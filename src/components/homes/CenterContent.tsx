import CreatePost from '../posts/CreatePost';
import StoryShow from '../stories/StoryShow';

const CenterContent = () => {
  return (
    <>
      <div className="flex flex-1 flex-col justify-start items-center gap-2">
        <CreatePost />
        <div className="overflow-hidden h-[200px] w-full">
          <StoryShow />
        </div>
      </div>
    </>
  );
};

export default CenterContent;
