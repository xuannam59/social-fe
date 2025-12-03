import React, { useCallback, useMemo, useState } from 'react';
import AvatarUser from '../common/AvatarUser';
import type { IUser } from '@social/types/user.type';
import ButtonGradient from '../common/ButtonGradient';
import { Button, Dropdown, message } from 'antd';
import { TbUserCheck, TbUserPlus, TbUserX } from 'react-icons/tb';
import { convertErrorMessage } from '@social/common/convert';
import {
  callApiRejectFriend,
  callApiRequestFriend,
  callApiUnfriend,
} from '@social/apis/friend.api';
import { NOTIFICATION_MESSAGE } from '@social/defaults/socket.default';
import { useSockets } from '@social/providers/SocketProvider';
import { useNavigate } from 'react-router-dom';
import { EFriendStatus } from '@social/types/friends.type';

interface IProps {
  friendInfo: IUser;
}

const MyFriendCard: React.FC<IProps> = ({ friendInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [friendStatus, setFriendStatus] = useState<EFriendStatus>(
    EFriendStatus.FRIENDS
  );
  const { socket } = useSockets();
  const navigate = useNavigate();

  const handleOpenProfile = useCallback(() => {
    navigate(`/${friendInfo._id}`);
  }, [friendInfo._id, navigate]);

  const handleUnfriendRequest = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await callApiUnfriend(friendInfo._id);
      if (res.data) {
        message.success('Bạn bè đã được hủy');
        setFriendStatus(EFriendStatus.ADD_FRIEND);
      } else {
        message.error(convertErrorMessage(res.message));
      }
    } catch (error) {
      console.error('Failed to request add friend:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  }, [friendInfo._id]);

  const handleRequestAddFriend = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await callApiRequestFriend(friendInfo._id);
      if (res.data) {
        message.success('Lời mời đã được gửi');
        setFriendStatus(EFriendStatus.PENDING_FROM_ME);
        socket.emit(NOTIFICATION_MESSAGE.FRIEND_REQUEST, {
          friendId: friendInfo._id,
        });
      } else {
        message.error(convertErrorMessage(res.message));
      }
    } catch (error) {
      console.error('Failed to request friend:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  }, [friendInfo._id, socket]);

  const handleCancelRequest = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await callApiRejectFriend(friendInfo._id);
      if (res.data) {
        message.success('Lời mời đã được hủy');
        setFriendStatus(EFriendStatus.ADD_FRIEND);
        socket.emit(NOTIFICATION_MESSAGE.FRIEND_REQUEST_CANCEL, {
          friendId: friendInfo._id,
        });
      } else {
        message.error(convertErrorMessage(res.message));
      }
    } catch (error) {
      console.error('Failed to cancel request:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  }, [friendInfo._id, socket]);

  const renderButton = useMemo(() => {
    switch (friendStatus) {
      case EFriendStatus.ADD_FRIEND:
        return (
          <ButtonGradient
            icon={<TbUserPlus className="!text-white" size={20} />}
            onClick={handleRequestAddFriend}
            loading={isLoading}
          >
            <span className="text-base font-semibold">Kết bạn</span>
          </ButtonGradient>
        );
      case EFriendStatus.PENDING_FROM_ME:
        return (
          <Button
            danger
            icon={<TbUserX size={18} />}
            onClick={handleCancelRequest}
            loading={isLoading}
          >
            <span className="text-base font-semibold">Hủy lời mời</span>
          </Button>
        );
      case EFriendStatus.FRIENDS:
        return (
          <Dropdown
            trigger={['click']}
            placement="bottomLeft"
            arrow
            overlayStyle={{ width: '150px' }}
            menu={{
              items: [
                {
                  key: 'unfriend',
                  label: (
                    <span className="text-base font-semibold flex items-center gap-2">
                      <TbUserX size={20} />
                      Hủy Kết bạn
                    </span>
                  ),
                  onClick: handleUnfriendRequest,
                },
              ],
            }}
          >
            <ButtonGradient
              icon={<TbUserCheck className="!text-white" size={20} />}
            >
              <span className="text-base font-semibold">Bạn bè</span>
            </ButtonGradient>
          </Dropdown>
        );
    }
  }, [
    friendStatus,
    handleRequestAddFriend,
    handleUnfriendRequest,
    handleCancelRequest,
    isLoading,
  ]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4 flex flex-col items-center">
          <div className="mb-3">
            <AvatarUser
              avatar={friendInfo.avatar}
              size={80}
              className="cursor-pointer"
              onClick={handleOpenProfile}
            />
          </div>

          <span
            className="font-semibold text-h3 mb-2 text-center line-clamp-1 w-full cursor-pointer"
            onClick={handleOpenProfile}
          >
            {friendInfo.fullname}
          </span>
          <div className="mt-2">{renderButton}</div>
        </div>
      </div>
    </>
  );
};

export default MyFriendCard;
