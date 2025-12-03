import { callApiGetInvitationList } from '@social/apis/friend.api';
import FriendInviteCard from '@social/components/friends/FriendInviteCard';
import { useSockets } from '@social/providers/SocketProvider';
import type { IInvitationFriend } from '@social/types/friends.type';
import type { INotificationDelete } from '@social/types/notifications.type';
import { NOTIFICATION_MESSAGE } from '@social/defaults/socket.default';
import { Spin } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';

const FriendInviteContent = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [friendRequests, setFriendRequests] = useState<IInvitationFriend[]>([]);
  const totalFriendRequests = useRef(0);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { socket } = useSockets();

  const fetchInvitationList = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const res = await callApiGetInvitationList(`limit=50&page=1`);
      if (res.data) {
        setFriendRequests(res.data.list);
        totalFriendRequests.current = res.data.meta.total;
        setPage(1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitationList();
  }, [fetchInvitationList]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;
    if (friendRequests.length >= totalFriendRequests.current) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await callApiGetInvitationList(`limit=10&page=${nextPage}`);
      if (res.data && res.data.list.length > 0) {
        setFriendRequests(prev => [...prev, ...res.data.list]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Failed to load more invitations:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, friendRequests.length, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || friendRequests.length >= totalFriendRequests.current)
        return;

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
  }, [loadMore, isLoadingMore, friendRequests.length]);

  useEffect(() => {
    if (!socket) return;
    const handleDeleteFriendRequestNotification = (
      data: INotificationDelete
    ) => {
      if (!data._id) return;
      setFriendRequests(prev => {
        const newInvitationList = prev.filter(
          invite => !invite.users.includes(data.friendId)
        );
        return newInvitationList;
      });
    };

    socket.on(
      NOTIFICATION_MESSAGE.DELETE,
      handleDeleteFriendRequestNotification
    );
    return () => {
      socket.off(
        NOTIFICATION_MESSAGE.DELETE,
        handleDeleteFriendRequestNotification
      );
    };
  }, [socket]);

  return (
    <>
      <div className="flex-1 flex justify-center h-[100vh] px-3">
        <div className="w-full h-full my-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-h3 font-bold">Lời mời kết bạn</h1>
          </div>
          {isInitialLoading ? (
            <div className="w-full min-h-[300px] flex items-center justify-center">
              <Spin />
            </div>
          ) : friendRequests.length === 0 ? (
            <div className="w-full min-h-[300px] flex items-center justify-center">
              <span className="text-gray-500 text-h3 font-semibold">
                Không có lời mời kết bạn nào
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
                {friendRequests.map(request => (
                  <FriendInviteCard key={request._id} invitation={request} />
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

export default FriendInviteContent;
