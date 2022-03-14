import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenState {
  token: string | null;
  refreshToken: string | null;
}

const initialState: TokenState = {
  token: null,
  refreshToken: null,
};

/**
 * A slice for saving the current session and refresh token in the cache.
 */
export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    unsetToken: (state) => {
      state.token = null;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    unsetRefreshToken: (state) => {
      state.refreshToken = null;
    },
  },
});

export const { setToken, unsetToken, setRefreshToken, unsetRefreshToken } =
  tokenSlice.actions;

export default tokenSlice.reducer;
