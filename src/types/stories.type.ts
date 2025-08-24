export interface IStory {
  _id: string;
  type: 'image' | 'video' | 'text';
  file: string;
  user_id: string;
  privacy?: string;
  content?: string;
  backgroundColor?: string;
  duration?: number;
  createdAt?: string;
  audio?: string;
  isViewed: boolean;
}

export interface IUserStory {
  _id: string;
  user_id: string;
  fullName: string;
  avatar: string;
  stories: IStory[];
}

export interface IFormCreateStory {
  type: 'image' | 'video' | 'text';
  file?: File;
  privacy: string;
  content?: string;
  backgroundColor?: string;
}

export interface IStoryState {
  currentStory: IUserStory;
  userStories: IUserStory[];
}
