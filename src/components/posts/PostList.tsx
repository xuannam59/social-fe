import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { useCallback, useRef, useState } from 'react';
import PostItem from './PostItem';
import { POST_DEFAULT } from '@social/defaults/post';
import ModalViewPost from '../modals/posts/ModalViewPost';
import type { IPost, IPostLike } from '@social/types/posts.type';
import {
  doAddComment,
  doDeleteComment,
  doToggleLike,
  setPosts,
} from '@social/redux/reducers/post.reducer';
import type { VirtuosoHandle } from 'react-virtuoso';
import { callApiGetPost } from '@social/apis/posts.api';
import LoadingPostList from '../loading/LoadingPostList';

const PostList = () => {
  const { listPosts, isLoadingPosts } = useAppSelector(state => state.post);
  const dispatch = useAppDispatch();
  const [openModalViewPost, setOpenModalViewPost] = useState(false);
  const [postSelected, setPostSelected] = useState<IPost>(POST_DEFAULT);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [firstItemIndex, setFirstItemIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const handleOpenModalViewPost = useCallback((post: IPost) => {
    setPostSelected(post);
    setOpenModalViewPost(true);
  }, []);

  const handleCloseModalViewPost = useCallback(() => {
    setPostSelected(POST_DEFAULT);
    setOpenModalViewPost(false);
  }, []);

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
    [dispatch]
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

  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await callApiGetPost(`page=${nextPage}`);
      if (res.data) {
        const olderAsc = [...res.data].reverse();
        if (olderAsc.length > 0) {
          setFirstItemIndex(prev => prev - olderAsc.length);
          setPage(nextPage);
          dispatch(setPosts(olderAsc));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, page, dispatch]);

  return (
    <>
      {isLoadingPosts ? (
        <LoadingPostList />
      ) : (
        <>
          <div className="flex flex-col gap-2 w-full">
            {listPosts.map(post => (
              <PostItem
                key={post._id}
                post={post}
                onLikePost={likePost}
                onClickComment={() => handleOpenModalViewPost(post)}
              />
            ))}
          </div>
        </>
      )}

      <ModalViewPost
        openModalViewPost={openModalViewPost}
        post={postSelected}
        onClose={handleCloseModalViewPost}
        onLikePost={likePost}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
      />
    </>
  );
};

export default PostList;
