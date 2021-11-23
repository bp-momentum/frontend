import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../util/api";

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
      api.setToken(action.payload);
    },
    unsetToken: (state) => {
      state.token = null;
      api.setToken("");
    }
  }
});

export const { setToken, unsetToken } = tokenSlice.actions;

export default tokenSlice.reducer;