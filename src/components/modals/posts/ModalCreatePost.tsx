import {
  EOpenContent,
  type IFile,
  type IFormCreatePost,
} from '@social/types/posts.type';
import type { IUserTag } from '@social/types/user.type';
import { Modal } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import PostEditor from './PostEditor';
import PostUserTags from './PostUserTags';
import PostFelling from './PostFelling';

interface IProps {
  isOpen: boolean;
  image: IFile[];
  video: IFile[];
  onClose: () => void;
  onOpenChooseFile: (type: 'image' | 'video') => void;
  onDeleteFile: (type: 'image' | 'video') => void;
}

const ModalCreatePost: React.FC<IProps> = ({
  isOpen,
  onClose,
  image,
  video,
  onOpenChooseFile,
  onDeleteFile,
}) => {
  const [openContent, setOpenContent] = useState<EOpenContent>(
    EOpenContent.POST
  );
  const [userTags, setUserTags] = useState<IUserTag[]>([]);
  const [feeling, setFeeling] = useState<string>('');
  const handleCancel = useCallback(() => {
    onClose();
    setUserTags([]);
    setFeeling('');
  }, [onClose]);

  const handleOpenContent = useCallback((content: EOpenContent) => {
    setOpenContent(content);
  }, []);

  const handlePostSubmit = useCallback(
    (values: IFormCreatePost) => {
      const data: IFormCreatePost = {
        content: values.content,
        privacy: values.privacy,
        images: image.map(item => item.file),
        videos: video.map(item => item.file),
        userTags,
        feeling,
      };
      console.log(data);
    },
    [userTags, feeling, image, video]
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
    switch (openContent) {
      case EOpenContent.POST:
        return (
          <PostEditor
            userTags={userTags}
            feeling={feeling}
            image={image}
            video={video}
            handleCancel={handleCancel}
            handlePostSubmit={handlePostSubmit}
            handleOpenContent={handleOpenContent}
            onOpenChooseFile={onOpenChooseFile}
            onDeleteFile={onDeleteFile}
          />
        );
      case EOpenContent.USER_TAG:
        return (
          <PostUserTags
            onBack={onBack}
            addUserTag={onAddUserTag}
            userTags={userTags}
          />
        );
      case EOpenContent.FEELING:
        return (
          <PostFelling
            onBack={onBack}
            addFelling={onAddFeeling}
            felling={feeling}
          />
        );
    }
  }, [
    openContent,
    userTags,
    feeling,
    image,
    video,
    handleCancel,
    handlePostSubmit,
    handleOpenContent,
    onAddUserTag,
    onBack,
    onAddFeeling,
    onOpenChooseFile,
    onDeleteFile,
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
