import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import {
  doDeletePost,
  doToggleLike,
  doUpdateCommentCount,
  doUpdatePost,
  doAddMorePosts,
  fetchPosts,
} from '@social/redux/reducers/post.reducer';
import { callApiFetchPosts } from '@social/apis/posts.api';
import { useCallback, useEffect, useRef, useState } from 'react';
import LoadingPostList from '../loading/LoadingPostList';
import PostItem from './PostItem';
import type { IPost } from '@social/types/posts.type';
import { TbLoader2 } from 'react-icons/tb';

const PostList = () => {
  const { listPosts, isLoadingPosts, total } = useAppSelector(
    state => state.post
  );
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollParentRef = useRef<HTMLElement | Window | null>(null);

  const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
    if (!node) return window;
    let parent: HTMLElement | null = node.parentElement;
    while (parent) {
      const style = window.getComputedStyle(parent);
      const overflowY = style.overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') {
        return parent;
      }
      parent = parent.parentElement;
    }
    return window;
  };

  useEffect(() => {
    if (listPosts.length === 0) {
      dispatch(fetchPosts('limit=10'));
    }
  }, [dispatch, listPosts.length]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;
    if (listPosts.length >= total) return;
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await callApiFetchPosts(`limit=10&page=${nextPage}`);
      if (res.data?.list?.length) {
        dispatch(doAddMorePosts(res.data.list));
        setPage(nextPage);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [dispatch, isLoadingMore, listPosts.length, page, total]);

  useEffect(() => {
    scrollParentRef.current = getScrollParent(containerRef.current);
    const el = scrollParentRef.current;

    const handleScroll = () => {
      if (el instanceof Window) {
        const nearBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 200;
        if (nearBottom) void loadMore();
      } else if (el) {
        const element = el as HTMLElement;
        const nearBottom =
          element.scrollTop + element.clientHeight >=
          element.scrollHeight - 200;
        if (nearBottom) void loadMore();
      }
    };

    if (el instanceof Window) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } else if (el) {
      (el as HTMLElement).addEventListener('scroll', handleScroll, {
        passive: true,
      });
      return () =>
        (el as HTMLElement).removeEventListener('scroll', handleScroll);
    }
  }, [loadMore]);

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
          <div className="flex flex-col gap-2 w-full mb-5" ref={containerRef}>
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
            {isLoadingMore && (
              <>
                <div className="flex justify-center items-center py-2">
                  <TbLoader2 size={30} className="animate-spin text-gray-500" />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default PostList;
