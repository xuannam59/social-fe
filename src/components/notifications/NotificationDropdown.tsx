import { Badge, Dropdown, Typography } from 'antd';
import { TbBell } from 'react-icons/tb';
import defaultAvatar from '@social/images/default-avatar.webp';
import NotificationItem from './NotificationItem';

const { Title } = Typography;

const NotificationDropdown = () => {
  const notificationList = [
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      notification: 'has sent you a message and you have ',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      notification: 'has sent you a message and you have ',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      notification: 'has sent you a message and you have ',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      notification: 'has sent you a message and you have ',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      notification: 'has sent you a message and you have ',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      notification: 'has sent you a message and you have ',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      notification: 'has sent you a message and you have ',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      notification: 'has sent you a message and you have ',
      time: '12:00',
      isRead: false,
    },
  ];
  return (
    <>
      <Dropdown
        className="cursor-pointer"
        trigger={['click']}
        placement={'bottomLeft'}
        popupRender={() => {
          return (
            <div className="w-[380px] h-fit max-h-[calc(100vh-95px)] mb-10 bg-white rounded-lg inset-shadow-2xs shadow-md p-4 flex flex-col overflow-hidden overflow-y-auto">
              <div className="flex items-center justify-between">
                <Title level={3}>Notifications</Title>
              </div>
              <div className="flex-1 min-h-0 mt-4 overflow-x-hidden">
                <div className="grid grid-cols-1 gap-4">
                  {notificationList.map((item, index) => (
                    <NotificationItem
                      key={index}
                      avatar={item.avatar}
                      name={item.name}
                      notification={item.notification}
                      time={item.time}
                      isRead={item.isRead}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        }}
      >
        <div
          className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full
         hover:bg-gray-200 transition-all duration-300 ease-out"
        >
          <Badge count={1}>
            <TbBell size={23} />
          </Badge>
        </div>
      </Dropdown>
    </>
  );
};

export default NotificationDropdown;
