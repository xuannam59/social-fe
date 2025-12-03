import { callApiGetFriendByUserId } from '@social/apis/user.api';
import MyFriendCard from '@social/components/friends/MyFriendCard';
import { useAppSelector } from '@social/hooks/redux.hook';
import type { IUser } from '@social/types/user.type';
import { Spin } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';

const MyFriendsPage = () => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<IUser[]>([]);
  const totalFriends = useRef(0);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchUserFriends = useCallback(async () => {
    if (!userInfo?._id) return;

    try {
      setIsLoading(true);
      const res = await callApiGetFriendByUserId(
        userInfo._id,
        'limit=50&page=1'
      );
      if (res.data) {
        setFriends(res.data.list);
        totalFriends.current = res.data.meta.total;
        setPage(1);
      }
    } catch (error) {
      console.error('Failed to fetch user friends:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userInfo?._id]);

  useEffect(() => {
    fetchUserFriends();
  }, [fetchUserFriends]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;
    if (friends.length >= totalFriends.current) return;
    if (!userInfo?._id) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await callApiGetFriendByUserId(
        userInfo._id,
        `limit=10&page=${nextPage}`
      );
      if (res.data && res.data.list.length > 0) {
        setFriends(prev => [...prev, ...res.data.list]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Failed to load more friends:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, friends.length, page, userInfo?._id]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || friends.length >= totalFriends.current) return;

      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const windowHeight = window.innerHeight || 0;
      const documentHeight = document.documentElement.scrollHeight || 0;

      if (scrollTop + windowHeight >= documentHeight - 200) {
        void loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, isLoadingMore, friends.length]);

  return (
    <>
      <div className="flex-1 flex justify-center h-[100vh] px-3">
        <div className="w-full h-full my-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-h3 font-bold">Tất cả bạn bè</h1>
          </div>
          {isLoading ? (
            <div className="w-full min-h-[300px] flex items-center justify-center">
              <Spin />
            </div>
          ) : friends.length === 0 ? (
            <div className="w-full min-h-[300px] flex items-center justify-center">
              <span className="text-gray-500 text-h3 font-semibold">
                Không có bạn bè nào
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
                {friends.map(friend => (
                  <MyFriendCard key={friend._id} friendInfo={friend} />
                ))}
              </div>
              {isLoadingMore && (
                <div className="w-full flex justify-center py-4">
                  <Spin />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyFriendsPage;
