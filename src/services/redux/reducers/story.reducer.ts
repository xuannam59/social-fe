import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STORY_DEFAULT, USER_STORY_DEFAULT } from '@social/defaults/story';
import type { IStoryState } from '@social/types/stories.type';
import { callApiGetStories } from '@social/apis/stories.api';

const initialState: IStoryState = {
  currentUserStory: USER_STORY_DEFAULT,
  currentStory: STORY_DEFAULT,
  userStories: [],
  totalStories: 0,
  page: 1,
  limit: 10,
};

export const fetchStories = createAsyncThunk('stories/fetchStories', async (query?: string) => {
  const res = await callApiGetStories(query);
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
      state.userStories = action.payload.list;
      state.totalStories = action.payload.meta.total;
      state.page = action.payload.meta.page;
      state.limit = action.payload.meta.limit;
    });
  },
});

export const { setCurrentStory, setUserStories } = storySlice.actions;
export const storyReducer = storySlice.reducer;
