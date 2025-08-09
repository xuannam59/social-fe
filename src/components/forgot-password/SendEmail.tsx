import type { IForgotPasswordForm } from '@social/types/auths.type';
import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';

interface IProps {
  setForgotPassword: React.Dispatch<React.SetStateAction<IForgotPasswordForm>>;
  handleNextStep: () => void;
}

const SendEmail: React.FC<IProps> = ({ setForgotPassword, handleNextStep }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: { email: string }) => {
    const email = values.email;
    setIsLoading(true);
    try {
      setForgotPassword(prev => ({
        ...prev,
        email,
      }));
      message.success('OTP has been sent to your email');
      handleNextStep();
    } catch (error) {
      console.log(error);
      message.error('Failed to send reset password email');
    } finally {
      setIsLoading(false);
    }
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
