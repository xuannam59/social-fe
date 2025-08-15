import type { IUserTag } from './user.type';

export interface IFormCreatePost {
  content: string;
  privacy: string;
  images?: File[];
  videos?: File[];
  userTags?: IUserTag[];
  feeling?: string;
}

export interface IFile {
  url: string;
  file: File;
  type: string;
}

export enum EOpenContent {
  POST = 'post',
  USER_TAG = 'userTag',
  FEELING = 'feeling',
}
