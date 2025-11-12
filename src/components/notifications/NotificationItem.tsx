import { Avatar } from 'antd';
import { TbPointFilled } from 'react-icons/tb';
import defaultAvatar from '@social/images/default-avatar.webp';
import {
  EEntityType,
  type INotificationResponse,
} from '@social/types/notifications.type';
import {
  convertNotificationMessage,
  formatRelativeTimeV2,
} from '@social/common/convert';
import { useCallback, useMemo, useState } from 'react';
import { callApiReadNotifications } from '@social/apis/notifications.api';

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
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsRead(true);
      switch (notification.entityType) {
        case EEntityType.POST:
          onSetPostDetail(notification.entityId);
          break;
      }

      callApiReadNotifications(notification._id);
      onCloseDropdown();
    },
    [notification, onCloseDropdown, onSetPostDetail]
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
