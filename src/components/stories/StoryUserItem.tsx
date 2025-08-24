import type React from 'react';
import AvatarUser from '../common/AvatarUser';
import type { IUserStory } from '@social/types/stories.type';

interface IProps {
  userStory: IUserStory;
}

const StoryUserItem: React.FC<IProps> = ({ userStory }) => {
  return (
    <>
      <div className="flex gap-2 items-center p-2 cursor-pointer hover:bg-gray-200 rounded-lg">
        <div className="w-15 h-15 bg-gray-100 rounded-full border-3 border-blue-light">
          <div className="flex items-center justify-center h-full w-full">
            <AvatarUser avatar={userStory.avatar} size={50} />
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-1">
          <span className="text-[16px] font-semibold">
            {userStory.fullName}
          </span>
          <div className="flex gap-1 items-center">
            <span className="text-base text-blue-light">
              {userStory.stories.length} thẻ mới
            </span>
            <span> · </span>
            <span className="text-base text-gray-500">thời gian</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryUserItem;
