import { callApiLogin } from '@social/apis/auths.api';
import LoginGoogle from '@social/components/logins/LoginGoogle';
import { ROUTES } from '@social/constants/route.constant';
import { useAppDispatch } from '@social/hooks/redux.hook';
import logo from '@social/images/logo.webp';
import { doLogin } from '@social/redux/reducers/auth.reducer';
import type { ILoginForm } from '@social/types/auths.type';
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  notification,
  Typography,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const { Title } = Typography;
const LoginPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const counts = useRef(0);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status && status.toLowerCase() === 'false' && counts.current === 0) {
      notification.error({
        message: 'Đăng nhập với Google thất bại',
        description: 'vui lòng thử lại',
        duration: 2.5,
      });
    }
    counts.current = 1;
  }, [searchParams, setSearchParams]);

  const onSubmit = async (values: ILoginForm) => {
    setIsLoading(true);
    const res = await callApiLogin(values);
    if (res.data) {
      message.success('Đăng nhập thành công');
      navigate(ROUTES.DEFAULT);
      localStorage.setItem('access_token', res.data.access_token);
      dispatch(doLogin(res.data));
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
            Chào mừng trở lại!
          </Title>
          <p className="text-gray-600 text-sm">
            Đăng nhập để tiếp tục hành trình của bạn với chúng tôi
          </p>
        </div>
        <Form
          layout="vertical"
          form={form}
          onFinish={onSubmit}
          disabled={isLoading}
        >
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
            rules={[{ required: true, message: 'Mật khẩu là bắt buộc' }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu của bạn"
              allowClear
              onPressEnter={() => form.submit()}
            />
          </Form.Item>
          <div className="flex justify-end items-center mb-4">
            <Link
              to={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-primary hover:!underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="flex flex-col mb-4">
            <Button
              type="primary"
              size="middle"
              loading={isLoading}
              onClick={() => form.submit()}
            >
              Đăng nhập
            </Button>
            <Divider />
            <LoginGoogle disabled={isLoading} />
          </div>
          <div className="flex justify-center items-center gap-4">
            <span className="text-sm text-gray-600">Không có tài khoản?</span>
            <Link
              to={ROUTES.AUTH.REGISTER}
              className="text-primary hover:!underline"
            >
              Đăng ký
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default LoginPage;
