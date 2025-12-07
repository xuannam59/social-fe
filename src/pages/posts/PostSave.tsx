import { callApiGetSavedPosts } from '@social/apis/posts.api';
import NotificationPost from '@social/components/notifications/NotificationPost';
import PostSaveItemCard from '@social/components/posts/PostSaveItemCard';
import { POST_DEFAULT } from '@social/defaults/post';
import type { IPost, IPostSave } from '@social/types/posts.type';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TbLoader } from 'react-icons/tb';

const PostSave = () => {
  const [listPostsSave, setListPostsSave] = useState<IPostSave[]>([]);
  const [isLoadingPostsSave, setIsLoadingPostsSave] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [openModalViewPost, setOpenModalViewPost] = useState(false);
  const [postView, setPostView] = useState<IPost>(POST_DEFAULT);
  const [page, setPage] = useState(1);
  const totalPostsSave = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollParentRef = useRef<HTMLElement | Window | null>(null);

  const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
    if (!node) return window;

    // Check the node itself first
    const nodeStyle = window.getComputedStyle(node);
    if (nodeStyle.overflowY === 'auto' || nodeStyle.overflowY === 'scroll') {
      return node;
    }

    // Then check parent elements
    let parent: HTMLElement | null = node.parentElement;
    while (parent) {
      const style = window.getComputedStyle(parent);
      const overflowY = style.overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') {
        return parent;
      }
      parent = parent.parentElement;
    }
    return window;
  };

  const fetchSavedPosts = useCallback(async () => {
    setIsLoadingPostsSave(true);
    try {
      const res = await callApiGetSavedPosts(`limit=10`);
      if (res.data) {
        setListPostsSave(res.data.list);
        totalPostsSave.current = res.data.meta.total;
        setPage(1);
      }
    } finally {
      setIsLoadingPostsSave(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;
    if (listPostsSave.length >= totalPostsSave.current) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await callApiGetSavedPosts(`limit=10&page=${nextPage}`);
      if (res.data?.list?.length) {
        setListPostsSave(prev => [...prev, ...res.data.list]);
        setPage(nextPage);
        if (res.data.meta?.total) {
          totalPostsSave.current = res.data.meta.total;
        }
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, listPostsSave.length, page]);

  useEffect(() => {
    scrollParentRef.current = getScrollParent(containerRef.current);
    const el = scrollParentRef.current;

    const handleScroll = () => {
      if (el instanceof Window) {
        const nearBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 200;
        if (nearBottom) void loadMore();
      } else if (el) {
        const element = el as HTMLElement;
        const nearBottom =
          element.scrollTop + element.clientHeight >=
          element.scrollHeight - 200;
        if (nearBottom) void loadMore();
      }
    };

    if (el instanceof Window) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } else if (el) {
      (el as HTMLElement).addEventListener('scroll', handleScroll, {
        passive: true,
      });
      return () =>
        (el as HTMLElement).removeEventListener('scroll', handleScroll);
    }
  }, [loadMore]);

  const handleDeletePostSave = useCallback(async (postId: string) => {
    setListPostsSave(prev => prev.filter(ps => ps.postId._id !== postId));
    totalPostsSave.current = totalPostsSave.current - 1;
  }, []);

  const handleCloseModalViewPost = () => {
    setOpenModalViewPost(false);
  };

  const handleOpenPost = (postId: string) => {
    setPostView(
      listPostsSave.find(ps => ps.postId._id === postId)?.postId ?? POST_DEFAULT
    );
    setOpenModalViewPost(true);
  };

  return (
    <>
      <div className="flex h-full gap-4 overflow-y-auto" ref={containerRef}>
        <div className="hidden lg:block lg:w-[280px] xl:w-[360px] sticky top-0 left-0">
          <div className="w-full h-full bg-white shadow-md py-2 px-3">
            <span className="font-bold text-h2 text-center block-inline">
              Đã lưu
            </span>
          </div>
        </div>
        <div className="flex-1 flex justify-center h-[100vh] px-3">
          <div className="max-w-[680px] w-full h-full my-4">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-h3 font-bold">Đã lưu</h1>
            </div>
            {isLoadingPostsSave ? (
              <div className="w-full flex flex-col justify-center gap-3">
                {/* <LoadingPostList /> */}
              </div>
            ) : listPostsSave.length === 0 ? (
              <div className="w-full min-h-[300px] flex items-center justify-center">
                <span className="text-gray-500 text-base font-semibold">
                  Không có dữ liệu nào
                </span>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 w-full">
                  {listPostsSave.map(ps => (
                    <PostSaveItemCard
                      key={ps._id}
                      post={ps}
                      onDeletePostSave={handleDeletePostSave}
                      onOpenPost={handleOpenPost}
                    />
                  ))}
                </div>
                {isLoadingMore && (
                  <div className="flex justify-center py-4">
                    <TbLoader
                      size={28}
                      className="animate-spin text-gray-500"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <NotificationPost
        post={postView}
        openModalViewPost={openModalViewPost}
        closeModalViewPost={handleCloseModalViewPost}
      />
    </>
  );
};

export default PostSave;
