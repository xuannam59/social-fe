import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { callApiFetchPosts } from '@social/apis/posts.api';
import type { IUserLiked, IPostState, IPost } from '@social/types/posts.type';

const initialState: IPostState = {
  listPosts: [],
  scroll: 0,
  isLoadingPosts: true,
  total: 0,
  page: 1,
};

export const fetchPosts = createAsyncThunk(
  'post/fetchPosts',
  async (query?: string) => {
    const res = await callApiFetchPosts(query);
    return res.data;
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    doSetScroll: (state, action: PayloadAction<number>) => {
      state.scroll = action.payload;
    },
    doAddMorePosts: (state, action: PayloadAction<IPost[]>) => {
      state.listPosts = [...state.listPosts, ...action.payload];
    },
    doToggleLike: (
      state,
      action: PayloadAction<{
        index: number;
        userLiked: IUserLiked;
        isLike: boolean;
      }>
    ) => {
      const { index, userLiked, isLike } = action.payload;
      const postDetail = state.listPosts[index];
      if (isLike && userLiked) {
        postDetail.userLiked = userLiked;
        const existingLikeIndex = postDetail.userLikes.findIndex(
          like => like.userId === userLiked.userId
        );
        if (existingLikeIndex === -1) {
          postDetail.userLikes.push(userLiked);
        }
      } else {
        postDetail.userLiked = null;
        postDetail.userLikes = postDetail.userLikes.filter(
          like => like.userId !== userLiked.userId
        );
      }
      state.listPosts[index] = postDetail;
    },
    doUpdateCommentCount: (
      state,
      action: PayloadAction<{ index: number; count: number }>
    ) => {
      const { index, count } = action.payload;
      const postDetail = state.listPosts[index];
      postDetail.commentCount += count;
      state.listPosts[index] = postDetail;
    },
    doCreatePost: (state, action: PayloadAction<IPost>) => {
      state.listPosts = [action.payload, ...state.listPosts];
    },
    doUpdatePost: (
      state,
      action: PayloadAction<{ index: number; post: IPost }>
    ) => {
      const { index, post } = action.payload;
      state.listPosts[index] = post;
    },
    doDeletePost: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.listPosts = state.listPosts.filter(post => post._id !== id);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.listPosts = action.payload.list;
      state.isLoadingPosts = false;
      state.total = action.payload.meta.total;
      state.page = action.payload.meta.page;
    });
  },
});

export const {
  doSetScroll,
  doAddMorePosts,
  doToggleLike,
  doUpdateCommentCount,
  doCreatePost,
  doUpdatePost,
  doDeletePost,
} = postSlice.actions;
export const postReducer = postSlice.reducer;
