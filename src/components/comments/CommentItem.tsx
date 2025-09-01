import {
  callApiCommentLike,
  callApiCreateComment,
  callGetComments,
} from '@social/apis/comment.api';
import {
  convertErrorMessage,
  formatRelativeTime,
} from '@social/common/convert';
import { renderComment } from '@social/common/render';
import { emojiReactions } from '@social/constants/emoji';
import { COMMENT_DEFAULT } from '@social/defaults/post';
import { useAppSelector } from '@social/hooks/redux.hook';
import type { IComment, IFormComment } from '@social/types/comments.type';
import type { IEmojiReaction } from '@social/types/commons.type';
import { Button, Form, message, Spin, Typography } from 'antd';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { TbChevronDown, TbLoader2, TbTrash } from 'react-icons/tb';
import { v4 as uuidv4 } from 'uuid';
import AvatarUser from '../common/AvatarUser';
import ButtonLike from '../common/ButtonLike';
import CommentInput from './CommentInput';

interface IProps {
  comment: IComment;
  level: number;
  replyStatus?: 'success' | 'error' | 'pending';
  requestReplyOnParent?: (fullname: string, authorId: string) => void;
}
const { Paragraph } = Typography;

const CommentItem: React.FC<IProps> = ({
  comment,
  level,
  replyStatus = 'success',
  requestReplyOnParent,
}) => {
  const time = useMemo(
    () => formatRelativeTime(comment.createdAt),
    [comment.createdAt]
  );
  const [openReply, setOpenReply] = useState(false);
  const [userLiked, setUserLiked] = useState<IEmojiReaction | null>(
    comment.userLiked.type
      ? (emojiReactions.find(emoji => emoji.value === comment.userLiked.type) ??
          null)
      : null
  );
  const [countLike, setCountLike] = useState(comment.likeCount);
  const [replyProcess, setReplyProcess] = useState<
    'success' | 'error' | 'pending'
  >('success');
  const [isLoadingShowMore, setIsLoadingShowMore] = useState(false);
  const [commentChildren, setCommentChildren] = useState<IComment[]>([]);
  const commentReply = useRef<IComment | null>(null);
  const commentInputRef = useRef<HTMLDivElement>(null);
  const countReplyPresent = useRef(0);
  const [form] = Form.useForm();
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const author = comment.authorId;
  const defaultEmoji = emojiReactions[0];

  const getCommentChildren = useCallback(async () => {
    setIsLoadingShowMore(true);
    const res = await callGetComments(
      comment.postId,
      `level=${Math.min(level, 2)}&parentId=${comment._id}`
    );
    if (res.data) {
      setCommentChildren(prev => [...prev, ...res.data]);
    }
    setIsLoadingShowMore(false);
  }, [comment, level]);

  const onUserLiked = useCallback(
    async (type: number, isLike: boolean) => {
      const previousState = userLiked;

      if (isLike) {
        if (!userLiked) {
          setCountLike(prev => prev + 1);
        }
        setUserLiked(
          emojiReactions.find(emoji => emoji.value === type) ?? null
        );
      } else {
        setUserLiked(null);
        setCountLike(prev => prev - 1);
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
          setUserLiked(previousState);
          setCountLike(prev => prev - 1);
        }
      } catch (error) {
        console.log(error);
        setUserLiked(previousState);
        setCountLike(prev => prev - 1);
      }
    },
    [userLiked, comment._id]
  );

  const onClickReply = useCallback(
    (fullname: string, authorId: string) => {
      setOpenReply(true);

      setTimeout(() => {
        form.focusField(comment._id);
        form.setFieldValue(comment._id, `@[${fullname}](${authorId}) `);

        if (commentInputRef.current) {
          commentInputRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        }
      }, 100);
    },
    [form, comment]
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
      const commentReplyCurrent = commentReply.current;
      if (commentReplyCurrent) {
        setCommentChildren(prev => [...prev, commentReplyCurrent]);
        countReplyPresent.current++;
      }
      const { content, parentId, medias, mentions, level } = values;
      const payload = {
        content,
        parentId,
        postId: comment.postId,
        medias,
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
        const res = await callApiCreateComment(payload);
        if (res.data) {
          commentReply.current._id = res.data._id;
          setReplyProcess('success');
        } else {
          message.error(convertErrorMessage(res.message));
          setReplyProcess('error');
        }
      } catch (error) {
        console.log(error);
        setReplyProcess('error');
      }
    },
    [comment.postId, userInfo]
  );

  const renderReplyProcess = useCallback(() => {
    switch (replyStatus) {
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
            <ButtonLike onActionLike={onUserLiked}>
              {userLiked ? (
                <div
                  className="text-xs hover:underline font-semibold cursor-pointer text-gray-500"
                  onClick={() => onUserLiked(userLiked.value, false)}
                  style={{ color: userLiked.color }}
                >
                  {userLiked.label}
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
            {countLike > 0 && (
              <div className="text-xs font-medium text-gray-500 flex-1 flex justify-end px-2">
                {countLike > 1 && (
                  <div className="text-xs font-medium text-gray-500">
                    {countLike}
                  </div>
                )}
                <div className="px-1">
                  {countLike === 1 && userLiked
                    ? userLiked.emoji
                    : defaultEmoji.emoji}
                  {userLiked &&
                    countLike > 1 &&
                    userLiked.emoji !== defaultEmoji.emoji &&
                    userLiked.emoji}
                </div>
              </div>
            )}
          </div>
        );
    }
  }, [
    replyStatus,
    time,
    onUserLiked,
    countLike,
    userLiked,
    handleReplyClickCurrent,
    defaultEmoji,
  ]);

  const handleDeleteComment = useCallback(() => {
    console.log('delete comment', comment._id);
  }, [comment]);
  return (
    <>
      <div className={`flex items-start gap-2 `}>
        <AvatarUser size={30} avatar={comment.authorId.avatar} />
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
                    >
                      <TbTrash size={16} className="text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
              {renderReplyProcess()}
            </div>
          </div>
          <div className="ml-2">
            {comment.replyCount > 0 &&
              level <= 2 &&
              commentChildren.length === countReplyPresent.current && (
                <div
                  className="text-sm font-medium text-gray-500 mt-2 cursor-pointer flex items-center gap-1"
                  onClick={getCommentChildren}
                >
                  <TbChevronDown size={16} />
                  <span>Xem tất cả {comment.replyCount} phản hồi</span>
                  {isLoadingShowMore && (
                    <TbLoader2 size={16} className="animate-spin" />
                  )}
                </div>
              )}
            {level <= 2 &&
              commentChildren.length > 0 &&
              commentChildren.map(child => (
                <div key={child._id} className="mt-2">
                  <CommentItem
                    comment={child}
                    level={level + 1}
                    requestReplyOnParent={onClickReply}
                  />
                </div>
              ))}
            {commentReply.current && (
              <div className="mt-2">
                <CommentItem
                  comment={commentReply.current}
                  level={level + 1}
                  replyStatus={replyProcess}
                  requestReplyOnParent={onClickReply}
                />
              </div>
            )}
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
