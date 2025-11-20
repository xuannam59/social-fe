import type { IPost } from '@social/types/posts.type';
import React, { useState } from 'react';
import ModalViewPost from '../modals/posts/ModalViewPost';
import PostView from './PostView';
import ModalEditPost from '../modals/posts/ModalEditPost';

interface IProps {
  post: IPost;
  buttonClose?: boolean;
  updateLikePost: (type: number, isLike: boolean) => void;
  updateCommentPost: (count: number) => void;
  updatePost: (post: IPost) => void;
  deletePost: () => void;
}

const PostItem: React.FC<IProps> = ({
  post,
  buttonClose = true,
  updateLikePost,
  updateCommentPost,
  updatePost,
  deletePost,
}) => {
  const [openModalViewPost, setOpenModalViewPost] = useState(false);
  const [openModalEditPost, setOpenModalEditPost] = useState(false);

  const onClickComment = () => {
    setOpenModalViewPost(true);
  };

  const onClickEditPost = () => {
    setOpenModalEditPost(true);
  };

  return (
    <>
      <PostView
        post={post}
        onClickComment={onClickComment}
        onLikePost={updateLikePost}
        onClickEditPost={onClickEditPost}
        onDeletePost={deletePost}
        buttonClose={buttonClose}
      />

      {openModalViewPost && (
        <ModalViewPost
          openModalViewPost={openModalViewPost}
          post={post}
          onClose={() => setOpenModalViewPost(false)}
          onLikePost={updateLikePost}
          onAddComment={() => updateCommentPost(1)}
          onDeleteComment={updateCommentPost}
        />
      )}
      {openModalEditPost && (
        <ModalEditPost
          isOpen={openModalEditPost}
          postDetail={post}
          onClose={() => setOpenModalEditPost(false)}
          updatePost={updatePost}
        />
      )}
    </>
  );
};

export default PostItem;
