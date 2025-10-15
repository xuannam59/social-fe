import { callApiGetConversations } from '@social/apis/conversations.api';
import { HEADER_MESSAGE } from '@social/defaults/socket.default';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { useSockets } from '@social/providers/SocketProvider';
import {
  doSetConversations,
  doSetUnSeenConversation,
  doUpdateConversationPosition,
  seenConversation,
} from '@social/redux/reducers/conversations';
import { Badge, Button, Dropdown, notification, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { TbMessageCircle } from 'react-icons/tb';
import InputSearch from '../common/InputSearch';
import LoadingComment from '../loading/LoadingComment';
import ConversationItem from './ConversationItem';
import EmptyState from '../common/EmptyState';
import type { IConversation } from '@social/types/conversations.type';

const { Title } = Typography;

const ConversationDropdown = () => {
  const { listConversations, unSeenConversations } = useAppSelector(
    state => state.conversations
  );
  const [openDropdown, setOpenDropdown] = useState(false);
  const [_, setIsSearchFocused] = useState(false);
  const [conversationType, setConversationType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useSockets();
  const { userInfo } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const conversationTypeList = [
    {
      type: 'all',
      label: 'Tất cả',
      width: 'col-span-2',
    },
    {
      type: 'notRead',
      label: 'Chưa đọc',
      width: 'col-span-3',
    },
    {
      type: 'group',
      label: 'Nhóm',
      width: 'col-span-3',
    },
  ];

  const handleOpenDropdown = useCallback(
    async (visible: boolean) => {
      setOpenDropdown(visible);
      if (visible) {
        try {
          if (listConversations.length === 0) {
            setIsLoading(true);
            const res = await callApiGetConversations('page=1&limit=10');
            if (res.data) {
              dispatch(
                doSetConversations({
                  conversations: res.data.list,
                  total: res.data.meta.total,
                })
              );
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
    [dispatch, listConversations, unSeenConversations]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on(
      HEADER_MESSAGE.UN_SEEN_CONVERSATION,
      (data: { conversation: IConversation; senderId: string }) => {
        const { conversation, senderId } = data;
        if (!conversation._id) return;
        if (senderId !== userInfo._id) {
          dispatch(doSetUnSeenConversation(conversation._id));
        }
        dispatch(
          doUpdateConversationPosition({ conversation, userId: userInfo._id })
        );
      }
    );
    return () => {
      socket.off(HEADER_MESSAGE.UN_SEEN_CONVERSATION);
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
                <div className="flex items-center">
                  <InputSearch
                    placeholder="Tìm kiếm cuộc hội thoại"
                    className="w-full h-[36px]"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>
                <div className="grid grid-cols-12 gap-1 mt-4 pb-2">
                  {conversationTypeList.map(item => (
                    <Button
                      key={item.type}
                      color={
                        conversationType === item.type ? 'primary' : 'default'
                      }
                      variant={`${conversationType === item.type ? 'filled' : 'text'}`}
                      className={item.width}
                      onClick={() => setConversationType(item.type)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-2 py-3">
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
