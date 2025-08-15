import type { IUserTag } from './user.type';

export interface IFormCreatePost {
  content: string;
  privacy: string;
  images?: File[];
  video?: string;
  userTags?: IUserTag[];
  feeling?: string;
}

export interface IFile {
  url: string;
  file: File;
}

export enum EOpenContent {
  POST = 'post',
  USER_TAG = 'userTag',
  FEELING = 'feeling',
}
