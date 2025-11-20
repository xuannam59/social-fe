import { callApiFetchPostsVideo } from '@social/apis/posts.api';
import LoadingPostList from '@social/components/loading/LoadingPostList';
import PostItem from '@social/components/posts/PostItem';
import { useAppSelector } from '@social/hooks/redux.hook';
import type { IPost } from '@social/types/posts.type';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TbLoader2 } from 'react-icons/tb';

const WatchPage = () => {
  const [listPostsVideo, setListPostsVideo] = useState<IPost[]>([]);
  const [isLoadingPostsVideo, setIsLoadingPostsVideo] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const totalPostsVideo = useRef(0);
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const userId = userInfo?._id;

  const fetchPostsVideo = useCallback(async () => {
    setIsLoadingPostsVideo(true);
    try {
      const res = await callApiFetchPostsVideo('limit=10');
      if (res.data) {
        setListPostsVideo(res.data.list);
        totalPostsVideo.current = res.data.meta.total;
        setPage(1);
      }
    } finally {
      setIsLoadingPostsVideo(false);
    }
  }, []);

  useEffect(() => {
    fetchPostsVideo();
  }, [fetchPostsVideo]);

  const updateLikePost = useCallback(
    (index: number, type: number, isLike: boolean) => {
      if (!userId) return;
      setListPostsVideo(prev => {
        const next = [...prev];
        const target = next[index];
        if (!target) return prev;

        const currentLikes = target.userLikes ?? [];
        if (isLike) {
          const userLiked = { userId, type };
          const hasLiked = currentLikes.some(like => like.userId === userId);
          next[index] = {
            ...target,
            userLiked,
            userLikes: hasLiked
              ? currentLikes.map(like =>
                  like.userId === userId ? userLiked : like
                )
              : [...currentLikes, userLiked],
          };
        } else {
          next[index] = {
            ...target,
            userLiked: null,
            userLikes: currentLikes.filter(like => like.userId !== userId),
          };
        }
        return next;
      });
    },
    [userId]
  );

  const updateCommentPost = useCallback((index: number, count: number) => {
    setListPostsVideo(prev => {
      const next = [...prev];
      const target = next[index];
      if (!target) return prev;
      next[index] = {
        ...target,
        commentCount: Math.max(0, (target.commentCount ?? 0) + count),
      };
      return next;
    });
  }, []);

  const updatePost = useCallback((index: number, post: IPost) => {
    setListPostsVideo(prev => {
      const next = [...prev];
      next[index] = post;
      return next;
    });
  }, []);

  const deletePost = useCallback((id: string) => {
    setListPostsVideo(prev => prev.filter(post => post._id !== id));
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;
    if (listPostsVideo.length >= totalPostsVideo.current) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await callApiFetchPostsVideo(`limit=10&page=${nextPage}`);
      if (res.data?.list?.length) {
        setListPostsVideo(prev => [...prev, ...res.data.list]);
        setPage(nextPage);
        if (res.data.meta?.total) {
          totalPostsVideo.current = res.data.meta.total;
        }
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, listPostsVideo.length, page]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200;
      if (nearBottom) {
        void loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  return (
    <>
      <div className="flex h-full gap-4 overflow-y-auto">
        <div className="hidden lg:block lg:w-[280px] xl:w-[360px] sticky top-0 left-0">
          <div className="w-full h-full bg-white shadow-md py-2 px-3">
            <span className="font-bold text-h2 text-center block-inline">
              Video
            </span>
          </div>
        </div>
        <div className="flex-1 flex justify-center h-[100vh] px-3">
          <div className="max-w-[680px] w-full h-full my-4">
            {isLoadingPostsVideo ? (
              <div className="w-full flex flex-col justify-center gap-3">
                <LoadingPostList />
              </div>
            ) : listPostsVideo.length === 0 ? (
              <div className="w-full min-h-[300px] flex items-center justify-center">
                <span className="text-gray-500 text-base font-semibold">
                  Không có dữ liệu nào
                </span>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 w-full">
                  {listPostsVideo.map((post, index) => (
                    <PostItem
                      key={post._id}
                      post={post}
                      updateLikePost={(type, isLike) =>
                        updateLikePost(index, type, isLike)
                      }
                      updateCommentPost={(count: number) =>
                        updateCommentPost(index, count)
                      }
                      updatePost={postUpdated => updatePost(index, postUpdated)}
                      buttonClose={false}
                      deletePost={() => deletePost(post._id)}
                    />
                  ))}
                </div>
                {isLoadingMore && (
                  <div className="flex justify-center py-4">
                    <TbLoader2
                      size={28}
                      className="animate-spin text-gray-500"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WatchPage;
