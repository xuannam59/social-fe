import AvatarUser from '@social/components/common/AvatarUser';
import { TbCameraFilled, TbMessageCircle, TbUserPlus } from 'react-icons/tb';
import { Button, message, Tabs, Typography } from 'antd';
import CreatePost from '@social/components/posts/CreatePost';
import { useCallback, useEffect, useState } from 'react';
import { callApiGetPost } from '@social/apis/posts.api';
import type { IPost } from '@social/types/posts.type';
import PostList from '@social/components/posts/PostList';
import { useAppSelector } from '@social/hooks/redux.hook';
import { useNavigate, useParams } from 'react-router-dom';
import type { IUser } from '@social/types/user.type';
import { USER_DEFAULT } from '@social/defaults/user.default';
import { callApiGetUserInfo } from '@social/apis/user.api';
import { ROUTES } from '@social/constants/route.constant';

const { Text, Paragraph } = Typography;

const ProfilePage = () => {
  const { userId } = useParams();
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [friendInfo, setFriendInfo] = useState<IUser>(USER_DEFAULT);
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fetchUserPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await callApiGetPost(`user=${userId}`);
      if (res.data) {
        setUserPosts(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const items = [
    {
      key: 'posts',
      label: <span className="text-base font-semibold">Bài viết</span>,
    },
    {
      key: 'about',
      label: <span className="text-base font-semibold">Giới thiệu</span>,
    },
    {
      key: 'friends',
      label: <span className="text-base font-semibold">Bạn bè</span>,
    },
  ];

  const fetchUserInfo = useCallback(async () => {
    try {
      if (!userId) return;
      const res = await callApiGetUserInfo(userId);
      if (res.data) {
        setFriendInfo(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      message.error('Không tìm thấy người dùng');
      navigate(ROUTES.DEFAULT);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserPosts();
    if (userId !== userInfo._id) {
      fetchUserInfo();
    } else {
      setFriendInfo(userInfo);
    }
  }, [fetchUserPosts]);

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="mx-3">
          <div className="flex justify-center">
            <div className="w-full max-w-6xl h-80 bg-gradient-to-b from-gray-200 to-gray-400 rounded-b-lg relative">
              {friendInfo.cover && (
                <img
                  src={friendInfo.cover}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-2 right-8">
                <button className="bg-white flex items-center gap-1 p-1.5 rounded-md cursor-pointer hover:bg-gray-100">
                  <TbCameraFilled size={20} />
                  <span className="text-base font-semibold hidden md:block">
                    Thêm ảnh bìa
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-6xl pb-4 px-4">
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="bottom-0 left-0 md:absolute relative -mt-[84px] md:mt-0">
                  <AvatarUser
                    avatar={friendInfo.avatar}
                    size={174}
                    className="!border-4 !border-white"
                  />
                  <Button
                    type="text"
                    shape="circle"
                    size={'middle'}
                    className="!absolute bottom-2 right-2 !bg-gray-200 !shadow-md"
                  >
                    <TbCameraFilled size={24} />
                  </Button>
                </div>
                <div className="w-[174px] hidden md:block shrink-0"></div>

                <div className="md:mt-8 md:mb-4 mb-2 flex-1 ml-2 shrink-0">
                  <span className="font-bold text-h1 text-center !mb-0 block-inline">
                    {friendInfo.fullname || 'Tên người dùng'}
                  </span>
                  <div className="flex gap-2 items-center shrink-0">
                    <Text className="text-gray-600 !text-base">
                      {friendInfo?.followers?.length || 0} người theo dõi
                    </Text>
                    <span className="text-gray-600 !text-base">•</span>
                    <Paragraph className="text-gray-600 !text-base !mb-0">
                      {friendInfo?.following?.length || 0} đang theo dõi
                    </Paragraph>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 flex-1 justify-end">
                  {/* <ButtonGradient className="px-4">Chỉnh sửa</ButtonGradient> */}
                  <Button>
                    <TbUserPlus size={20} />
                    Kết bạn
                  </Button>
                  <Button>
                    <TbMessageCircle size={20} />
                    Nhắn tin
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="flex gap-2 overflow-x-auto w-full max-w-6xl border-t border-gray-300">
              <Tabs
                defaultActiveKey="1"
                items={items}
                onChange={onChange}
                tabBarStyle={{ margin: 0 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="w-full flex justify-center pb-3">
        <div className="lg:max-w-6xl w-full max-w-2xl mx-4 mt-4">
          <div className="flex flex-col lg:flex-row gap-5 items-center lg:items-start">
            <div className="w-full lg:w-3/7">
              <div className="bg-white rounded-lg shadow p-4">
                <span className="text-lg font-bold">Giới thiệu</span>
              </div>
            </div>
            <div className="w-full lg:w-4/7 shrink-0">
              <div className="flex flex-col gap-3">
                {userId === userInfo._id && <CreatePost />}

                <PostList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
