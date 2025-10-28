import {
  convertUrlString,
  formatFullDateTime,
  formatNumberAbbreviate,
  formatRelativeTime,
} from '@social/common/convert';
import { emojiReactions } from '@social/constants/emoji';
import type { IEmojiReaction } from '@social/types/commons.type';
import type { IPost, IPostLike } from '@social/types/posts.type';
import { Button, Tooltip, Typography } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import {
  TbDots,
  TbLock,
  TbMessageCircle,
  TbMessageCircleFilled,
  TbShare3,
  TbUsers,
  TbWorld,
  TbX,
} from 'react-icons/tb';
import AvatarUser from '../common/AvatarUser';
import UserTagsDisplay from '../common/UserTagsDisplay';
import PostButtonLike from './PostButtonLike';
import PostMediaGallery from './PostMediaGallery';
import { v4 as uuidv4 } from 'uuid';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';

const { Text } = Typography;

interface IProps {
  post: IPost;
  buttonClose?: boolean;
  onClickComment: () => void;
  onLikePost: (postLike: IPostLike) => void;
}

const PostItem: React.FC<IProps> = ({
  post,
  onClickComment,
  buttonClose = true,
  onLikePost,
}) => {
  const navigate = useNavigate();
  const time = formatRelativeTime(post.createdAt);
  const exactTime = formatFullDateTime(post.createdAt);
  const [isExpanded, setIsExpanded] = useState(false);
  const userLiked = useMemo(() => {
    if (post.userLiked.isLiked) {
      return (
        emojiReactions.find(emoji => emoji.value === post.userLiked.type) ??
        null
      );
    }
    return null;
  }, [post.userLiked.type, post.userLiked.isLiked]);

  const medias = useMemo(() => {
    return post.medias.map(media => ({
      id: uuidv4(),
      url: convertUrlString(media.keyS3 ?? ''),
      type: media.type,
    }));
  }, [post.medias]);

  const onUserLiked = useCallback(
    (value: IEmojiReaction | null) => {
      const payload: IPostLike = {
        postId: post._id,
        type: value?.value ?? null,
        isLike: value !== null,
      };
      onLikePost(payload);
    },
    [post._id, onLikePost]
  );

  return (
    <>
      <div className="w-full h-fit bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 flex-shrink-0">
        <div className="flex flex-col">
          <div className="flex w-full justify-between items-start pt-3 px-3 mb-3 flex-shrink-0">
            <div className="flex-1 flex items-start gap-1">
              <Link to={`/${post.authorId._id}`}>
                <AvatarUser
                  size={50}
                  avatar={post.authorId.avatar}
                  className="flex-shrink-0"
                />
              </Link>
              <div className="flex-1">
                <div className="w-full">
                  <div
                    className="font-semibold text-base inline-block cursor-pointer hover:underline"
                    onClick={() => {
                      navigate(`/${post.authorId._id}`);
                    }}
                  >
                    {post.authorId.fullname}
                  </div>
                  <UserTagsDisplay
                    userTags={post.userTags}
                    feeling={post.feeling}
                    onClickFeeling={() => {}}
                    onClickUserTag={() => {}}
                    type="post"
                  />
                </div>
                <div className="flex items-center gap-0.5">
                  <Tooltip title={exactTime} placement="bottom" arrow={false}>
                    <Text type="secondary" className="text-sm font-semibold">
                      {time}
                    </Text>
                  </Tooltip>
                  <div className="flex items-center gap-2">·</div>
                  {post.privacy === 'public' && (
                    <TbWorld size={16} className="text-gray-500" />
                  )}
                  {post.privacy === 'friends' && (
                    <TbUsers size={16} className="text-gray-500" />
                  )}
                  {post.privacy === 'private' && (
                    <TbLock size={16} className="text-gray-500" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {buttonClose && (
                <>
                  <Button type="text" shape="circle">
                    <TbDots size={24} className="text-gray-500" />
                  </Button>

                  <Button type="text" shape="circle">
                    <TbX size={24} className="text-gray-500" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="px-3 mb-2 flex-shrink-0">
            <div className="flex flex-col">
              <div
                className={`text-sm text-gray-800 whitespace-pre-wrap transition-all ${
                  isExpanded ? '' : 'line-clamp-2'
                }`}
              >
                {post.content}
              </div>

              {post.content.length > 100 && !isExpanded && (
                <div className="text-sm flex-shrink-0 font-semibold">
                  <div
                    className="inline-block font-semibold cursor-pointer hover:underline"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    Xem thêm
                  </div>
                </div>
              )}
            </div>
          </div>

          {medias.length > 0 && (
            <div className="mb-1.5 flex-1 overflow-hidden">
              <PostMediaGallery medias={medias} onClick={() => {}} />
            </div>
          )}
          <div className="px-3 mb-1.5 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 cursor-pointer">
                {post.likeCount > 0 && (
                  <>
                    <span className="flex items-center">
                      {(!userLiked || (userLiked && post.likeCount > 1)) && (
                        <div className="relative z-1 p-0.5 bg-white rounded-full">
                          <Lottie
                            animationData={emojiReactions[0].reSource}
                            loop={false}
                            className="size-5"
                          />
                        </div>
                      )}
                      {userLiked &&
                        (userLiked.emoji !== emojiReactions[0].emoji ||
                          post.likeCount === 1) && (
                          <div className="-ml-1 p-0.5 bg-white rounded-full">
                            <Lottie
                              animationData={userLiked.reSource}
                              loop={false}
                              className="size-5"
                            />
                          </div>
                        )}
                    </span>
                    <span className="text-gray-500 text-base hover:underline">
                      {formatNumberAbbreviate(post.likeCount)}
                    </span>
                  </>
                )}
              </div>
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={onClickComment}
              >
                {post.commentCount > 0 && (
                  <>
                    <span className="text-gray-500 text-base hover:underline">
                      {formatNumberAbbreviate(post.commentCount)}
                    </span>
                    <TbMessageCircleFilled
                      size={18}
                      className="text-gray-500"
                    />
                  </>
                )}
              </div>
            </div>
            <div className="flex border-t border-gray-200 pt-2">
              {/* TODO: Thích */}
              <PostButtonLike
                post={post}
                userLiked={userLiked}
                onUserLiked={onUserLiked}
              />
              {/* TODO: Bình luận */}
              <Button
                type="text"
                className="flex items-center flex-1"
                onClick={onClickComment}
              >
                <TbMessageCircle size={24} className="text-gray-500" />
                <Text className="text-sm font-semibold">Bình luận</Text>
              </Button>
              {/* TODO: Chia sẻ */}
              <Button type="text" className="flex items-center flex-1">
                <TbShare3 size={24} className="text-gray-500" />
                <Text className="text-sm font-semibold">Chia sẻ</Text>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostItem;
