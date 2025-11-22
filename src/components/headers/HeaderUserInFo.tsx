import { callApiChangePassword, callApiLogout } from '@social/apis/auths.api';
import { ROUTES } from '@social/constants/route.constant';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { setIsLoading } from '@social/redux/reducers/auth.reducer';
import {
  Button,
  Dropdown,
  Form,
  Input,
  message,
  Modal,
  Typography,
} from 'antd';
import { TbLockOpen, TbLogout, TbX } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import AvatarUser from '../common/AvatarUser';
import ConversationDropdown from '../conversations/ConversationDropdown';
import NotificationDropdown from '../notifications/NotificationDropdown';
import defaultAvatar from '@social/images/default-avatar.webp';
import { useEffect, useState } from 'react';
import { fetchUnSeenConversations } from '@social/redux/reducers/conversations.reducer';
import type { IChangePasswordForm } from '@social/types/auths.type';

const { Text } = Typography;

const HeaderUserInfo = () => {
  const { userInfo } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);
  const [form] = Form.useForm();
  const [isLoadingResetPassword, setIsLoadingResetPassword] = useState(false);
  const handleLogout = async () => {
    const res = await callApiLogout();
    if (res.data) {
      dispatch(setIsLoading(true));
      localStorage.removeItem('access_token');
      window.location.href = ROUTES.AUTH.LOGIN;
    }
  };

  useEffect(() => {
    dispatch(fetchUnSeenConversations());
  }, [dispatch]);

  const handleChangePassword = () => {
    setOpenDropdown(false);
    setOpenModalChangePassword(true);
  };

  const handleCancel = () => {
    setOpenModalChangePassword(false);
    form.resetFields();
  };

  const onFinish = async (values: IChangePasswordForm) => {
    try {
      setIsLoadingResetPassword(true);
      const res = await callApiChangePassword(values);
      if (res.data) {
        message.success('Thay đổi mật khẩu thành công');
        form.resetFields();
        setOpenModalChangePassword(false);
      } else {
        message.error(
          res.message && Array.isArray(res.message)
            ? res.message.join(', ')
            : res.message || 'Thay đổi mật khẩu thất bại'
        );
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          'Thay đổi mật khẩu thất bại. Vui lòng thử lại!'
      );
      console.error(error);
    } finally {
      setIsLoadingResetPassword(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end h-full gap-2">
        <ConversationDropdown />

        <NotificationDropdown />
        <Dropdown
          open={openDropdown}
          onOpenChange={setOpenDropdown}
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
                        navigate(`/${userInfo._id}`);
                        setOpenDropdown(false);
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

                  <div
                    className="flex items-center justify-start gap-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2 mt-3"
                    onClick={handleChangePassword}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                      <TbLockOpen size={25} />
                    </div>
                    <Text className="!text-[16px] font-medium">
                      Thay đổi mật khẩu
                    </Text>
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
          <AvatarUser
            size={40}
            avatar={userInfo.avatar}
            onClick={() => setOpenDropdown(!openDropdown)}
          />
        </Dropdown>
      </div>

      <Modal
        open={openModalChangePassword}
        title={null}
        closable={false}
        destroyOnHidden={true}
        className="create-post-modal"
        footer={null}
        centered
      >
        <div className="max-h-[calc(100vh-100px)]">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex-1 flex items-center justify-center">
              <span className="text-h3 font-bold">Thay đổi mật khẩu</span>
            </div>
            <Button
              type="text"
              shape="circle"
              onClick={handleCancel}
              disabled={isLoadingResetPassword}
            >
              <TbX size={20} />
            </Button>
          </div>
          <div className="p-3 max-h-[calc(100vh-300px)] overflow-y-auto overflow-x-hidden">
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              disabled={isLoadingResetPassword}
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Form.Item
                    name="oldPassword"
                    label="Mật khẩu cũ"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu cũ' },
                    ]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu cũ" allowClear />
                  </Form.Item>
                </div>
              </div>

              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" allowClear />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập xác nhận mật khẩu mới',
                  },
                  {
                    validator: (_, value) => {
                      if (value !== form.getFieldValue('newPassword')) {
                        return Promise.reject(
                          new Error(
                            'Mật khẩu và xác nhận mật khẩu mới không khớp!'
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.Password
                  placeholder="Nhập xác nhận mật khẩu mới"
                  allowClear
                />
              </Form.Item>
            </Form>
          </div>
          <div className="flex justify-end p-4 border-t border-gray-200">
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => form.submit()}
              loading={isLoadingResetPassword}
              className="w-full"
            >
              Thay đổi mật khẩu
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HeaderUserInfo;
