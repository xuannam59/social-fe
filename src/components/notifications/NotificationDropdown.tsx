import {
  callApiGetNotifications,
  callApiGetUnSeenNotifications,
  callApiUpdateSeenNotifications,
} from '@social/apis/notifications.api';
import { convertNotificationMessage } from '@social/common/convert';
import { POST_DEFAULT } from '@social/defaults/post';
import { NOTIFICATION_MESSAGE } from '@social/defaults/socket.default';
import { useSockets } from '@social/providers/SocketProvider';
import type { INotificationResponse } from '@social/types/notifications.type';
import type { IPost } from '@social/types/posts.type';
import { Badge, Dropdown, notification, Spin, Typography } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TbBell, TbX } from 'react-icons/tb';
import AvatarUser from '../common/AvatarUser';
import EmptyState from '../common/EmptyState';
import LoadingComment from '../loading/LoadingComment';
import NotificationItem from './NotificationItem';
import NotificationPost from './NotificationPost';

const { Title } = Typography;

const NotificationDropdown = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [notificationList, setNotificationList] = useState<
    INotificationResponse[]
  >([]);
  const [unSeenNotifications, setUnSeenNotifications] = useState<Set<string>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [postDetail, setPostDetail] = useState<IPost>(POST_DEFAULT);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [openModalViewPost, setOpenModalViewPost] = useState(false);
  const { socket } = useSockets();
  const getUnSeenNotifications = useCallback(async () => {
    try {
      const res = await callApiGetUnSeenNotifications();
      if (res.data) {
        setUnSeenNotifications(new Set(res.data));
      }
    } catch (error) {
      console.log(error);
    }
  }, [setUnSeenNotifications]);

  const loadMoreNotifications = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const query = `page=${nextPage}&limit=10`;
      const res = await callApiGetNotifications(query);

      if (res.data) {
        const newNotifications = res.data.list;
        const currentLength = notificationList.length;

        const scrollContainer = scrollContainerRef.current;
        const scrollTop = scrollContainer?.scrollTop || 0;

        setNotificationList(prev => [...prev, ...newNotifications]);
        setCurrentPage(nextPage);

        const totalLoaded = currentLength + newNotifications.length;
        setHasMore(totalLoaded < res.data.meta.total);

        setTimeout(() => {
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollTop;
          }
        }, 0);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải thêm thông báo',
      });
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, currentPage, notificationList.length]);

  useEffect(() => {
    getUnSeenNotifications();
  }, [getUnSeenNotifications]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isNearBottom && hasMore && !loadingMore) {
        loadMoreNotifications();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore, loadMoreNotifications]);

  useEffect(() => {
    if (!socket) return;
    socket.on(NOTIFICATION_MESSAGE.RESPONSE, (data: INotificationResponse) => {
      if (!data._id) return;

      if (notificationList.length > 0) {
        setNotificationList(prev => {
          const oldNotificationList = [...prev];
          const existingNotification = oldNotificationList.findIndex(
            item => item._id === data._id
          );
          if (existingNotification !== -1) {
            oldNotificationList.splice(existingNotification, 1);
          }
          const newNotificationList = [data, ...oldNotificationList];
          return newNotificationList;
        });
      }
      setUnSeenNotifications(prev => {
        const newUnSeenNotifications = new Set(prev);
        newUnSeenNotifications.add(data._id);
        return newUnSeenNotifications;
      });
      if (!openDropdown) {
        const lastSender = data.senderIds[data.senderIds.length - 1];
        notification.open({
          key: data._id,
          message: '',
          description: (
            <>
              <div className="flex items-start gap-1.5">
                <div className="flex-shrink-0">
                  <AvatarUser avatar={lastSender.avatar} size={58} />
                </div>
                <div className="flex flex-col w-full min-w-0 gap-1">
                  <div className="text-base line-clamp-3 break-words">
                    <span className="font-medium">{lastSender.fullname} </span>
                    <span className="text-gray-500">
                      {convertNotificationMessage(data.message, data.type)}
                    </span>
                  </div>
                </div>
                <div
                  className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 rounded-full flex-shrink-0"
                  onClick={() => {
                    notification.destroy(data._id);
                  }}
                >
                  <TbX size={16} className="text-gray-500" />
                </div>
              </div>
            </>
          ),
          onClick: () => {
            notification.destroy(data._id);
          },
          duration: 2.5,
          closeIcon: null,
          className: '!px-4 !py-3',
        });
      }
    });

    socket.on(NOTIFICATION_MESSAGE.DELETE, (data: INotificationResponse) => {
      if (!data._id) return;
      console.log('delete notification', data._id);
      setNotificationList(prev => prev.filter(item => item._id !== data._id));
      setUnSeenNotifications(prev => {
        const newUnSeenNotifications = new Set(prev);
        newUnSeenNotifications.delete(data._id);
        return newUnSeenNotifications;
      });
    });
    return () => {
      if (socket) {
        socket.off(NOTIFICATION_MESSAGE.RESPONSE);
        socket.off(NOTIFICATION_MESSAGE.DELETE);
      }
    };
  }, [socket, openDropdown, notificationList]);

  const handleOpenDropdown = useCallback(
    async (visible: boolean) => {
      setOpenDropdown(visible);
      if (visible) {
        if (notificationList.length === 0) {
          setIsLoading(true);
          try {
            const res = await callApiGetNotifications('page=1&limit=10');
            if (res.data) {
              setNotificationList(res.data.list);
              setCurrentPage(1);
              setHasMore(res.data.list.length < res.data.meta.total);
              setUnSeenNotifications(new Set());
            } else {
              notification.error({
                message: 'Lỗi',
                description: res.message,
              });
            }
          } catch (error) {
            console.log(error);
            notification.error({
              message: 'Lỗi',
              description: 'Không tải được thông báo',
            });
          } finally {
            setIsLoading(false);
          }
        }
        if (unSeenNotifications.size > 0) {
          try {
            const res = await callApiUpdateSeenNotifications();
            if (res.data) {
              setUnSeenNotifications(new Set());
            } else {
              notification.error({
                message: 'Lỗi',
                description: res.message,
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
    [notificationList, unSeenNotifications]
  );

  const handleCloseDropdown = useCallback(() => {
    setOpenDropdown(false);
  }, []);

  const handleSetPostDetail = useCallback((post: string) => {
    setPostDetail({ ...POST_DEFAULT, _id: post });
    setOpenModalViewPost(true);
  }, []);

  const handleCloseModalViewPost = useCallback(() => {
    setPostDetail(POST_DEFAULT);
    setOpenModalViewPost(false);
  }, []);

  return (
    <>
      <Dropdown
        className="cursor-pointer"
        trigger={['click']}
        placement={'bottomLeft'}
        open={openDropdown}
        onOpenChange={handleOpenDropdown}
        popupRender={() => {
          return (
            <div className="w-[380px] h-fit max-h-[calc(100vh-95px)] overflow-y-auto mb-10 pt-4 bg-white rounded-lg inset-shadow-2xs shadow-md">
              <div className="flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 border-b border-gray-200">
                  <Title level={3}>Thông báo</Title>
                </div>
                <div
                  ref={scrollContainerRef}
                  className="flex-1 min-h-0 overflow-x-hidden p-2"
                >
                  {isLoading ? (
                    <LoadingComment />
                  ) : notificationList.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <div className="grid grid-cols-1">
                      {notificationList.map(item => (
                        <NotificationItem
                          key={item._id}
                          notification={item}
                          onCloseDropdown={handleCloseDropdown}
                          onSetPostDetail={handleSetPostDetail}
                        />
                      ))}
                      {loadingMore && (
                        <div className="flex justify-center py-4">
                          <Spin size="small" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }}
      >
        <div
          className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full
         hover:bg-gray-300 transition-all duration-300 ease-out"
        >
          <Badge count={unSeenNotifications.size} overflowCount={9}>
            <TbBell size={23} />
          </Badge>
        </div>
      </Dropdown>

      <NotificationPost
        post={postDetail}
        openModalViewPost={openModalViewPost}
        closeModalViewPost={handleCloseModalViewPost}
      />
    </>
  );
};

export default NotificationDropdown;
