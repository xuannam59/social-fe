import { useCallback, useEffect, useMemo, useState } from 'react';
import CreatePost from '../posts/CreatePost';
import StoryPreviewList from '../stories/StoryPreviewList';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import PostItem from '../posts/PostItem';
import ModalViewPost from '../modals/posts/ModalViewPost';
import {
  fetchPosts,
  setCurrentPost,
} from '@social/redux/reducers/post.reducer';
import { POST_DEFAULT } from '@social/defaults/post';

const CenterContent = () => {
  const [openModalViewPost, setOpenModalViewPost] = useState(false);
  const posts = useAppSelector(state => state.post.listPosts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch]);

  const handleOpenModalViewPost = useCallback(
    (postId: string) => {
      dispatch(setCurrentPost(postId));
      setOpenModalViewPost(true);
    },
    [dispatch]
  );

  const handleCloseModalViewPost = useCallback(() => {
    dispatch(setCurrentPost(POST_DEFAULT));
    setOpenModalViewPost(false);
  }, [dispatch]);

  return (
    <>
      <div className="flex flex-1 flex-col justify-start items-center gap-2">
        <CreatePost />
        <div className="overflow-hidden h-[200px] w-full">
          <StoryPreviewList />
        </div>
        <div className="flex flex-col gap-2 w-full">
          {posts.map(post => (
            <div
              className="w-full h-fit bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
              key={post._id}
            >
              <PostItem
                post={post}
                onClickComment={() => {
                  handleOpenModalViewPost(post._id);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {openModalViewPost && (
        <ModalViewPost
          open={openModalViewPost}
          onClose={handleCloseModalViewPost}
        />
      )}
    </>
  );
};

export default CenterContent;
