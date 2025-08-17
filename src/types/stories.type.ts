export interface IStory {
  _id: string;
  type: 'image' | 'video' | 'text';
  file: string;
  fullName: string;
  isCreate?: boolean;
  avatar?: string;
  privacy?: string;
  text?: string;
  backgroundColor?: string;
}

export interface IFormCreateStory {
  type: 'image' | 'video' | 'text';
  file?: File;
  privacy: string;
  text?: string;
  backgroundColor?: string;
}
