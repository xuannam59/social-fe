import { callApiGetConversations } from '@social/apis/conversations.api';
import { HEADER_MESSAGE } from '@social/defaults/socket.default';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { useSockets } from '@social/providers/SocketProvider';
import {
  doAddMoreConversations,
  doSetConversations,
  doSetUnSeenConversation,
  doUpdateConversationPosition,
  seenConversation,
} from '@social/redux/reducers/conversations.reducer';
import type { IUnSeenConversation } from '@social/types/conversations.type';
import { Badge, Dropdown, notification, Typography } from 'antd';
import type { UIEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { TbMessageCircle } from 'react-icons/tb';
import EmptyState from '../common/EmptyState';
import LoadingComment from '../loading/LoadingComment';
import ConversationItem from './ConversationItem';

const { Title } = Typography;

const ConversationDropdown = () => {
  const { listConversations, unSeenConversations, total } = useAppSelector(
    state => state.conversations
  );
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const { socket } = useSockets();
  const { userInfo } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const LIMIT = 10;

  const handleOpenDropdown = useCallback(
    async (visible: boolean) => {
      setOpenDropdown(visible);
      if (visible) {
        try {
          if (listConversations.length === 0) {
            setIsLoading(true);
            const res = await callApiGetConversations(`page=1&limit=${LIMIT}`);
            if (res.data) {
              dispatch(
                doSetConversations({
                  conversations: res.data.list,
                  total: res.data.meta.total,
                })
              );
              setPage(1);
            } else {
              notification.error({
                message: 'Lỗi',
                description: 'Không tải được tin nhắn',
              });
            }
          }
          if (unSeenConversations.length > 0) {
            dispatch(seenConversation(unSeenConversations));
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [dispatch, listConversations, unSeenConversations, LIMIT]
  );

  const loadMoreConversations = useCallback(async () => {
    if (isLoadingMore || isLoading) return;
    if (listConversations.length >= total) return;
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await callApiGetConversations(
        `page=${nextPage}&limit=${LIMIT}`
      );
      if (res.data && res.data.list.length > 0) {
        dispatch(doAddMoreConversations(res.data.list));
        setPage(nextPage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    LIMIT,
    dispatch,
    isLoading,
    isLoadingMore,
    listConversations.length,
    page,
    total,
  ]);

  const handleScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const nearBottom =
        target.scrollTop + target.clientHeight >= target.scrollHeight - 24;
      const hasMore = listConversations.length < total;
      if (nearBottom && hasMore) {
        void loadMoreConversations();
      }
    },
    [listConversations.length, loadMoreConversations, total]
  );

  useEffect(() => {
    if (!socket) return;
    const handleUnSeenConversation = (data: IUnSeenConversation) => {
      const { conversation, senderId } = data;
      if (!conversation._id) return;
      if (senderId !== userInfo._id) {
        dispatch(doSetUnSeenConversation(conversation._id));
      }
      dispatch(
        doUpdateConversationPosition({ conversation, userId: userInfo._id })
      );
    };

    socket.on(HEADER_MESSAGE.UN_SEEN_CONVERSATION, handleUnSeenConversation);
    return () => {
      socket.off(HEADER_MESSAGE.UN_SEEN_CONVERSATION, handleUnSeenConversation);
    };
  }, [socket, dispatch, userInfo._id]);

  return (
    <>
      <Dropdown
        className="cursor-pointer"
        trigger={['click']}
        open={openDropdown}
        onOpenChange={handleOpenDropdown}
        placement={'bottomLeft'}
        popupRender={() => {
          return (
            <div className="w-[380px] max-h-[calc(100vh-95px)] mb-10 bg-white rounded-lg inset-shadow-2xs shadow-md pt-4 flex flex-col overflow-hidden">
              <div className="px-4 flex-shrink-0 shadow-sm">
                <div className="flex items-center justify-between">
                  <Title level={3}>Tin nhắn</Title>
                </div>
              </div>

              <div
                className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-2 py-3"
                onScroll={handleScroll}
              >
                {isLoading ? (
                  <LoadingComment />
                ) : listConversations.length > 0 ? (
                  <div className="grid grid-cols-1">
                    {listConversations.map(item => (
                      <ConversationItem
                        key={item._id}
                        conversation={item}
                        onCloseDropdown={() => setOpenDropdown(false)}
                      />
                    ))}
                    {isLoadingMore && (
                      <div className="py-2">
                        <LoadingComment />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <EmptyState />
                  </div>
                )}
              </div>
            </div>
          );
        }}
      >
        <div
          className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full
         hover:bg-gray-300 transition-all duration-300 ease-out"
        >
          <Badge count={unSeenConversations.length}>
            <TbMessageCircle size={25} />
          </Badge>
        </div>
      </Dropdown>
    </>
  );
};

export default ConversationDropdown;
