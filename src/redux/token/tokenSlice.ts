import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenState {
  token: string | null;
}

const initialState: TokenState = {
  token: null,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    unsetToken: (state) => {
      state.token = null;
    }
  }
});

export const { setToken, unsetToken } = tokenSlice.actions;

export default tokenSlice.reducer;