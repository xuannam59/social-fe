import type { IPost } from '@social/types/posts.type';

export const POST_DEFAULT: IPost = {
  _id: '',
  content: '',
  privacy: '',
  medias: [],
  userTags: [],
  likeCount: 0,
  commentCount: 0,
  createdAt: '',
  updatedAt: '',
  authorId: {
    _id: '',
    fullname: '',
    avatar: '',
  },
  userLiked: {
    isLiked: false,
    type: null,
  },
};
