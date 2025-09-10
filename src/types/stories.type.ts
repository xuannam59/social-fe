export interface IStory {
  _id: string;
  type: 'image' | 'video' | 'text';
  media: {
    keyS3: string;
    type: string;
  };
  authorId: string;
  privacy: string;
  content?: string;
  backgroundColor: string;
  duration: number;
  createdAt: string;
  audio: string;
  isViewed: boolean;
}

export interface IUserStory {
  _id: string;
  fullName: string;
  avatar: string;
  stories: IStory[];
}


export interface ITextStory {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
}

export interface IFormCreateStory {
  type: string;
  media?: {
    keyS3: string;
    type: string;
  };
  privacy: string;
  content?: string;
  backgroundColor?: string;
}

export interface IStoryState {
  currentUserStory: IUserStory;
  currentStory: IStory;
  userStories: IUserStory[];
  totalStories: number;
  page: number;
  limit: number;
}
