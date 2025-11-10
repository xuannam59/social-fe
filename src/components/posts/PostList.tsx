import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import {
  doDeletePost,
  doToggleLike,
  doUpdateCommentCount,
  doUpdatePost,
  fetchPosts,
} from '@social/redux/reducers/post.reducer';
import { useCallback, useEffect } from 'react';
import LoadingPostList from '../loading/LoadingPostList';
import PostItem from './PostItem';
import type { IPost } from '@social/types/posts.type';

const PostList = () => {
  const { listPosts, isLoadingPosts } = useAppSelector(state => state.post);
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (listPosts.length === 0) {
      dispatch(fetchPosts('limit=10'));
    }
  }, [dispatch, listPosts.length]);

  const updateLikePost = useCallback(
    (index: number, type: number, isLike: boolean) => {
      const userLiked = { userId: userInfo._id, type };
      dispatch(doToggleLike({ index, userLiked, isLike }));
    },
    [userInfo._id, dispatch]
  );

  const updateCommentPost = useCallback(
    (index: number, count: number) => {
      dispatch(doUpdateCommentCount({ index, count }));
    },
    [dispatch]
  );

  const updatePost = useCallback(
    (index: number, post: IPost) => {
      dispatch(doUpdatePost({ index, post }));
    },
    [dispatch]
  );

  const deletePost = useCallback(
    (id: string) => {
      dispatch(doDeletePost(id));
    },
    [dispatch]
  );
  return (
    <>
      {isLoadingPosts ? (
        <LoadingPostList />
      ) : (
        <>
          <div className="flex flex-col gap-2 w-full mb-5">
            {listPosts.map((post, index) => (
              <PostItem
                key={post._id}
                post={post}
                updateLikePost={(type, isLike) =>
                  updateLikePost(index, type, isLike)
                }
                updateCommentPost={(count: number) =>
                  updateCommentPost(index, count)
                }
                updatePost={post => updatePost(index, post)}
                deletePost={() => deletePost(post._id)}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default PostList;
