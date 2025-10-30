import type { IPost } from '@social/types/posts.type';
import React, { useState } from 'react';
import ModalViewPost from '../modals/posts/ModalViewPost';
import PostView from './PostView';

interface IProps {
  post: IPost;
  updateLikePost: (type: number, isLike: boolean) => void;
  updateCommentPost: (countDeleted: number) => void;
}

const PostItem: React.FC<IProps> = ({
  post,
  updateLikePost,
  updateCommentPost,
}) => {
  const [openModalViewPost, setOpenModalViewPost] = useState(false);

  const onClickComment = () => {
    setOpenModalViewPost(true);
  };

  return (
    <>
      <PostView
        post={post}
        onClickComment={onClickComment}
        onLikePost={updateLikePost}
      />

      <ModalViewPost
        openModalViewPost={openModalViewPost}
        post={post}
        onClose={() => setOpenModalViewPost(false)}
        onLikePost={updateLikePost}
        onAddComment={() => updateCommentPost(1)}
        onDeleteComment={updateCommentPost}
      />
    </>
  );
};

export default PostItem;
