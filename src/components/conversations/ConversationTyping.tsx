import type { IMessageTyping } from '@social/types/messages.type';
import React from 'react';
import AvatarUser from '../common/AvatarUser';
import Lottie from 'lottie-react';
import typingAnimation from '@social/animations/typing.json';

interface IProps {
  usersTyping: IMessageTyping[];
}

const ConversationTyping: React.FC<IProps> = ({ usersTyping }) => {
  return (
    <>
      {usersTyping.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <div
            className="relative flex items-center max-w-[68px]"
            style={{ width: `${usersTyping.length * 28}px` }}
          >
            {usersTyping[0] && (
              <div className="relative z-10">
                <AvatarUser avatar={usersTyping[0].sender.avatar} size={32} />
              </div>
            )}

            {usersTyping[1] && (
              <div className="absolute left-5 z-20">
                <AvatarUser avatar={usersTyping[1].sender.avatar} size={32} />
              </div>
            )}

            {usersTyping.length > 2 && (
              <div className="absolute left-10 z-30 bg-blue-500 text-white text-xs rounded-full w-8 h-8 flex items-center justify-center font-medium border-2 border-white">
                +{usersTyping.length - 2}
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
