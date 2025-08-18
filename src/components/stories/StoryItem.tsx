import { Typography } from 'antd';
import React from 'react';
import { TbPlus } from 'react-icons/tb';
import AvatarUser from '../common/AvatarUser';
import { Link } from 'react-router-dom';
import type { IStory } from '@social/types/stories.type';

interface IProps {
  story: IStory;
  isFirst: boolean;
}

const { Paragraph } = Typography;

const StoryItem: React.FC<IProps> = ({ story, isFirst = false }) => {
  return (
    <>
      <Link to={`/story/${isFirst ? 'create' : story._id}`}>
        <div
          className="w-[125px] h-[200px] rounded-lg overflow-hidden border 
        border-gray-200 shadow-md group/story cursor-pointer flex-shrink-0"
        >
          <div className="flex flex-col h-full relative">
            <div
              className={`w-full border-b border-gray-200 relative bg-black ${
                isFirst ? 'h-[75%]' : 'h-[100%]'
              }`}
            >
              {story.type === 'image' && (
                <img
                  src={story.file}
                  alt="story"
                  className="w-full h-full object-cover group-hover/story:scale-105 transition-all duration-300"
                />
              )}
              {story.type === 'video' && (
                <video
                  src={story.file}
                  preload="none"
                  className="w-full h-full object-contain object-center group-hover/story:scale-105 transition-all duration-300"
                />
              )}
              {!isFirst && (
                <>
                  <div className="absolute top-2 left-2">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <AvatarUser avatar={story.avatar} size={34} />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 p-1">
                    <Paragraph
                      className="!text-sm font-normal !m-0 leading-none !text-white"
                      ellipsis={{ rows: 2 }}
                    >
                      {story.fullName}
                    </Paragraph>
                  </div>
                </>
              )}
            </div>
            <div className="absolute top-0 left-0 bottom-0 right-0 hidden group-hover/story:block transition-all z-1 duration-300 bg-black/10" />
            {isFirst && (
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
            )}
          </div>
        </div>
      </Link>
    </>
  );
};

export default StoryItem;
