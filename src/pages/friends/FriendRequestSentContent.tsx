import { callApiGetFriendRequestSentList } from '@social/apis/friend.api';
import type { IFriendRequestSent } from '@social/types/friends.type';
import { Spin } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import FriendRequestSentCard from '@social/components/friends/FriendRequestSentCard';

const FriendRequestSentContent = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [requests, setRequests] = useState<IFriendRequestSent[]>([]);
  const totalRequests = useRef(0);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchRequestSentList = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const res = await callApiGetFriendRequestSentList(`limit=50&page=1`);
      if (res.data) {
        setRequests(res.data.list);
        totalRequests.current = res.data.meta.total;
        setPage(1);
      }
    } catch (error) {
      console.error('Failed to fetch friend request sent list:', error);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequestSentList();
  }, [fetchRequestSentList]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;
    if (requests.length >= totalRequests.current) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await callApiGetFriendRequestSentList(
        `limit=10&page=${nextPage}`
      );
      if (res.data && res.data.list.length > 0) {
        setRequests(prev => [...prev, ...res.data.list]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Failed to load more sent requests:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, requests.length, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || requests.length >= totalRequests.current) return;

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
  }, [loadMore, isLoadingMore, requests.length]);

  return (
    <>
      <div className="flex-1 flex justify-center h-[100vh] px-3">
        <div className="w-full h-full my-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-h3 font-bold">Lời mời đã gửi</h1>
          </div>
          {isInitialLoading ? (
            <div className="w-full min-h-[300px] flex items-center justify-center">
              <Spin />
            </div>
          ) : requests.length === 0 ? (
            <div className="w-full min-h-[300px] flex items-center justify-center">
              <span className="text-gray-500 text-h3 font-semibold">
                Bạn chưa gửi lời mời kết bạn nào
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
                {requests.map(request => (
                  <FriendRequestSentCard key={request._id} request={request} />
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

export default FriendRequestSentContent;
