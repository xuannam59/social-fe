export interface IStory {
  _id: string;
  type: 'image' | 'video' | 'text';
  file: string;
  fullName: string;
  avatar?: string;
  privacy?: string;
  content?: string;
  backgroundColor?: string;
}

export interface IFormCreateStory {
  type: 'image' | 'video' | 'text';
  file?: File;
  privacy: string;
  content?: string;
  backgroundColor?: string;
}
