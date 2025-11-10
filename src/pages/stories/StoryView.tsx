import { callApiActionView, callApiGetStories } from '@social/apis/stories.api';
import StoryListViewer from '@social/components/stories/StoryListViewer';
import StoryPlayer from '@social/components/stories/StoryPlayer';
import StoryReply from '@social/components/stories/StoryReply';
import StoryUserItem from '@social/components/stories/StoryUserItem';
import { ROUTES } from '@social/constants/route.constant';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import {
  doNextStory,
  doPreviousStory,
  doViewStory,
  fetchStories,
  setCurrentUserStory,
  setListUserStories,
} from '@social/redux/reducers/story.reducer';
import { message, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TbChevronLeft, TbChevronRight, TbPlus } from 'react-icons/tb';
import { Link, useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;

const StoryView = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentStory, listUserStories, currentUserStory } = useAppSelector(
    state => state.story
  );
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useMemo(() => {
    return listUserStories.find(userStory => userStory._id === userId);
  }, [listUserStories, userId]);

  const navigationState = useMemo(() => {
    if (listUserStories.length === 0 || !currentStory._id)
      return { canGoPrev: false, canGoNext: false };
    const firstStory = listUserStories[0].stories[0];
    const lastUserStory = listUserStories[listUserStories.length - 1];
    const lastStory = lastUserStory.stories[lastUserStory.stories.length - 1];

    return {
      canGoPrev: currentStory._id !== firstStory._id,
      canGoNext: currentStory._id !== lastStory._id,
    };
  }, [listUserStories, currentStory._id]);

  const fetchUserStories = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const res = await callApiGetStories(`userId=${userId}`);
      if (res.data) {
        const listStories = res.data.list;
        const exist = listStories.find(us => us._id === userId);
        if (exist) {
          const data = {
            list: listStories,
            total: res.data.meta.total,
            page: res.data.meta.page,
            limit: res.data.meta.limit,
          };
          dispatch(setListUserStories(data));
        } else {
          navigate(ROUTES.DEFAULT);
        }
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, userId, navigate]);

  const handleViewStory = useCallback(async () => {
    if (!currentStory._id) return;
    try {
      const res = await callApiActionView(currentStory._id);
      if (res.data) {
        dispatch(
          doViewStory({ userId: userInfo._id, storyId: currentStory._id })
        );
      }
    } catch (error) {
      console.error('Failed to view story:', error);
    }
  }, [dispatch, currentStory._id, userInfo._id]);

  useEffect(() => {
    if (userId && listUserStories.length === 0) {
      fetchUserStories();
    }
  }, [userId, fetchUserStories, listUserStories.length]);

  useEffect(() => {
    if (currentUser && !currentStory._id) {
      dispatch(setCurrentUserStory(currentUser));
    }
  }, [currentUser, currentStory._id, dispatch, currentUserStory, navigate]);

  useEffect(() => {
    if (currentStory._id && currentStory.authorId !== userInfo._id) {
      handleViewStory();
    }
  }, [currentStory._id, handleViewStory, userInfo._id, currentStory.authorId]);

  const handlePreviousStory = useCallback(() => {
    dispatch(doPreviousStory());
  }, [dispatch]);

  const handleNextStory = useCallback(() => {
    dispatch(doNextStory());
  }, [dispatch]);

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
              to={`/${userId}`}
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
              {listUserStories.map(userStory => (
                <StoryUserItem
                  key={userStory._id}
                  userStory={userStory}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 h-screen bg-black">
        <div className="flex flex-col h-full items-center">
          <div className="flex h-[calc(100%-3.5rem)] w-full items-center">
            <div
              className={`h-full w-[50%] relative group/left ${
                navigationState.canGoPrev ? 'cursor-pointer' : 'opacity-50'
              }`}
              onClick={
                navigationState.canGoPrev && !isLoading
                  ? handlePreviousStory
                  : undefined
              }
            >
              <div
                className={`absolute right-10 top-1/2 duration-300 transition-all
                  ${navigationState.canGoPrev ? 'group-hover/left:right-12' : ''}`}
              >
                <div
                  className={`w-12 h-12 bg-gray-400 rounded-full duration-300 transition-all 
                    ${navigationState.canGoPrev ? 'group-hover/left:bg-white' : ''}`}
                >
                  <div className="flex items-center justify-center h-full w-full">
                    <TbChevronLeft size={28} className="text-black/50" />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full aspect-[5/9] w-auto relative">
              <StoryPlayer
                isLoading={isLoading}
                navigationState={navigationState}
              />
              <StoryListViewer />
            </div>
            <div
              className={`h-full w-[50%] relative group/right ${
                navigationState.canGoNext ? 'cursor-pointer' : 'opacity-50'
              }`}
              onClick={
                navigationState.canGoNext && !isLoading
                  ? handleNextStory
                  : undefined
              }
            >
              <div
                className={`absolute left-10 top-1/2 duration-300 transition-all
                  ${navigationState.canGoNext ? 'group-hover/right:left-12' : ''}`}
              >
                <div
                  className={`w-12 h-12 bg-gray-400 rounded-full duration-300 transition-all 
                    ${navigationState.canGoNext ? 'group-hover/right:bg-white' : ''}`}
                >
                  <div className="flex items-center justify-center h-full w-full">
                    <TbChevronRight size={28} className="text-black/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <StoryReply />
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryView;
