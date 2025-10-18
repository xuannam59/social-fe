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
import { callApiConversationFriendList } from '@social/apis/user.api';

const initialState: IConversationState = {
  listConversations: [],
  openConversations: [],
  unSeenConversations: [],
  friendConversations: [],
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

export const fetchFriendConversations = createAsyncThunk(
  'conversation/fetchFriendConversations',
  async () => {
    const res = await callApiConversationFriendList();
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
      state.friendConversations = state.friendConversations.map(fc =>
        fc._id === _id ? { ...fc, _id: conversation._id, isExist: true } : fc
      );
      if (conversationIndex !== -1) {
        state.openConversations[conversationIndex] = {
          ...state.openConversations[conversationIndex],
          _id: conversation._id,
          usersState: conversation.usersState,
          isExist: true,
        };
      }
    },
    doSetUnSeenConversation: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const unSeenSet = new Set(state.unSeenConversations);
      unSeenSet.add(conversationId);
      state.unSeenConversations = [...unSeenSet];
    },
    doReadConversation: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) => {
      const { conversationId, userId } = action.payload;
      state.unSeenConversations = state.unSeenConversations.filter(
        id => id !== conversationId
      );
      const conversationIndex = state.listConversations.findIndex(
        c => c._id === conversationId
      );
      if (conversationIndex !== -1) {
        const conversationDetail = state.listConversations[conversationIndex];
        const usersState = conversationDetail.usersState.map(user =>
          user.user === userId
            ? {
                user: userId,
                readLastMessage: conversationDetail.lastMessage?._id || '',
              }
            : user
        );
        state.listConversations[conversationIndex] = {
          ...conversationDetail,
          usersState,
        };
      }
    },
    doUpdateConversationPosition: (
      state,
      action: PayloadAction<{ conversation: IConversation; userId: string }>
    ) => {
      const { conversation, userId } = action.payload;
      const listConversations = state.listConversations;
      const existingIndex = listConversations.findIndex(
        c => c._id === conversation._id
      );

      if (existingIndex !== -1) {
        const existing = listConversations[existingIndex];
        listConversations.splice(existingIndex, 1);
        listConversations.unshift({
          ...existing,
          lastMessage: conversation.lastMessage,
          lastMessageAt: conversation.lastMessageAt,
          usersState: conversation.usersState,
        });
      } else {
        if (conversation.isGroup) {
          listConversations.unshift(conversation);
        } else {
          const other = conversation.users.find(u => u._id !== userId);
          const newConversation = {
            ...conversation,
            name: other?.fullname || 'Người dùng',
            avatar: other?.avatar || '',
          };
          listConversations.unshift(newConversation);
        }
      }

      state.listConversations = listConversations;
      state.friendConversations = state.friendConversations.map(fc =>
        fc.conversationId === conversation._id
          ? {
              ...fc,
              lastMessage: conversation.lastMessage,
              usersState: conversation.usersState,
            }
          : fc
      );
      state.openConversations = state.openConversations.map(oc =>
        oc._id === conversation._id
          ? {
              ...oc,
              lastMessage: conversation.lastMessage,
              usersState: conversation.usersState,
            }
          : oc
      );
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUnSeenConversations.fulfilled, (state, action) => {
      state.unSeenConversations = action.payload;
    });
    builder.addCase(seenConversation.fulfilled, state => {
      state.unSeenConversations = [];
    });
    builder.addCase(fetchFriendConversations.fulfilled, (state, action) => {
      state.friendConversations = action.payload;
    });
  },
});

export const {
  doOpenConversation,
  doCloseConversation,
  doSetIdConversation,
  doSetConversations,
  doSetUnSeenConversation,
  doUpdateConversationPosition,
  doReadConversation,
} = conversationSlice.actions;
export const conversationReducer = conversationSlice.reducer;
