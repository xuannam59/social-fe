import Lottie from 'lottie-react';
import login from '@social/animations/login.json';
import register from '@social/animations/register.json';
import forgotPassword from '@social/animations/forgot-password.json';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ROUTES } from '@social/constants/route.constant';

const LayoutAuth = () => {
  const pathname = useLocation();
  const [animation, setAnimation] = useState<any>(null);

  useEffect(() => {
    if (pathname.pathname === ROUTES.AUTH.LOGIN) {
      setAnimation(login);
    } else if (pathname.pathname === ROUTES.AUTH.REGISTER) {
      setAnimation(register);
    } else {
      setAnimation(forgotPassword);
    }
  }, [pathname]);

  return (
    <>
      <div className={`min-h-screen w-full flex`}>
        <div className="hidden lg:flex justify-center items-center w-1/2">
          <div className="max-w-lg">
            <Lottie animationData={animation} loop={true} />
          </div>
        </div>
        <div className={`w-full lg:w-1/2 flex justify-center items-center`}>
          <div className="max-w-lg min-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default LayoutAuth;
