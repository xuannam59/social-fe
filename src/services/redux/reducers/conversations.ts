import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { IConversationState } from '@social/types/conversations.type';
import { callApiGetConversations } from '@social/apis/conversations.api';
import type { IConversation } from '@social/types/conversations.type';

const initialState: IConversationState = {
  conversations: [],
  openConversations: [],
};

export const fetchConversations = createAsyncThunk(
  'conversation/fetchConversations',
  async () => {
    const res = await callApiGetConversations();
    return res.data;
  }
);

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    doOpenConversation: (state, action: PayloadAction<IConversation>) => {
      const { openConversations } = state;
      const conversation = action.payload;
      const conversationId = conversation._id;
      const numberOfOpenConversation = openConversations.length;

      const existingOpenConversation = openConversations.find(
        oc => oc._id === conversationId
      );

      if (existingOpenConversation) {
        return;
      }

      if (numberOfOpenConversation == 3) {
        state.openConversations.shift();
      }

      state.openConversations.push(conversation);
    },
    doCloseConversation: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      state.openConversations = state.openConversations.filter(
        oc => oc._id !== conversationId
      );
    },
    doSetIdConversation: (
      state,
      action: PayloadAction<{ _id: string; conversationId: string }>
    ) => {
      const payload = action.payload;
      const conversationIndex = state.openConversations.findIndex(
        oc => oc._id === payload._id
      );
      if (conversationIndex !== -1) {
        state.openConversations[conversationIndex] = {
          ...state.openConversations[conversationIndex],
          _id: payload.conversationId,
          isExist: true,
        };
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.conversations = action.payload;
    });
  },
});

export const { doOpenConversation, doCloseConversation, doSetIdConversation } =
  conversationSlice.actions;
export const conversationReducer = conversationSlice.reducer;
