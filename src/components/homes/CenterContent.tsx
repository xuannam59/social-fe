import CreatePost from '../posts/CreatePost';
import StoryPreviewList from '../stories/StoryPreviewList';
import PostList from '../posts/PostList';
import { fetchPosts } from '@social/redux/reducers/post.reducer';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';

const CenterContent = () => {
  const listPosts = useAppSelector(state => state.post.listPosts);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (listPosts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch]);
  return (
    <>
      <div className="flex flex-1 flex-col justify-start items-center gap-2">
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
