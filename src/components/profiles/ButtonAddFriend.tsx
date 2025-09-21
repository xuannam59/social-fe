import {
  callApiAcceptFriend,
  callApiGetFriends,
  callApiRejectFriend,
  callApiRequestFriend,
  callApiUnfriend,
} from '@social/apis/friend.api';
import { convertErrorMessage } from '@social/common/convert';
import { useAppSelector } from '@social/hooks/redux.hook';
import { EFriendStatus, type IFriend } from '@social/types/friends.type';
import { Dropdown, message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TbUserCheck, TbUserPlus, TbUserX } from 'react-icons/tb';
import ButtonGradient from '../common/ButtonGradient';

interface IProps {
  userIdB: string;
}

const ButtonAddFriend: React.FC<IProps> = ({ userIdB }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [friendShip, setFriendShip] = useState<IFriend | null>(null);
  const userInfo = useAppSelector(state => state.auth.userInfo);

  const buttonState = useMemo((): EFriendStatus => {
    if (!friendShip) return EFriendStatus.ADD_FRIEND;

    if (friendShip.status === 'pending') {
      return friendShip.fromUserId === userInfo._id
        ? EFriendStatus.PENDING_FROM_ME
        : EFriendStatus.PENDING_TO_ME;
    }

    return EFriendStatus.FRIENDS;
  }, [friendShip, userIdB]);

  const getFriendStatus = useCallback(async () => {
    if (!userIdB || userIdB === userInfo._id) return;
    const res = await callApiGetFriends(userIdB);
    if (res.data) {
      setFriendShip(res.data);
    }
  }, [userIdB]);

  useEffect(() => {
    getFriendStatus();
  }, [getFriendStatus]);

  const requestAddFriend = useCallback(async () => {
    if (!userIdB) return;
    try {
      setIsLoading(true);
      const res = await callApiRequestFriend(userIdB);
      if (res.data) {
        message.success('Lời mời đã được gửi');
        setFriendShip(res.data);
      } else {
        message.error(convertErrorMessage(res.message));
      }
    } catch (error) {
      console.error('Failed to request add friend:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  }, [userIdB]);

  const rejectRequest = useCallback(async () => {
    if (!userIdB) return;
    try {
      setIsLoading(true);
      const res = await callApiRejectFriend(userIdB);
      if (res.data) {
        message.success('Lời mời đã được từ chối');
        setFriendShip(null);
      } else {
        message.error(convertErrorMessage(res.message));
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  }, [userIdB]);

  const acceptRequest = useCallback(async () => {
    if (!userIdB) return;
    try {
      setIsLoading(true);
      const res = await callApiAcceptFriend(userIdB);
      if (res.data) {
        message.success('Lời mời đã được chấp nhận');
        setFriendShip(prev =>
          prev ? { ...prev, status: res.data.status } : null
        );
      } else {
        message.error(convertErrorMessage(res.message));
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  }, [userIdB]);

  const unfriendRequest = useCallback(async () => {
    if (!userIdB) return;
    try {
      setIsLoading(true);
      const res = await callApiUnfriend(userIdB);
      if (res.data) {
        message.success('Bạn bè đã được hủy');
        setFriendShip(null);
      } else {
        message.error(convertErrorMessage(res.message));
      }
    } catch (error) {
      console.error('Failed to unfriend:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  }, [userIdB]);

  // Render button dựa trên trạng thái
  const renderButton = () => {
    switch (buttonState) {
      case EFriendStatus.ADD_FRIEND:
        return (
          <ButtonGradient
            icon={<TbUserPlus className="!text-white" size={20} />}
            onClick={requestAddFriend}
            loading={isLoading}
          >
            <span className="text-base font-semibold">Kết bạn</span>
          </ButtonGradient>
        );

      case EFriendStatus.PENDING_FROM_ME:
        return (
          <ButtonGradient
            icon={<TbUserX className="!text-white" size={20} />}
            onClick={rejectRequest}
          >
            <span className="text-base font-semibold">Hủy lời mời</span>
          </ButtonGradient>
        );

      case EFriendStatus.PENDING_TO_ME:
        return (
          <Dropdown
            trigger={['click']}
            placement="bottomLeft"
            arrow
            overlayStyle={{ width: '150px' }}
            menu={{
              items: [
                {
                  key: 'confirm',
                  label: (
                    <span className="text-base font-semibold">Xác nhận</span>
                  ),
                  onClick: acceptRequest,
                },
                {
                  key: 'cancel',
                  label: (
                    <span className="text-base font-semibold">Xoá lời mời</span>
                  ),
                  onClick: rejectRequest,
                },
              ],
            }}
          >
            <ButtonGradient
              icon={<TbUserCheck className="!text-white" size={20} />}
            >
              <span className="text-base font-semibold">Phản hồi</span>
            </ButtonGradient>
          </Dropdown>
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
                  onClick: unfriendRequest,
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

      default:
        return null;
    }
  };

  return <>{renderButton()}</>;
};

export default ButtonAddFriend;
