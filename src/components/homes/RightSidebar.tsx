import { callApiGetInvitationList } from '@social/apis/friend.api';
import { NOTIFICATION_MESSAGE } from '@social/defaults/socket.default';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { useSockets } from '@social/providers/SocketProvider';
import {
  doOpenConversation,
  fetchFriendConversations,
  fetchGroupConversations,
} from '@social/redux/reducers/conversations.reducer';
import type { IConversation } from '@social/types/conversations.type';
import type { IInvitationFriend } from '@social/types/friends.type';
import { Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import AvatarUser from '../common/AvatarUser';
import FriendItemCard from '../friends/FriendItemCard';
import InviteFriendCard from '../friends/InviteFriendCard';
import type { INotificationDelete } from '@social/types/notifications.type';

const RightSidebar = () => {
  const [invitationList, setInvitationList] = useState<IInvitationFriend[]>([]);
  const { friendConversations, groupConversations } = useAppSelector(
    state => state.conversations
  );
  const dispatch = useAppDispatch();
  const fetchInvitationList = useCallback(async () => {
    try {
      const res = await callApiGetInvitationList('limit=2&page=1');
      if (res.data) {
        setInvitationList(res.data.list);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  const { socket } = useSockets();

  useEffect(() => {
    if (!socket) return;
    const handleDeleteFriendRequestNotification = (
      data: INotificationDelete
    ) => {
      if (!data._id) return;
      setInvitationList(prev => {
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

  useEffect(() => {
    fetchInvitationList();
  }, [fetchInvitationList]);

  useEffect(() => {
    dispatch(fetchFriendConversations());
    dispatch(fetchGroupConversations());
  }, [dispatch]);

  const handleRemoveInvitation = useCallback((invitationId: string) => {
    setInvitationList(prev =>
      prev.filter(invite => invite._id !== invitationId)
    );
  }, []);

  const handleOpenGroupConversation = useCallback(
    (conversation: IConversation) => {
      dispatch(doOpenConversation(conversation));
    },
    [dispatch]
  );

  return (
    <>
      <div className="flex flex-1 flex-col justify-start items-stretch gap-3 overflow-y-auto w-full h-full">
        {invitationList.length > 0 && (
          <div className="px-4 flex flex-col gap-3">
            <div className="flex items-center justify-between pr-4 pt-2">
              <h3 className="text-[15px] font-semibold text-gray-700">
                Lời mời kết bạn
              </h3>
              <Button type="link">Xem tất cả</Button>
            </div>

            {invitationList.map(invite => (
              <InviteFriendCard
                invitation={invite}
                key={invite._id}
                onRemoveInvitation={handleRemoveInvitation}
              />
            ))}
          </div>
        )}

        <div className="px-4 flex flex-col gap-2">
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-[15px] font-semibold text-gray-700">Bạn bè</h3>
          </div>
          {friendConversations.length > 0 ? (
            <>
              {friendConversations.map(friend => (
                <FriendItemCard friend={friend} key={friend._id} />
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-gray-500">Chưa có bạn bè</span>
              <span className="text-gray-500">
                Hãy kết bạn với người bạn thân
              </span>
            </div>
          )}
        </div>
        <div className="px-4 flex flex-col gap-2">
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-[15px] font-semibold text-gray-700">
              Nhóm chat
            </h3>
          </div>

          {groupConversations.length > 0 ? (
            <>
              {groupConversations.map(group => (
                <div
                  key={group._id}
                  className="flex gap-2 items-center cursor-pointer rounded-lg p-1 hover:bg-gray-200"
                  onClick={() => handleOpenGroupConversation(group)}
                >
                  <div className="relative">
                    <AvatarUser avatar={group.avatar} size={42} />
                  </div>
                  <span className="text-base">{group.name}</span>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-gray-500 text-base">Chưa có nhóm chat</span>
              <span className="text-gray-500 text-base">
                Tạo nhóm chat để bắt đầu trò chuyện
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
