import { useRef } from 'react';
import CreatePost from '../posts/CreatePost';
import PostList from '../posts/PostList';
import StoryPreviewList from '../stories/StoryPreviewList';

const CenterContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-1 flex-col justify-start items-center gap-2"
      >
        <CreatePost />
        <div className="overflow-hidden h-[200px] w-full">
          <StoryPreviewList />
        </div>
        <PostList />
      </div>
    </>
  );
};

export default CenterContent;
