import {
  convertErrorMessage,
  convertUrlString,
  formatFullDateTime,
  formatNumberAbbreviate,
  formatRelativeTime,
} from '@social/common/convert';
import { emojiReactions } from '@social/constants/emoji';
import { useAppDispatch, useAppSelector } from '@social/hooks/redux.hook';
import type { IPost } from '@social/types/posts.type';
import { Button, Dropdown, message, Modal, Tooltip, Typography } from 'antd';
import Lottie from 'lottie-react';
import React, { useCallback, useMemo, useState } from 'react';
import {
  TbDots,
  TbLock,
  TbLockFilled,
  TbMessageCircle,
  TbMessageCircleFilled,
  TbPencil,
  TbShare3,
  TbTrash,
  TbUsers,
  TbWorld,
} from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import AvatarUser from '../common/AvatarUser';
import UserTagsDisplay from '../common/UserTagsDisplay';
import PostButtonLike from './PostButtonLike';
import PostMediaGallery from './PostMediaGallery';
import { callApiDeletePost } from '@social/apis/posts.api';
import { doDeletePost } from '@social/redux/reducers/post.reducer';
import ModalSharePost from '../modals/posts/ModalSharePost';
import PostShareContent from './PostShareContent';

const { Text } = Typography;

interface IProps {
  post: IPost;
  buttonClose?: boolean;
  onClickComment: () => void;
  onLikePost: (type: number, isLike: boolean) => void;
  onClickEditPost?: () => void;
  onDeletePost?: () => void;
}

const PostView: React.FC<IProps> = ({
  post,
  buttonClose = true,
  onClickComment,
  onLikePost,
  onClickEditPost,
  onDeletePost,
}) => {
  const navigate = useNavigate();
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const dispatch = useAppDispatch();
  const time = formatRelativeTime(post.createdAt);
  const exactTime = formatFullDateTime(post.createdAt);
  const [openModalSharePost, setOpenModalSharePost] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const totalLikes = useMemo(() => {
    return post.userLikes.length;
  }, [post.userLikes.length]);
  const myLike = useMemo(() => {
    const userLiked = post.userLiked;
    if (!userLiked) return null;
    return emojiReactions.find(emoji => emoji.value === userLiked.type) ?? null;
  }, [post.userLiked]);

  const isMyPost = useMemo(() => {
    return post.authorId._id === userInfo._id;
  }, [post.authorId._id, userInfo._id]);

  const postParent = useMemo(() => {
    return post.parentId ? post.parentId : null;
  }, [post.parentId]);

  const medias = useMemo(
    () =>
      post.medias.map(media => ({
        id: uuidv4(),
        url: convertUrlString(media.keyS3 ?? ''),
        type: media.type,
      })),
    [post.medias]
  );

  const onUserLiked = useCallback(
    (type: number, isLike: boolean) => {
      onLikePost(type, isLike);
    },
    [onLikePost]
  );

  if (postParent) {
    console.log(postParent);
  }

  const handleNavigateToProfile = () => {
    navigate(`/${post.authorId._id}`);
  };

  const handleDeletePost = async () => {
    if (onDeletePost && isMyPost) {
      Modal.confirm({
        title: 'Xoá bài viết',
        content: `Bạn có chắc chắn muốn xoá bài viết này không?`,
        centered: true,
        onOk: async () => {
          try {
            const res = await callApiDeletePost(post._id);
            if (res.data) {
              onDeletePost();
              dispatch(doDeletePost(post._id));
              message.success('Xoá bài viết thành công');
            } else {
              message.error(convertErrorMessage(res.message));
            }
          } catch (error) {
            console.log(error);
          }
        },
        okText: 'Xoá',
        cancelText: 'Hủy',
      });
    }
  };

  const handleEditPost = () => {
    if (onClickEditPost && isMyPost) {
      onClickEditPost();
    }
  };

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
                  {isMyPost && (
                    <>
                      <Dropdown
                        trigger={['click']}
                        placement="bottomRight"
                        arrow={true}
                        menu={{
                          items: [
                            {
                              label: (
                                <div className="flex items-center gap-2">
                                  <TbTrash size={18} className="text-red-500" />
                                  <span className="text-base text-red-500">
                                    Xoá bài viết
                                  </span>
                                </div>
                              ),
                              key: 'delete',
                              onClick: handleDeletePost,
                            },
                            {
                              label: 'Sửa bài viết',
                              key: 'edit',
                              icon: <TbPencil size={20} />,
                              onClick: handleEditPost,
                            },
                          ],
                        }}
                      >
                        <Button type="text" shape="circle">
                          <TbDots size={24} className="text-gray-500" />
                        </Button>
                      </Dropdown>
                    </>
                  )}
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
          {(post.parentId === null ||
            (post.parentId && post.parentId.privacy === 'private')) && (
            <>
              <div className="w-full px-3">
                <div className="border border-gray-200 p-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      <TbLockFilled size={30} />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="text-sm font-semibold">
                        Nội Dung bài viết không thể hiển thị
                      </div>
                      <div className="text-sm text-gray-500">
                        Lỗi này thường do chủ sở hữu đã thay đổi người được xem
                        hoặc xóa nội dung.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {postParent && postParent.privacy !== 'private' && (
            <PostShareContent post={postParent} />
          )}
          <div className="px-3 mb-1.5 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 cursor-pointer">
                {totalLikes > 0 && (
                  <>
                    <span className="flex items-center">
                      {(!myLike || (myLike && totalLikes > 1)) && (
                        <div className="relative z-1 p-0.5 bg-white rounded-full">
                          <Lottie
                            animationData={emojiReactions[0].reSource}
                            loop={false}
                            className="size-5"
                          />
                        </div>
                      )}
                      {myLike &&
                        (myLike.emoji !== emojiReactions[0].emoji ||
                          totalLikes === 1) && (
                          <div className="-ml-1 p-0.5 bg-white rounded-full">
                            <Lottie
                              animationData={myLike.reSource}
                              loop={false}
                              className="size-5"
                            />
                          </div>
                        )}
                    </span>
                    <span className="text-gray-500 text-base hover:underline">
                      {formatNumberAbbreviate(totalLikes)}
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
                {post.shareCount > 0 && (
                  <>
                    <span className="text-gray-500 text-base hover:underline">
                      {formatNumberAbbreviate(post.shareCount)}
                    </span>
                    <TbShare3 size={18} className="text-gray-500" />
                  </>
                )}
              </div>
            </div>
            <div className="flex border-t border-gray-200 pt-2">
              <PostButtonLike
                post={post}
                userLiked={myLike}
                onUserLiked={onUserLiked}
              />
              <Button
                type="text"
                className="flex items-center flex-1"
                onClick={onClickComment}
              >
                <TbMessageCircle size={24} className="text-gray-500" />
                <Text className="text-sm font-semibold">Bình luận</Text>
              </Button>
              <Button
                type="text"
                className="flex items-center flex-1"
                onClick={() => setOpenModalSharePost(true)}
              >
                <TbShare3 size={24} className="text-gray-500" />
                <Text className="text-sm font-semibold">Chia sẻ</Text>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ModalSharePost
        open={openModalSharePost}
        parentId={post.parentId ? post.parentId._id : post._id}
        onClose={() => setOpenModalSharePost(false)}
      />
    </>
  );
};

export default PostView;
