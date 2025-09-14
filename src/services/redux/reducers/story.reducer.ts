import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORY_DEFAULT, USER_STORY_DEFAULT } from '@social/defaults/story';
import type { IStoryState, IUserStory } from '@social/types/stories.type';
import { callApiGetStories } from '@social/apis/stories.api';
import dayjs from 'dayjs';

const initialState: IStoryState = {
  currentUserStory: USER_STORY_DEFAULT,
  currentStory: STORY_DEFAULT,
  listUserStories: [],
  paused: false,
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
    setCurrentUserStory: (state, action) => {
      state.currentUserStory = action.payload;
      if(state.currentUserStory.stories.length > 0) {
        state.currentStory = state.currentUserStory.stories[0];
      }
    },
    setListUserStories: (state, action) => {
      state.listUserStories = action.payload;
    },
    doCreateStory: (state, action: PayloadAction<IUserStory>) => {
      const authorId = action.payload._id;
      const userStoryIndex = state.listUserStories.findIndex(us => us._id === authorId);
      if(userStoryIndex !== -1) {
        state.listUserStories[userStoryIndex] = {
          ...action.payload,
          stories: [...state.listUserStories[userStoryIndex].stories, action.payload.stories[0]],
        };
      }else {
        state.listUserStories = [...state.listUserStories, action.payload];
      }
    },
    doPauseStory: (state, action) => {
      state.paused = action.payload;
    },
    doNextStory: (state) => {
      const storyIndex = state.currentUserStory.stories.findIndex(s => s._id === state.currentStory._id);
      if(storyIndex < state.currentUserStory.stories.length - 1) {
        state.currentStory = state.currentUserStory.stories[storyIndex + 1];
        state.paused = false;
      }else {
        const userStoryIndex = state.listUserStories.findIndex(us => us._id === state.currentUserStory._id);
        if(userStoryIndex < state.listUserStories.length - 1) {
          state.currentUserStory = state.listUserStories[userStoryIndex + 1];
          state.currentStory = state.currentUserStory.stories[0];
          state.paused = false;
        }
      }
    },
    doPreviousStory: (state) => {
      const storyIndex = state.currentUserStory.stories.findIndex(s => s._id === state.currentStory._id);
      if(storyIndex > 0) {
        state.currentStory = state.currentUserStory.stories[storyIndex - 1];
        state.paused = false;
      }else {
        const userStoryIndex = state.listUserStories.findIndex(us => us._id === state.currentUserStory._id);
        if(userStoryIndex > 0) {
          state.currentUserStory = state.listUserStories[userStoryIndex - 1];
          state.currentStory = state.currentUserStory.stories[state.currentUserStory.stories.length - 1];
          state.paused = false;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStories.fulfilled, (state, action) => {
      state.listUserStories = action.payload.list;
      state.totalStories = action.payload.meta.total;
      state.page = action.payload.meta.page;
      state.limit = action.payload.meta.limit;
    });
  },
});

export const { setCurrentStory, setListUserStories, setCurrentUserStory,
   doNextStory, doPreviousStory, doPauseStory, doCreateStory } = storySlice.actions;
export const storyReducer = storySlice.reducer;
