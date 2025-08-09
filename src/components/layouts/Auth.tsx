import Lottie from 'lottie-react';
import login from '@social/animations/Login.json';
import { Outlet } from 'react-router-dom';

const LayoutAuth = () => {
  return (
    <>
      <div className="min-h-screen w-full flex">
        <div className="hidden lg:flex justify-center items-center w-1/2">
          <div className="max-w-lg">
            <Lottie animationData={login} loop={true} />
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="max-w-lg min-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default LayoutAuth;
