import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Score {
  accuracy: number;
  intensity: number;
  speed: number;
}

interface TrainingPoints {
  latestScore: Score;
  currentSet: number;
  scoreHistory: { [set: number]: Score[] }; // Map<set, Score[]>
  information: string;
}

const initialState: TrainingPoints = {
  latestScore: { accuracy: 0, intensity: 0, speed: 0 },
  currentSet: 0,
  scoreHistory: {},
  information: "",
};

/**
 * A slice for saving friends information like the current friend-list or requests.
 */
export const trainingScoreSlice = createSlice({
  name: "trainingScore",
  initialState,
  reducers: {
    setSet: (state, action: PayloadAction<number>) => {
      state.currentSet = action.payload;
    },
    setLatestTrainingPoints: (state, action: PayloadAction<Score>) => {
      state.latestScore = action.payload;
      if (state.scoreHistory[state.currentSet] === undefined) {
        state.scoreHistory[state.currentSet] = [];
      }
      state.scoreHistory[state.currentSet].push(action.payload);
    },
    setInformation: (state, action: PayloadAction<string>) => {
      state.information = action.payload;
      setTimeout(() => {
        state.information = "";
      }, 5000);
    },
    resetTrainingPoints: (state) => {
      state.latestScore = { accuracy: 0, intensity: 0, speed: 0 };
      state.currentSet = 0;
      state.scoreHistory = {};
      state.information = "";
    },
  },
});

export const {
  setSet,
  setLatestTrainingPoints,
  setInformation,
  resetTrainingPoints,
} = trainingScoreSlice.actions;

export default trainingScoreSlice.reducer;
