import { callApiGetInvitationList } from '@social/apis/friend.api';
import { callApiConversationFriendList } from '@social/apis/user.api';
import type { IFriend } from '@social/types/friends.type';
import type { IUserConversation } from '@social/types/user.type';
import { Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import InviteFriendCard from '../friends/InviteFriendCard';
import FriendItemCard from '../friends/FriendItemCard';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { fetchFriendConversations } from '@social/redux/reducers/conversations';

const RightSidebar = () => {
  const [invitationList, setInvitationList] = useState<IFriend[]>([]);
  const userFriendList = useAppSelector(
    state => state.conversations.friendConversations
  );
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    fetchInvitationList();
    dispatch(fetchFriendConversations());
  }, [fetchInvitationList, dispatch]);

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
              <InviteFriendCard invitation={invite} key={invite._id} />
            ))}
          </div>
        )}

        <div className="px-4 flex flex-col gap-2">
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-[15px] font-semibold text-gray-700">Bạn bè</h3>
          </div>
          {userFriendList.length > 0 ? (
            <>
              {userFriendList.map(friend => (
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
      </div>
    </>
  );
};

export default RightSidebar;
