import { useEffect, useMemo } from 'react';
import CreatePost from '../posts/CreatePost';
import StoryPreviewList from '../stories/StoryPreviewList';
import { useAppDispatch } from '@social/hooks/redux.hook';
import { setUserStories } from '@social/redux/reducers/story.reducer';
import PostItem from '../posts/PostItem';
import type { IPost } from '@social/types/posts.type';

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

  const posts: IPost[] = useMemo(() => {
    return [
      {
        _id: '1',
        content: `Trong ảnh là sông Tô lịch hiện tại!
“Hà Nội sau cơn mưa lớn kéo dài từ hôm qua 25/08 đến tận sáng nay 26/08, rất nhiều tuyến phố, tuyến đường rơi vào cảnh ngập nặng. Giao thông ùn tắc tê liệt. 
Nước sông Tô Lịch dâng cao kỷ lục. Dự báo mưa lớn sẽ còn tiếp tục trong vài giờ tới và chưa có dấu hiệu ngừng. Các bác chú ý lộ trình di chuyển. Lắng nghe các kênh giao thông để có phương án hợp lý”
Cập nhật của bác Dũng Sky trong Chuyện của Hà Nội group.`,
        privacy: 'public',
        medias: [],
        userTags: [],
        likeCount: 10,
        commentCount: 10,
        createdAt: '2025-08-26T00:54:31.298+00:00',
        updatedAt: '2025-08-26T00:54:31.298+00:00',
        userId: '1',
        userInfo: {
          _id: '1',
          fullname: 'Chuyện của Hà Nội',
          avatar:
            'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
        },
      },
    ];
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col justify-start items-center gap-2">
        <CreatePost />
        <div className="overflow-hidden h-[200px] w-full">
          <StoryPreviewList />
        </div>
        <div className="flex flex-col gap-2 w-full">
          {posts.map(post => (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CenterContent;
