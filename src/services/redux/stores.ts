import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/auth.reducer';
import { storyReducer } from './reducers/story.reducer';
import { postReducer } from './reducers/post.reducer';
import { conversationReducer } from './reducers/conversations.reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    story: storyReducer,
    post: postReducer,
    conversations: conversationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
