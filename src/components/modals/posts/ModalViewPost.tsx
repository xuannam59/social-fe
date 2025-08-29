import CommentInput from '@social/components/comments/CommentInput';
import PostItem from '@social/components/posts/PostItem';
import type { IFormComment } from '@social/types/comments.type';
import type { IPost } from '@social/types/posts.type';
import { Button, Form, Modal, Typography } from 'antd';
import React from 'react';
import { TbX } from 'react-icons/tb';

interface IProps {
  post: IPost;
  open: boolean;
  onClose: () => void;
}

const { Title } = Typography;

const ModalViewPost: React.FC<IProps> = ({ post, open, onClose }) => {
  const [form] = Form.useForm();
  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  const onSubmit = async (values: IFormComment) => {
    console.log(values);
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        closable={false}
        footer={null}
        destroyOnHidden={true}
        className="!w-[100vw] md:!w-[80vw] lg:!w-[50vw] lg:!max-w-[700px]"
        centered
        styles={{
          content: {
            padding: 0,
          },
        }}
      >
        <div className="h-fit max-h-[calc(100vh-3.5rem)] flex flex-col mt-2">
          <div className="border-b border-gray-200 p-3 flex-shrink-0">
            <div className="flex items-center justify-between gap-2">
              <Title level={3} className="!m-0 flex-1 flex justify-center">
                Bài viết của {post.userInfo.fullname}
              </Title>
              <Button type="text" shape="circle" onClick={onCancel}>
                <TbX size={24} className="text-gray-500" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col overflow-y-auto">
            <PostItem
              post={post}
              onClickComment={() => form.focusField('comments')}
              buttonClose={false}
            />
          </div>

          <CommentInput form={form} onSubmit={onSubmit} />
        </div>
      </Modal>
    </>
  );
};

export default ModalViewPost;
