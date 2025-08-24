import { useAppSelector } from '@social/hooks/redux.hook';
import type { IStory, IUserStory } from '@social/types/stories.type';

interface IProps {}

const StoryPlayer: React.FC<IProps> = () => {
  const { currentStory, userStories } = useAppSelector(state => state.story);

  return (
    <>
      <div className="absolute inset-0 bg-[#222429] my-3 rounded-lg">
        <div className="absolute inset-0 m-3 h-1 ">
          <div className="flex items-center gap-2 h-full">
            {currentStory.stories.map((story: IStory, index: number) => {
              const currentIndex = index;

              return (
                <>
                  <div
                    key={story._id}
                    className="flex-1 h-full bg-white/30 rounded-full overflow-hidden relative"
                  >
                    <div
                      className={`absolute top-0 left-0 bottom-0 bg-white w-[5%] transition-all duration-300`}
                    />
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <img
          src="https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg"
          alt="story"
          className="w-full h-full object-contain"
        />
      </div>
    </>
  );
};

export default StoryPlayer;
