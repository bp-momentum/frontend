import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  loggedIn: boolean;
  username?: string;
  role?: "admin" | "trainer" | "player";
}

const initialState: ProfileState = {
  loggedIn: false,
};

/**
 * A slice for saving profile information.
 */
export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ username: string; role: string }>
    ) => {
      state.loggedIn = true;
      state.username = action.payload.username;
      state.role = action.payload.role as "admin" | "trainer" | "player";
    },
    logout: (state) => {
      state.loggedIn = false;
      state.username = undefined;
      state.role = undefined;
    },
    changeUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { login, logout, changeUsername } = profileSlice.actions;

export default profileSlice.reducer;
