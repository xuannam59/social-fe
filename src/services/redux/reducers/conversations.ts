import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { IConversationState } from '@social/types/conversations.type';
import {
  callApiGetConversations,
  callApiGetUnSeenConversations,
  callApiSeenConversation,
} from '@social/apis/conversations.api';
import type { IConversation } from '@social/types/conversations.type';

const initialState: IConversationState = {
  listConversations: [],
  openConversations: [],
  unSeenConversations: [],
  total: 0,
};

export const fetchConversations = createAsyncThunk(
  'conversation/fetchConversations',
  async (query?: string) => {
    const res = await callApiGetConversations(query);
    return res.data;
  }
);

export const fetchUnSeenConversations = createAsyncThunk(
  'conversation/fetchUnSeenConversations',
  async () => {
    const res = await callApiGetUnSeenConversations();
    return res.data;
  }
);

export const seenConversation = createAsyncThunk(
  'conversation/seenConversation',
  async (conversationIds: string[]) => {
    const res = await callApiSeenConversation(conversationIds);
    return res.data;
  }
);

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    doSetConversations: (
      state,
      action: PayloadAction<{ conversations: IConversation[]; total: number }>
    ) => {
      state.listConversations = action.payload.conversations;
      state.total = action.payload.total;
    },
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
      action: PayloadAction<{ _id: string; conversation: IConversation }>
    ) => {
      const { _id, conversation } = action.payload;
      const conversationIndex = state.openConversations.findIndex(
        oc => oc._id === _id
      );
      if (conversationIndex !== -1) {
        state.openConversations[conversationIndex] = {
          ...state.openConversations[conversationIndex],
          _id: conversation._id,
          users: conversation.users,
          isGroup: conversation.isGroup,
          name: conversation.name,
          avatar: conversation.avatar,
          usersState: conversation.usersState,
          lastMessageAt: conversation.lastMessageAt,
          isExist: true,
        };
      }
    },
    doSetSeenConversation: state => {
      state.unSeenConversations = [];
      // caapj nhaapj data....
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUnSeenConversations.fulfilled, (state, action) => {
      state.unSeenConversations = action.payload;
    });
    builder.addCase(seenConversation.fulfilled, (state, action) => {
      state.unSeenConversations = [];
    });
  },
});

export const {
  doOpenConversation,
  doCloseConversation,
  doSetIdConversation,
  doSetConversations,
} = conversationSlice.actions;
export const conversationReducer = conversationSlice.reducer;
