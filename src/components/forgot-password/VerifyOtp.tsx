import { callApiForgotPassword, callApiVerifyOtp } from '@social/apis/auths.api';
import type { IForgotPasswordForm, IVerifyOtpForm } from '@social/types/auths.type';
import { Button, Form, Input, message, notification } from 'antd';
import React, { useEffect, useState } from 'react';

interface IProps {
  forgotPassword: IForgotPasswordForm;
  setForgotPassword: React.Dispatch<React.SetStateAction<IForgotPasswordForm>>;
  handleNextStep: () => void;
}

const VerifyOtp: React.FC<IProps> = ({ forgotPassword, setForgotPassword, handleNextStep }) => {
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

  const handleResendOtp = async () => {
    setTimeLeft(60);
    const res = await callApiForgotPassword(forgotPassword.email);
    if (res.data) {
      message.success('OTP has been sent to your email');
    } else {
      notification.error({
        message: res.error,
        description: res.message && Array.isArray(res.message) ? res.message.join(', ') : res.message,
        duration: 3,
      });
    }
  };

  const onSubmit = async (values: { otp: string }) => {
    setIsLoading(true);
    const data: IVerifyOtpForm = {
      email: forgotPassword.email,
      otp: values.otp,
    };

    const res = await callApiVerifyOtp(data);
    if (res.data) {
      message.success('OTP verified successfully');
      setForgotPassword(prev => ({
        ...prev,
        otp: values.otp,
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
        <Form.Item label="OTP" name="otp" rules={[{ required: true, message: 'OTP is required' }]} className="!mb-0">
          <Input.OTP length={6} className="!w-full" />
        </Form.Item>
        <div className="flex justify-between items-center mb-4">
          {timeLeft > 0 ? (
            <span className="text-sm text-gray-500">Resend OTP in {timeLeft} seconds</span>
          ) : (
            <Button type="link" className="!p-0" onClick={handleResendOtp}>
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
