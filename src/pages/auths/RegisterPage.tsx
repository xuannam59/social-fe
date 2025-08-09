import { ROUTES } from '@social/constants/route.constant';
import logo from '@social/images/logo.webp';
import type { IRegisterForm } from '@social/types/auths.type';
import { Button, Divider, Form, Input, message, Typography } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: IRegisterForm) => {
    setIsLoading(true);
    try {
      console.log(values);
      message.success('Register successful');
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
            Create Your Account
          </Title>
          <p className="text-gray-600 text-sm">Join our community and connect with friends around the world</p>
        </div>
        <Form layout="vertical" form={form} onFinish={onSubmit} disabled={isLoading}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'First name is required' }]}
          >
            <Input placeholder="Enter your first name" allowClear />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Last name is required' }]}
            className="mb-4"
          >
            <Input placeholder="Enter your last name" allowClear />
          </Form.Item>

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
            <Input.Password placeholder="Enter your password" allowClear />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Confirm password is required' },
              {
                validator: (_, value) => {
                  if (value !== form.getFieldValue('password')) {
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password placeholder="Enter your confirm password" allowClear onPressEnter={() => form.submit()} />
          </Form.Item>

          <div className="flex flex-col">
            <Button type="primary" size="middle" loading={isLoading} onClick={() => form.submit()}>
              Register
            </Button>
            <Divider />
          </div>
          <div className="flex justify-center items-center gap-4">
            <span className="text-sm text-gray-600">Already have an account?</span>
            <Link to={ROUTES.AUTH.LOGIN} className="text-primary hover:!underline">
              Login
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default RegisterPage;
