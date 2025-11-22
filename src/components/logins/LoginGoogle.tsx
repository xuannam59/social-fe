import { Button } from 'antd';
import { FcGoogle } from 'react-icons/fc';

interface IProps {
  disabled: boolean;
}

const LoginGoogle = (props: IProps) => {
  const { disabled } = props;

  const onClick = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const url = `${backendUrl}/api/v1/auths/google-login`;
    window.location.href = url;
  };

  return (
    <>
      <Button
        size="middle"
        className="w-full"
        onClick={onClick}
        disabled={disabled}
      >
        <div className="flex justify-center items-center gap-2">
          <FcGoogle size={22} />
          Đăng nhập với Google
        </div>
      </Button>
    </>
  );
};

export default LoginGoogle;
