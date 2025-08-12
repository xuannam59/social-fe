import { Avatar, Typography } from 'antd';
import { TbPointFilled } from 'react-icons/tb';
import defaultAvatar from '@social/images/default-avatar.webp';

interface IProps {
  avatar: string;
  name: string;
  notification: string;
  time: string;
  isRead: boolean;
}

const { Paragraph } = Typography;

const NotificationItem: React.FC<IProps> = ({
  avatar,
  name,
  notification,
  time,
  isRead,
}) => {
  return (
    <>
      <div className="max-w-full">
        <div
          className="flex items-start gap-2 w-full min-w-0 
        max-w-full overflow-x-hidden cursor-pointer hover:bg-gray-100 rounded-lg p-2"
        >
          <div>
            <Avatar size={58} src={avatar || defaultAvatar} />
          </div>
          <div className="flex flex-col w-full min-w-0 gap-1">
            <Paragraph ellipsis={{ rows: 3 }} className=" min-w-0 !m-0">
              <strong>{`${name} `} </strong>
              <span className="text-gray-500">{notification}</span>
            </Paragraph>
            <span className="text-sm text-blue-500 shrink-0 whitespace-nowrap !m-0">
              {time}
            </span>
          </div>
          {isRead && (
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
