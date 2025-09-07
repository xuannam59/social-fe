import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STORY_DEFAULT } from '@social/defaults/story';
import type { IStoryState } from '@social/types/stories.type';
import { callApiGetStories } from '@social/apis/stories.api';

const initialState: IStoryState = {
  currentStory: STORY_DEFAULT,
  userStories: [],
};

export const fetchStories = createAsyncThunk('stories/fetchStories', async () => {
  const res = await callApiGetStories();
  return res.data;
});

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
  extraReducers: (builder) => {
    builder.addCase(fetchStories.fulfilled, (state, action) => {
      state.userStories = action.payload;
    });
  },
});

export const { setCurrentStory, setUserStories } = storySlice.actions;
export const storyReducer = storySlice.reducer;
