import type { IComment } from '@social/types/comments.type';
import type { IPost } from '@social/types/posts.type';
import { v4 as uuidv4 } from 'uuid';

export const POST_DEFAULT: IPost = {
  _id: '',
  content: '',
  privacy: '',
  medias: [],
  userTags: [],
  likeCount: 0,
  commentCount: 0,
  authorId: {
    _id: '',
    fullname: '',
    avatar: '',
  },
  userLiked: {
    isLiked: false,
    type: null,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const COMMENT_DEFAULT: IComment = {
  _id: Math.random().toString(36).substring(2, 15),
  content: '',
  medias: [],
  mentions: [],
  postId: '',
  level: 0,
  authorId: {
    _id: '',
    fullname: '',
    avatar: '',
  },
  userLiked: {
    isLiked: false,
    type: null,
  },
  likeCount: 0,
  replyCount: 0,
  isEdited: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
