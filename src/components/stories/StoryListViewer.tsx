import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { doPauseStory } from '@social/redux/reducers/story.reducer';
import { TbChevronUp } from 'react-icons/tb';
import { TbX } from 'react-icons/tb';
import { callApiGetViewers } from '@social/apis/stories.api';
import type { IStoryViewer } from '@social/types/stories.type';
import Loading from '../loading/Loading';
import EmptyState from '../common/EmptyState';
import AvatarUser from '../common/AvatarUser';
import { emojiReactions } from '@social/constants/emoji';
import { Link } from 'react-router-dom';

const StoryListViewer = () => {
  const { currentStory } = useAppSelector(state => state.story);
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const [showViewers, setShowViewers] = useState(false);
  const [totalViewers, setTotalViewers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const isMyStory = useMemo(() => {
    return currentStory.authorId === userInfo._id;
  }, [currentStory, userInfo]);

  const [viewers, setViewers] = useState<IStoryViewer[]>([]);

  const fetchViewers = useCallback(async () => {
    if (!currentStory._id || !showViewers) return;
    setIsLoading(true);
    try {
      const res = await callApiGetViewers(currentStory._id);
      if (res.data) {
        setViewers(res.data.list);
        setTotalViewers(res.data.meta.total);
      }
    } catch (error) {
      console.error('Failed to fetch viewers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentStory._id, showViewers]);

  useEffect(() => {
    if (currentStory._id) {
      fetchViewers();
    }
  }, [currentStory._id, fetchViewers]);

  return (
    <>
      {isMyStory && (
        <div className="absolute bottom-6 left-0">
          <div
            className="p-2 cursor-pointer rounded-full hover:translate-y-[-5px] transition-all duration-300 ml-2"
            onClick={() => {
              setShowViewers(true);
              dispatch(doPauseStory(true));
            }}
          >
            <div className="flex items-center gap-0.5">
              <span className="text-white text-base font-semibold ">
                Xem thông tin
              </span>
              <TbChevronUp size={20} className="text-white" />
            </div>
          </div>
        </div>
      )}
      {isMyStory && (
        <div
          className={`absolute bottom-5 left-0 right-0 transition-all duration-300 ease-in-out
            ${showViewers ? 'h-1/2 opacity-100' : 'h-0 opacity-0'}
            `}
        >
          <div className="h-full bg-white rounded-t-2xl shadow-lg p-4 overflow-auto">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-black text-base font-semibold">
                {totalViewers} người xem
              </span>
              <div
                onClick={() => {
                  setShowViewers(false);
                  dispatch(doPauseStory(false));
                }}
                className="size-8 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer"
              >
                <TbX />
              </div>
            </div>
            {isLoading ? (
              <Loading />
            ) : viewers.length === 0 ? (
              <div className="max-h-full w-full">
                <EmptyState />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {viewers.map(viewer => (
                  <div
                    key={viewer._id}
                    className="flex items-center justify-between hover:bg-gray-100 rounded-lg p-2"
                  >
                    <Link to={`/${viewer.userId._id}`}>
                      <div className="flex items-center gap-2">
                        <AvatarUser avatar={viewer.userId.avatar} size={45} />
                        <span className="text-base font-semibold">
                          {viewer.userId.fullname}
                        </span>
                      </div>
                    </Link>
                    <div className="text-[20px]">
                      {
                        emojiReactions.find(e => e.value === viewer.likedType)
                          ?.emoji
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StoryListViewer;
