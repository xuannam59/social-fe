import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { useCallback, useState } from 'react';
import PostItem from './PostItem';
import { POST_DEFAULT } from '@social/defaults/post';
import ModalViewPost from '../modals/posts/ModalViewPost';
import type { IPost, IPostLike } from '@social/types/posts.type';
import {
  doAddComment,
  doDeleteComment,
  doToggleLike,
} from '@social/redux/reducers/post.reducer';

const PostList = () => {
  const listPosts = useAppSelector(state => state.post.listPosts);
  const dispatch = useAppDispatch();
  const [openModalViewPost, setOpenModalViewPost] = useState(false);
  const [postSelected, setPostSelected] = useState<IPost>(POST_DEFAULT);

  const handleOpenModalViewPost = useCallback(
    (post: IPost) => {
      setPostSelected(post);
      setOpenModalViewPost(true);
    },
    [dispatch]
  );

  const handleCloseModalViewPost = useCallback(() => {
    setPostSelected(POST_DEFAULT);
    setOpenModalViewPost(false);
  }, [dispatch]);

  const likePost = useCallback(
    (post: IPostLike) => {
      setPostSelected(prev => ({
        ...prev,
        userLiked: {
          isLiked: post.isLike,
          type: post.type,
        },
      }));
      dispatch(doToggleLike(post));
    },
    [setPostSelected]
  );

  const handleAddComment = useCallback(
    (postId: string) => {
      setPostSelected(prev => ({
        ...prev,
        commentCount: prev.commentCount + 1,
      }));
      dispatch(doAddComment({ postId }));
    },
    [setPostSelected, dispatch]
  );

  const handleDeleteComment = useCallback(
    (postId: string, countDeleted: number) => {
      setPostSelected(prev => ({
        ...prev,
        commentCount: prev.commentCount - countDeleted,
      }));
      dispatch(doDeleteComment({ postId, countDeleted }));
    },
    [setPostSelected, dispatch]
  );

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        {listPosts.map(post => (
          <div
            className="w-full h-fit bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
            key={post._id}
          >
            <PostItem
              post={post}
              onLikePost={likePost}
              onClickComment={() => {
                handleOpenModalViewPost(post);
              }}
            />
          </div>
        ))}
      </div>
      {openModalViewPost && postSelected._id !== '' && (
        <ModalViewPost
          open={openModalViewPost}
          onClose={handleCloseModalViewPost}
          post={postSelected}
          onLikePost={likePost}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      )}
    </>
  );
};

export default PostList;
