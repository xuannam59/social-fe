import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callApiGetPost } from '@social/apis/posts.api';
import type { IPostState } from '@social/types/posts.type';

const initialState: IPostState = {
  listPosts: [],
  scroll: 0,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (query?: string) => {
    const res = await callApiGetPost(query);
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
      }
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
      state.listPosts = action.payload;
    });
  },
});

export const { setPosts, doToggleLike, doDeleteComment, doAddComment } =
  postSlice.actions;
export const postReducer = postSlice.reducer;
