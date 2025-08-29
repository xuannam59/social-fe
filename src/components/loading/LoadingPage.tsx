import Lottie from 'lottie-react';
import loading from '@social/animations/loading-page.json';
import logo from '@social/images/logo.webp';

const LoadingPage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <Lottie
            animationData={loading}
            loop={true}
            className="w-48 h-48 relative z-10"
          />
        </div>
        <div className="text-center mb-6 flex flex-col gap-1 items-center justify-center">
          <img src={logo} alt="logo" className="h-10 w-auto" />
          <p className="text-gray-600 text-lg">
            Vui lòng đợi trong giây lát...
          </p>
        </div>
      </div>
    </>
  );
};

export default LoadingPage;
