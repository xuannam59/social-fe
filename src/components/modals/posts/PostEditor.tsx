import ImageGallery from '@social/components/common/ImageGallery';
import VideoGalley from '@social/components/common/VideoGalley';
import Loading from '@social/components/loading/Loading';
import emojiData from '@social/constants/emoji';
import { useAppSelector } from '@social/hooks/redux.hook';
import defaultAvatar from '@social/images/default-avatar.webp';
import type { IFile, IFormCreatePost } from '@social/types/post.type';
import { EOpenContent } from '@social/types/post.type';
import type { IUserTag } from '@social/types/user.type';
import { Avatar, Button, Form, Input, Select, Tooltip, Typography } from 'antd';
import { EmojiStyle, type EmojiClickData } from 'emoji-picker-react';
import React, { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { LiaUserTagSolid } from 'react-icons/lia';
import {
  TbLock,
  TbMoodSmileBeam,
  TbPhoto,
  TbUsers,
  TbVideo,
  TbWorld,
  TbX,
} from 'react-icons/tb';

const { Text } = Typography;
const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

interface IProps {
  userTags: IUserTag[];
  feeling: string;
  image: IFile[];
  video: IFile[];
  handleCancel: () => void;
  handlePostSubmit: (values: any) => void;
  handleOpenContent: (content: EOpenContent) => void;
  onOpenChooseFile: (type: 'image' | 'video') => void;
  onDeleteFile: (type: 'image' | 'video') => void;
}

const PostEditor: React.FC<IProps> = ({
  userTags,
  feeling,
  image,
  video,
  handleCancel,
  handlePostSubmit,
  handleOpenContent,
  onOpenChooseFile,
  onDeleteFile,
}) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const hasImages = useMemo(() => image.length > 0, [image]);
  const hasVideos = useMemo(() => video.length > 0, [video]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [form] = Form.useForm();

  const handleCloseModal = useCallback(() => {
    form.resetFields();
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

  const handleSubmit = useCallback(
    (values: Pick<IFormCreatePost, 'content' | 'privacy'>) => {
      const data: IFormCreatePost = {
        content: values.content,
        privacy: values.privacy,
        images: image.map(item => item.file),
        videos: video.map(item => item.file),
      };
      handlePostSubmit(data);
    },
    [handlePostSubmit, image, video]
  );

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header - Cố định */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-center flex-1">Tạo bài viết</h2>
          <Button type="text" shape="circle" onClick={handleCloseModal}>
            <TbX size={20} />
          </Button>
        </div>

        {/* Content Container - Cố định height */}
        <div className="flex-1 px-3 flex flex-col min-h-0">
          <Form
            form={form}
            onFinish={handleSubmit}
            initialValues={{
              content: '',
              privacy: 'public',
            }}
            className="h-full flex flex-col"
          >
            <div className="flex flex-col h-full gap-2">
              {/* User Info Section - Cố định */}
              <div className="flex items-center gap-3 flex-shrink-0 mb-4">
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

              {/* Scrollable Content Area - Chỉ phần này scroll */}
              <div className="relative">
                <div className="flex-1 overflow-y-auto min-h-0 max-h-[calc(100vh-380px)]">
                  <div className="flex flex-col gap-3">
                    {/* Text Input */}
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <Form.Item
                          name="content"
                          dependencies={['content']}
                          className="!mb-0"
                        >
                          <Input.TextArea
                            placeholder={`${userInfo?.fullname?.split(' ')[0] || 'User'} bạn đang nghĩ gì?`}
                            className="!border-none !resize-none !text-md min-h-[80px] focus:!ring-0"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                          />
                        </Form.Item>

                        <div className="absolute bottom-2 right-2">
                          <Tooltip title="Emoji" placement="top" arrow={false}>
                            <Button
                              size="middle"
                              type="text"
                              shape="circle"
                              onClick={toggleEmojiPicker}
                            >
                              <TbMoodSmileBeam size={24} />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>

                    {/* Media Preview */}
                    {hasImages && (
                      <>
                        <Text type="secondary">Hình ảnh ({image.length})</Text>
                        <ImageGallery
                          images={image}
                          onDelete={() => onDeleteFile('image')}
                        />
                      </>
                    )}

                    {hasVideos && (
                      <>
                        <Text type="secondary">Video ({video.length})</Text>
                        <VideoGalley
                          videos={video}
                          onDelete={() => onDeleteFile('video')}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Emoji Picker - Cố định */}
                {showEmojiPicker && (
                  <div className="flex-shrink-0 mb-4">
                    <div className="absolute top-10 right-0 mb-2 z-50">
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

              {/* Action Buttons - Cố định */}
              <div className="flex flex-col gap-2">
                <div className="border border-gray-200 rounded-lg p-2 flex-shrink-0 mb-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-md font-semibold text-gray-700">
                      Thêm vào bài viết
                    </span>
                    <div className="flex items-center gap-2">
                      <Tooltip title="Thêm ảnh" placement="top" arrow={false}>
                        <Button
                          type="text"
                          shape="circle"
                          onClick={() => onOpenChooseFile('image')}
                        >
                          <TbPhoto size={24} className="text-lime-700" />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Thêm video" placement="top" arrow={false}>
                        <Button
                          type="text"
                          shape="circle"
                          onClick={() => onOpenChooseFile('video')}
                        >
                          <TbVideo size={24} className="text-lime-700" />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        title="Gắn thẻ người khác"
                        placement="top"
                        arrow={false}
                      >
                        <Button
                          type="text"
                          shape="circle"
                          onClick={() =>
                            handleOpenContent(EOpenContent.USER_TAG)
                          }
                        >
                          <LiaUserTagSolid size={24} className="text-primary" />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Cảm xúc" placement="top" arrow={false}>
                        <Button
                          type="text"
                          shape="circle"
                          onClick={() =>
                            handleOpenContent(EOpenContent.FEELING)
                          }
                        >
                          <TbMoodSmileBeam
                            size={24}
                            className="text-emerald-500"
                          />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* Submit Button - Cố định */}
                <div className="py-4 flex-shrink-0">
                  <Button
                    type="primary"
                    onClick={() => form.submit()}
                    className="w-full"
                  >
                    Đăng bài viết
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default PostEditor;
