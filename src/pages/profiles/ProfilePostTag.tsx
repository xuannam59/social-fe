import LoadingPostList from '@social/components/loading/LoadingPostList';
import CreatePost from '@social/components/posts/CreatePost';
import PostItem from '@social/components/posts/PostItem';
import ProfileIntroduction from '@social/components/profiles/ProfileIntroduction';
import { useAppSelector } from '@social/hooks/redux.hook';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { IPost } from '@social/types/posts.type';
import { callApiFetchPostsByUserId } from '@social/apis/posts.api';
import { TbLoader2 } from 'react-icons/tb';

const ProfilePostTag = () => {
  const { userId } = useParams();
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [listPosts, setListPosts] = useState<IPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const totalPosts = useRef(0);

  const fetchUserPosts = useCallback(async () => {
    if (!userId) return;
    setIsLoadingPosts(true);
    try {
      const res = await callApiFetchPostsByUserId(userId, 'limit=10&page=1');
      if (res.data) {
        setListPosts(res.data.list);
        totalPosts.current = res.data.meta.total;
        setPage(1);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [userId]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;
    if (listPosts.length >= totalPosts.current) return;
    if (!userId) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await callApiFetchPostsByUserId(
        userId,
        `limit=10&page=${nextPage}`
      );
      if (res.data && res.data.list.length > 0) {
        setListPosts(prev => [...prev, ...res.data.list]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [userId, page, isLoadingMore, listPosts.length]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || listPosts.length >= totalPosts.current) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, isLoadingMore, listPosts.length]);

  const onAddPostMySelf = useCallback((post: IPost) => {
    setListPosts(prev => [post, ...prev]);
  }, []);

  const updateLikePost = useCallback(
    (index: number, type: number, isLike: boolean) => {
      const userLiked = { userId: userInfo._id, type };
      setListPosts(prev => {
        const newList = [...prev];
        if (isLike) {
          newList[index].userLiked = userLiked;
          const existingLikeIndex = newList[index].userLikes.findIndex(
            like => like.userId === userInfo._id
          );
          if (existingLikeIndex === -1) {
            newList[index].userLikes.push(userLiked);
          }
        } else {
          newList[index].userLiked = null;
          newList[index].userLikes = newList[index].userLikes.filter(
            like => like.userId !== userInfo._id
          );
        }

        return newList;
      });
    },
    [userInfo._id]
  );

  const updateCommentPost = useCallback((index: number, count: number) => {
    setListPosts(prev => {
      const newList = [...prev];
      newList[index].commentCount += count;
      return newList;
    });
  }, []);

  const updatePost = useCallback((index: number, post: IPost) => {
    console.log(post);
    setListPosts(prev => {
      const newList = [...prev];
      newList[index] = post;
      return newList;
    });
  }, []);

  const deletePost = useCallback((id: string) => {
    setListPosts(prev => {
      const newList = [...prev];
      return newList.filter(post => post._id !== id);
    });
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-5 items-center lg:items-start">
        <div className="w-full lg:w-3/7">
          <ProfileIntroduction />
        </div>
        <div className="w-full lg:w-4/7 shrink-0">
          <div className="flex flex-col gap-3">
            {userId === userInfo._id && (
              <CreatePost onAddPostMySelf={onAddPostMySelf} />
            )}

            {isLoadingPosts ? (
              <LoadingPostList />
            ) : listPosts.length === 0 ? (
              <>
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-gray-500 text-h2 font-bold">
                    Chưa có bài viết nào
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2 w-full">
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
                {isLoadingMore && (
                  <div className="flex justify-center items-center py-4">
                    <TbLoader2
                      size={24}
                      className="animate-spin text-gray-500"
                    />
                  </div>
                )}
                {listPosts.length >= totalPosts.current &&
                  listPosts.length > 0 && (
                    <div className="flex justify-center items-center py-4">
                      <span className="text-gray-500 text-base font-semibold">
                        Đã hiển thị tất cả bài viết
                      </span>
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

export default ProfilePostTag;
