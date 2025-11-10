import { callApiUpdatePost } from '@social/apis/posts.api';
import {
  convertErrorMessage,
  convertUrlString,
  formatFile,
} from '@social/common/convert';
import { smartUpload } from '@social/common/uploads';
import { NOTIFICATION_MESSAGE } from '@social/defaults/socket.default';
import { useSockets } from '@social/providers/SocketProvider';
import type { IPost, IPreviewMedia } from '@social/types/posts.type';
import { EOpenContent, type IFormCreatePost } from '@social/types/posts.type';
import type { IUserTag } from '@social/types/user.type';
import { message, Modal, notification } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PostEditor from './PostEditor';
import PostFelling from './PostFelling';
import PostUserTags from './PostUserTags';
interface IProps {
  isOpen: boolean;
  postDetail: IPost;
  onClose: () => void;
  updatePost: (post: IPost) => void;
}

const ModalEditPost: React.FC<IProps> = ({
  isOpen,
  postDetail,
  onClose,
  updatePost,
}) => {
  const [openContent, setOpenContent] = useState<EOpenContent>(
    EOpenContent.POST
  );
  const [userTags, setUserTags] = useState<IUserTag[]>([]);
  const [feeling, setFeeling] = useState<string>('');
  const [medias, setMedias] = useState<IPreviewMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useSockets();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleOpenContent = useCallback((content: EOpenContent) => {
    setOpenContent(content);
  }, []);
  useEffect(() => {
    setUserTags(postDetail.userTags);
    setFeeling(postDetail.feeling ?? '');
    setMedias(
      postDetail.medias.map(media => ({
        id: media.keyS3,
        url: convertUrlString(media.keyS3),
        type: media.type,
      }))
    );
  }, [postDetail, isOpen]);

  const handlePostSubmit = useCallback(
    async (values: { content: string; privacy: string }) => {
      setIsLoading(true);
      try {
        const mediasUpload = [];
        for (const media of medias) {
          const file = media.file;
          if (file) {
            const res = await smartUpload(file);
            if (res.data) {
              mediasUpload.push({
                keyS3: res.data.key,
                type: file.type.split('/')[0],
              });
            } else {
              throw new Error(res.message);
            }
          } else {
            mediasUpload.push({
              keyS3: media.id,
              type: media.type,
            });
          }
        }

        const data: IFormCreatePost = {
          content: values.content,
          privacy: values.privacy,
          userTags: userTags.map(user => user._id),
          feeling,
          medias: mediasUpload,
        };

        const res = await callApiUpdatePost(postDetail._id, data);

        if (!res.data) {
          notification.error({
            message: 'Lỗi',
            description: convertErrorMessage(res.message),
          });
          return;
        }

        message.success('Cập nhật bài viết thành công');
        updatePost({
          ...postDetail,
          content: values.content,
          privacy: values.privacy,
          userTags: userTags,
          feeling: feeling,
          medias: mediasUpload,
        });
        if (userTags.length > 0) {
          socket.emit(NOTIFICATION_MESSAGE.POST_TAG, {
            postId: postDetail._id,
            userTags: userTags,
            message: values.content,
          });
        }
        onClose();
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [userTags, feeling, medias, onClose, socket, postDetail, updatePost]
  );

  const onAddUserTag = useCallback((user: IUserTag[]) => {
    setUserTags(user);
  }, []);

  const onBack = useCallback(() => {
    setOpenContent(EOpenContent.POST);
  }, []);

  const onAddFeeling = useCallback((feeling: string) => {
    setFeeling(feeling);
  }, []);

  const onOpenChooseFile = useCallback((type: 'image' | 'video') => {
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      videoInputRef.current?.click();
    }
  }, []);

  const onDeleteFile = useCallback(() => {
    setMedias([]);
  }, []);

  const renderContent = useMemo(() => {
    return (
      <>
        <div
          className={`${openContent === EOpenContent.POST ? 'block' : 'hidden'}`}
        >
          <PostEditor
            userTags={userTags}
            feeling={feeling}
            medias={medias}
            dataEdit={{
              content: postDetail.content,
              privacy: postDetail.privacy,
            }}
            isLoading={isLoading}
            handleCancel={onClose}
            handlePostSubmit={handlePostSubmit}
            handleOpenContent={handleOpenContent}
            onOpenChooseFile={onOpenChooseFile}
            onDeleteFile={onDeleteFile}
          />
        </div>
        <div
          className={`${openContent === EOpenContent.USER_TAG ? 'block' : 'hidden'}`}
        >
          <PostUserTags
            onBack={onBack}
            addUserTag={onAddUserTag}
            userTags={userTags}
          />
        </div>
        <div
          className={`${openContent === EOpenContent.FEELING ? 'block' : 'hidden'}`}
        >
          <PostFelling
            onBack={onBack}
            addFelling={onAddFeeling}
            felling={feeling}
          />
        </div>
      </>
    );
  }, [
    openContent,
    userTags,
    feeling,
    medias,
    isLoading,
    onClose,
    handlePostSubmit,
    handleOpenContent,
    onOpenChooseFile,
    onDeleteFile,
    onBack,
    onAddUserTag,
    onAddFeeling,
    postDetail,
  ]);

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const fileUrls = formatFile(files);
    setMedias(prev => [...prev, ...fileUrls]);
    event.target.value = '';
  };

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={onClose}
        className="create-post-modal"
        footer={null}
        closable={false}
        maskClosable={false}
        title={false}
        destroyOnHidden={true}
        style={{
          top: 50,
        }}
      >
        <div className="h-fit max-h-[100vh] flex flex-col">{renderContent}</div>
      </Modal>
      <input
        className="hidden"
        type="file"
        id="image-upload"
        multiple
        accept="image/*"
        ref={imageInputRef}
        onChange={handleMediaSelect}
      />
      <input
        className="hidden"
        type="file"
        id="video-upload"
        accept="video/*"
        ref={videoInputRef}
        disabled={medias.length >= 4}
        onChange={handleMediaSelect}
      />
    </>
  );
};

export default ModalEditPost;
