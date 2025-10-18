import type { IUserConversation } from '@social/types/user.type';
import React from 'react';
import AvatarUser from '../common/AvatarUser';
import { formatRelativeTimeV2 } from '@social/common/convert';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import type { IConversation } from '@social/types/conversations.type';
import { doOpenConversation } from '@social/redux/reducers/conversations';

interface IProps {
  friend: IUserConversation;
}

const FriendItemCard: React.FC<IProps> = ({ friend }) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const dispatch = useAppDispatch();

  const handleOpenConversation = async () => {
    const data: IConversation = {
      _id: friend.conversationId ? friend.conversationId : friend._id,
      users: [
        {
          _id: userInfo._id,
          fullname: userInfo.fullname,
          avatar: userInfo.avatar,
          isOnline: userInfo.isOnline,
        },
        {
          _id: friend._id,
          fullname: friend.fullname,
          avatar: friend.avatar,
          isOnline: friend.isOnline,
        },
      ],
      isGroup: friend.isGroup,
      name: friend.fullname,
      avatar: friend.avatar,
      isExist: friend.isExist,
      lastActive: friend.lastActive,
      isOnline: friend.isOnline,
      usersState: friend.usersState,
      lastMessage: friend.lastMessage,
      lastMessageAt: '',
    };
    dispatch(doOpenConversation(data));
  };
  return (
    <>
      <div
        className="flex gap-2 items-center cursor-pointer rounded-lg p-1 hover:bg-gray-200"
        onClick={handleOpenConversation}
      >
        <div className="relative">
          <AvatarUser avatar={friend.avatar} size={42} />
          {friend.isOnline ? (
            <div className="absolute bottom-0 right-1">
              <div className="w-3 h-3 bg-[#24832c] rounded-full border-2 border-white" />
            </div>
          ) : (
            <div className="absolute bottom-0 right-0 left-0">
              <div className="w-full h-3 bg-[#87d068] flex items-center justify-center px-1 rounded-lg">
                <span className="text-[10px] font-medium text-white truncate">
                  {formatRelativeTimeV2(friend.lastActive)}
                </span>
              </div>
            </div>
          )}
        </div>
        <span className="text-base">{friend.fullname}</span>
      </div>
    </>
  );
};

export default FriendItemCard;
