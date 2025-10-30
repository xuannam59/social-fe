import { callApiPostLike } from '@social/apis/posts.api';
import { convertErrorMessage } from '@social/common/convert';
import { emojiReactions } from '@social/constants/emoji';
import { NOTIFICATION_MESSAGE } from '@social/defaults/socket.default';
import { useSockets } from '@social/providers/SocketProvider';
import type { IEmojiReaction } from '@social/types/commons.type';
import type { IPost, IPostLike } from '@social/types/posts.type';
import { message, Typography } from 'antd';
import Lottie from 'lottie-react';
import React from 'react';
import { TbThumbUp } from 'react-icons/tb';
import ButtonLike from '../common/ButtonLike';

const { Text } = Typography;

interface IProps {
  post: IPost;
  userLiked: IEmojiReaction | null;
  onUserLiked: (type: number, isLike: boolean) => void;
}

const PostButtonLike: React.FC<IProps> = ({ post, userLiked, onUserLiked }) => {
  const { socket } = useSockets();
  const handleActionLike = async (type: number, isLike: boolean) => {
    onUserLiked(type, isLike);

    try {
      const payload: IPostLike = {
        postId: post._id,
        type,
        isLike,
      };
      const res = await callApiPostLike(payload);
      if (res.data) {
        socket.emit(NOTIFICATION_MESSAGE.POST_LIKE, {
          postId: post._id,
          creatorId: post.authorId._id,
          message: post.content,
        });
      } else {
        message.error(convertErrorMessage(res.message));
      }
    } catch (error) {
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
