import React, { useCallback, useEffect, useState } from 'react';
import ModalViewPost from '../modals/posts/ModalViewPost';
import type { IPost, IPostLike } from '@social/types/posts.type';
import { callApiGetPostDetail } from '@social/apis/posts.api';
import { notification } from 'antd';
import { POST_DEFAULT } from '@social/defaults/post';

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
  const [postDetail, setPostDetail] = useState<IPost>(post);
  const [isLoading, setIsLoading] = useState(false);

  const getPostDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await callApiGetPostDetail(post._id);
      if (res.data) {
        setPostDetail({ ...res.data, authorId: post.authorId });
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
  }, [post._id, closeModalViewPost, post.authorId]);

  const handleLikePost = useCallback((post: IPostLike) => {
    setPostDetail(prev => {
      const userLiked = prev.userLiked;
      if (post.isLike) {
        if (userLiked.isLiked) {
          return {
            ...prev,
            userLiked: {
              isLiked: true,
              type: post.type,
            },
          };
        } else {
          return {
            ...prev,
            likeCount: prev.likeCount + 1,
            userLiked: {
              isLiked: true,
              type: post.type,
            },
          };
        }
      } else {
        return {
          ...prev,
          likeCount: prev.likeCount - 1,
          userLiked: {
            isLiked: false,
            type: null,
          },
        };
      }
    });
  }, []);

  const handleAddComment = useCallback((postId: string) => {
    setPostDetail(prev => ({
      ...prev,
      commentCount: prev.commentCount + 1,
    }));
  }, []);

  useEffect(() => {
    if (post._id) {
      getPostDetail();
    }
  }, [getPostDetail, post._id]);

  const handleDeleteComment = useCallback(
    (postId: string, countDeleted: number) => {
      setPostDetail(prev => ({
        ...prev,
        commentCount: prev.commentCount - countDeleted,
      }));
    },
    []
  );

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
