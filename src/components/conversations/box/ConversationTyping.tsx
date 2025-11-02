import type { IMessageTyping } from '@social/types/messages.type';
import React, { useEffect, useMemo, useState } from 'react';
import Lottie from 'lottie-react';
import typingAnimation from '@social/animations/typing.json';
import { useAppSelector } from '@social/hooks/redux.hook';
import AvatarUser from '@social/components/common/AvatarUser';
import { useSockets } from '@social/providers/SocketProvider';
import { CHAT_MESSAGE } from '@social/defaults/socket.default';

interface IProps {
  conversationId: string;
}

const ConversationTyping: React.FC<IProps> = ({ conversationId }) => {
  const userId = useAppSelector(state => state.auth.userInfo._id);
  const { socket } = useSockets();
  const [usersTyping, setUsersTyping] = useState<IMessageTyping[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (payload: IMessageTyping) => {
      if (payload.conversationId !== conversationId) return;
      if (payload.sender._id === userId) return;
      if (payload.status === 'typing') {
        setUsersTyping(prev => {
          const exists = prev.some(u => u.sender._id === payload.sender._id);
          if (exists) return prev;
          return [...prev, payload];
        });
      } else {
        setUsersTyping(prev =>
          prev.filter(u => u.sender._id !== payload.sender._id)
        );
      }
    };

    socket.on(CHAT_MESSAGE.TYPING, handleTyping);
    return () => {
      socket.off(CHAT_MESSAGE.TYPING, handleTyping);
    };
  }, [socket, conversationId, userId]);

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
