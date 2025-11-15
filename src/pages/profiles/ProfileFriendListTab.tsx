import { callApiGetFriendByUserId } from '@social/apis/user.api';
import AvatarUser from '@social/components/common/AvatarUser';
import type { IUser } from '@social/types/user.type';
import { Button, Dropdown, Input, Spin } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TbDots, TbLoader2, TbSearch, TbUserCircle } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';

const ProfileFriendListTab = () => {
  const [listFriends, setListFriends] = useState<IUser[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useParams();
  const totalFriends = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchUserFriends = useCallback(async () => {
    try {
      if (!userId) return;
      setIsInitialLoading(true);
      const res = await callApiGetFriendByUserId(userId, 'limit=10&page=1');
      if (res.data) {
        setListFriends(res.data.list);
        totalFriends.current = res.data.meta.total;
      }
    } catch (error) {
      console.error('Failed to fetch user friends:', error);
    } finally {
      setIsInitialLoading(false);
    }
  }, [userId]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;
    if (listFriends.length >= totalFriends.current) return;
    if (!userId) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await callApiGetFriendByUserId(
        userId,
        `limit=10&page=${nextPage}`
      );
      if (res.data && res.data.list.length > 0) {
        setListFriends(prev => [...prev, ...res.data.list]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Failed to load more friends:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [userId, page, isLoadingMore, listFriends.length]);

  useEffect(() => {
    fetchUserFriends();
  }, [fetchUserFriends]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || listFriends.length >= totalFriends.current) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, isLoadingMore, listFriends.length]);
  return (
    <>
      <div
        className="w-full rounded-2xl bg-white p-4 shadow-md"
        ref={containerRef}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-h3 font-bold">Bạn bè</span>
            <div className="flex items-center gap-2 justify-end">
              <Input
                placeholder="Tìm kiếm bạn bè"
                allowClear
                prefix={<TbSearch size={20} className="text-gray-500" />}
                variant="filled"
                className="!rounded-full !border-none !bg-gray-100"
              />
            </div>
          </div>
          {isInitialLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spin size="large" />
            </div>
          ) : listFriends.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <span className="text-gray-500 text-base">
                Chưa có bạn bè nào
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-12 gap-2">
                {listFriends.map(friend => (
                  <div key={friend._id} className="col-span-12 md:col-span-6">
                    <div className="p-4 border border-gray-200 rounded-md flex items-center gap-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0">
                            <AvatarUser
                              shape="square"
                              avatar={friend.avatar}
                              size={82}
                              className=""
                            />
                          </div>
                          <span className="text-base font-semibold line-clamp-1">
                            {friend.fullname}
                          </span>
                        </div>
                        <Dropdown
                          trigger={['click']}
                          placement="bottomRight"
                          menu={{
                            items: [
                              {
                                label: 'Xem trang cá nhân',
                                key: 'viewProfile',
                                icon: <TbUserCircle size={20} />,
                                onClick: () => navigate(`/${friend._id}`),
                              },
                              // ...(!userInfo.friends.includes(friend._id) &&
                              // friend._id !== userInfo._id
                              //   ? [
                              //       {
                              //         label: 'Thêm bạn bè',
                              //         key: 'addFriend',
                              //         icon: <TbUserPlus size={20} />,
                              //         // onClick: () => handleAddFriend(friend._id),
                              //       },
                              //     ]
                              //   : []),
                            ],
                          }}
                        >
                          <Button type="text" shape="circle">
                            <TbDots size={20} />
                          </Button>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {isLoadingMore && (
                <div className="flex justify-center items-center py-4">
                  <TbLoader2 size={24} className="animate-spin text-gray-500" />
                </div>
              )}
              {listFriends.length >= totalFriends.current &&
                listFriends.length > 0 && (
                  <div className="flex justify-center items-center py-4">
                    <span className="text-gray-500 text-base font-semibold">
                      Đã hiển thị tất cả bạn bè
                    </span>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileFriendListTab;
