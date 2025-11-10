import { callApiDeleteStory } from '@social/apis/stories.api';
import { convertUrlString, formatRelativeTime } from '@social/common/convert';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import {
  doNextStory,
  doPauseStory,
  doDeleteStory,
} from '@social/redux/reducers/story.reducer';
import { Button, Dropdown, message, Modal } from 'antd';
import React, { useCallback, useMemo } from 'react';
import {
  TbDotsVertical,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbTrash,
} from 'react-icons/tb';
import AvatarUser from '../common/AvatarUser';
import ProgressBar from '../common/ProgressBar';
import LoadingStoryPlayer from '../loading/LoadingStoryPlayer';

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
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const paused = useAppSelector(state => state.story.paused);
  const dispatch = useAppDispatch();
  const currentIndex = useMemo(() => {
    return currentUserStory.stories.findIndex(s => s._id === currentStory._id);
  }, [currentUserStory.stories, currentStory._id]);

  const timeStory = useMemo(() => {
    return formatRelativeTime(currentStory.createdAt);
  }, [currentStory.createdAt]);

  const isMyStory = useMemo(() => {
    return currentStory.authorId === userInfo._id;
  }, [currentStory, userInfo]);

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
  }, [currentIndex, currentUserStory.stories]);

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

  const authorInfo = useMemo(
    () => ({
      avatar: currentUserStory.avatar,
      fullName: currentUserStory.fullname,
    }),
    [currentUserStory.avatar, currentUserStory.fullname]
  );

  const handelDeleteStory = useCallback(async () => {
    Modal.confirm({
      title: 'Xoá story',
      centered: true,
      content: (
        <span className="text-base text-gray-500">
          Bạn có chắc chắn muốn xoá story này không?
        </span>
      ),
      onOk: async () => {
        try {
          const res = await callApiDeleteStory(currentStory._id);
          if (res.data) {
            console.log(res.data);
            message.success('Xoá story thành công');
            dispatch(doDeleteStory());
          } else {
            message.error('Xoá story thất bại');
          }
        } catch (error) {
          console.log(error);
        }
      },
      okText: 'Xoá',
      cancelText: 'Hủy',
    });
  }, [dispatch, currentStory._id]);

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
                <div className="shrink-0">
                  <AvatarUser avatar={authorInfo.avatar} size={40} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium text-white line-clamp-1">
                    {authorInfo.fullName}
                  </span>
                  <span className="text-sm text-white line-clamp-1">
                    {timeStory}
                  </span>
                </div>
              </div>
              <div className="flex item-center gap-0.5">
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
                {isMyStory && (
                  <Dropdown
                    trigger={['click']}
                    placement="bottomRight"
                    arrow={true}
                    onOpenChange={open => {
                      dispatch(doPauseStory(open));
                    }}
                    menu={{
                      items: [
                        {
                          label: (
                            <div className="flex items-center gap-2">
                              <TbTrash size={20} className="text-red-500" />
                              <span className="text-base text-red-500">
                                Xoá story
                              </span>
                            </div>
                          ),
                          key: 'delete',
                          onClick: handelDeleteStory,
                        },
                      ],
                    }}
                  >
                    <Button type="text" shape="circle">
                      <TbDotsVertical size={20} className="text-white" />
                    </Button>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
          {renderContent()}
        </>
      )}
    </div>
  );
};

export default StoryPlayer;
