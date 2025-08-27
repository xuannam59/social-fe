import { callApiGetUserLiked } from '@social/apis/posts.api';
import {
  convertUrlString,
  formatFullDateTime,
  formatNumberAbbreviate,
  formatRelativeTime,
} from '@social/common/convert';
import { emojiReactions } from '@social/constants/emoji';
import type { IEmojiReaction } from '@social/types/commons.type';
import type { IPost } from '@social/types/posts.type';
import { Button, Tooltip, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  TbDots,
  TbMessageCircle,
  TbMessageCircleFilled,
  TbShare3,
  TbX,
} from 'react-icons/tb';
import AvatarUser from '../common/AvatarUser';
import UserTagsDisplay from '../common/UserTagsDisplay';
import PostButtonLike from './PostButtonLike';
import PostMediaGallery from './PostMediaGallery';

const { Text } = Typography;

interface IProps {
  post: IPost;
}

const PostItem: React.FC<IProps> = ({ post }) => {
  const time = formatRelativeTime(post.createdAt);
  const exactTime = formatFullDateTime(post.createdAt);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userLiked, setUserLiked] = useState<IEmojiReaction | null>(null);

  const medias = useMemo(() => {
    return post.medias.map(media => ({
      url: convertUrlString(media.keyS3 ?? ''),
      type: media.type,
    }));
  }, [post.medias]);

  const getUserLiked = useCallback(async () => {
    const res = await callApiGetUserLiked(post._id);
    if (res.data) {
      const emoji = emojiReactions.find(emoji => emoji.value === res.data.type);
      setUserLiked(emoji ?? null);
    }
  }, [post._id]);

  const onUserLiked = useCallback((value: IEmojiReaction | null) => {
    setUserLiked(value);
  }, []);

  useEffect(() => {
    getUserLiked();
  }, [getUserLiked]);
  return (
    <>
      <div className="w-full h-fit bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
        <div className="w-full h-full flex flex-col">
          <div className="flex w-full justify-between items-center pt-3 px-3 mb-3 flex-shrink-0">
            <div className="flex-1 flex items-start gap-1">
              <AvatarUser
                size={50}
                avatar={post.userInfo.avatar}
                className="flex-shrink-0"
              />
              <div className="flex-1">
                <div className="w-full">
                  <div className="font-semibold text-base inline-block">
                    {post.userInfo.fullname}
                  </div>
                  <UserTagsDisplay
                    userTags={post.userTags}
                    feeling={post.feeling}
                    onClickFeeling={() => {}}
                    onClickUserTag={() => {}}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip title={exactTime} placement="bottom" arrow={false}>
                    <Text type="secondary" className="text-sm font-semibold">
                      {time}
                    </Text>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="text" shape="circle">
                <TbDots size={24} className="text-gray-500" />
              </Button>
              <Button type="text" shape="circle">
                <TbX size={24} className="text-gray-500" />
              </Button>
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
              <div className="flex items-center gap-1">
                {post.likeCount > 0 && (
                  <>
                    <span className="text-base">{emojiReactions[0].emoji}</span>
                    <span className="text-gray-500 text-base">
                      {userLiked && 'Bạn và '}
                      {formatNumberAbbreviate(post.likeCount)}
                      {userLiked && ' người khác'}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                {post.commentCount > 0 && (
                  <>
                    <span className="text-gray-500 text-base">
                      {formatNumberAbbreviate(post.commentCount)}
                    </span>
                    <TbMessageCircleFilled size={18} />
                  </>
                )}
              </div>
            </div>
            <div className="flex border-t border-gray-200 pt-2">
              <PostButtonLike
                postId={post._id}
                userLiked={userLiked}
                onUserLiked={onUserLiked}
              />
              <Button type="text" className="flex items-center flex-1">
                <TbMessageCircle size={24} className="text-gray-500" />
                <Text className="text-sm font-semibold">Bình luận</Text>
              </Button>
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
