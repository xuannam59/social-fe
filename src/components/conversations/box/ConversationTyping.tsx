import type { IMessageTyping } from '@social/types/messages.type';
import React, { useMemo } from 'react';
import Lottie from 'lottie-react';
import typingAnimation from '@social/animations/typing.json';
import { useAppSelector } from '@social/hooks/redux.hook';
import AvatarUser from '@social/components/common/AvatarUser';

interface IProps {
  usersTyping: IMessageTyping[];
}

const ConversationTyping: React.FC<IProps> = ({ usersTyping }) => {
  const userId = useAppSelector(state => state.auth.userInfo._id);
  const changedUsersTyping = useMemo(() => {
    return usersTyping.filter(user => user.sender._id !== userId);
  }, [usersTyping, userId]);
  return (
    <>
      {changedUsersTyping.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <div
            className="relative flex items-center max-w-[68px]"
            style={{ width: `${changedUsersTyping.length * 28}px` }}
          >
            {changedUsersTyping[0] && (
              <div className="relative z-10">
                <AvatarUser
                  avatar={changedUsersTyping[0].sender.avatar}
                  size={32}
                />
              </div>
            )}

            {changedUsersTyping[1] && (
              <div className="absolute left-5 z-20">
                <AvatarUser
                  avatar={changedUsersTyping[1].sender.avatar}
                  size={32}
                />
              </div>
            )}

            {changedUsersTyping.length > 2 && (
              <div className="absolute left-10 z-30 bg-blue-500 text-white text-xs rounded-full w-8 h-8 flex items-center justify-center font-medium border-2 border-white">
                +{changedUsersTyping.length - 2}
              </div>
            )}
          </div>

          <div className="flex items-center h-8 w-12 bg-gray-100 rounded-full">
            <Lottie
              animationData={typingAnimation}
              loop={true}
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ConversationTyping;
