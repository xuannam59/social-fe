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
  getMessageReply: (message: IMessage) => void;
  onReSendMessage: (messageId: string) => void;
}

const ConversationContent: React.FC<IProps> = ({
  message,
  getMessageReply,
  onReSendMessage,
}) => {
  const { socket } = useSockets();
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [usersLike, setUsersLike] = useState(message.userLikes);
  const [totalLikes, setTotalLikes] = useState(message.userLikes.length);
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

    const handleReaction = (data: IMessageReaction) => {
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
              setTotalLikes(prev => prev + 1);
            }
            return newUsersLike;
          });
        } else {
          setUsersLike(prev =>
            prev.filter(user => user.userId !== data.userId)
          );
          setTotalLikes(prev => prev - 1);
        }
      }
    };

    socket.on(CHAT_MESSAGE.REACTION, handleReaction);

    return () => {
      socket.off(CHAT_MESSAGE.REACTION, handleReaction);
    };
  }, [socket, userInfo._id, message._id, message]);

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
          setTotalLikes(prev => prev + 1);
        }
        return newUsersLike;
      });
    } else {
      setUsersLike(prev => prev.filter(user => user.userId !== userInfo._id));
      setTotalLikes(prev => prev - 1);
    }

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
      <div id={`msg_${message._id}`} className="group/message">
        {message.parentId && (
          <div
            className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'} mt-3 -mb-5`}
          >
            {!isMine && <div className="w-9" />}
            <div className="flex flex-col max-w-[80%] gap-1">
              <div
                className={`flex items-center gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <BsFillReplyFill size={16} className="text-gray-500" />
                <span className="text-sm text-gray-500">
                  {message.parentId.sender._id === userInfo._id
                    ? message.parentId.sender.fullname
                    : 'Bạn'}{' '}
                  đã trả lời bạn
                </span>
              </div>
              <div className="pb-5 rounded-2xl px-3 pt-2 bg-gray-300 opacity-50 ">
                <span className="text-sm text-gray-500 leading-5 line-clamp-3">
                  {message.parentId.content}
                </span>
              </div>
            </div>
          </div>
        )}
        <div
          className={`relative z-10 flex ${isMine ? 'justify-end' : 'justify-start'} gap-2 items-center`}
        >
          <div
            className={`hidden group-hover/message:block ${isMine ? 'order-first' : 'order-last'}`}
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
                <div
                  className="flex items-center justify-center p-1 hover:bg-gray-100 rounded-full"
                  onClick={() => getMessageReply(message)}
                >
                  <BsFillReplyFill size={20} className="text-gray-500" />
                </div>
              </Tooltip>
              <ButtonLike
                onActionLike={handleReactMessage}
                trigger="click"
                likedType={myLike?.type}
              >
                <div className="flex items-center justify-center p-1 hover:bg-gray-100 rounded-full">
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

          <div
            className={`${isMine ? 'max-w-[70%]' : 'max-w-[60%]'} flex-shrink-0`}
          >
            <div className="flex">
              <div
                className={`relative w-fit rounded-2xl px-3 py-2 text-base leading-5
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
            </div>
            {typeLikes.length > 0 && (
              <>
                <div className="relative w-full h-2.5">
                  <div className="absolute bottom-0 right-0">
                    <div className="flex items-center gap-0.5 bg-white rounded-full p-0.5 shadow-md border border-gray-200">
                      {typeLikes.slice(0, 2).map((type, index) => (
                        <div
                          key={type}
                          className={`text-xs relative ${index > 0 ? '-ml-2.5 z-1' : 'z-2'}`}
                        >
                          {emojiReactions[type - 1].emoji}
                        </div>
                      ))}
                      {typeLikes.length > 2 && (
                        <div className="text-xs -ml-2 relative z-3">
                          +{typeLikes.length - 2}
                        </div>
                      )}

                      {totalLikes > 1 && (
                        <div className="text-xs">{totalLikes}</div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {message.status === 'pending' && (
          <div className="flex items-center gap-2 justify-end">
            <div className="text-xs text-gray-500">Đang gửi...</div>
            <TbLoader2 size={12} className="animate-spin text-gray-500" />
          </div>
        )}
        {message.status === 'failed' && (
          <div className="flex items-center gap-2 justify-end">
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
