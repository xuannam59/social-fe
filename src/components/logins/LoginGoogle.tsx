import { Button, message } from 'antd';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

interface IProps {
  disabled: boolean;
}

const LoginGoogle = (props: IProps) => {
  const { disabled } = props;
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    setIsLoading(true);
    try {
      message.info('Login Google');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="middle" className="w-full" onClick={onClick} loading={isLoading} disabled={disabled}>
        <div className="flex justify-center items-center gap-2">
          <FcGoogle size={22} />
          Or login with Google
        </div>
      </Button>
    </>
  );
};

export default LoginGoogle;
