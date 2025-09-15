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

const StoryReply = () => {
  const { currentStory, paused } = useAppSelector(state => state.story);
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const dispatch = useAppDispatch();
  const inputRef = useRef<InputRef>(null);
  const [form] = Form.useForm();
  const [isFocused, setIsFocused] = useState(false);
  const userLiked = useMemo(() => {
    return (
      currentStory.userLikes.find(like => like.userId === userInfo._id) ?? null
    );
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
      };
      console.log(payload);
      form.resetFields();
      setIsFocused(false);
      inputRef.current?.blur();
    },
    [currentStory, form]
  );

  const onActionLike = useCallback(
    async (value: number) => {
      try {
        const res = await callApiActionLike(currentStory._id, value);
        if (res.data) {
          dispatch(doLikeStory({ userId: userInfo._id, type: value }));
        } else {
          message.error(convertErrorMessage(res.message));
        }
      } catch (error) {
        console.log(error);
        message.error('Có lỗi xảy ra');
      }
    },
    [currentStory, userInfo]
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
      <div className="h-12 max-w-[690px] w-[80%] bg-transparent">
        <div className="flex justify-start items-center w-full h-full gap-1 px-2">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className={`flex items-center border-1 border-white rounded-2xl h-10 transition-all duration-300
              ${isFocused ? 'flex-1' : 'w-[300px]'}`}
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
            className={`items-center flex-1 ${isFocused ? 'hidden' : 'flex'} gap-1`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
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
                      className={`text-3xl font-semibold hover:scale-150 transition-all duration-300 
                          ${
                            userLiked?.type === emoji.value
                              ? 'scale-125'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                      style={{
                        filter:
                          userLiked?.type === emoji.value
                            ? `drop-shadow(0 0 8px ${emoji.color}) drop-shadow(0 0 16px ${emoji.color}40)`
                            : undefined,
                      }}
                    >
                      {emoji.emoji}
                    </span>
                  </div>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryReply;
