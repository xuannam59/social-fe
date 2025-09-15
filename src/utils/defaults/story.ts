import type { IStory, IUserStory } from '@social/types/stories.type';

export const STORY_DEFAULT: IStory = {
  _id: '',
  authorId: '',
  content: '',
  media: {
    keyS3: '',
    type: '',
  },
  type: 'image',
  privacy: '',
  backgroundColor: '',
  duration: 0,
  userLikes: [],
  createdAt: '',
  audio: '',
  isViewed: false,
};

export const USER_STORY_DEFAULT: IUserStory = {
  _id: '',
  fullname: '',
  avatar: '',
  endStoryAt: '',
  stories: [],
};
