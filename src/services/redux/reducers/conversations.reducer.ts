import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {
  callApiGetConversations,
  callApiGetGroupConversations,
  callApiGetUnSeenConversations,
  callApiSeenConversation,
} from '@social/apis/conversations.api';
import { callApiConversationFriendList } from '@social/apis/user.api';
import type {
  IConversation,
  IConversationState,
  IEditConversation,
} from '@social/types/conversations.type';
import type { IUserTag } from '@social/types/user.type';

const initialState: IConversationState = {
  listConversations: [],
  openConversations: [],
  friendConversations: [],
  groupConversations: [],
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

export const fetchFriendConversations = createAsyncThunk(
  'conversation/fetchFriendConversations',
  async () => {
    const res = await callApiConversationFriendList();
    return res.data;
  }
);

export const fetchGroupConversations = createAsyncThunk(
  'conversation/fetchGroupConversations',
  async () => {
    const res = await callApiGetGroupConversations();
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
      const { conversations, total } = action.payload;
      state.listConversations = conversations;
      state.total = total;
    },
    doAddMoreConversations: (state, action: PayloadAction<IConversation[]>) => {
      const conversations = action.payload;
      state.listConversations = [...state.listConversations, ...conversations];
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
      if (!conversation.isGroup) {
        state.friendConversations = state.friendConversations.map(fc =>
          fc._id === _id ? { ...fc, _id: conversation._id, isExist: true } : fc
        );
      }
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
      if (listConversations.length === 0) return;
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
    doAddMemberToConversation: (state, action) => {
      const { conversationId, users } = action.payload;
      state.groupConversations = state.groupConversations.map(gc =>
        gc._id === conversationId
          ? {
              ...gc,
              users: [...gc.users, ...users],
              usersState: [
                ...gc.usersState,
                ...users.map((user: IUserTag) => ({
                  user: user._id,
                  readLastMessage: null,
                })),
              ],
            }
          : gc
      );
      state.listConversations = state.listConversations.map(c =>
        c._id === conversationId
          ? {
              ...c,
              users: [...c.users, ...users],
              usersState: [
                ...c.usersState,
                ...users.map((user: IUserTag) => ({
                  user: user._id,
                  readLastMessage: null,
                })),
              ],
            }
          : c
      );
      state.openConversations = state.openConversations.map(oc =>
        oc._id === conversationId
          ? {
              ...oc,
              users: [...oc.users, ...users],
              usersState: [
                ...oc.usersState,
                ...users.map((user: IUserTag) => ({
                  user: user._id,
                  readLastMessage: null,
                })),
              ],
            }
          : oc
      );
    },
    doRemoveMemberFromConversation: (state, action) => {
      const { userId, conversationId } = action.payload;
      state.groupConversations = state.groupConversations.map(gc =>
        gc._id === conversationId
          ? {
              ...gc,
              users: gc.users.filter(user => user._id !== userId),
              usersState: gc.usersState.filter(user => user.user !== userId),
            }
          : gc
      );
      state.listConversations = state.listConversations.map(c =>
        c._id === conversationId
          ? {
              ...c,
              users: c.users.filter(user => user._id !== userId),
              usersState: c.usersState.filter(user => user.user !== userId),
            }
          : c
      );
      state.openConversations = state.openConversations.map(oc =>
        oc._id === conversationId
          ? {
              ...oc,
              users: oc.users.filter(user => user._id !== userId),
              usersState: oc.usersState.filter(user => user.user !== userId),
            }
          : oc
      );
    },
    doGrantAdminToConversation: (state, action) => {
      const { userId, conversationId } = action.payload;
      state.groupConversations = state.groupConversations.map(gc =>
        gc._id === conversationId
          ? {
              ...gc,
              admins: [...(gc.admins || []), userId],
            }
          : gc
      );
      state.listConversations = state.listConversations.map(c =>
        c._id === conversationId
          ? {
              ...c,
              admins: [...(c.admins || []), userId],
            }
          : c
      );
      state.openConversations = state.openConversations.map(oc =>
        oc._id === conversationId
          ? {
              ...oc,
              admins: [...(oc.admins || []), userId],
            }
          : oc
      );
    },
    doRevokeAdminFromConversation: (state, action) => {
      const { userId, conversationId } = action.payload;
      state.groupConversations = state.groupConversations.map(gc =>
        gc._id === conversationId
          ? {
              ...gc,
              admins: (gc.admins || []).filter(admin => admin !== userId),
            }
          : gc
      );
      state.listConversations = state.listConversations.map(c =>
        c._id === conversationId
          ? {
              ...c,
              admins: (c.admins || []).filter(admin => admin !== userId),
            }
          : c
      );
      state.openConversations = state.openConversations.map(oc =>
        oc._id === conversationId
          ? {
              ...oc,
              admins: (oc.admins || []).filter(admin => admin !== userId),
            }
          : oc
      );
    },
    doCreateConversation: (state, action: PayloadAction<IConversation>) => {
      state.groupConversations.unshift(action.payload);
    },
    doEditConversation: (state, action: PayloadAction<IEditConversation>) => {
      const { conversationId, name, avatar } = action.payload;
      state.groupConversations = state.groupConversations.map(gc =>
        gc._id === conversationId ? { ...gc, name, avatar } : gc
      );
      state.listConversations = state.listConversations.map(c =>
        c._id === conversationId ? { ...c, name, avatar } : c
      );
      state.openConversations = state.openConversations.map(oc =>
        oc._id === conversationId ? { ...oc, name, avatar } : oc
      );
    },
    doDeleteConversation: (state, action: PayloadAction<string>) => {
      state.groupConversations = state.groupConversations.filter(
        gc => gc._id !== action.payload
      );
      state.listConversations = state.listConversations.filter(
        c => c._id !== action.payload
      );
      state.openConversations = state.openConversations.filter(
        oc => oc._id !== action.payload
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
    builder.addCase(fetchGroupConversations.fulfilled, (state, action) => {
      state.groupConversations = action.payload;
    });
  },
});

export const {
  doOpenConversation,
  doCloseConversation,
  doSetIdConversation,
  doSetConversations,
  doAddMoreConversations,
  doSetUnSeenConversation,
  doUpdateConversationPosition,
  doReadConversation,
  doAddMemberToConversation,
  doRemoveMemberFromConversation,
  doGrantAdminToConversation,
  doRevokeAdminFromConversation,
  doEditConversation,
  doCreateConversation,
  doDeleteConversation,
} = conversationSlice.actions;
export const conversationReducer = conversationSlice.reducer;
