import Lottie from 'lottie-react';
import emptyState from '@social/animations/empty-state.json';
import TextGradient from './TextGradient';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full mb-2">
      <div className="flex flex-col items-center gap-2 w-[40%]">
        <Lottie animationData={emptyState} loop={true} className="relative" />
        <TextGradient className="!text-lg font-bold">
          Không có dữ liệu
        </TextGradient>
      </div>
    </div>
  );
};

export default EmptyState;
