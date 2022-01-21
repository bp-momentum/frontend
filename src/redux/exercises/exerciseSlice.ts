import { Exercise } from "../../api/exercise";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import api from "../../util/api";
import { store } from "../store";

export const exerciseApi = createApi({
  reducerPath: "exerciseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: api.serverUrl,
    prepareHeaders: (headers, { getState }) => {
      headers.set(
        "Session-Token",
        (getState() as ReturnType<typeof store.getState>).token.token ?? ""
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getExerciseById: builder.query<Exercise | undefined, string>({
      query(exerciseId) {
        return {
          url: "/api/getexercise",
          method: "POST",
          body: {
            id: exerciseId,
          },
        };
      },
      transformResponse(response: {
        success: boolean;
        data: Exercise;
        description: string;
      }) {
        if (response.success) {
          return response.data;
        }
        return undefined;
      },
    }),
  }),
});

export default exerciseApi.reducer;
export const { useGetExerciseByIdQuery } = exerciseApi;

/*
interface ExerciseState {
  exercises: Record<number, AdvancedExercise>;
}

const initialState: ExerciseState = {
  exercises: {},
};

const exerciseAdapter = createEntityAdapter<AdvancedExercise>({
  selectId: (exercise) => exercise.id,
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

const exerciseSlice = createSlice({
  name: "exercise",
  initialState: exerciseAdapter.getInitialState(),
  reducers: {
    addExercise: exerciseAdapter.addOne,
    setExercises(state, action) {
      exerciseAdapter.setAll(state, action.payload.exercises);
    },
  },
});

const exerciseSelectors = exerciseAdapter.getSelectors();

const getExercise = createAsyncThunk(
  "",
  async (exerciseId: string) => {
    return {}; // TODO fetch
  },
  {
    condition: (exerciseId, { getState }) => {
      return !exerciseSelectors.selectById(getState(), exerciseId);
    },
  }
);

/*

export const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    setExercises: (state, action: PayloadAction<Record<number, Exercise>>) => {
      state.exercises = action.payload;
    },
  },
});

export const { setExercises } = exerciseSlice.actions;



export default exerciseSlice.reducer;
*/
