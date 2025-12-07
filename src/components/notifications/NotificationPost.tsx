import { callApiGetPostDetail } from '@social/apis/posts.api';
import { useAppSelector } from '@social/hooks/redux.hook';
import type { IPost } from '@social/types/posts.type';
import { notification } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import ModalViewPost from '../modals/posts/ModalViewPost';

interface IProps {
  post: IPost;
  openModalViewPost: boolean;
  closeModalViewPost: () => void;
}

const NotificationPost: React.FC<IProps> = ({
  post,
  openModalViewPost,
  closeModalViewPost,
}) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [postDetail, setPostDetail] = useState<IPost>(post);
  const [isLoading, setIsLoading] = useState(false);

  const getPostDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await callApiGetPostDetail(post._id);
      if (res.data) {
        setPostDetail(res.data);
      } else {
        notification.error({
          message: 'Lỗi',
          description: res.message,
        });
        closeModalViewPost();
      }
    } catch (error) {
      console.error('Failed to get post detail:', error);
    }
    setIsLoading(false);
  }, [post._id, closeModalViewPost]);

  const handleLikePost = useCallback(
    (type: number, isLike: boolean) => {
      setPostDetail(prev => {
        const newPost = { ...prev };
        if (isLike) {
          newPost.userLiked = { userId: userInfo._id, type };
          const existingLikeIndex = newPost.userLikes.findIndex(
            like => like.userId === userInfo._id
          );
          if (existingLikeIndex === -1) {
            newPost.userLikes.push({ userId: userInfo._id, type });
          }
        } else {
          newPost.userLiked = null;
          newPost.userLikes = newPost.userLikes.filter(
            like => like.userId !== userInfo._id
          );
        }

        return newPost;
      });
    },
    [userInfo._id]
  );

  const handleAddComment = useCallback(() => {
    setPostDetail(prev => ({
      ...prev,
      commentCount: prev.commentCount + 1,
    }));
  }, []);

  useEffect(() => {
    if (post._id && openModalViewPost) {
      getPostDetail();
    }
  }, [getPostDetail, post._id, openModalViewPost]);

  const handleDeleteComment = useCallback((countDeleted: number) => {
    setPostDetail(prev => ({
      ...prev,
      commentCount: prev.commentCount + countDeleted,
    }));
  }, []);

  return (
    <>
      <ModalViewPost
        openModalViewPost={openModalViewPost}
        post={postDetail}
        onClose={closeModalViewPost}
        onLikePost={handleLikePost}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        isLoading={isLoading}
      />
    </>
  );
};

export default NotificationPost;
