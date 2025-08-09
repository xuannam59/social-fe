import type { IForgotPasswordForm } from '@social/types/auths.type';
import { Button, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';

interface IProps {
  setForgotPassword: React.Dispatch<React.SetStateAction<IForgotPasswordForm>>;
  handleNextStep: () => void;
}

const VerifyOtp: React.FC<IProps> = ({ setForgotPassword, handleNextStep }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!timeLeft) return;

    const times = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(times);
  }, [timeLeft]);

  const onSubmit = async (values: IForgotPasswordForm) => {
    setIsLoading(true);
    try {
      console.log(values);
      message.success('OTP verified successfully');
      setForgotPassword(prev => ({
        ...prev,
        otp: values.otp,
      }));
      handleNextStep();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form layout="vertical" form={form} onFinish={onSubmit} disabled={isLoading}>
        <Form.Item label="OTP" name="otp" rules={[{ required: true, message: 'OTP is required' }]} className="!mb-0">
          <Input.OTP length={6} type="number" />
        </Form.Item>
        <div className="flex justify-between items-center mb-4">
          {timeLeft > 0 ? (
            <span className="text-sm text-gray-500">Resend OTP in {timeLeft} seconds</span>
          ) : (
            <Button type="link" className="!p-0" onClick={() => setTimeLeft(60)}>
              Resend OTP
            </Button>
          )}
        </div>
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
            Verify
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default VerifyOtp;
