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

  const onSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
    setIsLoading(true);
    const data: IForgotPasswordForm = {
      email: forgotPassword.email,
      otp: forgotPassword.otp,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };
    const res = await callApiResetPassword(data);
    if (res.data) {
      message.success('Reset password successful');
      navigate(ROUTES.AUTH.LOGIN);
    } else {
      notification.error({
        message: res.error,
        description: res.message && Array.isArray(res.message) ? res.message.join(', ') : res.message,
        duration: 3,
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <Form layout="vertical" form={form} onFinish={onSubmit} disabled={isLoading}>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: 'New password is required' },
            { min: 8, message: 'New password must be at least 8 characters' },
          ]}
        >
          <Input.Password placeholder="Enter your new password" allowClear />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            { required: true, message: 'Confirm password is required' },
            { min: 8, message: 'Confirm password must be at least 8 characters' },
            {
              validator: (_, value) => {
                if (value !== form.getFieldValue('newPassword')) {
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password placeholder="Enter your confirm password" allowClear />
        </Form.Item>
        <Form.Item className="!mb-0">
          <Button type="primary" htmlType="submit" loading={isLoading} className="w-full">
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ResetPassword;
