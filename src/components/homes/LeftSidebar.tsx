import { useAppSelector } from '@social/hooks/redux.hook';
import { useNavigate } from 'react-router-dom';
import AvatarUser from '../common/AvatarUser';
import { TbBookmark, TbUsers } from 'react-icons/tb';
import { ROUTES } from '@social/constants/route.constant';

const LeftSidebar = () => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const navigate = useNavigate();
  return (
    <>
      <div className="px-3">
        <div className="flex flex-col overflow-y-auto w-full overflow-x-hidden h-full">
          <div
            className="flex gap-2 justify-start items-center hover:bg-gray-200 rounded-lg p-2 cursor-pointer"
            onClick={() => {
              navigate(`/${userInfo._id}`);
            }}
          >
            <AvatarUser size={42} avatar={userInfo.avatar} />
            <span className="text-[16px]">{userInfo.fullname}</span>
          </div>

          <div
            className="flex gap-1.5 justify-start items-center hover:bg-gray-200 rounded-lg p-2 cursor-pointer"
            onClick={() => {
              navigate(ROUTES.FRIEND);
            }}
          >
            <div className="p-2">
              <TbUsers size={28} />
            </div>
            <span className="text-[16px]">Bạn bè</span>
          </div>

          <div
            className="flex gap-1.5 justify-start items-center hover:bg-gray-200 rounded-lg p-2 cursor-pointer"
            onClick={() => {
              navigate(ROUTES.SAVED_POST);
            }}
          >
            <div className="p-2">
              <TbBookmark size={28} />
            </div>
            <span className="text-[16px]">Bài viết đã lưu</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
