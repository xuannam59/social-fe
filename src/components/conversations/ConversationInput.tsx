import { Form, Input, Button } from 'antd';
import React, { useCallback, useEffect, useMemo } from 'react';
import { TbSend } from 'react-icons/tb';
import type { IConversation } from '@social/types/conversations.type';
import type { IMessage, IMessageTyping } from '@social/types/messages.type';
import { useAppSelector } from '@social/hooks/redux.hook';
import { useSockets } from '@social/providers/SocketProvider';
import { CHAT_MESSAGE } from '@social/defaults/socket.default';
import { debounce } from 'lodash';

interface IProps {
  conversation: IConversation;
  isLoadingMessages: boolean;
  usersTyping: IMessageTyping[];
  onAddMessage: (values: IMessage) => void;
}

const ConversationInput: React.FC<IProps> = ({
  conversation,
  isLoadingMessages,
  usersTyping,
  onAddMessage,
}) => {
  const { socket } = useSockets();
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [form] = Form.useForm();

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
      onAddMessage(newMessage);
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
    [conversation._id, socket, userInfo, form, onAddMessage]
  );

  const debouncedTyping = useMemo(
    () =>
      debounce((payload: IMessageTyping) => {
        socket.emit(CHAT_MESSAGE.TYPING, payload);
      }, 3000),
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

      const exist = usersTyping.find(
        user => user.sender._id === messageTyping.sender._id
      );
      if (!exist) {
        socket.emit(CHAT_MESSAGE.TYPING, messageTyping);
      }

      debouncedTyping({ ...messageTyping, status: 'stop_typing' });
    },
    [debouncedTyping, userInfo, conversation._id, socket, usersTyping]
  );

  return (
    <>
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
    </>
  );
};

export default ConversationInput;
