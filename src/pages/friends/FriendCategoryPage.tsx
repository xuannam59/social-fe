import { useState } from 'react';
import { TbList, TbUserPlus } from 'react-icons/tb';
import FriendInviteContent from './FriendInviteContent';
import MyFriendsContent from './MyFriendsContent';
import FriendRequestSentContent from './FriendRequestSentContent';

const FriendCategoryPage = () => {
  const [activeTab, setActiveTab] = useState('friend-request');

  const onChangeTab = (key: string) => {
    setActiveTab(key);
  };

  const menuItems = [
    {
      key: 'friend-request',
      icon: <TbUserPlus size={24} />,
      label: 'Lời mời kết bạn',
    },
    {
      key: 'friend-request-sent',
      icon: <TbUserPlus size={24} />,
      label: 'Lời mời kết bạn đã gửi',
    },
    {
      key: 'my-friends',
      icon: <TbList size={24} />,
      label: 'Tất cả bạn bè',
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'friend-request':
        return <FriendInviteContent />;
      case 'friend-request-sent':
        return <FriendRequestSentContent />;
      case 'my-friends':
        return <MyFriendsContent />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex h-full gap-4 overflow-y-auto">
        <div className="hidden lg:block lg:w-[280px] xl:w-[360px] sticky top-0 left-0">
          <div className="w-full h-full bg-white shadow-md py-2 px-3">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="font-bold text-h2">Bạn bè</span>
            </div>
            <div className="flex flex-col">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => onChangeTab(item.key)}
                  className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                    activeTab === item.key
                      ? 'bg-gray-100 text-blue-600'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${activeTab === item.key ? 'text-white bg-primary' : 'text-black bg-gray-200'}`}
                  >
                    {item.icon}
                  </div>
                  <span className="flex-1 text-[15px] font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {renderContent()}
      </div>
    </>
  );
};

export default FriendCategoryPage;
