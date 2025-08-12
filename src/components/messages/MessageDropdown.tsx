import { Button, Dropdown } from 'antd';
import InputSearch from '../commons/InputSearch';
import { TbMessageCircle } from 'react-icons/tb';
import { Badge, Typography } from 'antd';
import defaultAvatar from '@social/images/default-avatar.webp';
import { useState } from 'react';
import MessageItem from './MessageItem';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const MessageDropdown = () => {
  const [_, setIsSearchFocused] = useState(false);
  const [messageType, setMessageType] = useState('all');

  const messageTypeList = [
    {
      type: 'all',
      label: 'All',
      width: 'col-span-2',
    },
    {
      type: 'notRead',
      label: 'Not Read',
      width: 'col-span-3',
    },
    {
      type: 'group',
      label: 'Group',
      width: 'col-span-3',
    },
  ];

  const messageList = [
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      message: 'Xin chào tôi là Nam nè',
      time: '12:00',
      isRead: true,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      message: 'Xin chào tôi là Nam',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      message: 'Xin chào tôi là Nam',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      message: 'Xin chào tôi là Nam',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      message: 'Xin chào tôi là Nam',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      message: 'Xin chào tôi là Nam',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      message: 'Xin chào tôi là Nam',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      message: 'Xin chào tôi là Nam',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      message: 'Xin chào tôi là Nam',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      message: 'Xin chào tôi là Nam',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      message: 'Xin chào tôi là Nam',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      message: 'Xin chào tôi là Nam',
      time: '12:00',
      isRead: false,
    },
    {
      avatar: defaultAvatar,
      name: 'John Doe',
      message: 'Xin chào tôi là Nam',
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
            <div className="w-[380px] max-h-[calc(100vh-95px)] mb-10 bg-white rounded-lg inset-shadow-2xs shadow-md p-4 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between">
                <Title level={3}>Messages</Title>
              </div>
              <div className="flex items-center">
                <InputSearch
                  placeholder="Search"
                  className="w-full h-[36px]"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
              <div className="grid grid-cols-12 gap-1 mt-4 px-2">
                {messageTypeList.map(item => (
                  <Button
                    key={item.type}
                    color={messageType === item.type ? 'primary' : 'default'}
                    variant={`${messageType === item.type ? 'filled' : 'text'}`}
                    className={item.width}
                    onClick={() => setMessageType(item.type)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>

              <div className="flex-1 min-h-0 mt-4 overflow-y-auto overflow-x-hidden overscroll-contain">
                <div className="grid grid-cols-1 gap-4">
                  {messageList.map((item, index) => (
                    <MessageItem
                      key={index}
                      avatar={item.avatar}
                      name={item.name}
                      message={item.message}
                      time={item.time}
                      isRead={item.isRead}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center mt-4 flex-shrink-0 border-t border-gray-200 pt-2">
                <Link to="/messages">View all</Link>
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
            <TbMessageCircle size={25} />
          </Badge>
        </div>
      </Dropdown>
    </>
  );
};

export default MessageDropdown;
