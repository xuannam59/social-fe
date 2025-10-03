import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AvatarUser from '../common/AvatarUser';
import { Button, Form } from 'antd';
import { TbSend, TbX } from 'react-icons/tb';
import { Input } from 'antd';
import type { IConversation } from '@social/types/conversations.type';
import type { IMessage } from '@social/types/messages.type';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { doCloseConversation } from '@social/redux/reducers/conversations';
import { formatRelativeTimeV2 } from '@social/common/convert';
import { callApiGetConversationIdOrCreate } from '@social/apis/conversations.api';
import { useSockets } from '@social/providers/SocketProvider';

interface IProps {
  conversation: IConversation;
}

const ConversationItemBox: React.FC<IProps> = ({ conversation }) => {
  const userId = useAppSelector(state => state.auth.userInfo._id);
  const { socket } = useSockets();
  const dispatch = useAppDispatch();
  const createInitialMessages = (): IMessage[] => {
    const base: IMessage[] = [
      {
        _id: 'm1',
        sender: { _id: 'u_friend_1', fullname: 'Jane Doe', avatar: '' },
        type: 'text',
        content: 'Chào bạn! Bạn đã xem tính năng chat mới chưa?',
        mentions: [],
        userLiked: [],
      },
      {
        _id: 'm2',
        sender: { _id: userId, fullname: 'Tôi', avatar: '' },
        type: 'text',
        content: 'Mình đang test đây nè 😄',
        mentions: [],
        userLiked: [],
      },
      {
        _id: 'm3',
        sender: { _id: 'u_friend_1', fullname: 'Jane Doe', avatar: '' },
        type: 'text',
        content: 'Ok, gửi mình vài tin nhắn mẫu nhé!',
        mentions: [],
        userLiked: [],
      },
      {
        _id: 'm4',
        sender: { _id: userId, fullname: 'Tôi', avatar: '' },
        type: 'text',
        content: 'Tin nhắn của mình sẽ canh phải và màu khác nè.',
        mentions: [],
        userLiked: [],
      },
      {
        _id: 'm5',
        sender: { _id: 'u_friend_1', fullname: 'Jane Doe', avatar: '' },
        type: 'text',
        content: 'Tuyệt vời! Nhớ để danh sách cuộn từ dưới lên nhé.',
        mentions: [],
        userLiked: [],
      },
      {
        _id: 'm6',
        sender: { _id: userId, fullname: 'Tôi', avatar: '' },
        type: 'text',
        content: 'Đã set flex-col-reverse để luôn hiện cuối cùng ở dưới 👍',
        mentions: [],
        userLiked: [],
      },
    ];
    const older: IMessage[] = Array.from({ length: 30 }).map((_, idx) => {
      const isMine = idx % 2 === 0;
      return {
        _id: `m_old_${idx}`,
        sender: isMine
          ? { _id: userId, fullname: 'Tôi', avatar: '' }
          : { _id: 'u_friend_1', fullname: 'Jane Doe', avatar: '' },
        type: 'text',
        content: isMine
          ? `Tin nhắn mới #${idx + 1} từ tôi`
          : `Tin nhắn cũ #${idx + 1} từ Jane`,
        mentions: [],
        userLiked: [],
      };
    });
    return [...base, ...older];
  };
  const isExist = useMemo(() => conversation.isExist, [conversation]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [form] = Form.useForm();

  const getConversationId = useCallback(async () => {
    try {
      if (isExist) return;
      const res = await callApiGetConversationIdOrCreate(conversation.users);
      if (res.data) {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [conversation, isExist]);

  useEffect(() => {
    getConversationId();
  }, [getConversationId]);

  const handleSendMessage = (values: any) => {
    const content = values[conversation._id].trim();
    if (!content) return;
    const newMessage: IMessage = {
      _id: `m_${Date.now()}`,
      sender: { _id: userId, fullname: 'Tôi', avatar: '' },
      type: 'text',
      content,
      mentions: [],
      userLiked: [],
    };
    setMessages(prev => [newMessage, ...prev]);
    form.resetFields();
  };

  const handleCloseConversation = () => {
    dispatch(doCloseConversation(conversation._id));
  };
  return (
    <>
      <div className="w-[328px] max-h-[455px] flex flex-col bg-white rounded-t-lg shadow-md overflow-visible">
        <div className="p-2 flex items-center shadow-sm">
          <div className="flex flex-1 gap-2 items-center">
            <div className="shrink-0">
              <AvatarUser avatar={conversation.avatar} size={36} />
            </div>
            <div className="flex flex-col gap-0">
              <span className="text-base font-medium flex-1 line-clamp-1 leading-5">
                {conversation.name}
              </span>
              <span className="text-sm text-gray-500 truncate leading-4">
                {conversation.lastActive
                  ? formatRelativeTimeV2(conversation.lastActive)
                  : 'Đang hoạt động'}
              </span>
            </div>
          </div>
          <Button type="text" shape="circle" onClick={handleCloseConversation}>
            <TbX size={20} />
          </Button>
        </div>
        <div className="flex flex-col min-h-0 h-[400px]">
          <div className="flex flex-col-reverse overflow-y-auto p-3 gap-2 flex-1">
            {messages.length > 0 ? (
              messages.map(message => {
                const isMine = message.sender._id === userId;
                return (
                  <div
                    key={message._id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMine && (
                      <div className="mr-2 self-end">
                        <AvatarUser avatar={message.sender.avatar} size={28} />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm leading-5 ${
                        isMine
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <AvatarUser avatar={''} size={50} />
                <span className="text-gray-500">{conversation.name}</span>
                <span className="text-gray-500 text-sm">
                  Chưa có tin nhắn, hãy bắt đầu trò chuyện
                </span>
              </div>
            )}
          </div>
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
                  autoSize={{ minRows: 1, maxRows: 5 }}
                />
              </Form.Item>
            </Form>
            <Button
              type="text"
              onClick={() => form.submit()}
              shape="circle"
              className="self-end"
            >
              <TbSend size={20} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationItemBox;
