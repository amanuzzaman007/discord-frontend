import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

type ServerImageType = {
  _id: string;
  url: string;
  public_id: string;
};

export type ServerType = {
  _id: string;
  __v?: number;
  name: string;
  image?: ServerImageType;
  creator: {
    _id: string;
    username: string;
    email: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  users?: [
    {
      _id: string;
      username: string;
      email: string;
      active: boolean;
      createdAt: Date;
      updatedAt: Date;
    }
  ];
  createdAt?: Date;
  updatedAt?: Date;
};

type SelectedChannelType = {
  _id: string;
  channelName: string;
  creator: any;
  isGroupChat: boolean;
  server?: any;
  category?: any;
  users: any[];
  latestMessage?: any;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

interface ChatState {
  selectedServer: ServerType | null;
  messages: any[];
  selectedChanel: SelectedChannelType | null;
  directChatList: any[];
  notificationsList: any[];
  fetchAgain: string;
  serverList: any[];
  scrollAgain: string;
}

const initialState: ChatState = {
  selectedServer: null,
  messages: [],
  selectedChanel: null,
  directChatList: [],
  notificationsList: [],
  fetchAgain: "",
  serverList: [],
  scrollAgain: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    handleStoreMessages(state, action: PayloadAction<any[]>) {
      state.messages = action.payload;
    },
    handleStoreServers(state, action: PayloadAction<any[]>) {
      state.serverList = action.payload;
    },
    handlePushNewMessage(state, action: PayloadAction<any>) {
      const mgsIndex = state.messages?.findIndex(
        (mgs) => mgs._id === action.payload?._id
      );
      if (mgsIndex !== -1) {
        state.messages[mgsIndex].messageByDate.push(
          ...action.payload?.messageByDate
        );
      } else {
        state.messages.push(action.payload);
      }
    },
    handlePushNotification(state, action: PayloadAction<any>) {
      state.notificationsList.push(action?.payload);
    },
    handleRemoveNotifications(state, action: PayloadAction<any[]>) {
      state.notificationsList = action?.payload;
    },
    handleSelectChannel(
      state,
      action: PayloadAction<SelectedChannelType | null>
    ) {
      state.selectedChanel = action.payload;
    },
    handleSelectServer(state, action: PayloadAction<ServerType | null>) {
      state.selectedServer = action.payload;
    },
    handleStoreDirectChatList(state, action: PayloadAction<any[]>) {
      state.directChatList = action.payload;
    },
    handleClearOnLogout(state) {
      state.messages = [];
      state.selectedChanel = null;
      state.directChatList = [];
    },
    handleFetchAgain(state) {
      state.fetchAgain = Date.now().toString();
    },
    handleScrollAgain(state) {
      state.scrollAgain = Date.now().toString();
    },
  },
});

export const {
  handleStoreMessages,
  handleStoreServers,
  handleSelectChannel,
  handleSelectServer,
  handleStoreDirectChatList,
  handleClearOnLogout,
  handlePushNewMessage,
  handlePushNotification,
  handleRemoveNotifications,
  handleFetchAgain,
  handleScrollAgain,
} = chatSlice.actions;
export default chatSlice.reducer;
