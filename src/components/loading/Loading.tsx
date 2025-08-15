import loading from '@social/animations/loading-page.json';
import Lottie from 'lottie-react';
import TextGradient from '../common/TextGradient';

const Loading = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-col gap-2 w-[40%] h-[40%]">
          <Lottie
            animationData={loading}
            loop={true}
            className="w-[full] h-[full] relative z-10"
          />
          <div className="flex justify-center items-center w-full h-full">
            <TextGradient className="!text-lg font-bold">
              Loading...
            </TextGradient>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
