import { formatRelativeTimeV2 } from '@social/common/convert';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import type { IConversation } from '@social/types/conversations.type';
import React, { useCallback, useMemo } from 'react';
import { TbPointFilled } from 'react-icons/tb';
import AvatarUser from '../common/AvatarUser';
import { doOpenConversation } from '@social/redux/reducers/conversations.reducer';

interface IProps {
  conversation: IConversation;
  onCloseDropdown: () => void;
}

const ConversationItem: React.FC<IProps> = ({
  conversation,
  onCloseDropdown,
}) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const dispatch = useAppDispatch();
  const unRead = useMemo(() => {
    const user = conversation.usersState.find(
      user => user.user === userInfo._id
    );
    if (user) {
      return user.readLastMessage !== conversation.lastMessage?._id;
    }
    return false;
  }, [conversation.usersState, userInfo._id, conversation.lastMessage]);
  const isOnline = useMemo(() => {
    if (conversation.isGroup) return false;
    const otherUser = conversation.users.filter(
      user => user._id !== userInfo._id
    );
    if (otherUser) {
      return otherUser.every(user => user.isOnline);
    }
    return false;
  }, [conversation.users, userInfo._id, conversation.isGroup]);

  const handleOpenConversation = useCallback(() => {
    const data: IConversation = {
      _id: conversation._id,
      users: conversation.users,
      isGroup: conversation.isGroup,
      name: conversation.name,
      avatar: conversation.avatar,
      usersState: conversation.usersState,
      lastMessageAt: conversation.lastMessageAt,
      isExist: conversation.isExist,
      lastActive: conversation.lastActive,
      isOnline: isOnline,
    };
    dispatch(doOpenConversation(data));
    onCloseDropdown();
  }, [conversation, dispatch, onCloseDropdown, isOnline]);
  return (
    <>
      <div
        className="max-w-full hover:bg-gray-200 rounded-lg p-1.5"
        onClick={handleOpenConversation}
      >
        <div className="flex items-center gap-2 w-full min-w-0 max-w-full overflow-x-hidden cursor-pointer">
          <div className="relative">
            <AvatarUser size={58} avatar={conversation.avatar} />
            {isOnline && (
              <div className="absolute bottom-0 right-1">
                <div className="w-4 h-4 bg-[#24832c] rounded-full border-2 border-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col w-full min-w-0">
            <span className="font-medium text-base line-clamp-1">
              {conversation.name}
            </span>
            <div className="flex items-center gap-2 w-full min-w-0">
              <span
                className={`min-w-0 !m-0 ${unRead ? 'font-medium' : 'text-gray-500'} line-clamp-1`}
              >
                {conversation.lastMessage?.sender === userInfo._id
                  ? 'Bạn: '
                  : ``}
                {conversation.lastMessage?.content}
              </span>
              <span className="shrink-0" aria-hidden="true">
                ·
              </span>
              <span className="text-sm text-gray-500 shrink-0 whitespace-nowrap">
                {formatRelativeTimeV2(conversation.lastMessageAt)}
              </span>
            </div>
          </div>
          {unRead && (
            <div className="ml-1">
              <TbPointFilled size={30} className="text-sky-500" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConversationItem;
