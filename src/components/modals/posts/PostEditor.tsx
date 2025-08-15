import Loading from '@social/components/loading/Loading';
import defaultAvatar from '@social/images/default-avatar.webp';
import ImageGallery from '@social/components/posts/ImageGallery';
import { useAppSelector } from '@social/hooks/redux.hook';
import type { IFile, IFormCreatePost } from '@social/types/post.type';
import type { IUserTag } from '@social/types/user.type';
import { Avatar, Button, Form, Input, Select, Tooltip } from 'antd';
import { EmojiStyle, type EmojiClickData } from 'emoji-picker-react';
import React, {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LiaUserTagSolid } from 'react-icons/lia';
import {
  TbLock,
  TbMoodSmileBeam,
  TbPhoto,
  TbUsers,
  TbWorld,
  TbX,
} from 'react-icons/tb';
import { EOpenContent } from '@social/types/post.type';
import emojiData from '@social/constants/emoji';
const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

interface IProps {
  userTags: IUserTag[];
  feeling: string;
  handleCancel: () => void;
  handlePostSubmit: (values: any) => void;
  handleOpenContent: (content: EOpenContent) => void;
}

const PostEditor: React.FC<IProps> = ({
  userTags,
  feeling,
  handleCancel,
  handlePostSubmit,
  handleOpenContent,
}) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [image, setImage] = useState<IFile[]>([]);
  const imageLength = useMemo(() => image.length, [image.length]);
  const hasImages = useMemo(() => imageLength > 0, [imageLength]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [form] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCloseModal = useCallback(() => {
    form.resetFields();
    setImage([]);
    setShowEmojiPicker(false);
    handleCancel();
  }, [form, handleCancel]);

  const onEmojiClick = useCallback(
    (emojiObject: EmojiClickData) => {
      const { emoji } = emojiObject;
      const currentContent = form.getFieldValue('content') || '';
      form.setFieldsValue({ content: currentContent + emoji });
      form.focusField('content');
    },
    [form]
  );

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(prev => !prev);
    if (showEmojiPicker) {
      form.focusField('content');
    }
  }, [showEmojiPicker, form]);

  const privacyOptions = useMemo(
    () => [
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
        value: 'only-me',
      },
    ],
    []
  );

  const renderUserTags = useCallback(() => {
    return (
      <>
        {feeling && (
          <>
            {` đang `}
            <span className=" text-gray-900 text-md inline-block hover:underline cursor-pointer">
              {emojiData.find(e => e.id === feeling)?.emoji || ''}
            </span>
            {` cảm thấy `}
            <span
              className="font-semibold text-gray-900 text-md inline-block hover:underline cursor-pointer"
              onClick={() => handleOpenContent(EOpenContent.FEELING)}
            >
              {emojiData.find(e => e.id === feeling)?.label || ''}
            </span>
          </>
        )}
        {userTags.length > 0 && (
          <>
            {` cùng với `}
            {userTags.slice(0, 3).map((user, index) => (
              <>
                <span
                  key={user.id}
                  className="font-semibold text-gray-900 text-md inline-block hover:underline cursor-pointer"
                  onClick={() => handleOpenContent(EOpenContent.USER_TAG)}
                >
                  {user.name}
                </span>

                {index === userTags.length - 2
                  ? ' và '
                  : index < userTags.length - 1
                    ? ', '
                    : ''}
              </>
            ))}
            {userTags.length > 3 && (
              <>
                {`và `}
                <span
                  className="font-semibold text-gray-900 text-md inline-block hover:underline cursor-pointer"
                  onClick={() => handleOpenContent(EOpenContent.USER_TAG)}
                >
                  {userTags.length - 3} {`người khác`}
                </span>
              </>
            )}
          </>
        )}
      </>
    );
  }, [userTags, handleOpenContent, feeling]);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const fileUrls = Array.from(files).map(file => ({
          url: URL.createObjectURL(file),
          file,
        }));
        setImage(prev => [...prev, ...fileUrls]);
        event.target.value = '';
      }
    },
    []
  );

  const handleSubmit = useCallback(
    (values: Pick<IFormCreatePost, 'content' | 'privacy'>) => {
      const data: IFormCreatePost = {
        content: values.content,
        privacy: values.privacy,
        images: image.map(item => item.file),
      };
      handlePostSubmit(data);
    },
    [handlePostSubmit, image]
  );

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-center flex-1">Tạo bài viết</h2>
        <Button type="text" shape="circle" onClick={handleCloseModal}>
          <TbX size={20} />
        </Button>
      </div>
      <div className="px-3">
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            content: '',
            privacy: 'public',
          }}
        >
          <div className="grid grid-cols-1">
            <div className="flex items-center gap-3">
              <Avatar
                size={50}
                src={userInfo?.avatar || defaultAvatar}
                className="flex-shrink-0"
              />
              <div className="flex-1">
                <div className="w-full">
                  <div className="font-semibold text-gray-900 text-md inline-block">
                    {userInfo?.fullname || 'Nam Minh'}
                  </div>
                  {renderUserTags()}
                </div>
                <div className="flex items-center gap-2">
                  <Form.Item name="privacy" className="!mb-0">
                    <Select
                      size="small"
                      options={privacyOptions}
                      variant="filled"
                      className="!w-35"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="overflow-x-hidden overflow-y-auto flex flex-col gap-3 max-h-[calc(100vh-400px)]">
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Form.Item
                    name="content"
                    dependencies={['content']}
                    className="!mb-0"
                  >
                    <Input.TextArea
                      placeholder={`${userInfo?.fullname.split(' ')[0] || 'User'} bạn đang nghĩ gì?`}
                      className="!border-none !resize-none !text-md min-h-[120px]"
                      autoSize={{ minRows: hasImages ? 2 : 5 }}
                    />
                  </Form.Item>

                  <div className="absolute bottom-1 right-1">
                    <Button
                      size="large"
                      type="text"
                      shape="circle"
                      onClick={toggleEmojiPicker}
                    >
                      <TbMoodSmileBeam size={24} />
                    </Button>
                  </div>
                </div>
              </div>

              {hasImages && (
                <ImageGallery images={image} onDelete={() => setImage([])} />
              )}
            </div>

            {showEmojiPicker && (
              <div className="relative">
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

            <div className="border border-gray-200 rounded-lg p-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-md font-semibold text-gray-700">
                  Thêm vào bài viết
                </span>
                <div className="flex items-center gap-2">
                  <Tooltip title="Thêm ảnh" placement="top">
                    <Button
                      type="text"
                      shape="circle"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <TbPhoto size={24} className="text-lime-700" />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Gắn thẻ người khác" placement="top">
                    <Button
                      type="text"
                      shape="circle"
                      onClick={() => handleOpenContent(EOpenContent.USER_TAG)}
                    >
                      <LiaUserTagSolid size={24} className="text-primary" />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Thêm cảm xúc" placement="top">
                    <Button
                      type="text"
                      shape="circle"
                      onClick={() => handleOpenContent(EOpenContent.FEELING)}
                    >
                      <TbMoodSmileBeam size={24} className="text-emerald-500" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="py-4">
              <Button
                type="primary"
                onClick={() => form.submit()}
                className="w-full"
              >
                Đăng bài viết
              </Button>
            </div>
          </div>
        </Form>
      </div>
      <input
        className="hidden"
        type="file"
        id="upload"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
    </>
  );
};

export default PostEditor;
