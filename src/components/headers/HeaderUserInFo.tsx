import { callApiLogout } from '@social/apis/auths.api';
import { ROUTES } from '@social/constants/route.constant';
import { useAppSelector } from '@social/hooks/redux.hook';
import defaultAvatar from '@social/images/default-avatar.webp';
import { Avatar, Dropdown, Typography } from 'antd';
import { TbLogout, TbSettings } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import MessageDropdown from '../messages/MessageDropdown';
import NotificationDropdown from '../notifications/NotificationDropdown';

const { Text } = Typography;

const HeaderUserInfo = () => {
  const { userInfo } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const handleLogout = async () => {
    const res = await callApiLogout();
    if (res.data) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.reload();
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
                      <Avatar
                        size={50}
                        src={userInfo.avatar || defaultAvatar}
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
          <Avatar size={40} src={userInfo.avatar || defaultAvatar} />
        </Dropdown>
      </div>
    </>
  );
};

export default HeaderUserInfo;
