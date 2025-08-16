import { useAppSelector } from '@social/hooks/redux.hook';
import defaultAvatar from '@social/images/default-avatar.webp';
import type { IStory } from '@social/types/story.type';
import { useCallback, useMemo, useRef, useState } from 'react';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import StoryItem from './StoryItem';

const StoryShow = () => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const stories: IStory[] = useMemo(
    () => [
      {
        _id: '1',
        type: 'image',
        file: defaultAvatar,
        fullName: userInfo?.fullname || '',
        isCreate: true,
      },
      {
        _id: '2',
        type: 'image',
        file: 'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
        fullName: userInfo?.fullname || '',
        avatar: defaultAvatar,
      },
      {
        _id: '6',
        type: 'image',
        file: 'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
        fullName: userInfo?.fullname || '',
        avatar: defaultAvatar,
      },
      {
        _id: '7',
        type: 'image',
        file: 'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
        fullName: userInfo?.fullname || '',
        avatar: defaultAvatar,
      },
      {
        _id: '8',
        type: 'image',
        file: 'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
        fullName: userInfo?.fullname || '',
        avatar: defaultAvatar,
      },
    ],
    [userInfo]
  );

  // Tính toán vị trí translate tối đa có thể cuộn
  const maxTranslateX = useMemo(() => {
    if (!containerRef.current) return 0;
    const containerWidth = containerRef.current.offsetWidth;
    const totalWidth = stories.length * 125 + (stories.length - 1) * 4; // 125px width + 4px gap
    return Math.max(0, totalWidth - containerWidth);
  }, [stories.length]);

  // Tính toán translateX hiện tại với giới hạn
  const currentTranslateX = useMemo(() => {
    if (translateX < 0) return 0;
    if (translateX > maxTranslateX) return maxTranslateX;
    return translateX;
  }, [translateX, maxTranslateX]);

  const scrollLeft = useCallback(() => {
    console.log('currentTranslateX', currentTranslateX);
    console.log('maxTranslateX', maxTranslateX);
    setTranslateX(prev => Math.max(0, prev - 250));
  }, []);

  const scrollRight = useCallback(() => {
    console.log('currentTranslateX', currentTranslateX);
    console.log('maxTranslateX', maxTranslateX);
    setTranslateX(prev => Math.min(maxTranslateX, prev + 250));
  }, [maxTranslateX]);

  return (
    <div className="relative">
      {currentTranslateX > 0 && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10
           bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all duration-200"
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
        {stories.map(story => (
          <StoryItem key={story._id} story={story} />
        ))}
      </div>

      {currentTranslateX < maxTranslateX && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white 
          rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all duration-200"
        >
          <TbChevronRight size={20} className="text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default StoryShow;
