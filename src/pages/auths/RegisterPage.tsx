import { callApiRegister } from '@social/apis/auths.api';
import { ROUTES } from '@social/constants/route.constant';
import logo from '@social/images/logo.webp';
import type { IRegisterForm } from '@social/types/auths.type';
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  notification,
  Typography,
} from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values: IRegisterForm) => {
    setIsLoading(true);

    const res = await callApiRegister(values);
    if (res.data) {
      message.success('Đăng ký thành công');
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
            Tạo tài khoản của bạn
          </Title>
          <p className="text-gray-600 text-sm">
            Tham gia cộng đồng của chúng tôi và kết nối với bạn bè trên toàn thế
            giới
          </p>
        </div>
        <Form
          layout="vertical"
          form={form}
          onFinish={onSubmit}
          disabled={isLoading}
        >
          <Form.Item
            label="Họ và tên"
            name="fullname"
            rules={[{ required: true, message: 'Họ và tên là bắt buộc' }]}
          >
            <Input placeholder="Nhập họ và tên của bạn" allowClear />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Email là bắt buộc',
              },
              {
                type: 'email',
                message: 'Vui lòng nhập email hợp lệ',
              },
            ]}
          >
            <Input placeholder="Nhập email của bạn" allowClear />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Mật khẩu là bắt buộc' },
              { min: 8, message: 'Mật khẩu phải ít nhất 8 ký tự' },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu của bạn" allowClear />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Xác nhận mật khẩu là bắt buộc' },
              { min: 8, message: 'Xác nhận mật khẩu phải ít nhất 8 ký tự' },
              {
                validator: (_, value) => {
                  if (value !== form.getFieldValue('password')) {
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
              onPressEnter={() => form.submit()}
            />
          </Form.Item>

          <div className="flex flex-col">
            <Button
              type="primary"
              size="middle"
              loading={isLoading}
              onClick={() => form.submit()}
            >
              Đăng ký
            </Button>
            <Divider />
          </div>
          <div className="flex justify-center items-center gap-4">
            <span className="text-sm text-gray-600">Đã có tài khoản?</span>
            <Link
              to={ROUTES.AUTH.LOGIN}
              className="text-primary hover:!underline"
            >
              Đăng nhập
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default RegisterPage;
