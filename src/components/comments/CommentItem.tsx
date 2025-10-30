import {
  callApiCommentLike,
  callApiCreateComment,
  callApiDeleteComment,
  callGetComments,
} from '@social/apis/comment.api';
import {
  convertErrorMessage,
  convertUrlString,
  formatRelativeTime,
} from '@social/common/convert';
import { renderComment } from '@social/common/render';
import { smartUpload } from '@social/common/uploads';
import { emojiReactions } from '@social/constants/emoji';
import { COMMENT_DEFAULT } from '@social/defaults/post';
import { useAppSelector } from '@social/hooks/redux.hook';
import type { IComment, IFormComment } from '@social/types/comments.type';
import {
  Button,
  Form,
  Image,
  Spin,
  Typography,
  message,
  notification,
} from 'antd';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { TbChevronDown, TbLoader2, TbTrash } from 'react-icons/tb';
import { v4 as uuidv4 } from 'uuid';
import AvatarUser from '../common/AvatarUser';
import ButtonLike from '../common/ButtonLike';
import CommentInput from './CommentInput';
import { useSockets } from '@social/providers/SocketProvider';
import { NOTIFICATION_MESSAGE } from '@social/defaults/socket.default';
import type { IPost } from '@social/types/posts.type';
import type { IEmojiReaction } from '@social/types/commons.type';

interface IProps {
  post: IPost;
  comment: IComment;
  level: number;
  commentStatus?: 'success' | 'error' | 'pending';
  requestReplyOnParent?: (fullname: string, authorId: string) => void;
  onDeleteComment: (commentId: string, countDeleted: number) => void;
  onAddComment: (postId: string) => void;
}
const { Paragraph } = Typography;

