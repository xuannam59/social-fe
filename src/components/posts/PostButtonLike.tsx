import { callApiPostLike } from '@social/apis/posts.api';
import { convertErrorMessage } from '@social/common/convert';
import { emojiReactions } from '@social/constants/emoji';
import type { IEmojiReaction } from '@social/types/commons.type';
import type { IPostLike } from '@social/types/posts.type';
import { message, Typography } from 'antd';
import React from 'react';
import { TbThumbUp } from 'react-icons/tb';
import ButtonLike from '../common/ButtonLike';
import Lottie from 'lottie-react';

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
  const handleActionLike = async (type: number, isLike: boolean) => {
    const previousState = userLiked;

    if (isLike) {
      onUserLiked(emojiReactions.find(emoji => emoji.value === type) ?? null);
    } else {
      onUserLiked(null);
    }

    try {
      const payload: IPostLike = {
        postId,
        type,
        isLike,
      };
      const res = await callApiPostLike(payload);

      if (!res.data) {
        onUserLiked(previousState);
        message.error(convertErrorMessage(res.message));
      }
    } catch (error) {
      onUserLiked(previousState);
      message.error('Có lỗi xảy ra');
    }
  };
  return (
    <>
      <ButtonLike onActionLike={handleActionLike} likedType={userLiked?.value}>
        <div className=" flex-1 group/like hover:bg-gray-100 rounded-md cursor-pointer">
          <div className="flex items-center justify-center h-full w-full">
            {userLiked ? (
              <div
                className="flex items-center justify-center h-full w-full gap-2"
                onClick={() => {
                  handleActionLike(userLiked.value, false);
                }}
              >
                <span className="size-5">
                  <Lottie animationData={userLiked.reSource} loop={false} />
                </span>
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
      </ButtonLike>
    </>
  );
};

export default PostButtonLike;
