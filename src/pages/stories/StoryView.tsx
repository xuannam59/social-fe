import StoryPlayer from '@social/components/stories/StoryPlayer';
import StoryUserItem from '@social/components/stories/StoryUserItem';
import { ROUTES } from '@social/constants/route.constant';
import defaultAvatar from '@social/images/default-avatar.webp';
import { Typography } from 'antd';
import { useMemo } from 'react';
import { TbChevronLeft, TbChevronRight, TbPlus } from 'react-icons/tb';
import { Link, useParams } from 'react-router-dom';

const { Title } = Typography;

const StoryView = () => {
  const { id } = useParams();

  const userStories: any[] = useMemo(
    () => [
      {
        user_id: '1123123',
        fullName: 'Nguyễn Văn A',
        avatar: defaultAvatar,
        stories: [
          {
            _id: '23',
            type: 'image',
            file: defaultAvatar,
            fullName: 'Nguyễn Văn A',
          },
          {
            _id: '2123123',
            type: 'image',
            file: 'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            fullName: 'Nguyễn Văn B',
            avatar: defaultAvatar,
          },
          {
            _id: '3123123',
            type: 'image',
            file: 'https://i.pinimg.com/1200x/e6/34/d3/e634d384fb0c31d7245d70d6f70f830d.jpg',
            fullName: 'Nguyễn Văn B',
            avatar: defaultAvatar,
          },
        ],
      },
      {
        user_id: '217456',
        fullName: 'Nguyễn Văn B',
        avatar: defaultAvatar,
        stories: [
          {
            _id: '3123123',
            type: 'image',
            file: defaultAvatar,
            fullName: 'Nguyễn Văn A',
          },
        ],
      },
      {
        user_id: '3345',
        fullName: 'Nguyễn Văn C',
        avatar: defaultAvatar,
        stories: [
          {
            _id: '4123123',
            type: 'image',
            file: defaultAvatar,
            fullName: 'Nguyễn Văn A',
          },
        ],
      },
    ],
    []
  );

  return (
    <>
      <div className="w-[360px] bg-white shadow-md relative flex-shrink-0 hidden lg:block">
        <div className="w-full h-14"></div>
        <div className="flex flex-col overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <div className="flex justify-between my-3 mx-4">
            <Title level={3} className="!mb-0">
              Tin
            </Title>
          </div>
          <div className="flex items-center px-4 pb-5">
            <Link
              to={ROUTES.PROFILE}
              className="text-[#0064d1] hover:underline text-[15px]"
            >
              Kho lưu trứ
            </Link>
          </div>
          <div className="px-4 mb-2">
            <Title level={5}>Tin của bạn</Title>
          </div>
          <Link to={ROUTES.STORY.CREATE} className="cursor-pointer">
            <div className="px-3 py-2 m-1 flex gap-2 items-center">
              <div className="w-15 h-15 bg-gray-100 rounded-full">
                <div className="flex items-center justify-center h-full w-full">
                  <TbPlus size={20} className="text-sky-700" />
                </div>
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <span className="text-[16px] font-semibold">Tạo tin</span>
                <span className="text-xs text-gray-500">
                  Bạn có thể chia sẻ ảnh hoặc bài viết gì đó.
                </span>
              </div>
            </div>
          </Link>
          <div className="pt-5">
            <div className="px-4">
              <Title level={5}>Tất cả tin</Title>
            </div>
            <div className="flex flex-col px-2">
              {userStories.map(userStory => (
                <StoryUserItem key={userStory.user_id} userStory={userStory} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 h-screen bg-black">
        <div className="flex flex-col h-full items-center">
          <div className="flex h-[calc(100%-3.5rem)] w-full items-center">
            <div
              className="h-full w-[50%] relative group/left cursor-pointer"
              onClick={() => {
                console.log('left');
              }}
            >
              <div className="absolute right-10 top-1/2 group-hover/left:right-12 duration-300 transition-all">
                <div className="w-12 h-12 bg-gray-400 rounded-full group-hover/left:bg-white duration-300 transition-all">
                  <div className="flex items-center justify-center h-full w-full">
                    <TbChevronLeft size={28} className="text-black/50" />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full aspect-[5/9] w-auto relative">
              <StoryPlayer />
            </div>
            <div
              className="h-full w-[50%] relative group/right cursor-pointer"
              onClick={() => {
                console.log('right');
              }}
            >
              <div className="absolute left-10 top-1/2 group-hover/right:left-12 duration-300 transition-all">
                <div className="w-12 h-12 bg-gray-400 rounded-full group-hover/right:bg-white duration-300 transition-all">
                  <div className="flex items-center justify-center h-full w-full">
                    <TbChevronRight size={28} className="text-black/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute h-12 w-[690px] top-1/2 left-1/2 -translate-x-1/2">
              <div className="flex justify-center items-center h-full w-full bg-red-500">
                <div className="text-white">x</div>
                <div className="text-white">y</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryView;
