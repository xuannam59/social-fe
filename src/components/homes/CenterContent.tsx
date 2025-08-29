import { useEffect, useMemo, useState } from 'react';
import CreatePost from '../posts/CreatePost';
import StoryPreviewList from '../stories/StoryPreviewList';
import { useAppDispatch } from '@social/hooks/redux.hook';
import { setUserStories } from '@social/redux/reducers/story.reducer';
import PostItem from '../posts/PostItem';
import type { IPost } from '@social/types/posts.type';
import ModalViewPost from '../modals/posts/ModalViewPost';
import { v4 as uuidv4 } from 'uuid';

const CenterContent = () => {
  const [openModalViewPost, setOpenModalViewPost] = useState(false);
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
        _id: uuidv4(),
        content: `Trong ảnh là sông Tô lịch hiện tại!
“Hà Nội sau cơn mưa lớn kéo dài từ hôm qua 25/08 đến tận sáng nay 26/08, rất nhiều tuyến phố, tuyến đường rơi vào cảnh ngập nặng. Giao thông ùn tắc tê liệt. 
Nước sông Tô Lịch dâng cao kỷ lục. Dự báo mưa lớn sẽ còn tiếp tục trong vài giờ tới và chưa có dấu hiệu ngừng. Các bác chú ý lộ trình di chuyển. Lắng nghe các kênh giao thông để có phương án hợp lý”
Cập nhật của bác Dũng Sky trong Chuyện của Hà Nội group.`,
        privacy: 'public',
        medias: [
          {
            keyS3:
              'images/689c61814640f1e607dbb9a1/2025/08/b8a761b5-31fa-462c-bf53-6db7219e99f8.png',
            type: 'image',
          },
          {
            keyS3:
              'images/689c61814640f1e607dbb9a1/2025/08/c838c9c7-deda-4bb1-b4a0-510ccd67328b.webp',
            type: 'image',
          },
          {
            keyS3:
              'images/689c61814640f1e607dbb9a1/2025/08/5ee0754a-e9ea-42e9-9cac-c3e196822ded.png',
            type: 'image',
          },
          {
            keyS3:
              'images/689c61814640f1e607dbb9a1/2025/08/3987f526-6b65-4351-ab3b-4347aa62024a.png',
            type: 'image',
          },
          {
            keyS3:
              'images/689c61814640f1e607dbb9a1/2025/08/ba1b11f3-692d-4e45-899d-1e3b686ee497.png',
            type: 'image',
          },

          {
            keyS3:
              'images/689c61814640f1e607dbb9a1/2025/08/a5db4462-d834-440f-8be0-572ac972e84d.jpeg',
            type: 'image',
          },
          {
            keyS3:
              'images/689c61814640f1e607dbb9a1/2025/08/a5db4462-d834-440f-8be0-572ac972e84d.jpeg',
            type: 'image',
          },
          {
            keyS3:
              'images/689c61814640f1e607dbb9a1/2025/08/a5db4462-d834-440f-8be0-572ac972e84d.jpeg',
            type: 'image',
          },
        ],
        userTags: [],
        likeCount: 10,
        commentCount: 10000,
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
            <>
              <div key={post._id}>
                <div className="w-full h-fit bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
                  <PostItem
                    post={post}
                    onClickComment={() => {
                      setOpenModalViewPost(true);
                    }}
                  />
                </div>
                <ModalViewPost
                  post={post}
                  open={openModalViewPost}
                  onClose={() => setOpenModalViewPost(false)}
                />
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default CenterContent;
