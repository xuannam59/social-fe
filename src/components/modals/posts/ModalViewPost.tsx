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
import LoadingModalPost from '@social/components/loading/LoadingModalPost';
import PostItem from '@social/components/posts/PostItem';
import { COMMENT_DEFAULT } from '@social/defaults/post';
import { NOTIFICATION_MESSAGE } from '@social/defaults/socket.default';
import { useAppSelector } from '@social/hooks/redux.hook';
import type { IComment, IFormComment } from '@social/types/comments.type';
import type { IPost, IPostLike } from '@social/types/posts.type';
import { Button, Form, message, Modal } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TbX } from 'react-icons/tb';
import { v4 as uuidv4 } from 'uuid';
import { useSockets } from '@social/providers/SocketProvider';

interface IProps {
  openModalViewPost: boolean;
  post: IPost;
  onClose: () => void;
  onLikePost: (post: IPostLike) => void;
  onAddComment: (postId: string) => void;
  onDeleteComment: (postId: string, countDeleted: number) => void;
  isLoading?: boolean;
}

const ModalViewPost: React.FC<IProps> = ({
  openModalViewPost,
  post,
  onClose,
  onLikePost,
  onAddComment,
  onDeleteComment,
  isLoading = false,
}) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const { socket } = useSockets();
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
    if (!post._id) return;
    setIsLoadingComments(true);
    const res = await callGetComments(post._id);
    if (res.data) {
      setComments(res.data);
    }
    setIsLoadingComments(false);
  }, [post._id]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  const onSubmit = useCallback(
    async (values: IFormComment) => {
      setCommentProcess('pending');
      try {
        const { content, media, mentions, level } = values;
        const payload = {
          content,
          media,
          mentions,
          postId: post._id,
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
          onAddComment(post._id);
          setCommentProcess('success');
          socket.emit(NOTIFICATION_MESSAGE.POST_COMMENT, {
            postId: post._id,
            content,
            postAuthorId: post.authorId._id,
            commentId: res.data._id,
            mentionsList: mentions.map(mention => mention.userId),
          });
        } else {
          message.error(convertErrorMessage(res.message));
          setCommentProcess('error');
        }
      } catch (error) {
        console.log(error);
        setCommentProcess('error');
      }
    },
    [post._id, userInfo, onAddComment, socket, post.authorId._id]
  );

  const handleDeleteComment = useCallback(
    (commentId: string, countDeleted: number) => {
      setComments(prev => prev.filter(comment => comment._id !== commentId));
      onDeleteComment(post._id, countDeleted);
    },
    [post._id, onDeleteComment]
  );

  return (
    <>
      <Modal
        open={openModalViewPost}
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
        {isLoading ? (
          <LoadingModalPost />
        ) : (
          <div className="h-fit max-h-[70vh] flex flex-col mt-2">
            <div className="border-b border-gray-200 p-3 flex-shrink-0">
              <div className="flex items-center justify-between gap-2">
                <span className="flex-1 flex justify-center text-h2 font-bold">
                  Bài viết của {post.authorId.fullname}
                </span>
                <Button type="text" shape="circle" onClick={onCancel}>
                  <TbX size={24} className="text-gray-500" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col overflow-y-auto">
              <PostItem
                post={post}
                onClickComment={() => form.focusField('content')}
                buttonClose={false}
                onLikePost={onLikePost}
              />
              <div className="px-3 mb-3">
                <div className="border-t border-gray-200 pt-2 flex flex-col gap-2 h-fit max-h-[calc(100vh-200px)]">
                  {comment.current && (
                    <CommentItem
                      post={post}
                      comment={comment.current}
                      level={1}
                      commentStatus={commentProcess}
                      onDeleteComment={() => {}}
                      onAddComment={() => {}}
                    />
                  )}
                  {isLoadingComments ? (
                    <LoadingComment />
                  ) : comments.length > 0 ? (
                    comments.map(comment => (
                      <CommentItem
                        key={comment._id}
                        post={post}
                        comment={comment}
                        level={1}
                        onDeleteComment={handleDeleteComment}
                        onAddComment={onAddComment}
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
        )}
      </Modal>
    </>
  );
};

export default ModalViewPost;
