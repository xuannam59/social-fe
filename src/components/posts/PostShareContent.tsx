import React, { useMemo, useState } from 'react';
import type { IPost } from '@social/types/posts.type';
import { v4 as uuidv4 } from 'uuid';
import {
  convertUrlString,
  formatFullDateTime,
  formatRelativeTime,
} from '@social/common/convert';
import PostMediaGallery from './PostMediaGallery';
import { Link, useNavigate } from 'react-router-dom';
import AvatarUser from '../common/AvatarUser';
import UserTagsDisplay from '../common/UserTagsDisplay';
import { Tooltip } from 'antd';
import { TbLock, TbUsers, TbWorld } from 'react-icons/tb';

interface IProps {
  post: IPost;
}

const PostShareContent: React.FC<IProps> = ({ post }) => {
  const navigate = useNavigate();
  const time = formatRelativeTime(post.createdAt);
  const exactTime = formatFullDateTime(post.createdAt);
  const [isExpanded, setIsExpanded] = useState(false);

  const medias = useMemo(
    () =>
      post.medias.map(media => ({
        id: uuidv4(),
        url: convertUrlString(media.keyS3 ?? ''),
        type: media.type,
      })),
    [post.medias]
  );

  const handleNavigateToProfile = () => {
    navigate(`/${post.authorId._id}`);
  };

  return (
    <>
      <div className="w-full px-3">
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          {medias.length > 0 && (
            <>
              <div className="mb-1.5 flex-1 overflow-hidden">
                <PostMediaGallery medias={medias} onClick={() => {}} />
              </div>
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
                        onClick={handleNavigateToProfile}
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
                      <Tooltip
                        title={exactTime}
                        placement="bottom"
                        arrow={false}
                      >
                        <span className="text-sm font-semibold text-gray-500">
                          {time}
                        </span>
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PostShareContent;
