import { callApiResetPassword } from '@social/apis/auths.api';
import type { IForgotPasswordForm } from '@social/types/auths.type';
import { Button, Form, Input, message, notification } from 'antd';
import React from 'react';
import { useState } from 'react';
import { ROUTES } from '@social/constants/route.constant';
import { useNavigate } from 'react-router-dom';

interface IProps {
  forgotPassword: IForgotPasswordForm;
}

const ResetPassword: React.FC<IProps> = ({ forgotPassword }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    const data: IForgotPasswordForm = {
      email: forgotPassword.email,
      otp: forgotPassword.otp,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };
    const res = await callApiResetPassword(data);
    if (res.data) {
      message.success('Đặt lại mật khẩu thành công');
      navigate(ROUTES.AUTH.LOGIN);
    } else {
      notification.error({
        message: res.error,
        description:
          res.message && Array.isArray(res.message)
            ? res.message.join(', ')
            : res.message,
        duration: 3,
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        disabled={isLoading}
      >
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: 'Mật khẩu mới là bắt buộc' },
            { min: 8, message: 'Mật khẩu mới phải ít nhất 8 ký tự' },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới của bạn" allowClear />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[
            { required: true, message: 'Xác nhận mật khẩu là bắt buộc' },
            { min: 8, message: 'Xác nhận mật khẩu phải ít nhất 8 ký tự' },
            {
              validator: (_, value) => {
                if (value !== form.getFieldValue('newPassword')) {
                  return Promise.reject(
                    new Error('Mật khẩu và xác nhận mật khẩu không khớp!')
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            placeholder="Nhập xác nhận mật khẩu của bạn"
            allowClear
          />
        </Form.Item>
        <Form.Item className="!mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="w-full"
          >
            Đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ResetPassword;
