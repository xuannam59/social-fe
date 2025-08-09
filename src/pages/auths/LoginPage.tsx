import LoginGoogle from '@social/components/logins/LoginGoogle';
import { ROUTES } from '@social/constants/route.constant';
import logo from '@social/images/logo.webp';
import type { ILoginForm } from '@social/types/auths.type';
import { Button, Checkbox, Divider, Form, Input, message, Typography } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const { Title } = Typography;
const LoginPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: ILoginForm) => {
    setIsLoading(true);
    try {
      console.log(values);
      message.success('Login successful');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-4 p-5">
        <div className="mb-4 flex justify-start items-center gap-2">
          <img src={logo} alt="logo" className="w-[60px]" />
          <Title
            level={2}
            className="!mb-0 !text-transparent bg-clip-text bg-gradient-to-r from-[#3793B6] to-[#B5AF3A]"
          >
            Social
          </Title>
        </div>
        <div className="flex flex-col">
          <Title level={3} className="!text-primary">
            Welcome Back!
          </Title>
          <p className="text-gray-600 text-sm">Login to continue your journey with us</p>
        </div>
        <Form layout="vertical" form={form} onFinish={onSubmit} disabled={isLoading}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Email is required',
              },
              {
                type: 'email',
                message: 'Please enter a valid email',
              },
            ]}
          >
            <Input placeholder="Enter your email" allowClear />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Password is required' }]}>
            <Input.Password placeholder="Enter your password" allowClear onPressEnter={() => form.submit()} />
          </Form.Item>
          <div className="flex justify-between items-center mb-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="text-primary hover:!underline">
              Forgot password?
            </Link>
          </div>
          <div className="flex flex-col mb-4">
            <Button type="primary" size="middle" loading={isLoading} onClick={() => form.submit()}>
              Login
            </Button>
            <Divider />
            <LoginGoogle disabled={isLoading} />
          </div>
          <div className="flex justify-center items-center gap-4">
            <span className="text-sm text-gray-600">Don't have an account?</span>
            <Link to={ROUTES.AUTH.REGISTER} className="text-primary hover:!underline">
              Register
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default LoginPage;
