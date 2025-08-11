import { callApiForgotPassword } from '@social/apis/auths.api';
import type { IForgotPasswordForm } from '@social/types/auths.type';
import { Button, Form, Input, message, notification } from 'antd';
import { useState } from 'react';

interface IProps {
  setForgotPassword: React.Dispatch<React.SetStateAction<IForgotPasswordForm>>;
  handleNextStep: () => void;
}

const SendEmail: React.FC<IProps> = ({ setForgotPassword, handleNextStep }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    const email = values.email;
    const res = await callApiForgotPassword(email);
    if (res.data) {
      message.success('OTP has been sent to your email');
      setForgotPassword(prev => ({
        ...prev,
        email,
      }));
      handleNextStep();
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
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please enter your email address',
            },
            {
              type: 'email',
              message: 'Please enter a valid email address',
            },
          ]}
        >
          <Input placeholder="Enter your email address" allowClear />
        </Form.Item>

        <Form.Item className="!mb-0">
          <Button
            type="primary"
            size="large"
            loading={isLoading}
            onClick={() => {
              form.submit();
            }}
            className="w-full rounded-lg h-12 font-medium"
          >
            Sending
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SendEmail;
