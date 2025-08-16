import { ROUTES } from '@social/constants/route.constant';
import logo from '@social/images/logo.webp';
import { TbX } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import HeaderUserInfo from './HeaderUserInFo';

const HeaderStory = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="h-14 w-full fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between items-center h-full">
          <div className="flex px-4 gap-2 items-center justify-start w-[360px] shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center bg-gray-500/80 rounded-full">
              <TbX size={25} className="text-white" />
            </div>
            <div className="w-[50px] h-14 overflow-hidden flex justify-end">
              <img
                src={logo}
                alt="logo"
                className={`cursor-pointer h-auto object-contain transition-all duration-300 ease-out`}
                onClick={() => {
                  navigate(ROUTES.DEFAULT);
                }}
              />
            </div>
          </div>
          <div className="w-fit h-14 px-4">
            <HeaderUserInfo />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderStory;
