import Lottie from 'lottie-react';
import loading from '@social/animations/loading-page.json';

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
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Loading...
          </h1>
          <p className="text-gray-600 text-lg">
            Please wait while we prepare everything for you
          </p>
        </div>
      </div>
    </>
  );
};

export default LoadingPage;
