import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { STORY_DEFAULT, USER_STORY_DEFAULT } from '@social/defaults/story';
import type { IStoryState, IUserStory } from '@social/types/stories.type';
import { callApiGetStories } from '@social/apis/stories.api';

const initialState: IStoryState = {
  currentUserStory: USER_STORY_DEFAULT,
  currentStory: STORY_DEFAULT,
  listUserStories: [],
  paused: false,
  totalStories: 0,
  page: 1,
  limit: 10,
};

export const fetchStories = createAsyncThunk(
  'stories/fetchStories',
  async (query?: string) => {
    const res = await callApiGetStories(query);
    return res.data;
  }
);

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setCurrentStory: (state, action) => {
      state.currentStory = action.payload;
    },
    setCurrentUserStory: (state, action) => {
      state.currentUserStory = action.payload;
      if (state.currentUserStory.stories.length > 0) {
        state.currentStory = state.currentUserStory.stories[0];
      }
    },
    setListUserStories: (
      state,
      action: PayloadAction<{
        list: IUserStory[];
        total: number;
        page: number;
        limit: number;
      }>
    ) => {
      state.listUserStories = action.payload.list;
      state.totalStories = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
    },
    doCreateStory: (state, action: PayloadAction<IUserStory>) => {
      const authorId = action.payload._id;
      const userStoryIndex = state.listUserStories.findIndex(
        us => us._id === authorId
      );
      if (userStoryIndex !== -1) {
        state.listUserStories[userStoryIndex] = {
          ...action.payload,
          stories: [
            ...state.listUserStories[userStoryIndex].stories,
            action.payload.stories[0],
          ],
        };
      } else {
        state.listUserStories = [action.payload, ...state.listUserStories];
      }
    },
    doPauseStory: (state, action) => {
      state.paused = action.payload;
    },
    doNextStory: state => {
      const storyIndex = state.currentUserStory.stories.findIndex(
        s => s._id === state.currentStory._id
      );
      if (storyIndex < state.currentUserStory.stories.length - 1) {
        state.currentStory = state.currentUserStory.stories[storyIndex + 1];
        state.paused = false;
      } else {
        const userStoryIndex = state.listUserStories.findIndex(
          us => us._id === state.currentUserStory._id
        );
        if (userStoryIndex < state.listUserStories.length - 1) {
          state.currentUserStory = state.listUserStories[userStoryIndex + 1];
          state.currentStory = state.currentUserStory.stories[0];
          state.paused = false;
        }
      }
    },
    doPreviousStory: state => {
      const storyIndex = state.currentUserStory.stories.findIndex(
        s => s._id === state.currentStory._id
      );
      if (storyIndex > 0) {
        state.currentStory = state.currentUserStory.stories[storyIndex - 1];
        state.paused = false;
      } else {
        const userStoryIndex = state.listUserStories.findIndex(
          us => us._id === state.currentUserStory._id
        );
        if (userStoryIndex > 0) {
          state.currentUserStory = state.listUserStories[userStoryIndex - 1];
          state.currentStory =
            state.currentUserStory.stories[
              state.currentUserStory.stories.length - 1
            ];
          state.paused = false;
        }
      }
    },
    doLikeStory: (
      state,
      action: PayloadAction<{ userId: string; type: number }>
    ) => {
      const payload = action.payload;
      const storyId = state.currentStory._id;

      const currentStory = state.currentUserStory.stories.find(
        s => s._id === storyId
      );
      if (currentStory) {
        const existingLikeIndex = currentStory.viewers.findIndex(
          l => l.userId === payload.userId
        );

        if (existingLikeIndex !== -1) {
          currentStory.viewers[existingLikeIndex].likedType = payload.type;
        } else {
          currentStory.viewers.push({
            userId: payload.userId,
            likedType: payload.type,
          });
        }
      }

      const userStoryIndex = state.listUserStories.findIndex(
        us => us._id === state.currentUserStory._id
      );
      if (userStoryIndex !== -1) {
        const storyInList = state.listUserStories[userStoryIndex].stories.find(
          s => s._id === storyId
        );
        if (storyInList) {
          const existingLikeIndex = storyInList.viewers.findIndex(
            l => l.userId === payload.userId
          );

          if (existingLikeIndex !== -1) {
            storyInList.viewers[existingLikeIndex].likedType = payload.type;
          } else {
            storyInList.viewers.push({
              userId: payload.userId,
              likedType: payload.type,
            });
          }
        }
      }

      const existingLikeInCurrent = state.currentStory.viewers.findIndex(
        l => l.userId === payload.userId
      );
      if (existingLikeInCurrent !== -1) {
        state.currentStory.viewers[existingLikeInCurrent].likedType =
          payload.type;
      } else {
        state.currentStory.viewers.push({
          userId: payload.userId,
          likedType: payload.type,
        });
      }
    },
    doViewStory: (
      state,
      action: PayloadAction<{ userId: string; storyId: string }>
    ) => {
      const { userId, storyId } = action.payload;
      const storyDetail = state.currentUserStory.stories.find(
        s => s._id === storyId
      );
      if (storyDetail) {
        const existingViewIndex = storyDetail.viewers.findIndex(
          v => v.userId === userId
        );
        if (existingViewIndex === -1) {
          storyDetail.viewers.push({ userId, likedType: 0 });
        }
      }

      const userStoryIndex = state.listUserStories.findIndex(
        us => us._id === state.currentUserStory._id
      );
      if (userStoryIndex !== -1) {
        const storyInList = state.listUserStories[userStoryIndex].stories.find(
          s => s._id === storyId
        );
        if (storyInList) {
          const existingViewIndex = storyInList.viewers.findIndex(
            v => v.userId === userId
          );
          if (existingViewIndex === -1) {
            storyInList.viewers.push({ userId, likedType: 0 });
          }
        }
      }

      const existingViewIndex = state.currentStory.viewers.findIndex(
        v => v.userId === userId
      );
      if (existingViewIndex === -1) {
        state.currentStory.viewers.push({ userId, likedType: 0 });
      }
    },
    doDeleteStory: state => {
      const userStory = state.currentUserStory;
      const listStory = userStory.stories.filter(
        s => s._id !== state.currentStory._id
      );
      if (listStory.length > 0) {
        state.currentUserStory = {
          ...userStory,
          stories: listStory,
        };
        state.currentStory = listStory[0];
        state.listUserStories.forEach(us => {
          if (us._id === userStory._id) {
            us.stories = listStory;
          }
        });
      } else {
        state.listUserStories = state.listUserStories.filter(
          us => us._id !== userStory._id
        );
        if (state.listUserStories.length > 0) {
          state.currentUserStory = state.listUserStories[0];
          state.currentStory = state.currentUserStory.stories[0];
        } else {
          state.currentUserStory = USER_STORY_DEFAULT;
          state.currentStory = STORY_DEFAULT;
        }
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchStories.fulfilled, (state, action) => {
      state.listUserStories = action.payload.list;
      state.totalStories = action.payload.meta.total;
      state.page = action.payload.meta.page;
      state.limit = action.payload.meta.limit;
    });
  },
});

export const {
  setCurrentStory,
  setListUserStories,
  setCurrentUserStory,
  doNextStory,
  doPreviousStory,
  doPauseStory,
  doCreateStory,
  doLikeStory,
  doViewStory,
  doDeleteStory,
} = storySlice.actions;
export const storyReducer = storySlice.reducer;
