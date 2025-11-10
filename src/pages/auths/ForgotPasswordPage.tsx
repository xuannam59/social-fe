import ResetPassword from '@social/components/forgot-password/ResetPassword';
import SendEmail from '@social/components/forgot-password/SendEmail';
import VerifyOtp from '@social/components/forgot-password/VerifyOtp';
import { ROUTES } from '@social/constants/route.constant';
import { DEFAULT_FORGOT_PASSWORD } from '@social/defaults/forgotPassword';
import logo from '@social/images/logo.webp';
import type { IForgotPasswordForm } from '@social/types/auths.type';
import { Button, Steps, Typography } from 'antd';
import { useState } from 'react';
import { TbChevronLeft } from 'react-icons/tb';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const ForgotPasswordPage = () => {
  const [forgotPassword, setForgotPassword] = useState<IForgotPasswordForm>(
    DEFAULT_FORGOT_PASSWORD
  );
  const [stepCurrent, setStepCurrent] = useState(0);

  const steps = [
    { description: 'Email' },
    { description: 'OTP' },
    { description: 'Mật khẩu mới' },
  ];

  const handleNextStep = () => {
    setStepCurrent(prev => prev + 1);
  };

  const renderStep = () => {
    switch (stepCurrent) {
      case 0:
        return (
          <SendEmail
            setForgotPassword={setForgotPassword}
            handleNextStep={handleNextStep}
          />
        );
      case 1:
        return (
          <VerifyOtp
            forgotPassword={forgotPassword}
            setForgotPassword={setForgotPassword}
            handleNextStep={handleNextStep}
          />
        );
      case 2:
        return <ResetPassword forgotPassword={forgotPassword} />;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-md mx-auto">
      <Steps current={stepCurrent} labelPlacement="vertical" items={steps} />
      <div
        className={`flex justify-between items-center ${stepCurrent === 2 ? 'justify-center' : 'justify-between'}`}
      >
        {stepCurrent === 0 && (
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors duration-200"
          >
            <TbChevronLeft size={18} />
            <span className="text-sm font-medium">Quay lại đăng nhập</span>
          </Link>
        )}
        {stepCurrent === 1 && (
          <Button
            type="link"
            className="!text-gray-600 hover:!text-primary transition-colors duration-200 !p-0"
            onClick={() => {
              setStepCurrent(prev => prev - 1);
            }}
          >
            <TbChevronLeft size={18} />
            <span className="text-sm font-medium">Quay lại</span>
          </Button>
        )}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className="w-[50px] h-[50px] object-contain"
          />
          <Title
            level={2}
            className="!mb-0 !text-transparent bg-clip-text bg-gradient-to-r from-[#3793B6] to-[#B5AF3A]"
          >
            Social
          </Title>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Title level={3} className="!text-primary !mb-0">
          Quên mật khẩu?
        </Title>
        <p className="text-gray-600 text-sm leading-relaxed">
          Đừng lo lắng! Điều này xảy ra. Vui lòng nhập địa chỉ email liên kết
          với tài khoản của bạn.
        </p>
      </div>

      {renderStep()}

      <div className="text-center">
        <p className="text-gray-500 text-sm">
          Nhớ mật khẩu của bạn?
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="text-primary hover:underline font-medium ml-2"
          >
            Đăng nhập ở đây
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
