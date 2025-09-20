import { useAppSelector } from '@social/hooks/redux.hook';
import AvatarUser from '../common/AvatarUser';
import { Link } from 'react-router-dom';

const LeftSidebar = () => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  return (
    <>
      <div className="flex flex-1 justify-start items-start sticky top-0 left-0">
        <div className="overflow-y-auto overflow-x-hidden w-[60%]">
          <div className="flex flex-col gap-2">
            <Link
              to={`/${userInfo._id}`}
              className="hover:bg-gray-300 rounded-lg p-2 cursor-pointer"
            >
              <div className="flex gap-2 justify-start items-center">
                <AvatarUser size={42} avatar={userInfo.avatar} />
                <span className="text-[16px]">{userInfo.fullname}</span>
              </div>
            </Link>
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
