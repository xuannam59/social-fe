import type React from 'react';
import AvatarUser from '../common/AvatarUser';
import type { IUserStory } from '@social/types/stories.type';
import { useMemo } from 'react';
import { useAppSelector } from '@social/hooks/redux.hook';
import { Skeleton } from 'antd';
import { formatRelativeTime } from '@social/common/convert';
import dayjs from 'dayjs';

interface IProps {
  userStory: IUserStory;
  isLoading: boolean;
}

const StoryUserItem: React.FC<IProps> = ({ userStory, isLoading }) => {
  const { currentUserStory } = useAppSelector(state => state.story);
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const isViewed = useMemo(() => {
    return userStory._id === currentUserStory._id;
  }, [currentUserStory._id, userStory._id]);
  console.log(currentUserStory);
  console.log(userStory);

  const isMyStory = useMemo(() => {
    return userStory._id === userInfo._id;
  }, [userStory._id, userInfo._id]);

  const timeNewStory = useMemo(() => {
    return formatRelativeTime(
      dayjs(userStory.endStoryAt).subtract(24, 'hour').toISOString()
    );
  }, [userStory.endStoryAt]);
  return (
    <>
      {isLoading ? (
        <div className="flex gap-2 items-start p-2 cursor-pointer rounded-lg">
          <div className="w-15 h-15 bg-gray-100 rounded-full">
            <div className="flex items-center justify-center h-full w-full">
              <Skeleton.Avatar active size={55} />
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-1">
            <Skeleton.Input active />
          </div>
        </div>
      ) : (
        <div
          className={`flex gap-2 items-center p-2 cursor-pointer hover:bg-gray-300 rounded-2xl ${isViewed ? 'bg-gray-200' : ''}`}
        >
          <div
            className={`w-15 h-15 bg-gray-100 rounded-full
              ${isViewed ? 'border-gray-400 border-1' : 'border-blue-light border-2'}`}
          >
            <div className="flex items-center justify-center h-full w-full">
              <AvatarUser avatar={userStory.avatar} size={55} />
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-1">
            <span className="text-[16px] font-semibold">
              {userStory.fullname}
            </span>

            <div className="flex gap-1 items-center">
              {!isMyStory && (
                <>
                  <span className="text-base text-blue-light">
                    {userStory.stories.length} thẻ mới
                  </span>
                  <span> · </span>
                </>
              )}
              <span className="text-base text-gray-500">{timeNewStory}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryUserItem;
