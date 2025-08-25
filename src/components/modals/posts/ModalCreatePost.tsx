import {
  EOpenContent,
  type IMedia,
  type IFormCreatePost,
} from '@social/types/posts.type';
import type { IUserTag } from '@social/types/user.type';
import { message, Modal, notification } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import PostEditor from './PostEditor';
import PostFelling from './PostFelling';
import PostUserTags from './PostUserTags';
import { callApiCreatePost } from '@social/apis/posts.api';
import { smartUpload } from '@social/common/uploads';

interface IProps {
  isOpen: boolean;
  medias: IMedia[];
  onClose: () => void;
  onOpenChooseFile: (type: 'image' | 'video') => void;
  onDeleteFile: () => void;
}

const ModalCreatePost: React.FC<IProps> = ({
  isOpen,
  onClose,
  medias,
  onOpenChooseFile,
  onDeleteFile,
}) => {
  const [openContent, setOpenContent] = useState<EOpenContent>(
    EOpenContent.POST
  );
  const [userTags, setUserTags] = useState<IUserTag[]>([]);
  const [feeling, setFeeling] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const handleCancel = useCallback(() => {
    onClose();
    setUserTags([]);
    setFeeling('');
  }, [onClose]);

  const handleOpenContent = useCallback((content: EOpenContent) => {
    setOpenContent(content);
  }, []);

  const handlePostSubmit = useCallback(
    async (values: { content: string; privacy: string }) => {
      setIsLoading(true);
      try {
        const mediasUpload = [];
        if (medias.length > 0) {
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
            }
          }
        }

        const data: IFormCreatePost = {
          content: values.content,
          privacy: values.privacy,
          userTags,
          feeling,
          medias: mediasUpload,
        };
        console.log(data);

        const res = await callApiCreatePost(data);
        if (!res.data) {
          notification.error({
            message: 'Tạo bài viết thất bại',
            description:
              res.message && Array.isArray(res.message)
                ? JSON.stringify(res.message)
                : res.message,
          });
        }
        message.success('Tạo bài viết thành công');
        handleCancel();
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [userTags, feeling, medias, handleCancel]
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
            isLoading={isLoading}
            handleCancel={handleCancel}
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
    handleCancel,
    handlePostSubmit,
    handleOpenContent,
    onOpenChooseFile,
    onDeleteFile,
    onBack,
    onAddUserTag,
    onAddFeeling,
  ]);

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={handleCancel}
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
    </>
  );
};

export default ModalCreatePost;
