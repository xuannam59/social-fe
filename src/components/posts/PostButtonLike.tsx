import { callApiActionLike } from '@social/apis/posts.api';
import { emojiReactions } from '@social/constants/emoji';
import type { IEmojiReaction } from '@social/types/commons.type';
import type { IActionLike } from '@social/types/posts.type';
import { Dropdown, message, Tooltip, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { TbThumbUp } from 'react-icons/tb';

const { Text } = Typography;

interface IProps {
  postId: string;
  userLiked: IEmojiReaction | null;
  onUserLiked: (userLiked: IEmojiReaction | null) => void;
}

const PostButtonLike: React.FC<IProps> = ({
  postId,
  userLiked,
  onUserLiked,
}) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleVisibleChange = (nextVisible: boolean) => {
    if (nextVisible) {
      timerRef.current = setTimeout(() => {
        setOpen(true);
      }, 300);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setOpen(false);
    }
  };

  const handleActionLike = async (type: number, isLike: boolean) => {
    const payload: IActionLike = {
      postId,
      type,
      isLike,
    };
    const res = await callApiActionLike(payload);
    if (isLike) {
      onUserLiked(emojiReactions.find(emoji => emoji.value === type) ?? null);
    } else {
      onUserLiked(null);
    }
    if (!res.data) {
      message.error('Có lỗi xảy ra');
    }
  };
  return (
    <>
      <Dropdown
        trigger={['hover']}
        open={open}
        onOpenChange={handleVisibleChange}
        placement={'top'}
        className="cursor-pointer flex-1"
        popupRender={() => {
          return (
            <>
              <div className="flex items-center bg-white rounded-full shadow-md p-1 border border-gray-300">
                {emojiReactions.map(emoji => (
                  <div
                    key={emoji.id}
                    className={`w-10 h-10 p-2 rounded-full  cursor-pointer`}
                    onClick={() => {
                      handleActionLike(emoji.value, true);
                    }}
                  >
                    <Tooltip title={emoji.label}>
                      <div className="flex items-center justify-center w-full h-full">
                        <span className="text-3xl font-semibold hover:scale-150 transition-all duration-300">
                          {emoji.emoji}
                        </span>
                      </div>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </>
          );
        }}
      >
        <div className=" flex-1 group/like hover:bg-gray-100 rounded-md cursor-pointer">
          <div className="flex items-center justify-center h-full w-full">
            {userLiked ? (
              <div
                className="flex items-center justify-center h-full w-full gap-2"
                onClick={() => {
                  handleActionLike(userLiked.value, false);
                }}
              >
                <span className="text-lg font-semibold">{userLiked.emoji}</span>
                <span
                  className={`text-sm font-semibold`}
                  style={{ color: userLiked.color }}
                >
                  {userLiked.label}
                </span>
              </div>
            ) : (
              <div
                className="flex items-center justify-center h-full w-full"
                onClick={() => {
                  handleActionLike(emojiReactions[0].value, true);
                }}
              >
                <TbThumbUp size={24} className="text-gray-500" />
                <Text className="text-sm font-semibold">Thích</Text>
              </div>
            )}
          </div>
        </div>
      </Dropdown>
    </>
  );
};

export default PostButtonLike;
