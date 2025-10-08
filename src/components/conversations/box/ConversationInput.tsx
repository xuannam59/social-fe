import { Form, Input, Button, Image } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TbMoodSmileBeam, TbPhotoPlus, TbSend, TbX } from 'react-icons/tb';
import type { IConversation } from '@social/types/conversations.type';
import type { IMessage, IMessageTyping } from '@social/types/messages.type';
import { useAppSelector } from '@social/hooks/redux.hook';
import { useSockets } from '@social/providers/SocketProvider';
import { CHAT_MESSAGE } from '@social/defaults/socket.default';
import { debounce } from 'lodash';
import { EmojiStyle, type EmojiClickData } from 'emoji-picker-react';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import { lazy, Suspense } from 'react';
import Loading from '../../loading/Loading';
import { formatFile } from '@social/common/convert';
import type { IPreviewMedia } from '@social/types/posts.type';

const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

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
  const textAreaRef = useRef<TextAreaRef>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputNotEmpty = Form.useWatch(conversation._id, form);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [medias, setMedias] = useState<IPreviewMedia[]>([]);

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
        userLikes: [],
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

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const fileUrls = formatFile(files);
    setMedias(prev => [...prev, ...fileUrls]);
    event.target.value = '';
  };

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(prev => !prev);
    if (showEmojiPicker) {
      form.focusField(conversation._id);
    }
  }, [showEmojiPicker, form, conversation._id]);

  const onEmojiClick = useCallback(
    (emojiObject: EmojiClickData) => {
      const { emoji } = emojiObject;
      const currentContent = form.getFieldValue(conversation._id) || '';
      const el = textAreaRef.current?.resizableTextArea?.textArea as
        | HTMLTextAreaElement
        | undefined;

      if (!el) {
        form.setFieldValue(conversation._id, currentContent + emoji);
        form.focusField(conversation._id);
        return;
      }
      const start = el.selectionStart ?? currentContent.length;
      const end = el.selectionEnd ?? currentContent.length;

      const newContent =
        currentContent.slice(0, start) + emoji + currentContent.slice(end);

      const newCaretPos = start + emoji.length;
      form.setFieldValue(conversation._id, newContent);
      form.focusField(conversation._id);

      requestAnimationFrame(() => {
        const el2 = textAreaRef.current?.resizableTextArea?.textArea;
        if (el2) {
          el2.selectionStart = newCaretPos;
          el2.selectionEnd = newCaretPos;
        }
      });
    },
    [form, conversation._id]
  );

  const handleRemoveMedia = (id: string) => {
    setMedias(prev => prev.filter(m => m.id !== id));
  };

  return (
    <>
      <div className="flex flex-col gap-1 border-t border-gray-200 p-2">
        <div className="flex items-center gap-2 ">
          <Image.PreviewGroup>
            {medias.map(media => (
              <div key={media.id} className="max-h-18 max-w-18 relative">
                <Image src={media.url} className="rounded-lg" loading="lazy" />
                <div className="absolute -top-1 -right-2">
                  <button
                    className="rounded-full p-1 bg-white border border-gray-200 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRemoveMedia(media.id)}
                  >
                    <TbX size={16} />
                  </button>
                </div>
              </div>
            ))}
          </Image.PreviewGroup>
        </div>
        <div className="flex items-start gap-2 shrink-0">
          <Form
            form={form}
            onFinish={handleSendMessage}
            className="flex-1 flex items-center gap-1"
          >
            <div className={``}>
              <Button
                type="text"
                shape="circle"
                onClick={() => imageInputRef.current?.click()}
              >
                <TbPhotoPlus size={20} />
              </Button>
            </div>
            <div className="bg-gray-200 rounded-xl flex flex-1">
              <Form.Item name={conversation._id} className="!m-0 flex-1">
                <Input.TextArea
                  placeholder="Nhập tin nhắn..."
                  className="!border-none !ring-0 !shadow-none !bg-transparent !resize-none"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      form.submit();
                    }
                  }}
                  ref={textAreaRef}
                  disabled={isLoadingMessages}
                  onChange={handleTyping}
                  autoSize={{ minRows: 1, maxRows: 5 }}
                />
              </Form.Item>
              <div className="self-end relative">
                <Button
                  size="middle"
                  type="text"
                  shape="circle"
                  onClick={toggleEmojiPicker}
                >
                  <TbMoodSmileBeam size={24} />
                </Button>
                {showEmojiPicker && (
                  <div className="flex-shrink-0">
                    <div className="absolute bottom-10 right-0 mb-2 z-50">
                      <div
                        className="fixed inset-0 z-40"
                        onClick={toggleEmojiPicker}
                      />

                      <div className="relative z-50">
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                          <Suspense
                            fallback={
                              <div className="w-[300px] h-[250px] flex items-center justify-center">
                                <Loading />
                              </div>
                            }
                          >
                            <LazyEmojiPicker
                              onEmojiClick={onEmojiClick}
                              width={300}
                              height={250}
                              previewConfig={{ showPreview: false }}
                              searchDisabled={true}
                              emojiStyle={EmojiStyle.FACEBOOK}
                            />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Form>
          <Button
            type="text"
            onClick={() => form.submit()}
            shape="circle"
            className="self-end"
            disabled={isLoadingMessages || !inputNotEmpty}
          >
            <TbSend
              size={20}
              className={
                isLoadingMessages || !inputNotEmpty
                  ? 'text-gray-500'
                  : 'text-primary'
              }
            />
          </Button>
        </div>
      </div>

      <input
        className="hidden"
        type="file"
        id="image-upload"
        multiple
        accept="image/*"
        ref={imageInputRef}
        onChange={handleMediaSelect}
      />
    </>
  );
};

export default ConversationInput;
