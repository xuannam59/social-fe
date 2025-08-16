import { callApiLogout } from '@social/apis/auths.api';
import { ROUTES } from '@social/constants/route.constant';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { setIsLoading } from '@social/redux/reducers/auth.reducer';
import { Dropdown, Typography } from 'antd';
import { TbLogout, TbSettings } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import AvatarUser from '../common/AvatarUser';
import MessageDropdown from '../messages/MessageDropdown';
import NotificationDropdown from '../notifications/NotificationDropdown';
import defaultAvatar from '@social/images/default-avatar.webp';

const { Text } = Typography;

const HeaderUserInfo = () => {
  const { userInfo } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const res = await callApiLogout();
    if (res.data) {
      dispatch(setIsLoading(true));
      localStorage.removeItem('access_token');
      window.location.href = ROUTES.AUTH.LOGIN;
    }
  };

  return (
    <>
      <div className="flex items-center justify-end h-full gap-2">
        <MessageDropdown />

        <NotificationDropdown />
        <Dropdown
          trigger={['click']}
          placement={'bottomRight'}
          className="cursor-pointer"
          popupRender={() => {
            return (
              <div
                className="w-[380px] max-h-[calc(100vh-95px)] mb-10
               bg-white rounded-lg inset-shadow-2xs shadow-md p-4 flex flex-col overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-2">
                  <div className="shadow-md p-2 rounded-lg inset-shadow-2xs">
                    <div
                      className="flex items-center justify-start gap-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
                      onClick={() => {
                        navigate(ROUTES.PROFILE);
                      }}
                    >
                      <AvatarUser
                        size={50}
                        avatar={userInfo.avatar || defaultAvatar}
                      />
                      <div className="text-[16px] font-bold text-black">
                        {userInfo.fullname || 'User Unknown'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-start gap-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2 mt-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                      <TbSettings size={25} />
                    </div>
                    <Text className="!text-[16px] font-medium">Settings</Text>
                  </div>

                  <div
                    className="flex items-center justify-start gap-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                      <TbLogout size={25} />
                    </div>
                    <Text className="!text-[16px] font-medium">Logout</Text>
                  </div>
                </div>
              </div>
            );
          }}
        >
          <AvatarUser size={40} avatar={userInfo.avatar || defaultAvatar} />
        </Dropdown>
      </div>
    </>
  );
};

export default HeaderUserInfo;
