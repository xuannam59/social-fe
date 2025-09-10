import type { IUserStory } from '@social/types/stories.type';
import { Typography } from 'antd';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import AvatarUser from '../common/AvatarUser';
import { convertUrlString } from '@social/common/convert';

interface IProps {
  userStory: IUserStory;
}

const { Paragraph } = Typography;

const StoryPreviewItem: React.FC<IProps> = ({ userStory }) => {
  const story = userStory.stories[0];

  const renderContent = useCallback(() => {
    switch (story.type) {
      case 'image':
        return (<>
          <img
            src={convertUrlString(story.media.keyS3)}
            alt="story"
            className="w-full h-full object-cover group-hover/story:scale-105 transition-all duration-300"
            style={{
              backgroundColor: story.backgroundColor,
            }}
          />
        </>); 
      case 'video':
        console.log(story);
        return (<>
          <video
            src={convertUrlString(story.media.keyS3)}
            preload="none"
            className="w-full h-full object-contain object-center group-hover/story:scale-105 transition-all duration-300"
            style={{
              backgroundColor: story.backgroundColor,
            }}
          />
        </>);
      case 'text':
        return (<>
        <div className="w-full h-full flex items-center justify-center" 
          style={{
            backgroundColor: story.backgroundColor,
          }}
        >
          <div className="text-[8px] font-normal text-center">
            {story.content}
          </div>
        </div>
        </>);
    }
  }, [story])

  return (
    <>
      <Link to={`/story/${story._id}`}>
        <div
          className="w-[125px] h-[200px] rounded-lg overflow-hidden border 
        border-gray-200 shadow-md group/story cursor-pointer flex-shrink-0"
        >
          <div className="flex flex-col h-full relative">
            <div
              className={`w-full border-b border-gray-200 relative bg-black h-[100%]`}
            >
              {renderContent()}
              <div className="absolute top-2 left-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <AvatarUser avatar={userStory.avatar} size={34} />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2 p-1">
                <Paragraph
                  className="!text-sm font-normal !m-0 leading-none !text-white"
                  ellipsis={{ rows: 2 }}
                >
                  {userStory.fullName}
                </Paragraph>
              </div>
            </div>
            <div className="absolute top-0 left-0 bottom-0 right-0 hidden group-hover/story:block transition-all z-1 duration-300 bg-black/10" />
          </div>
        </div>
      </Link>
    </>
  );
};

export default StoryPreviewItem;
