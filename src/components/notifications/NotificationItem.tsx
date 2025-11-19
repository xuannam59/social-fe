import { Avatar, Button, message } from 'antd';
import { TbPointFilled, TbUserCheck, TbUserX } from 'react-icons/tb';
import defaultAvatar from '@social/images/default-avatar.webp';
import {
  EEntityType,
  ENotificationType,
  type INotificationResponse,
} from '@social/types/notifications.type';
import {
  convertErrorMessage,
  convertNotificationMessage,
  formatRelativeTimeV2,
} from '@social/common/convert';
import { useCallback, useMemo, useState } from 'react';
import { callApiReadNotifications } from '@social/apis/notifications.api';
import { useNavigate } from 'react-router-dom';
import {
  callApiAcceptFriend,
  callApiRejectFriend,
} from '@social/apis/friend.api';
import { NOTIFICATION_MESSAGE } from '@social/defaults/socket.default';
import { useSockets } from '@social/providers/SocketProvider';

interface IProps {
  notification: INotificationResponse;
  onCloseDropdown: () => void;
  onSetPostDetail: (postId: string) => void;
}

const NotificationItem: React.FC<IProps> = ({
  notification,
  onCloseDropdown,
  onSetPostDetail,
}) => {
  const lasSenderInfo = useMemo(() => {
    return notification.senderIds[notification.senderIds.length - 1];
  }, [notification.senderIds]);
  const [isRead, setIsRead] = useState(notification.isRead);
  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const { socket } = useSockets();
  const navigate = useNavigate();
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsRead(true);
      switch (notification.entityType) {
        case EEntityType.POST:
          onSetPostDetail(notification.entityId);
          break;
        case EEntityType.FRIEND_REQUEST:
          navigate(`/${notification.senderIds[0]._id}`);
          break;
      }

      callApiReadNotifications(notification._id);
      onCloseDropdown();
    },
    [notification, onCloseDropdown, onSetPostDetail, navigate]
  );

  const handleAcceptRequest = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        setIsLoadingAccept(true);
        const res = await callApiAcceptFriend(notification.senderIds[0]._id);
        if (res.data) {
          message.success('Lời mời đã được chấp nhận');
          socket.emit(NOTIFICATION_MESSAGE.FRIEND_REQUEST_ACCEPT, {
            friendId: notification.senderIds[0]._id,
          });
        } else {
          message.error(convertErrorMessage(res.message));
        }
      } catch (error) {
        console.error('Failed to accept request:', error);
        message.error('Có lỗi xảy ra');
      } finally {
        setIsLoadingAccept(false);
      }
    },
    [socket, notification.senderIds]
  );

  const handleRejectRequest = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        setIsLoadingReject(true);
        const res = await callApiRejectFriend(notification.senderIds[0]._id);
        if (res.data) {
          message.success('Lời mời đã được từ chối');
          socket.emit(NOTIFICATION_MESSAGE.FRIEND_REQUEST_REJECT, {
            friendId: notification.senderIds[0]._id,
          });
        } else {
          message.error(convertErrorMessage(res.message));
        }
      } catch (error) {
        console.error('Failed to reject request:', error);
        message.error('Có lỗi xảy ra');
      } finally {
        setIsLoadingReject(false);
      }
    },
    [socket, notification.senderIds]
  );

  return (
    <>
      <div
        className="max-w-full"
        onClick={handleClick}
        id={`n_${notification._id}`}
      >
        <div className="cursor-pointer hover:bg-gray-100 rounded-lg p-2">
          <div className="flex items-start gap-2 w-full min-w-0 max-w-full overflow-x-hidden">
            <div className="flex-shrink-0">
              <Avatar size={58} src={lasSenderInfo.avatar || defaultAvatar} />
            </div>
            <div className="flex flex-col w-full min-w-0 gap-1">
              <div className="flex items-center">
                <div className="text-base line-clamp-2 break-words">
                  <span className="font-medium text-base">
                    {lasSenderInfo.fullname}
                    {notification.senderIds.length > 1 && (
                      <span className="text-gray-500 text-base">
                        {` và `} {notification.senderIds.length - 1} người khác
                      </span>
                    )}
                  </span>
                  <span className="text-gray-500 text-base">
                    {convertNotificationMessage(
                      notification.message,
                      notification.type
                    )}
                  </span>
                </div>

                {!isRead && (
                  <div className="ml-1 h-full">
                    <TbPointFilled size={25} className="text-sky-500" />
                  </div>
                )}
              </div>
              {notification.type === ENotificationType.FRIEND_REQUEST && (
                <div className="flex items-center gap-2">
                  <Button
                    type="primary"
                    onClick={handleAcceptRequest}
                    loading={isLoadingAccept}
                  >
                    <div className="flex items-center gap-2">
                      <TbUserCheck size={20} />
                      <span className="text-base font-semibold">Xác nhận</span>
                    </div>
                  </Button>
                  <Button
                    type="default"
                    onClick={handleRejectRequest}
                    loading={isLoadingReject}
                  >
                    <div className="flex items-center gap-2">
                      <TbUserX size={20} />
                      <span className="text-base font-semibold">Từ chối</span>
                    </div>
                  </Button>
                </div>
              )}
              <span className="text-sm text-blue-500 shrink-0 whitespace-nowrap !m-0">
                {formatRelativeTimeV2(notification.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationItem;
