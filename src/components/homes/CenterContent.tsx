import CreatePost from '../posts/CreatePost';
import StoryPreviewList from '../stories/StoryPreviewList';
import PostList from '../posts/PostList';
import { fetchPosts, restorePosts } from '@social/redux/reducers/post.reducer';
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';

const CenterContent = () => {
  const listPosts = useAppSelector(state => state.post.listPosts);
  const tempPosts = useAppSelector(state => state.post.tempPosts);
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Nếu có tempPosts (từ trang cá nhân), khôi phục lại
    if (tempPosts.length > 0) {
      dispatch(restorePosts());
    } else if (listPosts.length === 0) {
      // Nếu không có posts nào, fetch từ API
      dispatch(fetchPosts());
    }
  }, [dispatch, tempPosts.length, listPosts.length]);

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
