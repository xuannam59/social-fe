import { useAppSelector } from '@social/hooks/redux.hook';
import { useNavigate } from 'react-router-dom';
import AvatarUser from '../common/AvatarUser';

const LeftSidebar = () => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col gap-2 overflow-y-auto w-full overflow-x-hidden h-full">
        <div className="px-3">
          <div
            className="flex gap-2 justify-start items-center hover:bg-gray-300 rounded-lg p-2 cursor-pointer"
            onClick={() => {
              navigate(`/${userInfo._id}`);
            }}
          >
            <AvatarUser size={42} avatar={userInfo.avatar} />
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
    </>
  );
};

export default LeftSidebar;
