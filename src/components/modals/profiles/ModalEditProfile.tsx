import AvatarUser from '@social/components/common/AvatarUser';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { Button, Form, Input, message, Modal } from 'antd';
import { TbX } from 'react-icons/tb';
import { useState } from 'react';
import { callApiUpdateProfile } from '@social/apis/user.api';
import type { IUpdateProfile } from '@social/types/user.type';
import { convertErrorMessage } from '@social/common/convert';
import { doUpdateProfile } from '@social/redux/reducers/auth.reducer';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const ModalEditProfile = ({ open, onClose }: IProps) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: IUpdateProfile) => {
    if (!isEditing) return;
    try {
      setIsLoading(true);
      console.log(values);
      const res = await callApiUpdateProfile(values);
      if (res.data) {
        message.success('Cập nhật thông tin thành công');
        dispatch(doUpdateProfile(values));
        onClose();
      } else {
        message.error(convertErrorMessage(res.message));
      }
    } catch (error) {
      message.error('Cập nhật thông tin thất bại');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setIsEditing(false);
    onClose();
  };
  return (
    <>
      <Modal
        open={open}
        footer={null}
        title={null}
        closable={false}
        destroyOnHidden={true}
        className="create-post-modal"
        centered
      >
        <div className="max-h-[500px]">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <span className="text-h3 font-bold text-center flex-1">
              Chỉnh sửa thông tin
            </span>
            <Button type="text" shape="circle" onClick={handleClose}>
              <TbX size={20} />
            </Button>
          </div>
          <div className="flex flex-col gap-2 p-4 max-h-[300px] overflow-y-auto">
            <div className="flex justify-center items-center">
              <AvatarUser
                size={100}
                avatar={userInfo.avatar}
                className="rounded-full"
              />
            </div>
            <Form
              layout="vertical"
              form={form}
              initialValues={{
                fullname: userInfo.fullname,
                phone: userInfo.phone,
                address: userInfo.address,
              }}
              onFinish={onSubmit}
              disabled={!isEditing || isLoading}
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1">
                  <Form.Item
                    name="fullname"
                    label="Tên"
                    className="!mb-2"
                    rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item label="Email" className="!mb-2">
                    <Input disabled value={userInfo.email} />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1">
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    className="!mb-2"
                    rules={[
                      { min: 10, message: 'Số điện thoại phải có 10 chữ số' },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" maxLength={10} />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item name="address" label="Địa chỉ" className="!mb-2">
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
          <div className="flex justify-end gap-2 p-2 border-t border-gray-200">
            <Button
              color="primary"
              variant={isEditing ? 'outlined' : 'solid'}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Hủy' : 'Chỉnh sửa'}
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              disabled={!isEditing}
              loading={isLoading}
            >
              Lưu
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalEditProfile;
