import { callApiActionLike } from '@social/apis/stories.api';
import { convertErrorMessage } from '@social/common/convert';
import { emojiReactions } from '@social/constants/emoji';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import {
  doLikeStory,
  doPauseStory,
} from '@social/redux/reducers/story.reducer';
import { Button, Form, Input, message, Tooltip, type InputRef } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TbSend } from 'react-icons/tb';
import Lottie from 'lottie-react';
import { useSockets } from '@social/providers/SocketProvider';
import {
  CHAT_MESSAGE,
  NOTIFICATION_MESSAGE,
} from '@social/defaults/socket.default';

const StoryReply = () => {
  const { socket } = useSockets();
  const { currentStory, currentUserStory, paused } = useAppSelector(
    state => state.story
  );
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const dispatch = useAppDispatch();
  const inputRef = useRef<InputRef>(null);
  const [form] = Form.useForm();
  const [isFocused, setIsFocused] = useState(false);
  const userLiked = useMemo(() => {
    return (
      currentStory.viewers.find(viewer => viewer.userId === userInfo._id) ??
      null
    );
  }, [currentStory, userInfo]);

  const myStory = useMemo(() => {
    return currentStory.authorId === userInfo._id;
  }, [currentStory, userInfo]);

  useEffect(() => {
    if (currentStory) {
      inputRef.current?.blur();
      form.resetFields();
    }
  }, [currentStory, form]);

  const onFinish = useCallback(
    (values: { content: string }) => {
      const payload = {
        storyId: currentStory._id,
        content: values.content.trim(),
        receiver: {
          _id: currentUserStory._id,
          fullname: currentUserStory.fullname,
          avatar: currentUserStory.avatar,
        },
      };
      socket.emit(CHAT_MESSAGE.REPLY_STORY, payload);
      form.resetFields();
      setIsFocused(false);
      inputRef.current?.blur();
    },
    [currentStory, form, socket, currentUserStory]
  );

  const onActionLike = useCallback(
    async (value: number) => {
      try {
        const res = await callApiActionLike(currentStory._id, value);
        if (res.data) {
          dispatch(doLikeStory({ userId: userInfo._id, type: value }));
          message.success('Thả cảm xúc thành công');
          socket.emit(NOTIFICATION_MESSAGE.STORY_REACTION, {
            storyId: currentStory._id,
            authorId: currentStory.authorId,
          });
        } else {
          message.error(convertErrorMessage(res.message));
        }
      } catch (error) {
        console.log(error);
        message.error('Có lỗi xảy ra');
      }
    },
    [currentStory, userInfo, dispatch, socket]
  );

  const onFocus = () => {
    setIsFocused(true);
    onMouseEnter();
  };

  const onBlur = () => {
    setIsFocused(false);
    onMouseLeave();
  };

  const onMouseEnter = () => {
    if (!paused) {
      dispatch(doPauseStory(true));
    }
  };

  const onMouseLeave = () => {
    if (paused) {
      dispatch(doPauseStory(false));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  return (
    <>
      <div className="h-12 max-w-[690px] w-[80%] bg-transparent overflow-hidden">
        {!myStory && (
          <div className="flex justify-start items-center w-full h-full">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className={`flex items-center border-1 border-white rounded-2xl h-10 transition-all duration-1000
              ${isFocused ? 'w-full' : 'w-[50%]'}`}
            >
              <Form.Item name="content" className="!m-0 flex-1">
                <Input
                  className="!bg-transparent !border-none !ring-0 !shadow-none !text-white
                   placeholder:!text-white"
                  placeholder="Trả lời..."
                  ref={inputRef}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onKeyDown={onKeyDown}
                  onPressEnter={() => form.submit()}
                  autoComplete="off"
                />
              </Form.Item>

              {isFocused && (
                <Button
                  type="text"
                  className="!text-white transition-colors duration-200"
                  onClick={() => form.submit()}
                >
                  <TbSend size={20} />
                </Button>
              )}
            </Form>
            <div
              className={`${isFocused ? 'w-0' : 'w-[50%]'} transition-all duration-1000`}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <div className="flex items-center gap-1">
                {emojiReactions.map(emoji => (
                  <div
                    key={emoji.id}
                    className="h-full rounded-full cursor-pointer flex-1"
                    onClick={() => {
                      onActionLike(emoji.value);
                    }}
                  >
                    <Tooltip title={emoji.label}>
                      <div className="flex items-center justify-center w-full h-full">
                        <span
                          className={`hover:scale-120 transition-all rounded-full duration-300 w-10 h-10
                          ${
                            userLiked?.likedType === emoji.value
                              ? 'scale-120'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                          style={{
                            filter:
                              userLiked?.likedType === emoji.value
                                ? `drop-shadow(0 0 8px ${emoji.color}) drop-shadow(0 0 16px ${emoji.color}40)`
                                : undefined,
                          }}
                        >
                          <Lottie animationData={emoji.reSource} loop={true} />
                        </span>
                      </div>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StoryReply;
