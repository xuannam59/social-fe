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
import { Button, notification } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { TbLoader2, TbX } from 'react-icons/tb';
import AvatarUser from '../../common/AvatarUser';
import Loading from '../../loading/Loading';
import ConversationContent from './ConversationContent';
import ConversationInput from './ConversationInput';
import ConversationTyping from './ConversationTyping';

interface IProps {
  conversation: IConversation;
}

const START_INDEX = 100_000;

const ConversationItemBox: React.FC<IProps> = ({ conversation }) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const { socket } = useSockets();
  const dispatch = useAppDispatch();
  const isExist = useMemo(() => conversation.isExist, [conversation]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageReply, setMessageReply] = useState<IMessage | null>(null);
  const [totalMessages, setTotalMessages] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [usersTyping, setUsersTyping] = useState<IMessageTyping[]>([]);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [firstItemIndex, setFirstItemIndex] = useState(0);

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
      const res = await callApiGetMessages(conversation._id, {
        page: 1,
      });
      if (res.data) {
        const asc = res.data.list.reverse();
        setMessages(asc);
        setTotalMessages(res.data.meta.total);
        setPage(1);

        setFirstItemIndex(START_INDEX - asc.length);

        requestAnimationFrame(() => {
          virtuosoRef.current?.scrollToIndex({
            index: asc.length - 1,
            align: 'end',
            behavior: 'auto',
          });
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [conversation._id]);

  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore) return;
    if (messages.length >= totalMessages) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await callApiGetMessages(conversation._id, {
        page: nextPage,
      });
      if (res.data) {
        const olderAsc = [...res.data.list].reverse();
        if (olderAsc.length > 0) {
          setFirstItemIndex(prev => prev - olderAsc.length);
          setMessages(prev => [...olderAsc, ...prev]);
          setPage(nextPage);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, messages.length, totalMessages, page, conversation._id]);

  useEffect(() => {
    getConversationId();
    getMessages();
  }, [getConversationId, getMessages]);

  useEffect(() => {
    if (usersTyping.length > 0 && atBottom) {
      const timer = setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: 'LAST',
          align: 'end',
          behavior: 'smooth',
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [usersTyping.length, atBottom]);

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
            message._id === data.tempId ? data : message
          );
        });
      } else {
        setMessages(prev => [...prev, data]);
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

  const handleReSendMessage = useCallback(
    (messageId: string) => {
      setMessages(prev =>
        prev.map(message =>
          message._id === messageId
            ? { ...message, status: 'pending' }
            : message
        )
      );
      const messageFailed = messages.find(message => message._id === messageId);
      if (messageFailed) {
        socket.emit(CHAT_MESSAGE.SEND, messageFailed);
      }
    },
    [socket, messages]
  );

  const handleCloseConversation = () => {
    dispatch(doCloseConversation(conversation._id));
  };

  const handleAddMessage = useCallback(
    (message: IMessage) => {
      setMessages(prev => [...prev, message]);
      if (!atBottom) {
        virtuosoRef.current?.scrollToIndex({
          index: 'LAST',
          align: 'end',
          behavior: 'auto',
        });
      }
    },
    [atBottom]
  );

  const handleGetMessageReply = useCallback((message: IMessage) => {
    setMessageReply(message);
  }, []);

  const handleRemoveMessageReply = useCallback(() => {
    setMessageReply(null);
  }, []);

  return (
    <>
      <div className="w-[328px] max-h-[455px] flex flex-col bg-white rounded-t-lg shadow-md overflow-visible">
        <div className="p-2 flex items-center shadow-sm">
          <div className="flex flex-1 gap-2 items-center min-w-0">
            <div className="shrink-0 relative">
              <AvatarUser avatar={conversation.avatar} size={36} />
              {conversation.isOnline && (
                <div className="absolute bottom-0 right-1">
                  <div className="w-3 h-3 bg-[#24832c] rounded-full border-2 border-white" />
                </div>
              )}
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
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <AvatarUser avatar={''} size={50} />
              <span className="text-gray-500">{conversation.name}</span>
              <span className="text-gray-500 text-sm">
                Chưa có tin nhắn, hãy bắt đầu trò chuyện
              </span>
            </div>
          ) : (
            <div className="flex-1 relative">
              <Virtuoso
                ref={virtuosoRef}
                classID="h-full w-full"
                data={messages}
                firstItemIndex={firstItemIndex}
                startReached={loadMoreMessages}
                followOutput={atBottom ? 'auto' : false}
                atBottomStateChange={setAtBottom}
                atBottomThreshold={120}
                computeItemKey={(_index, message) => message._id}
                itemContent={(_index, message) => (
                  <div className="px-3 py-0.5">
                    <ConversationContent
                      message={message}
                      getMessageReply={handleGetMessageReply}
                      onReSendMessage={handleReSendMessage}
                    />
                  </div>
                )}
                components={{
                  Header: () => (
                    <div
                      className={`flex items-center justify-center py-2 ${isLoadingMore ? 'block' : 'hidden'}`}
                    >
                      <TbLoader2
                        size={30}
                        className="animate-spin text-gray-500"
                      />
                    </div>
                  ),
                  Footer: () => (
                    <div className="px-3 py-0.5">
                      <ConversationTyping usersTyping={usersTyping} />
                    </div>
                  ),
                }}
              />
            </div>
          )}
          <div>
            <ConversationInput
              conversation={conversation}
              isLoadingMessages={isLoadingMessages}
              usersTyping={usersTyping}
              messageReply={messageReply}
              onAddMessage={handleAddMessage}
              onRemoveMessageReply={handleRemoveMessageReply}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationItemBox;
