import {
  callApiGetConversationIdOrCreate,
  callApiReadConversation,
} from '@social/apis/conversations.api';
import { callApiGetMessages } from '@social/apis/message.s.api';
import { formatRelativeTimeV2 } from '@social/common/convert';
import {
  CHAT_MESSAGE,
  CONVERSATION_MESSAGE,
} from '@social/defaults/socket.default';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import { useSockets } from '@social/providers/SocketProvider';
import {
  doCloseConversation,
  doReadConversation,
  doSetIdConversation,
} from '@social/redux/reducers/conversations';
import type { IConversation } from '@social/types/conversations.type';
import type { IMessage, IMessageRead } from '@social/types/messages.type';
import { Button, notification } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TbLoader2, TbX } from 'react-icons/tb';
import AvatarUser from '../../common/AvatarUser';
import Loading from '../../loading/Loading';
import ConversationContent from './ConversationContent';
import ConversationInput from './ConversationInput';
import ConversationTyping from './ConversationTyping';

interface IProps {
  conversation: IConversation;
}

const ConversationItemBox: React.FC<IProps> = ({ conversation }) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const { socket } = useSockets();
  const dispatch = useAppDispatch();
  const isExist = useMemo(() => conversation.isExist, [conversation]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectMessage, setSelectMessage] = useState<{
    message: IMessage;
    type: 'reply' | 'edit';
  } | null>(null);
  const [totalMessages, setTotalMessages] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [usersState, setUsersState] = useState<IConversation['usersState']>(
    conversation.usersState.filter(user => user.user !== userInfo._id)
  );
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const conversationBoxRef = useRef<HTMLDivElement | null>(null);
  const getConversationId = useCallback(async () => {
    try {
      if (isExist) return;
      const res = await callApiGetConversationIdOrCreate(
        conversation.users.map(user => user._id)
      );
      if (res.data) {
        dispatch(
          doSetIdConversation({
            _id: conversation._id,
            conversation: res.data,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [conversation, isExist, dispatch]);

  const handleReadConversation = useCallback(() => {
    if (conversation._id && conversation.isExist) {
      socket.emit(CHAT_MESSAGE.READ, {
        conversationId: conversation._id,
        userId: userInfo._id,
      });
      dispatch(
        doReadConversation({
          conversationId: conversation._id,
          userId: userInfo._id,
        })
      );
    }
  }, [conversation._id, userInfo._id, socket, dispatch, conversation.isExist]);

  const getMessages = useCallback(async () => {
    try {
      setIsLoadingMessages(true);
      const res = await callApiGetMessages(conversation._id, {
        page: 1,
      });
      if (res.data) {
        const messages = res.data.list;
        setMessages(messages);
        setTotalMessages(res.data.meta.total);
        setPage(1);

        requestAnimationFrame(() => {
          const c = scrollContainerRef.current;
          if (c) {
            c.scrollTop = 0;
            setHasUserScrolled(false);
          }
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [conversation._id]);

  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore) return;
    if (messages.length >= totalMessages) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const container = scrollContainerRef.current;
      const anchorMessageId = messages.length
        ? messages[messages.length - 1]._id
        : null;
      const prevOffsetFromContainerTop = (() => {
        if (!container || !anchorMessageId) return 0;
        const el = container.querySelector(
          `#msg_${anchorMessageId}`
        ) as HTMLElement | null;
        if (!el) return 0;
        return (
          el.getBoundingClientRect().top - container.getBoundingClientRect().top
        );
      })();

      const res = await callApiGetMessages(conversation._id, {
        page: nextPage,
      });
      if (res.data) {
        const older = res.data.list;
        setMessages(prev => [...prev, ...older]);
        setPage(nextPage);
        requestAnimationFrame(() => {
          const c = scrollContainerRef.current;
          if (!c) return;
          if (!anchorMessageId) return;
          const el = c.querySelector(
            `#msg_${anchorMessageId}`
          ) as HTMLElement | null;
          if (!el) return;
          const newOffsetFromContainerTop =
            el.getBoundingClientRect().top - c.getBoundingClientRect().top;
          const deltaOffset =
            newOffsetFromContainerTop - prevOffsetFromContainerTop;
          c.scrollTop = c.scrollTop + deltaOffset;
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [conversation._id, isLoadingMore, messages, totalMessages, page]);

  useEffect(() => {
    getConversationId();
  }, [getConversationId]);

  useEffect(() => {
    handleReadConversation();
  }, [handleReadConversation]);

  useEffect(() => {
    if (isExist) {
      getMessages();
    }
  }, [getMessages, isExist]);

  useEffect(() => {
    const conversationBox = conversationBoxRef.current;
    if (conversationBox) {
      conversationBox.addEventListener('click', handleReadConversation);

      return () => {
        conversationBox.removeEventListener('click', handleReadConversation);
      };
    }
  }, [conversation._id, handleReadConversation]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const sentinel = topSentinelRef.current;
    if (!container || !sentinel) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting && hasUserScrolled) {
          loadMoreMessages();
        }
      },
      {
        root: container,
        rootMargin: '0px',
        threshold: 1.0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMoreMessages, hasUserScrolled]);

  useEffect(() => {
    if (socket && conversation._id) {
      socket.emit(CONVERSATION_MESSAGE.JOIN, conversation._id);
    }

    return () => {
      if (socket && conversation._id) {
        socket.emit(CONVERSATION_MESSAGE.LEAVE, conversation._id);
      }
    };
  }, [socket, conversation._id]);

  useEffect(() => {
    if (!socket) return;
    socket.on(CHAT_MESSAGE.SEND, (data: IMessage) => {
      if (data.conversationId !== conversation._id) return;
      if (data.status === 'failed') {
        if (userInfo._id !== data.sender._id) return;
        setMessages(prev =>
          prev.map(message =>
            message._id === data.tempId
              ? { ...message, status: data.status }
              : message
          )
        );
        notification.error({
          message: 'Gửi tin nhắn thất bại',
          description: data.message,
          duration: 3,
        });
        return;
      }
      if (userInfo._id === data.sender._id) {
        setMessages(prev => {
          return prev.map(message =>
            message._id === data.tempId ? data : message
          );
        });
      } else {
        setMessages(prev => [data, ...prev]);
        setUsersState(prev => {
          return prev.map(user =>
            user.user === data.sender._id
              ? { ...user, readLastMessage: data._id }
              : user
          );
        });
      }
    });

    socket.on(CHAT_MESSAGE.EDIT, (data: IMessage) => {
      if (data.conversationId !== conversation._id) return;
      if (data.sender._id === userInfo._id) return;
      setMessages(prev =>
        prev.map(message =>
          message._id === data._id
            ? {
                ...message,
                content: data.content,
                type: data.type,
                edited: true,
                timeEdited: data.timeEdited,
                mentions: data.mentions,
              }
            : message
        )
      );
    });

    socket.on(CHAT_MESSAGE.READ, (data: IMessageRead) => {
      if (data.conversationId !== conversation._id) return;
      if (data.userId === userInfo._id) return;
      setUsersState(prev =>
        prev.map(user =>
          user.user === data.userId
            ? { ...user, readLastMessage: data.lastMessageId }
            : user
        )
      );
    });

    return () => {
      socket.off(CHAT_MESSAGE.SEND);
      socket.off(CHAT_MESSAGE.EDIT);
      socket.off(CHAT_MESSAGE.READ);
    };
  }, [socket, userInfo, conversation, usersState]);

  const handleReSendMessage = useCallback(
    (messageId: string) => {
      setMessages(prev =>
        prev.map(message =>
          message._id === messageId
            ? { ...message, status: 'pending' }
            : message
        )
      );
      const messageFailed = messages.find(message => message._id === messageId);
      if (messageFailed) {
        socket.emit(CHAT_MESSAGE.SEND, messageFailed);
      }
    },
    [socket, messages]
  );

  const handleCloseConversation = () => {
    dispatch(doCloseConversation(conversation._id));
  };

  const handleAddMessage = useCallback((message: IMessage) => {
    setMessages(prev => [message, ...prev]);
    requestAnimationFrame(() => {
      if (!bottomSentinelRef.current) return;
      scrollContainerRef.current?.scrollTo({
        top: bottomSentinelRef.current.getBoundingClientRect().bottom,
        behavior: 'smooth',
      });
    });
  }, []);

  const handleEditMessage = useCallback((message: IMessage) => {
    setMessages(prev =>
      prev.map(msg => (msg._id === message._id ? message : msg))
    );
  }, []);

  const handleGetMessageReply = useCallback(
    (message: IMessage, type: 'reply' | 'edit') => {
      setSelectMessage({ message, type });
    },
    [setSelectMessage]
  );

  const handleScrollToMessage = useCallback((messageId: string) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const messageElement = container.querySelector(`#msg_${messageId}`);
    if (!messageElement) return;

    messageElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, []);

  const handleRemoveSelectMessage = useCallback(() => {
    setSelectMessage(null);
  }, [setSelectMessage]);

  return (
    <>
      <div
        className="w-[328px] max-h-[455px] flex flex-col bg-white rounded-t-lg shadow-md overflow-visible"
        ref={conversationBoxRef}
      >
        <div className="p-2 flex items-center shadow-sm">
          <div className="flex flex-1 gap-2 items-center min-w-0">
            <div className="shrink-0 relative">
              <AvatarUser avatar={conversation.avatar} size={36} />
              {conversation.isOnline && (
                <div className="absolute bottom-0 right-1">
                  <div className="w-3 h-3 bg-[#24832c] rounded-full border-2 border-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-0 flex-1 min-w-0 overflow-hidden">
              <span className="text-base font-medium line-clamp-1 leading-5">
                {conversation.name}
              </span>
              <div className="flex items-center min-w-0">
                <span className="text-sm text-gray-500 truncate leading-4 block">
                  {conversation.isOnline
                    ? 'Đang hoạt động'
                    : `Hoạt động ${formatRelativeTimeV2(conversation.lastActive)} trước`}
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0 ml-2">
            <Button
              type="text"
              shape="circle"
              onClick={handleCloseConversation}
            >
              <TbX size={20} />
            </Button>
          </div>
        </div>
        <div className="flex flex-col min-h-0 h-[400px]">
          {isLoadingMessages ? (
            <Loading />
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <AvatarUser avatar={''} size={50} />
              <span className="text-gray-500">{conversation.name}</span>
              <span className="text-gray-500 text-sm">
                Chưa có tin nhắn, hãy bắt đầu trò chuyện
              </span>
            </div>
          ) : (
            <div
              className="flex flex-col-reverse overflow-y-auto px-3 gap-2 flex-1"
              ref={scrollContainerRef}
              onScroll={() => {
                if (!hasUserScrolled) {
                  setHasUserScrolled(true);
                }
              }}
            >
              <div ref={bottomSentinelRef} />
              <ConversationTyping conversationId={conversation._id} />
              {messages.map(message => {
                const userReadMessage = usersState.filter(
                  user => user.readLastMessage === message._id
                );
                const userInfoReadMessage = conversation.users.filter(user =>
                  userReadMessage.some(userRead => userRead.user === user._id)
                );
                return (
                  <div className="flex flex-col" key={message._id}>
                    <ConversationContent
                      message={message}
                      getMessageReply={handleGetMessageReply}
                      onReSendMessage={handleReSendMessage}
                      onScrollToMessage={handleScrollToMessage}
                    />
                    {userInfoReadMessage.length > 0 && (
                      <div className="flex justify-end items-center gap-1">
                        {userInfoReadMessage.map(user => (
                          <AvatarUser
                            key={user._id}
                            avatar={user.avatar}
                            size={20}
                          />
                        ))}
                        {userInfoReadMessage.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{userInfoReadMessage.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoadingMore && (
                <div className="flex items-center justify-center py-2">
                  <TbLoader2 size={30} className="animate-spin text-gray-500" />
                </div>
              )}
              <div ref={topSentinelRef} />
            </div>
          )}
          <div>
            <ConversationInput
              conversation={conversation}
              isLoadingMessages={isLoadingMessages}
              selectMessage={selectMessage}
              onAddMessage={handleAddMessage}
              onEditMessage={handleEditMessage}
              onRemoveSelectMessage={handleRemoveSelectMessage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationItemBox;
