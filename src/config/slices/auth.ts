import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

type UserType = {
  _id: string;
  username: string;
  email: string;
  token: string;
};

interface AuthState {
  currentUser: UserType | null;
  redirectUrl: string | null;
  notifications: any[];
}

const initialState: AuthState = {
  currentUser: null,
  redirectUrl: null,
  notifications: [],
};

const authSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    handleLoginUser(state, action: PayloadAction<UserType>) {
      state.currentUser = action.payload;
    },
    handleLogoutUser(state) {
      state.currentUser = null;
    },
    handleSetRedirectUrl(state, action: PayloadAction<string | null>) {
      state.redirectUrl = action.payload;
    },

    handleSetUserNotifications(state, action: PayloadAction<any[]>) {
      state.notifications = action.payload;
    },
    handlePushUserNotification(state, action: PayloadAction<any>) {
      state.notifications.push(action.payload);
    },
  },
});

export const {
  handleLoginUser,
  handleLogoutUser,
  handleSetRedirectUrl,
  handleSetUserNotifications,
  handlePushUserNotification,
} = authSlice.actions;
export default authSlice.reducer;
