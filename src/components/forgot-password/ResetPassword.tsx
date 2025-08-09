import type { IForgotPasswordForm } from '@social/types/auths.type';
import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { useState } from 'react';

interface IProps {
  forgotPassword: IForgotPasswordForm;
}

const ResetPassword: React.FC<IProps> = ({ forgotPassword }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: IForgotPasswordForm) => {
    setIsLoading(true);
    try {
      console.log(values);
      console.log(forgotPassword);
      message.success('Reset password successful');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form layout="vertical" form={form} onFinish={onSubmit} disabled={isLoading}>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: 'New password is required' }]}
        >
          <Input.Password placeholder="Enter your new password" allowClear />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            { required: true, message: 'Confirm password is required' },
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
