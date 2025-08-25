import type { IUserTag } from './user.type';

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

export interface IMedia {
  url: string;
  file?: File;
  type: string;
}

export enum EOpenContent {
  POST = 'post',
  USER_TAG = 'userTag',
  FEELING = 'feeling',
}
