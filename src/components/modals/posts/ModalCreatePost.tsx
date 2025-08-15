import { EOpenContent, type IFormCreatePost } from '@social/types/post.type';
import type { IUserTag } from '@social/types/user.type';
import { Modal } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import PostEditor from './PostEditor';
import PostUserTags from './PostUserTags';
import PostFelling from './PostFelling';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreatePost: React.FC<IProps> = ({ isOpen, onClose }) => {
  const [openContent, setOpenContent] = useState<EOpenContent>(
    EOpenContent.POST
  );
  const [userTags, setUserTags] = useState<IUserTag[]>([]);
  const [feeling, setFeeling] = useState<string>('');
  console.log(feeling);
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
        images: values.images,
        userTags,
        feeling,
      };
      console.log(data);
    },
    [userTags, feeling]
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
            handleCancel={handleCancel}
            handlePostSubmit={handlePostSubmit}
            handleOpenContent={handleOpenContent}
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
    handleCancel,
    handlePostSubmit,
    handleOpenContent,
    onAddUserTag,
    onBack,
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
      >
        <div className={`max-h-[75vh] flex flex-col gap-2`}>
          {renderContent}
        </div>
      </Modal>
    </>
  );
};

export default ModalCreatePost;
