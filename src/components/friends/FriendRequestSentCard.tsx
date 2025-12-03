import {
  callApiRejectFriend,
  callApiRequestFriend,
} from '@social/apis/friend.api';
import {
  convertErrorMessage,
  formatRelativeTime,
} from '@social/common/convert';
import { NOTIFICATION_MESSAGE } from '@social/defaults/socket.default';
import { useSockets } from '@social/providers/SocketProvider';
import type { IFriendRequestSent } from '@social/types/friends.type';
import { Button, message } from 'antd';
import React, { useCallback, useState } from 'react';
import { TbUserPlus, TbUserX } from 'react-icons/tb';
import AvatarUser from '../common/AvatarUser';
import ButtonGradient from '../common/ButtonGradient';
import { useNavigate } from 'react-router-dom';
interface IProps {
  request: IFriendRequestSent;
}

const FriendRequestSentCard: React.FC<IProps> = ({ request }) => {
  const friendInfo = request.toUserId;
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelRequest, setIsCancelRequest] = useState(false);
  const { socket } = useSockets();
  const navigate = useNavigate();

  const handleOpenProfile = useCallback(() => {
    navigate(`/${friendInfo._id}`);
  }, [friendInfo._id, navigate]);
  const handleCancelRequest = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await callApiRejectFriend(friendInfo._id);
      if (res.data) {
        message.success('Lời mời đã được từ chối');
        setIsCancelRequest(true);
        socket.emit(NOTIFICATION_MESSAGE.FRIEND_REQUEST_CANCEL, {
          friendId: friendInfo._id,
        });
      } else {
        message.error(convertErrorMessage(res.message));
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  }, [friendInfo._id, socket]);

  const handleRequestAddFriend = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await callApiRequestFriend(friendInfo._id);
      if (res.data) {
        message.success('Lời mời đã được gửi');
        setIsCancelRequest(false);
        socket.emit(NOTIFICATION_MESSAGE.FRIEND_REQUEST, {
          friendId: friendInfo._id,
        });
      } else {
        message.error(convertErrorMessage(res.message));
      }
    } catch (error) {
      console.error('Failed to request add friend:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  }, [friendInfo._id, socket]);

  return (
    <>
      <div className="w-full rounded-xl bg-white shadow-md p-3 flex flex-col gap-2">
        <div className="flex flex-col items-center gap-2">
          <AvatarUser
            avatar={friendInfo.avatar}
            size={96}
            shape="circle"
            onClick={handleOpenProfile}
            className="cursor-pointer"
          />
          <span
            className="text-base font-semibold text-center line-clamp-2 cursor-pointer"
            onClick={handleOpenProfile}
          >
            {friendInfo.fullname}
          </span>
          <span className="text-xs text-gray-500">
            Đã gửi {formatRelativeTime(request.createdAt)}
          </span>
        </div>
        <div className="mt-2">
          {isCancelRequest ? (
            <>
              <ButtonGradient
                icon={<TbUserPlus className="!text-white" size={20} />}
                onClick={handleRequestAddFriend}
                loading={isLoading}
                className="w-full font-semibold"
              >
                <span className="text-base font-semibold">Kết bạn</span>
              </ButtonGradient>
            </>
          ) : (
            <Button
              danger
              icon={<TbUserX size={18} />}
              className="w-full font-semibold"
              onClick={handleCancelRequest}
              loading={isLoading}
            >
              Hủy lời mời
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default FriendRequestSentCard;
