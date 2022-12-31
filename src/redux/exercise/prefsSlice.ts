import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExercisePreferencesState {
  visible: boolean;
  speed: number;
}

const initialState: ExercisePreferencesState = {
  visible: true,
  speed: 10,
};

/**
 * A slice for saving friends information like the current friend-list or requests.
 */
export const prefsSlice = createSlice({
  name: "exercisePrefs",
  initialState,
  reducers: {
    setExercisePrefs: (
      state,
      action: PayloadAction<ExercisePreferencesState>
    ) => {
      state.speed = action.payload.speed;
      state.visible = action.payload.visible;
    },
  },
});

export const { setExercisePrefs } = prefsSlice.actions;

export default prefsSlice.reducer;
