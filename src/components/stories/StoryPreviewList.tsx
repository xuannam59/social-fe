import { useAppSelector } from '@social/hooks/redux.hook';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TbChevronLeft, TbChevronRight, TbPlus } from 'react-icons/tb';
import StoryPreviewItem from './StoryPreviewItem';
import { Link } from 'react-router-dom';
import defaultAvatar from '@social/images/default-avatar.webp';
import { Image } from 'antd';

const StoryPreviewList = () => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const userStories = useAppSelector(state => state.story.userStories);

  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Lấy container width khi component mount và resize
  const updateContainerWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, [updateContainerWidth]);

  // Tính toán vị trí translate tối đa có thể cuộn
  const maxTranslateX = useMemo(() => {
    if (containerWidth === 0) return 0;
    const totalWidth = userStories.length * 125 + (userStories.length - 1) * 4; // 125px width + 4px gap
    return Math.max(0, totalWidth - containerWidth);
  }, [userStories.length, containerWidth]);

  // Tính toán translateX hiện tại với giới hạn
  const currentTranslateX = useMemo(() => {
    if (translateX < 0) return 0;
    if (translateX > maxTranslateX) return maxTranslateX;
    return translateX;
  }, [translateX, maxTranslateX]);

  const scrollLeft = useCallback(() => {
    setTranslateX(prev => Math.max(0, prev - 250));
  }, []);

  const scrollRight = useCallback(() => {
    setTranslateX(prev => Math.min(maxTranslateX, prev + 250));
  }, [maxTranslateX]);

  return (
    <div className="relative">
      {currentTranslateX > 0 && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer
           bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all duration-200"
        >
          <TbChevronLeft size={20} className="text-gray-600" />
        </button>
      )}

      <div
        ref={containerRef}
        className="flex flex-nowrap gap-1 h-full"
        style={{
          transform: `translateX(-${currentTranslateX}px)`,
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <Link to={`/story/create`}>
          <div
            className="w-[125px] h-[200px] rounded-lg overflow-hidden border 
        border-gray-200 shadow-md group/story cursor-pointer flex-shrink-0"
          >
            <div className="flex flex-col h-full relative">
              <div className="w-full border-b border-gray-200 relative bg-black h-[75%]">
                <div className="flex items-center justify-center h-full">
                  <Image
                    src={userInfo?.avatar || defaultAvatar}
                    alt="user avatar"
                    width='100%'
                    height='100%'
                    className='object-cover'
                    loading="lazy"
                    preview={false}
                  />
                </div>
              </div>
              <div className="w-full h-[25%] bg-white pt-7 pb-3 px-4 flex items-center justify-center relative">
                <div className="absolute -top-[50%]">
                  <div className="flex items-center justify-center bg-white rounded-full h-10 w-10">
                    <div className="rounded-full bg-primary h-8 w-8 flex items-center justify-center">
                      <TbPlus size={20} className="text-white" />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold">Tạo tin</span>
              </div>
            </div>
          </div>
        </Link>
        {userStories.map(userStory => (
          <StoryPreviewItem key={userStory._id} userStory={userStory} />
        ))}
      </div>

      {currentTranslateX < maxTranslateX && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white cursor-pointer
          rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all duration-200"
        >
          <TbChevronRight size={20} className="text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default StoryPreviewList;
