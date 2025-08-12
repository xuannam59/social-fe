import { Avatar, Typography } from 'antd';
import defaultAvatar from '@social/images/default-avatar.webp';
import React from 'react';
import { TbPointFilled } from 'react-icons/tb';

const { Paragraph } = Typography;

interface IProps {
  avatar: string;
  name: string;
  message: string;
  time: string;
  isRead: boolean;
}

const MessageItem: React.FC<IProps> = ({
  avatar,
  name,
  message,
  time,
  isRead,
}) => {
  return (
    <>
      <div className="max-w-full">
        <div
          className="flex items-center gap-2 w-full min-w-0 max-w-full 
        overflow-x-hidden cursor-pointer hover:bg-gray-100 rounded-lg px-2"
        >
          <div>
            <Avatar size={58} src={avatar || defaultAvatar} />
          </div>
          <div className="flex flex-col w-full min-w-0">
            <Paragraph className="!m-0 font-bold">{name}</Paragraph>
            <div className="flex items-center gap-2 w-full min-w-0">
              <Paragraph
                ellipsis={{ rows: 1 }}
                type="secondary"
                className=" min-w-0 !m-0"
              >
                {message}
              </Paragraph>
              <span className="shrink-0" aria-hidden="true">
                ·
              </span>
              <Paragraph
                type="secondary"
                className="text-sm text-gray-500 shrink-0 whitespace-nowrap !m-0"
              >
                {time}
              </Paragraph>
            </div>
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

export default MessageItem;
