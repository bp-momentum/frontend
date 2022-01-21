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
