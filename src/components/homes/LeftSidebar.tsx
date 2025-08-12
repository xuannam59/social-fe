import { useAppSelector } from '@social/hooks/redux.hook';
import { Avatar } from 'antd';
import defaultAvatar from '@social/images/default-avatar.webp';
import { TbFriends } from 'react-icons/tb';

const LeftSidebar = () => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  return (
    <>
      <div className="flex flex-1 justify-start items-start">
        <div className="overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 justify-start items-center">
              <Avatar size={40} src={userInfo?.avatar || defaultAvatar} />
              <span className="text-[16px]">{userInfo.fullname}</span>
            </div>
            {/* <div className="flex gap-2 justify-start items-center">
              <div className="p-2 rounded-full bg-gray-200">
                <TbFriends size={30} />
              </div>
              <span className="text-[16px]">Friends</span>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
