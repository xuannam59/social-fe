export interface IStory {
  _id: string;
  type: 'image' | 'video';
  file: string;
  fullName: string;
  isCreate?: boolean;
  avatar?: string;
}
