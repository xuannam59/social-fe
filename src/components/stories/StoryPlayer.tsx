import { convertUrlString } from '@social/common/convert';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import React, { useCallback, useMemo } from 'react';
import ProgressBar from '../common/ProgressBar';
import { TbPlayerPlayFilled, TbPlayerPauseFilled } from 'react-icons/tb';
import { Button, Typography } from 'antd';
import AvatarUser from '../common/AvatarUser';
import {
  doNextStory,
  doPauseStory,
} from '@social/redux/reducers/story.reducer';
import LoadingStoryPlayer from '../loading/LoadingStoryPlayer';
import { formatRelativeTime } from '@social/common/convert';

const { Text } = Typography;

interface IProps {
  isLoading: boolean;
  navigationState: {
    canGoPrev: boolean;
    canGoNext: boolean;
  };
}

const StoryPlayer: React.FC<IProps> = ({ isLoading, navigationState }) => {
  const { currentStory, currentUserStory } = useAppSelector(
    state => state.story
  );
  const paused = useAppSelector(state => state.story.paused);
  const dispatch = useAppDispatch();
  const currentIndex = useMemo(() => {
    return currentUserStory.stories.findIndex(s => s._id === currentStory._id);
  }, [currentUserStory.stories, currentStory._id]);

  const timeStory = useMemo(() => {
    return formatRelativeTime(currentStory.createdAt);
  }, [currentStory.createdAt]);

  const renderContent = useCallback(() => {
    switch (currentStory.type) {
      case 'image':
        return (
          <img
            src={convertUrlString(currentStory.media.keyS3)}
            alt="story"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        );
      case 'video':
        return (
          <video
            src={convertUrlString(currentStory.media.keyS3)}
            className="w-full h-full object-contain"
          />
        );
      case 'text':
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: currentStory.backgroundColor }}
          >
            {currentStory.content}
          </div>
        );
      default:
        return null;
    }
  }, [currentStory]);

  const storyStatuses = useMemo(() => {
    return currentUserStory.stories.map((_, index) => {
      if (index < currentIndex) {
        return 'completed';
      } else if (index === currentIndex) {
        return 'current';
      } else {
        return 'upcoming';
      }
    });
  }, [currentIndex, currentUserStory.stories.length]);

  const getStoryStatus = useCallback(
    (index: number) => {
      return storyStatuses[index] || 'upcoming';
    },
    [storyStatuses]
  );

  const handleStoryComplete = useCallback(() => {
    if (navigationState.canGoNext) {
      dispatch(doNextStory());
    } else {
      dispatch(doPauseStory(true));
    }
  }, [dispatch, navigationState.canGoNext]);

  const handleTogglePause = useCallback(() => {
    dispatch(doPauseStory(!paused));
  }, [dispatch, paused]);

  const userInfo = useMemo(
    () => ({
      avatar: currentUserStory.avatar,
      fullName: currentUserStory.fullname,
    }),
    [currentUserStory.avatar, currentUserStory.fullname]
  );

  return (
    <div className="absolute inset-0 bg-[#222429] my-5 rounded-lg overflow-hidden">
      {isLoading ? (
        <LoadingStoryPlayer />
      ) : (
        <>
          <div className="absolute inset-0 m-3 h-fit">
            <div className="flex items-center gap-2 h-1">
              {currentUserStory.stories.map((story, index) => (
                <ProgressBar
                  key={story._id}
                  duration={story.duration * 1000}
                  paused={paused}
                  onComplete={handleStoryComplete}
                  status={getStoryStatus(index)}
                />
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-start gap-2">
                <AvatarUser avatar={userInfo.avatar} size={40} />
                <div className="flex items-center gap-2">
                  <Text className="!text-[16px] !font-medium !text-white">
                    {userInfo.fullName}
                  </Text>
                  <div className="text-sm text-white">{timeStory}</div>
                </div>
              </div>
              <Button
                type="text"
                shape="circle"
                onClick={handleTogglePause}
                className="hover:bg-white/10"
                aria-label={paused ? 'Phát story' : 'Tạm dừng story'}
              >
                {paused ? (
                  <TbPlayerPlayFilled size={20} className="text-white" />
                ) : (
                  <TbPlayerPauseFilled size={20} className="text-white" />
                )}
              </Button>
            </div>
          </div>
          {renderContent()}
        </>
      )}
    </div>
  );
};

export default StoryPlayer;
