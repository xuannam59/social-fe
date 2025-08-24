import { useEffect, useMemo } from 'react';
import CreatePost from '../posts/CreatePost';
import StoryPreviewList from '../stories/StoryPreviewList';
import { useAppDispatch } from '@social/hooks/redux.hook';
import { setUserStories } from '@social/redux/reducers/story.reducer';

const CenterContent = () => {
  const userStories: any[] = useMemo(
    () => [
      {
        user_id: '1',
        fullName: 'Nguyễn Văn A',
        avatar:
          'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
        stories: [
          {
            _id: '1',
            type: 'image',
            file: 'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            fullName: 'Nguyễn Văn A',
          },
          {
            _id: '2',
            type: 'image',
            file: 'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            fullName: 'Nguyễn Văn B',
            avatar:
              'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
          },
        ],
      },
      {
        user_id: '2',
        fullName: 'Nguyễn Văn B',
        avatar:
          'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
        stories: [
          {
            _id: '3',
            type: 'image',
            file: 'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            fullName: 'Nguyễn Văn A',
          },
        ],
      },
      {
        user_id: '3',
        fullName: 'Nguyễn Văn C',
        avatar:
          'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
        stories: [
          {
            _id: '4',
            type: 'image',
            file: 'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            fullName: 'Nguyễn Văn A',
          },
        ],
      },
    ],
    []
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setUserStories(userStories));
  }, [dispatch, userStories]);

  return (
    <>
      <div className="flex flex-1 flex-col justify-start items-center gap-2">
        <CreatePost />
        <div className="overflow-hidden h-[200px] w-full">
          <StoryPreviewList />
        </div>
      </div>
    </>
  );
};

export default CenterContent;
