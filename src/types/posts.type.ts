import type { IUser, IUserTag } from './user.type';

export interface IPostState {
  listPosts: IPost[];
  tempPosts: IPost[];
  scroll: number;
  isLoadingPosts: boolean;
}

export interface IPost {
  _id: string;
  content: string;
  privacy: string;
  medias: {
    keyS3: string;
    type: string;
  }[];
  userTags: IUserTag[];
  feeling?: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  authorId: Pick<IUser, '_id' | 'fullname' | 'avatar'>;
  userLiked: {
    isLiked: boolean;
    type: number | null;
  };
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
