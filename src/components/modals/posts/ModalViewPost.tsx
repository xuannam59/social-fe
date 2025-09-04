import {
  callApiCreateComment,
  callGetComments,
} from '@social/apis/comment.api';
import { convertErrorMessage } from '@social/common/convert';
import { smartUpload } from '@social/common/uploads';
import CommentInput from '@social/components/comments/CommentInput';
import CommentItem from '@social/components/comments/CommentItem';
import EmptyState from '@social/components/common/EmptyState';
import LoadingComment from '@social/components/loading/LoadingComment';
import PostItem from '@social/components/posts/PostItem';
import { COMMENT_DEFAULT } from '@social/defaults/post';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { doAddComment } from '@social/redux/reducers/post.reducer';
import type { IComment, IFormComment } from '@social/types/comments.type';
import { Button, Form, message, Modal, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TbX } from 'react-icons/tb';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const { Title } = Typography;

const ModalViewPost: React.FC<IProps> = ({ open, onClose }) => {
  const currentPost = useAppSelector(state => state.post.currentPost);
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const dispatch = useAppDispatch();
  const parentId = useRef<string>('');
  const [comments, setComments] = useState<IComment[]>([]);
  const comment = useRef<IComment | null>(null);
  const [commentProcess, setCommentProcess] = useState<
    'success' | 'error' | 'pending'
  >('success');
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

  const onSubmit = useCallback(
    async (values: IFormComment) => {
      setCommentProcess('pending');
      try {
        const { content, media, mentions, level } = values;
        const payload = {
          content,
          media,
          mentions,
          postId: currentPost._id,
          level,
          parentId: parentId.current,
        };
        comment.current = {
          ...COMMENT_DEFAULT,
          ...payload,
          mentions: mentions.map(mention => ({
            _id: uuidv4(),
            ...mention,
          })),
          authorId: {
            _id: userInfo._id,
            fullname: userInfo.fullname,
            avatar: userInfo.avatar,
          },
        };

        let mediasUpload: { keyS3: string; type: string } | undefined =
          undefined;
        if (media?.file) {
          const file = media.file;
          if (file) {
            const uploadRes = await smartUpload(file);
            if (uploadRes.data) {
              mediasUpload = {
                keyS3: uploadRes.data.key,
                type: file.type.split('/')[0],
              };
            } else {
              throw new Error(uploadRes.message);
            }
          }
        }

        const res = await callApiCreateComment({
          ...payload,
          media: mediasUpload,
        });
        if (res.data) {
          const commentCurrent = comment.current;
          if (commentCurrent) {
            setComments(prev => [
              { ...commentCurrent, _id: res.data._id, media: mediasUpload },
              ...prev,
            ]);
            comment.current = null;
          }
          dispatch(doAddComment({ postId: currentPost._id }));
          setCommentProcess('success');
        } else {
          message.error(convertErrorMessage(res.message));
          setCommentProcess('error');
        }
      } catch (error) {
        console.log(error);
        setCommentProcess('error');
      }
    },
    [currentPost._id, userInfo, dispatch]
  );

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
                {comment.current && (
                  <CommentItem
                    comment={comment.current}
                    level={1}
                    commentStatus={commentProcess}
                  />
                )}
                {isLoadingComments ? (
                  <LoadingComment />
                ) : comments.length > 0 ? (
                  comments.map(comment => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      level={1}
                      onDeleteComment={commentId =>
                        setComments(prev =>
                          prev.filter(child => child._id !== commentId)
                        )
                      }
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