const CommentItem: React.FC<IProps> = ({
  post,
  comment,
  level,
  commentStatus = 'success',
  requestReplyOnParent,
  onDeleteComment,
  onAddComment,
}) => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const { socket } = useSockets();
  const time = useMemo(
    () => formatRelativeTime(comment.createdAt),
    [comment.createdAt]
  );
  const [openReply, setOpenReply] = useState(false);
  const [myLike, setMyLike] = useState<IEmojiReaction | null>(() => {
    const userLike = comment.userLikes.find(
      like => like.userId === userInfo._id
    );
    return userLike
      ? (emojiReactions.find(emoji => emoji.value === userLike.type) ?? null)
      : null;
  });
  const [userLikes, setUserLikes] = useState(comment.userLikes);
  const [replyCount, setReplyCount] = useState(comment.replyCount);
  const [isOpenAllReply, setIsOpenAllReply] = useState(false);
  const [replyProcess, setReplyProcess] = useState<
    'success' | 'error' | 'pending'
  >('success');
  const [isLoadingShowMore, setIsLoadingShowMore] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [commentChildren, setCommentChildren] = useState<IComment[]>([]);
  const commentReply = useRef<IComment | null>(null);
  const commentInputRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();
  const author = comment.authorId;
  const defaultEmoji = emojiReactions[0];

  const getCommentChildren = useCallback(async () => {
    setIsLoadingShowMore(true);
    const res = await callGetComments(
      comment.postId,
      `level=${Math.min(level, 2)}&parentId=${comment._id}`
    );
    if (res.data) {
      const existedIds = commentChildren.map(child => child._id);
      const getData = res.data.list.filter(
        child => !existedIds.includes(child._id)
      );
      setCommentChildren(prev => [...prev, ...getData]);
      setIsOpenAllReply(true);
    }
    setIsLoadingShowMore(false);
  }, [comment, level, commentChildren]);

  const onUserLiked = useCallback(
    async (type: number, isLike: boolean) => {
      if (isLike) {
        if (!myLike) {
          setUserLikes(prev => [...prev, { userId: userInfo._id, type }]);
        }
        setMyLike(emojiReactions.find(emoji => emoji.value === type) ?? null);
      } else {
        setUserLikes(prev => prev.filter(like => like.userId !== userInfo._id));
        setMyLike(null);
      }

      const payload = {
        commentId: comment._id,
        type,
        isLike,
      };
      try {
        const res = await callApiCommentLike(payload);
        if (!res.data) {
          message.error(convertErrorMessage(res.message));
          setUserLikes(prev =>
            prev.filter(like => like.userId !== userInfo._id)
          );
        }
      } catch (error) {
        console.log(error);
        setUserLikes(prev => prev.filter(like => like.userId !== userInfo._id));
      }
    },
    [comment._id, userInfo._id, myLike]
  );

  const onClickReply = useCallback(
    (fullname: string, authorId: string) => {
      setOpenReply(true);

      setTimeout(() => {
        form.focusField(comment._id);
        if (comment.authorId._id !== userInfo._id) {
          form.setFieldValue(comment._id, `@[${fullname}](${authorId}) `);
        } else {
          form.setFieldValue(comment._id, '');
        }

        if (commentInputRef.current) {
          commentInputRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        }
      }, 100);
    },
    [form, comment, userInfo._id]
  );

  const handleReplyClickCurrent = useCallback(() => {
    if (level > 2 && requestReplyOnParent) {
      requestReplyOnParent(author.fullname, author._id);
    } else {
      onClickReply(author.fullname, author._id);
    }
  }, [level, requestReplyOnParent, onClickReply, author]);

  const onSubmitReply = useCallback(
    async (values: IFormComment) => {
      const { content, parentId, media, mentions, level } = values;
      const payload = {
        content,
        parentId,
        postId: comment.postId,
        media,
        mentions,
        level,
      };

      commentReply.current = {
        ...COMMENT_DEFAULT,
        ...payload,
        mentions: mentions.map(mention => ({
          _id: uuidv4(),
          ...mention,
        })),
        authorId: {
          _id: userInfo._id,
          fullname: userInfo.fullname,
          avatar: userInfo.avatar,
        },
      };
      try {
        setReplyProcess('pending');
        let mediasUpload: { keyS3: string; type: string } | undefined =
          undefined;
        if (media?.file) {
          const file = media.file;
          if (file) {
            const res = await smartUpload(file);
            if (res.data) {
              mediasUpload = {
                keyS3: res.data.key,
                type: file.type.split('/')[0],
              };
            } else {
              throw new Error(res.message);
            }
          }
        }
        const res = await callApiCreateComment({
          ...payload,
          media: mediasUpload,
        });
        if (res.data) {
          const commentReplyCurrent = commentReply.current;
          if (commentReplyCurrent) {
            setCommentChildren(prev => [
              {
                ...commentReplyCurrent,
                _id: res.data._id,
                media: mediasUpload,
              },
              ...prev,
            ]);
            commentReply.current = null;
            setReplyCount(prev => prev + 1);
            setIsOpenAllReply(true);
          }
          setReplyProcess('success');
          onAddComment(comment.postId);
          if (
            comment.authorId._id !== userInfo._id ||
            post.authorId._id !== userInfo._id
          ) {
            socket.emit(NOTIFICATION_MESSAGE.POST_COMMENT, {
              postId: post._id,
              content,
              postAuthorId: post.authorId._id,
              commentId: res.data._id,
              commentAuthorId: comment.authorId._id,
              mentionsList: mentions.map(mention => mention.userId),
            });
          }
        } else {
          message.error(convertErrorMessage(res.message));
          setReplyProcess('error');
        }
      } catch (error) {
        console.log(error);
        setReplyProcess('error');
      }
    },
    [comment, userInfo, onAddComment, socket, post]
  );

  const renderReplyProcess = useCallback(() => {
    switch (commentStatus) {
      case 'pending':
        return (
          <div className="text-gray-500 flex gap-2 items-center">
            Đang gửi... <Spin size="small" />
          </div>
        );
      case 'error':
        return <div className="text-red-500">Lỗi</div>;
      case 'success':
        return (
          <div className="flex gap-3 items-center ml-2">
            <div className="text-xs text-gray-500">{time}</div>
            <ButtonLike onActionLike={onUserLiked} likedType={myLike?.value}>
              {myLike ? (
                <div
                  className="text-xs hover:underline font-semibold cursor-pointer text-gray-500"
                  onClick={() => onUserLiked(myLike.value, false)}
                  style={{ color: myLike.color }}
                >
                  {myLike.label}
                </div>
              ) : (
                <div
                  className="text-xs hover:underline font-semibold cursor-pointer text-gray-500"
                  onClick={() => onUserLiked(emojiReactions[0].value, true)}
                >
                  Thích
                </div>
              )}
            </ButtonLike>
            <div
              className="text-xs text-gray-500 cursor-pointer hover:underline"
              onClick={handleReplyClickCurrent}
            >
              Trả lời
            </div>
            {userLikes.length > 0 && (
              <div className="text-xs font-medium text-gray-500 flex-1 flex justify-end px-2">
                {userLikes.length > 1 && (
                  <div className="text-xs font-medium text-gray-500">
                    {userLikes.length}
                  </div>
                )}
                <div className="px-1">
                  {userLikes.length === 1 && myLike
                    ? myLike.emoji
                    : defaultEmoji.emoji}
                  {myLike &&
                    userLikes.length > 1 &&
                    myLike.emoji !== defaultEmoji.emoji &&
                    myLike.emoji}
                </div>
              </div>
            )}
          </div>
        );
    }
  }, [
    commentStatus,
    time,
    onUserLiked,
    myLike,
    handleReplyClickCurrent,
    defaultEmoji,
    userLikes,
  ]);

  const handleDeleteComment = useCallback(async () => {
    try {
      setIsLoadingDelete(true);
      const res = await callApiDeleteComment(comment._id);
      if (res.data) {
        const data = res.data;
        message.success('Xóa bình luận thành công');
        if (onDeleteComment) {
          onDeleteComment(data.commentId, data.countDeleted);
        }
      } else {
        notification.error({
          message: 'Xóa bình luận thất bại',
          description: convertErrorMessage(res.message),
        });
      }
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: 'Xóa bình luận thất bại',
        description: convertErrorMessage(error.message),
      });
    } finally {
      setIsLoadingDelete(false);
    }
  }, [comment, onDeleteComment]);

  const onDeleteCommentChild = useCallback(
    (commentId: string, countDeleted: number) => {
      setCommentChildren(prev => prev.filter(child => child._id !== commentId));
      setReplyCount(prev => Math.max(0, prev - countDeleted));
      onDeleteComment(commentId, countDeleted);
    },
    [onDeleteComment]
  );
  return (
    <>
      <div className={`flex items-start gap-2 `}>
        <div className="flex-shrink-0">
          <AvatarUser size={40} avatar={comment.authorId.avatar} />
        </div>
        <div className="w-full">
          <div className="w-full group/comment">
            <div className="w-fit max-w-[80%] ">
              <div className="flex items-center gap-2">
                <div className="bg-gray-200 rounded-xl p-2 mb-1">
                  <div className="text-sm font-semibold cursor-pointer">
                    {author.fullname}
                  </div>
                  <Paragraph className="!m-0">
                    {renderComment(comment.content, comment.mentions)}
                  </Paragraph>
                </div>
                {author._id === userInfo._id && (
                  <div className={`group-hover/comment:block hidden`}>
                    <Button
                      type="text"
                      shape="circle"
                      onClick={handleDeleteComment}
                      disabled={isLoadingDelete}
                      danger
                    >
                      <TbTrash size={16} />
                    </Button>
                  </div>
                )}
              </div>
              {comment.media && (
                <div className="flex flex-wrap gap-2">
                  <div className="w-30">
                    <Image
                      src={
                        comment.media.file
                          ? URL.createObjectURL(comment.media.file)
                          : convertUrlString(comment.media.keyS3)
                      }
                      alt="image"
                      className="w-full h-full object-cover rounded-lg border border-gray-200 "
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
              {renderReplyProcess()}
            </div>
          </div>
          <div className="ml-2">
            {replyCount > 0 && level <= 2 && !isOpenAllReply && (
              <div
                className="text-sm font-medium text-gray-500 mt-2 cursor-pointer flex items-center gap-1"
                onClick={getCommentChildren}
              >
                <TbChevronDown size={16} />
                <span>Xem tất cả {replyCount} phản hồi</span>
                {isLoadingShowMore && (
                  <TbLoader2 size={16} className="animate-spin" />
                )}
              </div>
            )}
            {commentReply.current && (
              <div className="mt-2">
                <CommentItem
                  post={post}
                  comment={commentReply.current}
                  level={level + 1}
                  commentStatus={replyProcess}
                  requestReplyOnParent={onClickReply}
                  onDeleteComment={() => {}}
                  onAddComment={() => {}}
                />
              </div>
            )}
            {level <= 2 &&
              commentChildren.length > 0 &&
              commentChildren.map(child => (
                <div key={child._id} className="mt-2">
                  <CommentItem
                    post={post}
                    comment={child}
                    level={level + 1}
                    requestReplyOnParent={onClickReply}
                    onDeleteComment={onDeleteCommentChild}
                    onAddComment={onAddComment}
                  />
                </div>
              ))}
          </div>
          {openReply && level <= 2 && (
            <div ref={commentInputRef}>
              <CommentInput
                form={form}
                onSubmit={onSubmitReply}
                parentId={comment._id}
                placeEmoji="bottomLeft"
                level={level}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentItem;
