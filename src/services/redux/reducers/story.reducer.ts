import { createSlice } from '@reduxjs/toolkit';
import { STORY_DEFAULT } from '@social/defaults/story';
import type { IStoryState } from '@social/types/stories.type';

const initialState: IStoryState = {
  currentStory: STORY_DEFAULT,
  userStories: [],
};

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setCurrentStory: (state, action) => {
      state.currentStory = action.payload;
    },
    setUserStories: (state, action) => {
      state.userStories = action.payload;
    },
  },
});

export const { setCurrentStory, setUserStories } = storySlice.actions;
export const storyReducer = storySlice.reducer;
