import { convertUrlString } from '@social/common/convert';
import AvatarUser from '@social/components/common/AvatarUser';
import ButtonLike from '@social/components/common/ButtonLike';
import { emojiReactions } from '@social/constants/emoji';
import { CHAT_MESSAGE } from '@social/defaults/socket.default';
import { useAppSelector } from '@social/hooks/redux.hook';
import { useSockets } from '@social/providers/SocketProvider';
import type {
  IMessage,
  IMessageReaction,
  IMessageRevoke,
} from '@social/types/messages.type';
import { Dropdown, Image, Modal, notification, Tooltip } from 'antd';
import dayjs from 'dayjs';
import Lottie from 'lottie-react';
import React, { useEffect, useMemo, useState } from 'react';
import { BsFillReplyFill } from 'react-icons/bs';
import { TbDotsVertical, TbLoader2, TbMoodSmile } from 'react-icons/tb';

interface IProps {
  message: IMessage;
  isGroup: boolean;
  getMessageReply: (message: IMessage, type: 'reply' | 'edit') => void;
  onReSendMessage: (messageId: string) => void;
  onScrollToMessage: (messageId: string) => void;
}

const ConversationContent: React.FC<IProps> = ({
  message,
  isGroup,
  getMessageReply,
  onReSendMessage,
  onScrollToMessage,
}) => {
  const { socket } = useSockets();
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [usersLike, setUsersLike] = useState(message.userLikes);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isRevoked, setIsRevoked] = useState(message.revoked);
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

  const lastName = useMemo(() => {
    const name = message.sender.fullname.split(' ');
    return name[name.length - 1];
  }, [message.sender.fullname]);

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
            }
            return newUsersLike;
          });
        } else {
          setUsersLike(prev =>
            prev.filter(user => user.userId !== data.userId)
          );
        }
      }
    };

    const handleRevokeMessage = (data: IMessageRevoke) => {
      console.log('data revoke message', data);
      if (data.messageId !== message._id) return;
      if (data.userId === userInfo._id) return;
      setIsRevoked(true);
    };

    socket.on(CHAT_MESSAGE.REACTION, handleReaction);
    socket.on(CHAT_MESSAGE.REVOKE, handleRevokeMessage);

    return () => {
      socket.off(CHAT_MESSAGE.REACTION, handleReaction);
      socket.off(CHAT_MESSAGE.REVOKE, handleRevokeMessage);
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
        }
        return newUsersLike;
      });
    } else {
      setUsersLike(prev => prev.filter(user => user.userId !== userInfo._id));
    }

    socket.emit(CHAT_MESSAGE.REACTION, {
      conversationId: message.conversationId,
      messageId: message._id,
      userId: userInfo._id,
      type,
      isLike,
    });
  };

  const handleRevokeMessage = () => {
    setIsRevoked(true);
    socket.emit(CHAT_MESSAGE.REVOKE, {
      conversationId: message.conversationId,
      messageId: message._id,
      content: message.content,
      userId: userInfo._id,
    });
  };

  if (message.storyId) {
    console.log('message storyId', message);
  }

  return (
    <>
      <div id={`msg_${message._id}`} className="group/message">
        {isGroup && !isMine && (
          <div className="flex items-center ml-11">
            <span className="text-sm text-gray-500 mb-0.5 line-clamp-1 w-[50%]">
              {lastName}
            </span>
          </div>
        )}
        {(message.parentId || message.edited || message.storyId) &&
          !isRevoked && (
            <div
              className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'} mt-1`}
            >
              {!isMine && <div className="w-9" />}
              <div className="flex flex-col max-w-[80%]">
                <div
                  className={`flex items-center ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {message.parentId && (
                    <>
                      <BsFillReplyFill size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-500">
                        Phản hồi tin nhắn
                      </span>
                    </>
                  )}
                  {message.edited && (
                    <>
                      <div className="ml-2">
                        <span className="text-sm text-blue-500">
                          Đã chỉnh sửa
                        </span>
                      </div>
                    </>
                  )}
                  {message.storyId && message.storyId.type !== 'text' && (
                    <>
                      <BsFillReplyFill size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {isMine
                          ? 'Bạn'
                          : `${message.sender.fullname.split(' ')[0]}`}{' '}
                        đã trả lời story
                        {!isMine && ' của bạn'}
                      </span>
                    </>
                  )}
                </div>
                {message.parentId && (
                  <div
                    className={`${isMine && 'justify-end'} flex items-center -mb-5`}
                  >
                    <div
                      className="pb-5 rounded-2xl px-3 pt-2 bg-gray-300 opacity-50 w-fit cursor-pointer hover:bg-gray-400 transition-colors"
                      onClick={() => onScrollToMessage(message.parentId!._id)}
                    >
                      <span className="text-sm text-gray-500 leading-5 line-clamp-3 w-fit">
                        {message.parentId.content}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        {message.storyId && !isRevoked && (
          <div
            className={`flex ${isMine ? 'justify-end' : 'justify-start'} -mb-3 opacity-50`}
          >
            {!isMine && <div className="w-9" />}
            {message.storyId.type === 'image' && (
              <div className="w-[25%] rounded-lg overflow-hidden h-fit flex items-end">
                <Image
                  src={convertUrlString(message.storyId.media.keyS3)}
                  alt="story"
                  className="w-full object-cover"
                  preview={false}
                />
              </div>
            )}
            {message.storyId.type === 'text' && (
              <div
                className={`${isMine && 'justify-end'} flex items-center -mb-1`}
              >
                <div className="pb-5 rounded-2xl px-3 pt-2 bg-gray-300 opacity-50 w-fit cursor-pointer hover:bg-gray-400 transition-colors">
                  <span className="text-sm font-medium leading-5 line-clamp-3 w-fit">
                    {isMine
                      ? 'Bạn'
                      : `${message.sender.fullname.split(' ')[0]}`}{' '}
                    đã trả lời story
                    {!isMine && ' của bạn'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        <div
          className={`relative z-10 flex ${isMine ? 'justify-end' : 'justify-start'} gap-2 items-center`}
        >
          <div
            className={`invisible group-hover/message:visible ${isMine ? 'order-first' : 'order-last'}`}
          >
            <div
              className={`flex items-center ${!isMine && 'flex-row-reverse'}`}
            >
              <Dropdown
                trigger={['click']}
                placement="top"
                arrow={true}
                open={openDropdown}
                onOpenChange={visible => setOpenDropdown(visible)}
                className="cursor-pointer"
                popupRender={() => {
                  return (
                    <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200 w-[150px]">
                      <div className="grid grid-cols-1">
                        {isMine && (
                          <>
                            {ableEditMessage && !isRevoked && (
                              <div
                                className="col-span-1 rounded-md hover:bg-gray-100 p-2 cursor-pointer"
                                onClick={() => {
                                  getMessageReply(message, 'edit');
                                  setOpenDropdown(false);
                                }}
                              >
                                <div className="text-base w-full font-medium">
                                  Chỉnh sửa
                                </div>
                              </div>
                            )}
                            <div
                              className={`col-span-1 rounded-md hover:bg-gray-100 p-2 cursor-pointer ${isRevoked && 'hidden'}`}
                              onClick={() => {
                                Modal.confirm({
                                  title: 'Thu hồi tin nhắn',
                                  centered: true,
                                  okText: 'Thu hồi',
                                  cancelText: 'Đóng',
                                  content:
                                    'Bạn có chắc chắn muốn thu hồi tin nhắn này không?',
                                  onOk: () => {
                                    handleRevokeMessage();
                                  },
                                });
                                setOpenDropdown(false);
                              }}
                            >
                              <div className="text-base w-full font-medium">
                                Thu hồi
                              </div>
                            </div>
                          </>
                        )}
                        {(!isMine || (isMine && isRevoked)) && (
                          <div
                            className="col-span-1 rounded-md hover:bg-gray-100 p-2 cursor-pointer"
                            onClick={() => setOpenDropdown(false)}
                          >
                            <div className="text-base w-full font-medium">
                              Gỡ/ Xoá
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
              <Tooltip title="Phàn hồi" className={`${isRevoked && 'hidden'}`}>
                <div
                  className="flex items-center justify-center p-1 hover:bg-gray-100 rounded-full"
                  onClick={() => getMessageReply(message, 'reply')}
                >
                  <BsFillReplyFill size={20} className="text-gray-500" />
                </div>
              </Tooltip>
              <div className={`${isRevoked && 'hidden'}`}>
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
          </div>

          {!isMine && (
            <div className="self-end">
              <AvatarUser avatar={message.sender.avatar} size={32} />
            </div>
          )}

          <div
            className={`${isMine ? 'max-w-[70%]' : 'max-w-[60%]'} flex-shrink-0`}
          >
            <div className="flex">
              {isRevoked ? (
                <div className="w-fit rounded-2xl px-3 py-2 text-base leading-5 bg-transparent border border-gray-200 break-words">
                  <span className="text-gray-500 italic">
                    {message.sender._id === userInfo._id
                      ? 'Bạn'
                      : `${message.sender.fullname}`}{' '}
                    đã thu hồi tin nhắn
                  </span>
                </div>
              ) : (
                <div
                  className={`w-fit max-w-full rounded-2xl px-3 py-2 text-base leading-5 break-words
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
              )}
            </div>
            {typeLikes.length > 0 && !isRevoked && (
              <>
                <div className="relative w-full h-2.5">
                  <div className="absolute bottom-0 right-0">
                    <div className="flex items-center gap-0.5 bg-white rounded-full p-0.5 shadow-md border border-gray-200">
                      {typeLikes.slice(0, 2).map((type, index) => (
                        <div
                          key={type}
                          className={`w-4 h-4 relative ${index > 0 ? '-ml-1 z-1' : 'z-2'}`}
                        >
                          <Lottie
                            animationData={emojiReactions[type - 1].reSource}
                            loop={true}
                          />
                        </div>
                      ))}
                      {typeLikes.length > 2 && (
                        <div className="text-xs -ml-2 relative z-3">
                          +{typeLikes.length - 2}
                        </div>
                      )}

                      {usersLike.length > 1 && (
                        <div className="text-xs">{usersLike.length}</div>
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
