import { callApiGetInvitationList } from '@social/apis/friend.api';
import { callApiConversationFriendList } from '@social/apis/user.api';
import type { IFriend } from '@social/types/friends.type';
import type { IUserConversation } from '@social/types/user.type';
import { Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import InviteFriendCard from '../friends/InviteFriendCard';
import FriendItemCard from '../friends/FriendItemCard';

const RightSidebar = () => {
  const [invitationList, setInvitationList] = useState<IFriend[]>([]);
  const [userFriendList, setUserFriendList] = useState<IUserConversation[]>([]);
  const fetchInvitationList = useCallback(async () => {
    try {
      const res = await callApiGetInvitationList();
      if (res.data) {
        setInvitationList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchUserFriendList = useCallback(async () => {
    try {
      const res = await callApiConversationFriendList();
      if (res.data) {
        setUserFriendList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchInvitationList();
    fetchUserFriendList();
  }, [fetchInvitationList, fetchUserFriendList]);

  return (
    <>
      <div className="flex flex-1 flex-col justify-start items-stretch gap-3 overflow-y-auto w-full h-full">
        <div className="px-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-4 pt-2">
            <h3 className="text-[15px] font-semibold text-gray-700">
              Lời mời kết bạn
            </h3>
            <Button type="link">Xem tất cả</Button>
          </div>

          {invitationList.map(invite => (
            <InviteFriendCard invitation={invite} key={invite._id} />
          ))}
        </div>

        <div className="px-4 flex flex-col gap-2">
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-[15px] font-semibold text-gray-700">Bạn bè</h3>
          </div>

          {userFriendList.map(friend => (
            <FriendItemCard friend={friend} key={friend._id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
