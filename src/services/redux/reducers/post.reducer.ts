import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { callApiFetchPosts } from '@social/apis/posts.api';
import type { IUserLiked, IPostState } from '@social/types/posts.type';

const initialState: IPostState = {
  listPosts: [],
  scroll: 0,
  isLoadingPosts: true,
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
    setPosts: (state, action) => {
      state.listPosts = action.payload;
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
    doAddComment: (state, action) => {
      const postId = action.payload.postId;
      state.listPosts = state.listPosts.map(post => {
        if (post._id === postId) {
          post.commentCount += 1;
        }
        return post;
      });
    },
    doDeleteComment: (state, action) => {
      const { countDeleted, postId } = action.payload;
      const currentPost = state.listPosts.find(post => post._id === postId);
      if (currentPost) {
        state.listPosts = state.listPosts.map(post => {
          if (post._id === postId) {
            post.commentCount = Math.max(0, post.commentCount - countDeleted);
          }
          return post;
        });
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.listPosts = action.payload.list;
      state.isLoadingPosts = false;
    });
  },
});

export const { setPosts, doToggleLike, doDeleteComment, doAddComment } =
  postSlice.actions;
export const postReducer = postSlice.reducer;
