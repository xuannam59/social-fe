import CommentInput from '@social/components/comments/CommentInput';
import PostItem from '@social/components/posts/PostItem';
import type { IComment, IFormComment } from '@social/types/comments.type';
import { Button, Form, Modal, notification, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TbX } from 'react-icons/tb';
import { useAppSelector } from '@social/hooks/redux.hook';
import { callApiCreateComment } from '@social/apis/comment.api';
import { convertErrorMessage } from '@social/common/convert';
import { callGetComments } from '@social/apis/comment.api';
import CommentItem from '@social/components/comments/CommentItem';
import LoadingComment from '@social/components/loading/LoadingComment';
import EmptyState from '@social/components/common/EmptyState';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const { Title } = Typography;

const ModalViewPost: React.FC<IProps> = ({ open, onClose }) => {
  const currentPost = useAppSelector(state => state.post.currentPost);
  const parentId = useRef<string>('');
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [form] = Form.useForm();
  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  const getComments = useCallback(async () => {
    setIsLoadingComments(true);
    const res = await callGetComments(currentPost._id);
    if (res.data) {
      setComments(res.data);
    }
    setIsLoadingComments(false);
  }, [currentPost._id]);

  useEffect(() => {
    if (currentPost._id) {
      getComments();
    }
  }, [getComments, currentPost._id]);

  const onSubmit = async (values: IFormComment) => {
    try {
      const { content, medias, mentions, level } = values;
      const payload = {
        content,
        medias,
        mentions,
        postId: currentPost._id,
        level,
        parentId: parentId.current,
      };
      const res = await callApiCreateComment(payload);
      if (!res.data) {
        notification.error({
          message: 'Tạo bình luận thất bại',
          description: convertErrorMessage(res.message),
        });
      }
    } catch (error) {
      console.log(error);
    }
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
                Bài viết của {currentPost.authorId.fullname}
              </Title>
              <Button type="text" shape="circle" onClick={onCancel}>
                <TbX size={24} className="text-gray-500" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col overflow-y-auto">
            <PostItem
              post={currentPost}
              onClickComment={() => form.focusField('content')}
              buttonClose={false}
            />
            <div className="px-3 mb-3">
              <div className="border-t border-gray-200 pt-2 flex flex-col gap-2 h-fit">
                {isLoadingComments ? (
                  <LoadingComment />
                ) : comments.length > 0 ? (
                  comments.map(comment => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      level={1}
                    />
                  ))
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <CommentInput form={form} onSubmit={onSubmit} level={0} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalViewPost;
