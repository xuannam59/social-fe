import type { IUser, IUserTag } from './user.type';

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
  userId: string;
  userInfo: Pick<IUser, '_id' | 'fullname' | 'avatar'>;
}

export interface IFormCreatePost {
  content: string;
  privacy: string;
  medias?: Array<{
    keyS3: string;
    type: string;
  }>;
  userTags?: IUserTag[];
  feeling?: string;
}
export interface IActionLike {
  postId: string;
  type: number;
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
