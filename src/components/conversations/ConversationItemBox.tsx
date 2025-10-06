import { callApiGetConversationIdOrCreate } from '@social/apis/conversations.api';
import { callApiGetMessages } from '@social/apis/message.s.api';
import { formatRelativeTimeV2 } from '@social/common/convert';
import {
  CHAT_MESSAGE,
  CONVERSATION_MESSAGE,
} from '@social/defaults/socket.default';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { useSockets } from '@social/providers/SocketProvider';
import {
  doCloseConversation,
  doSetIdConversation,
} from '@social/redux/reducers/conversations';
import type { IConversation } from '@social/types/conversations.type';
import type {
  IMessage,
  IMessageStatus,
  IMessageTyping,
} from '@social/types/messages.type';
import { Button, Form, Input, notification } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TbLoader2, TbSend, TbX } from 'react-icons/tb';
import AvatarUser from '../common/AvatarUser';
import Loading from '../loading/Loading';
import ConversationTyping from './ConversationTyping';

interface IProps {
  conversation: IConversation;
}

const ConversationItemBox: React.FC<IProps> = ({ conversation }) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const { socket } = useSockets();
  const dispatch = useAppDispatch();
  const isExist = useMemo(() => conversation.isExist, [conversation]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [usersTyping, setUsersTyping] = useState<IMessageTyping[]>([]);
  const [form] = Form.useForm();

  const getConversationId = useCallback(async () => {
    try {
      if (isExist) return;
      const res = await callApiGetConversationIdOrCreate(conversation.users);
      if (res.data) {
        dispatch(
          doSetIdConversation({
            _id: conversation._id,
            conversationId: res.data,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [conversation, isExist, dispatch]);

  const getMessages = useCallback(async () => {
    try {
      setIsLoadingMessages(true);
      const res = await callApiGetMessages(conversation._id);
      if (res.data) {
        setMessages(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [conversation._id]);

  useEffect(() => {
    getConversationId();
    getMessages();
  }, [getConversationId, getMessages]);

  useEffect(() => {
    if (socket && conversation._id) {
      socket.emit(CONVERSATION_MESSAGE.JOIN, conversation._id);
    }

    return () => {
      if (socket && conversation._id) {
        socket.emit(CONVERSATION_MESSAGE.LEAVE, conversation._id);
      }
    };
  }, [socket, conversation._id]);

  useEffect(() => {
    if (!socket) return;
    socket.on(CHAT_MESSAGE.SEND, (data: IMessage) => {
      if (data.conversationId !== conversation._id) return;
      if (userInfo._id === data.sender._id) {
        setMessages(prev => {
          return prev.map(message =>
            message._id === data.tempId
              ? { ...message, status: data.status, _id: data._id }
              : message
          );
        });
      } else {
        setMessages(prev => [data, ...prev]);
      }
    });

    socket.on(CHAT_MESSAGE.STATUS_MESSAGE, (data: IMessageStatus) => {
      if (
        data.conversationId !== conversation._id ||
        data.senderId !== userInfo._id
      )
        return;
      if (data.status === 'failed') {
        setMessages(prev =>
          prev.map(message =>
            message._id === data.tempId
              ? { ...message, status: data.status }
              : message
          )
        );
        notification.error({
          message: 'Gửi tin nhắn thất bại',
          description: data.message,
          duration: 3,
        });
      }
    });

    socket.on(CHAT_MESSAGE.TYPING, (payload: IMessageTyping) => {
      if (payload.conversationId !== conversation._id) return;
      if (payload.status === 'typing') {
        const exist = usersTyping.find(
          user => user.sender._id === payload.sender._id
        );
        if (exist) return;
        setUsersTyping(prev => [...prev, payload]);
      } else {
        setUsersTyping(prev =>
          prev.filter(user => user.sender._id !== payload.sender._id)
        );
      }
    });

    return () => {
      socket.off(CHAT_MESSAGE.SEND);
      socket.off(CHAT_MESSAGE.STATUS_MESSAGE);
      socket.off(CHAT_MESSAGE.TYPING);
    };
  }, [socket, userInfo, conversation._id, usersTyping]);

  const handleSendMessage = useCallback(
    (values: any) => {
      const content = values[conversation._id].trim();
      if (!content) return;
      const newMessage: IMessage = {
        _id: `m_${Date.now()}`,
        sender: {
          _id: userInfo._id,
          fullname: userInfo.fullname,
          avatar: userInfo.avatar,
        },
        type: 'text',
        conversationId: conversation._id,
        content,
        status: 'pending',
        mentions: [],
        userLiked: [],
      };
      setMessages(prev => [newMessage, ...prev]);
      socket.emit(CHAT_MESSAGE.SEND, newMessage);
      socket.emit(CHAT_MESSAGE.TYPING, {
        conversationId: conversation._id,
        sender: {
          _id: userInfo._id,
          fullname: userInfo.fullname,
          avatar: userInfo.avatar,
        },
        status: 'stop_typing',
      });
      form.resetFields();
    },
    [conversation._id, socket, userInfo, form]
  );

  const handleReSendMessage = useCallback(
    (_id: string) => {
      setMessages(prev =>
        prev.map(message =>
          message._id === _id ? { ...message, status: 'pending' } : message
        )
      );
      const messageFailed = messages.find(message => message._id === _id);
      if (messageFailed) {
        socket.emit(CHAT_MESSAGE.SEND, messageFailed);
      }
    },
    [socket, messages]
  );

  const debouncedTyping = useMemo(
    () =>
      debounce((payload: IMessageTyping) => {
        socket.emit(CHAT_MESSAGE.TYPING, payload);
      }, 1500),
    [socket]
  );

  useEffect(() => {
    return () => debouncedTyping.cancel();
  }, [debouncedTyping]);

  const handleTyping = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const content = e.target.value;
      const messageTyping: IMessageTyping = {
        conversationId: conversation._id,
        sender: {
          _id: userInfo._id,
          fullname: userInfo.fullname,
          avatar: userInfo.avatar,
        },
        status: 'typing',
      };

      if (!content) {
        socket.emit(CHAT_MESSAGE.TYPING, {
          ...messageTyping,
          status: 'stop_typing',
        });
        return;
      }
      socket.emit(CHAT_MESSAGE.TYPING, messageTyping);

      debouncedTyping({ ...messageTyping, status: 'stop_typing' });
    },
    [debouncedTyping, userInfo, conversation._id, socket]
  );

  const handleCloseConversation = () => {
    dispatch(doCloseConversation(conversation._id));
  };
  return (
    <>
      <div className="w-[328px] max-h-[455px] flex flex-col bg-white rounded-t-lg shadow-md overflow-visible">
        <div className="p-2 flex items-center shadow-sm">
          <div className="flex flex-1 gap-2 items-center min-w-0">
            <div className="shrink-0">
              <AvatarUser avatar={conversation.avatar} size={36} />
            </div>
            <div className="flex flex-col gap-0 flex-1 min-w-0 overflow-hidden">
              <span className="text-base font-medium line-clamp-1 leading-5">
                {conversation.name}
              </span>
              <div className="flex items-center min-w-0">
                <span className="text-sm text-gray-500 truncate leading-4 block">
                  {conversation.isOnline
                    ? 'Đang hoạt động'
                    : `Hoạt động ${formatRelativeTimeV2(conversation.lastActive)} trước`}
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0 ml-2">
            <Button
              type="text"
              shape="circle"
              onClick={handleCloseConversation}
            >
              <TbX size={20} />
            </Button>
          </div>
        </div>
        <div className="flex flex-col min-h-0 h-[400px]">
          {isLoadingMessages ? (
            <Loading />
          ) : (
            <div className="flex flex-col-reverse overflow-y-auto p-3 gap-2 flex-1">
              <ConversationTyping usersTyping={usersTyping} />
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full">
                  <AvatarUser avatar={''} size={50} />
                  <span className="text-gray-500">{conversation.name}</span>
                  <span className="text-gray-500 text-sm">
                    Chưa có tin nhắn, hãy bắt đầu trò chuyện
                  </span>
                </div>
              )}
              {messages.map(message => {
                const isMine = message.sender._id === userInfo._id;
                const status = message.status;
                return (
                  <div key={message._id} className="flex flex-col">
                    <div
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMine && (
                        <div className="mr-2 self-end">
                          <AvatarUser
                            avatar={message.sender.avatar}
                            size={28}
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm leading-5 
                        ${
                          isMine
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }
                      ${status === 'pending' ? 'opacity-80' : status === 'failed' ? 'border-2 border-red-500' : ''}
                      `}
                      >
                        {message.content}
                      </div>
                    </div>
                    {status === 'pending' && (
                      <div className="flex items-center gap-2 self-end">
                        <div className="text-xs text-gray-500">Đang gửi...</div>
                        <TbLoader2
                          size={12}
                          className="animate-spin text-gray-500"
                        />
                      </div>
                    )}
                    {status === 'failed' && (
                      <div className="flex items-center gap-2 self-end">
                        <div className="text-xs text-red-500 self-end">
                          Gửi thất bại
                        </div>
                        <span
                          className="text-xs text-blue-500 cursor-pointer hover:underline"
                          onClick={() => handleReSendMessage(message._id)}
                        >
                          Gửi lại
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div className="p-2 border-t border-gray-100 flex items-start gap-2 shrink-0">
            <Form form={form} onFinish={handleSendMessage} className="flex-1">
              <Form.Item name={conversation._id} className="!m-0">
                <Input.TextArea
                  placeholder="Nhập tin nhắn..."
                  className="!border-none !ring-0 !shadow-none !bg-gray-100 !resize-none"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      form.submit();
                    }
                  }}
                  disabled={isLoadingMessages}
                  onChange={handleTyping}
                  autoSize={{ minRows: 1, maxRows: 5 }}
                />
              </Form.Item>
            </Form>
            <Button
              type="text"
              onClick={() => form.submit()}
              shape="circle"
              className="self-end"
              disabled={isLoadingMessages}
            >
              <TbSend
                size={20}
                className={isLoadingMessages ? 'text-gray-500' : 'text-primary'}
              />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationItemBox;
