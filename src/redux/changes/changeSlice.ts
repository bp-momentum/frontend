import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChangeState {
  planChanges: boolean;
}

const initialState: ChangeState = {
  planChanges: false,
};

export const changeSlice = createSlice({
  name: "changes",
  initialState,
  reducers: {
    setPlanChanges: (state, action: PayloadAction<boolean>) => {
      state.planChanges = action.payload;
    },
  },
});

export const { setPlanChanges } = changeSlice.actions;

export default changeSlice.reducer;
