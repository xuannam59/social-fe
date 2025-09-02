import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callApiGetPost } from '@social/apis/posts.api';
import { POST_DEFAULT } from '@social/defaults/post';
import type { IPostState } from '@social/types/posts.type';

const initialState: IPostState = {
  currentPost: POST_DEFAULT,
  listPosts: [],
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const res = await callApiGetPost();
  return res.data;
});

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setCurrentPost: (state, action) => {
      const post = state.listPosts.find(post => post._id === action.payload);
      if (post) {
        state.currentPost = post;
      }
    },
    setPosts: (state, action) => {
      state.listPosts = action.payload;
    },
    doToggleLike: (state, action) => {
      const payload = action.payload;
      const index = state.listPosts.findIndex(
        post => post._id === payload.postId
      );
      if (index !== -1) {
        const currentPost = state.listPosts[index];
        const wasLiked = currentPost.userLiked.isLiked;

        state.listPosts[index].userLiked = {
          isLiked: payload.isLike,
          type: payload.isLike ? payload.type : null,
        };

        if (payload.isLike && !wasLiked) {
          state.listPosts[index].likeCount += 1;
        } else if (!payload.isLike && wasLiked) {
          state.listPosts[index].likeCount = Math.max(
            0,
            state.listPosts[index].likeCount - 1
          );
        }

        if (state.currentPost._id === payload.postId) {
          state.currentPost = { ...state.listPosts[index] };
        }
      }
    },
    doDeleteComment: (state, action) => {
      const payload = action.payload;
      const countDeleted = payload.countDeleted;
      const postId = payload.postId;
      const afterCommentCount = state.currentPost.commentCount - countDeleted;
      state.currentPost.commentCount = afterCommentCount;
      state.listPosts = state.listPosts.map(post => {
        if (post._id === postId) {
          post.commentCount = afterCommentCount;
        }
        return post;
      });
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.listPosts = action.payload;
    });
  },
});

export const { setPosts, setCurrentPost, doToggleLike, doDeleteComment } =
  postSlice.actions;
export const postReducer = postSlice.reducer;
