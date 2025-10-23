import { Avatar, Typography } from 'antd';
import { TbPointFilled } from 'react-icons/tb';
import defaultAvatar from '@social/images/default-avatar.webp';
import {
  EEntityType,
  ENotificationType,
  type INotificationResponse,
} from '@social/types/notifications.type';
import {
  convertNotificationMessage,
  formatRelativeTimeV2,
} from '@social/common/convert';
import { useCallback } from 'react';

interface IProps {
  notification: INotificationResponse;
  onCloseDropdown: () => void;
}

const NotificationItem: React.FC<IProps> = ({
  notification,
  onCloseDropdown,
}) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      switch (notification.entityType) {
        case EEntityType.POST:
          break;
      }

      onCloseDropdown();
    },
    [notification, onCloseDropdown]
  );
  return (
    <>
      <div
        className="max-w-full"
        onClick={handleClick}
        id={`n_${notification.notificationId}`}
      >
        <div
          className="flex items-start gap-2 w-full min-w-0 
        max-w-full overflow-x-hidden cursor-pointer hover:bg-gray-100 rounded-lg p-2"
        >
          <div className="flex-shrink-0">
            <Avatar
              size={58}
              src={notification.senders[0].avatar || defaultAvatar}
            />
          </div>
          <div className="flex flex-col w-full min-w-0 gap-1">
            <div className="text-base line-clamp-2 break-words">
              <span className="font-medium text-base">
                {notification.senders
                  .slice(0, 1)
                  .map(sender => sender.fullname)
                  .join(', ')}
                {notification.senders.length > 1 && (
                  <span className="text-gray-500 text-base">
                    và {notification.senders.length - 2} người khác
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
            <span className="text-sm text-blue-500 shrink-0 whitespace-nowrap !m-0">
              {formatRelativeTimeV2(notification.latestAt)}
            </span>
          </div>
          {notification.isRead && (
            <div className="ml-1">
              <TbPointFilled size={30} className="text-sky-500" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationItem;
