import type { IComment } from '@social/types/comments.type';
import type { IPost } from '@social/types/posts.type';

export const POST_DEFAULT: IPost = {
  _id: '',
  content: '',
  privacy: '',
  medias: [],
  userTags: [],
  userLikes: [],
  userLiked: null,
  commentCount: 0,
  shareCount: 0,
  authorId: {
    _id: '',
    fullname: '',
    avatar: '',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const COMMENT_DEFAULT: IComment = {
  _id: new Date().getTime().toString(),
  content: '',
  mentions: [],
  postId: '',
  level: 0,
  authorId: {
    _id: '',
    fullname: '',
    avatar: '',
  },
  userLikes: [],
  replyCount: 0,
  isEdited: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
