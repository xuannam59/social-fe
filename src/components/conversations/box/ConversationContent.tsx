import AvatarUser from '@social/components/common/AvatarUser';
import ButtonLike from '@social/components/common/ButtonLike';
import { emojiReactions } from '@social/constants/emoji';
import { CHAT_MESSAGE } from '@social/defaults/socket.default';
import { useAppSelector } from '@social/hooks/redux.hook';
import { useSockets } from '@social/providers/SocketProvider';
import type { IMessage, IMessageReaction } from '@social/types/messages.type';
import { Dropdown, notification, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { BsFillReplyFill } from 'react-icons/bs';
import { TbDotsVertical, TbLoader2, TbMoodSmile } from 'react-icons/tb';

interface IProps {
  message: IMessage;
  onReSendMessage: (messageId: string) => void;
}

const ConversationContent: React.FC<IProps> = ({
  message,
  onReSendMessage,
}) => {
  const { socket } = useSockets();
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [usersLike, setUsersLike] = useState(message.userLikes);
  const myLike = useMemo(() => {
    return usersLike.find(user => user.userId === userInfo._id);
  }, [usersLike, userInfo._id]);
  const isMine = useMemo(
    () => message.sender._id === userInfo._id,
    [message.sender._id, userInfo._id]
  );
  const ableEditMessage = useMemo(
    () =>
      message.sender._id === userInfo._id &&
      dayjs().isBefore(message.timeEdited),
    [message.sender._id, userInfo._id, message.timeEdited]
  );
  const classStatus = useMemo(() => {
    if (message.status === 'pending') return 'opacity-80';
    if (message.status === 'failed') return 'border-2 border-red-500';
    return '';
  }, [message.status]);

  useEffect(() => {
    if (!socket) return;
    socket.on(CHAT_MESSAGE.REACTION, (data: IMessageReaction) => {
      if (data.messageId !== message._id) return;
      if (data.status === 'failed') {
        if (data.userId === userInfo._id) {
          notification.error({
            message: 'Bỏ/ Thêm cảm xúc thất bại',
            description: data.message,
            duration: 3,
          });
        }
        return;
      }
      if (data.userId !== userInfo._id) {
        if (data.isLike) {
          setUsersLike(prev => {
            const newUsersLike = [...prev];
            const index = prev.findIndex(user => user.userId === data.userId);
            if (index !== -1) {
              newUsersLike[index].type = data.type;
            } else {
              newUsersLike.push(data);
            }
            return newUsersLike;
          });
        } else {
          setUsersLike(prev =>
            prev.filter(user => user.userId !== data.userId)
          );
        }
      }
    });

    return () => {
      socket.off(CHAT_MESSAGE.REACTION);
    };
  }, [socket, userInfo._id, message._id]);

  const typeLikes = useMemo(() => {
    const likeSet = new Set<number>();
    usersLike.forEach(user => {
      likeSet.add(user.type);
    });
    return Array.from(likeSet);
  }, [usersLike]);

  const handleReactMessage = (type: number, isLike: boolean) => {
    if (isLike) {
      setUsersLike(prev => {
        const newUsersLike = [...prev];
        const index = prev.findIndex(user => user.userId === userInfo._id);
        if (index !== -1) {
          newUsersLike[index].type = type;
        } else {
          newUsersLike.push({ userId: userInfo._id, type });
        }
        return newUsersLike;
      });
    } else {
      setUsersLike(prev => prev.filter(user => user.userId !== userInfo._id));
    }

    console.log('usersLike', usersLike);

    socket.emit(CHAT_MESSAGE.REACTION, {
      conversationId: message.conversationId,
      messageId: message._id,
      userId: userInfo._id,
      type,
      isLike,
    });
  };

  return (
    <>
      <div id={`msg_${message._id}`} className="flex flex-col group/message">
        <div
          className={`flex ${isMine ? 'justify-end' : 'justify-start'} gap-1.5 items-center`}
        >
          <div
            className={`group-hover/message:block hidden ${isMine ? 'order-first' : 'order-last'}`}
          >
            <div
              className={`flex items-center ${!isMine && 'flex-row-reverse'}`}
            >
              <Dropdown
                trigger={['click']}
                placement="top"
                arrow={true}
                className="cursor-pointer"
                popupRender={() => {
                  return (
                    <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200 w-[150px]">
                      <div className="grid grid-cols-1">
                        {isMine ? (
                          <div className="col-span-1 rounded-md hover:bg-gray-100 p-2 cursor-pointer">
                            <div className="text-base w-full font-medium">
                              Thu hồi
                            </div>
                          </div>
                        ) : (
                          <div className="col-span-1 rounded-md hover:bg-gray-100 p-2 cursor-pointer">
                            <div className="text-base w-full font-medium">
                              Gỡ/ Xoá
                            </div>
                          </div>
                        )}
                        <div className="col-span-1 rounded-md hover:bg-gray-100 p-2 cursor-pointer">
                          <div className="text-base w-full font-medium">
                            Xem thêm
                          </div>
                        </div>
                        {ableEditMessage && (
                          <div className="col-span-1 rounded-md hover:bg-gray-100 p-2 cursor-pointer">
                            <div className="text-base w-full font-medium">
                              Chỉnh sửa
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }}
              >
                <div className="flex items-center justify-center p-1 hover:bg-gray-100 rounded-full">
                  <TbDotsVertical size={18} className="text-gray-500" />
                </div>
              </Dropdown>
              <Tooltip title="Phàn hồi">
                <div className="flex items-center justify-center p-1 hover:bg-gray-200 rounded-full">
                  <BsFillReplyFill size={20} className="text-gray-500" />
                </div>
              </Tooltip>
              <ButtonLike
                onActionLike={handleReactMessage}
                trigger="click"
                likedType={myLike?.type}
              >
                <div className="flex items-center justify-center p-1 hover:bg-gray-200 rounded-full">
                  <TbMoodSmile size={20} className="text-gray-500" />
                </div>
              </ButtonLike>
            </div>
          </div>

          {!isMine && (
            <div className="self-end">
              <AvatarUser avatar={message.sender.avatar} size={28} />
            </div>
          )}
          <div className={`${isMine ? 'max-w-[70%]' : 'max-w-[60%]'}`}>
            <div
              className={`relative w-fit rounded-2xl px-3 py-2 text-sm leading-5 flex-shrink-0
                        ${
                          isMine
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }
                      ${classStatus}
                      `}
            >
              {message.content}
            </div>
            {typeLikes.length > 0 && (
              <>
                <div className="relative w-full h-2.5">
                  <div className="absolute bottom-0 right-0">
                    <div className="flex items-center gap-0.5 bg-white rounded-full p-0.5 shadow-md border border-gray-200">
                      {typeLikes.slice(0, 2).map(type => (
                        <div key={type} className="text-xs">
                          {emojiReactions[type - 1].emoji}
                        </div>
                      ))}
                      {typeLikes.length > 2 && (
                        <div className="text-xs">+{typeLikes.length - 2}</div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {message.status === 'pending' && (
          <div className="flex items-center gap-2 self-end">
            <div className="text-xs text-gray-500">Đang gửi...</div>
            <TbLoader2 size={12} className="animate-spin text-gray-500" />
          </div>
        )}
        {message.status === 'failed' && (
          <div className="flex items-center gap-2 self-end">
            <div className="text-xs text-red-500 self-end">Gửi thất bại</div>
            <span
              className="text-xs text-blue-500 cursor-pointer hover:underline"
              onClick={() => onReSendMessage(message._id)}
            >
              Gửi lại
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default ConversationContent;
