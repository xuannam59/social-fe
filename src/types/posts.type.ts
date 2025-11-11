import type { IUserTag } from './user.type';

export interface IPostState {
  listPosts: IPost[];
  scroll: number;
  isLoadingPosts: boolean;
  total: number;
  page: number;
}

export interface IPost {
  _id: string;
  content: string;
  privacy: string;
  medias: {
    keyS3: string;
    type: string;
  }[];
  authorId: {
    _id: string;
    fullname: string;
    avatar: string;
  };
  userLikes: {
    userId: string;
    type: number;
  }[];
  userLiked: IUserLiked | null;
  userTags: IUserTag[];
  feeling?: string;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IFormCreatePost {
  content: string;
  privacy: string;
  medias?: Array<{
    keyS3: string;
    type: string;
  }>;
  userTags?: string[];
  feeling?: string;
}

export interface IPostLike {
  postId: string;
  type: number | null;
  isLike: boolean;
}

export interface IPreviewMedia {
  id: string;
  url: string;
  file?: File;
  type: string;
}

export enum EOpenContent {
  POST = 'post',
  USER_TAG = 'userTag',
  FEELING = 'feeling',
}

export interface IUserLiked {
  userId: string;
  type: number;
}
