import { callApiCreatePostShare } from '@social/apis/posts.api';
import { convertErrorMessage } from '@social/common/convert';
import AvatarUser from '@social/components/common/AvatarUser';
import ButtonGradient from '@social/components/common/ButtonGradient';
import Loading from '@social/components/loading/Loading';
import { useAppSelector } from '@social/hooks/redux.hook';
import type { IFormCreatePostShare } from '@social/types/posts.type';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  notification,
  Select,
} from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import { EmojiStyle, type EmojiClickData } from 'emoji-picker-react';
import React, { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { TbLock, TbMoodSmileBeam, TbUsers, TbWorld, TbX } from 'react-icons/tb';

const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

interface IProps {
  open: boolean;
  parentId: string;
  onClose: () => void;
}

const ModalSharePost: React.FC<IProps> = ({ open, onClose, parentId }) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const textAreaRef = useRef<TextAreaRef>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  const privacyOptions = [
    {
      label: (
        <div className="flex items-center gap-2">
          <TbWorld size={16} />
          <span>Công khai</span>
        </div>
      ),
      value: 'public',
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <TbUsers size={16} />
          <span>Bạn bè</span>
        </div>
      ),
      value: 'friends',
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <TbLock size={16} />
          <span>Chỉ mình tôi</span>
        </div>
      ),
      value: 'private',
    },
  ];

  const onFinish = async (values: any) => {
    setIsLoading(true);
    try {
      const data: IFormCreatePostShare = {
        content: values.content,
        privacy: values.privacy,
        parentId: parentId,
      };
      const res = await callApiCreatePostShare(data);
      if (!res.data) {
        notification.error({
          message: 'Chia sẻ bài viết thất bại',
          description: convertErrorMessage(res.message),
        });
        return;
      }
      message.success('Chia sẻ bài viết thành công');
      onClose();
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onEmojiClick = useCallback(
    (emojiObject: EmojiClickData) => {
      const { emoji } = emojiObject;
      const currentContent = form.getFieldValue('content') || '';
      const el = textAreaRef.current?.resizableTextArea?.textArea as
        | HTMLTextAreaElement
        | undefined;

      if (!el) {
        form.setFieldValue('content', currentContent + emoji);
        form.focusField('content');
        return;
      }
      const start = el.selectionStart ?? currentContent.length;
      const end = el.selectionEnd ?? currentContent.length;

      const newContent =
        currentContent.slice(0, start) + emoji + currentContent.slice(end);

      const newCaretPos = start + emoji.length;
      form.setFieldValue('content', newContent);
      form.focusField('content');

      requestAnimationFrame(() => {
        const el2 = textAreaRef.current?.resizableTextArea?.textArea;
        if (el2) {
          el2.selectionStart = newCaretPos;
          el2.selectionEnd = newCaretPos;
        }
      });
    },
    [form]
  );

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(prev => !prev);
    if (showEmojiPicker) {
      form.focusField('content');
    }
  }, [showEmojiPicker, form]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={null}
      centered
      className="create-post-modal"
      closable={false}
      destroyOnHidden={true}
    >
      <div className="h-fit max-h-[100vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-center flex-1">
            Chia sẻ bài viết
          </h2>
          <Button type="text" shape="circle" onClick={onCancel}>
            <TbX size={20} />
          </Button>
        </div>
        <div className="flex flex-col gap-2 p-4 max-h-[300px] overflow-y-auto">
          <Form
            form={form}
            onFinish={onFinish}
            initialValues={{ privacy: 'public' }}
          >
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">
                <AvatarUser
                  size={45}
                  avatar={userInfo.avatar}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="">
                  <span className="text-sm font-medium">
                    {userInfo.fullname}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  <div className="bg-gray-200 rounded-lg px-2 py-[1px]">
                    <span className="text-xs font-medium">Bảng feed</span>
                  </div>
                  <Form.Item name="privacy" className="!mb-0">
                    <Select
                      size="small"
                      options={privacyOptions}
                      variant="filled"
                      className="!h-6 bg-gray-200 rounded-lg"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="relative mb-2">
              <Form.Item
                name="content"
                className="!mb-0"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
              >
                <Input.TextArea
                  placeholder="Nhập nội dung..."
                  className="!border-none !resize-none !text-md min-h-[80px] focus:!ring-0"
                  rows={3}
                  ref={textAreaRef}
                />
              </Form.Item>
              <div className="absolute bottom-2 right-2">
                <Button
                  type="text"
                  shape="circle"
                  onClick={toggleEmojiPicker}
                  ref={emojiButtonRef}
                >
                  <TbMoodSmileBeam size={25} className="text-gray-500" />
                </Button>
                <div className="absolute bottom-0 right-0 w-[300px]">
                  {showEmojiPicker && (
                    <>
                      <div
                        className="fixed inset-0 z-[1001]"
                        onClick={toggleEmojiPicker}
                      />
                      <div className="fixed z-[1002]">
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
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <ButtonGradient loading={isLoading} onClick={() => form.submit()}>
                <span className="text-white font-medium text-base">
                  Chia sẻ ngay
                </span>
              </ButtonGradient>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSharePost;
