import config from "@config";
import { Exercise } from "@api/exercise";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { store } from "../store";

export const exerciseApi = createApi({
  reducerPath: "exerciseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.backendUrl,
    prepareHeaders: (headers, { getState }) => {
      headers.set(
        "Session-Token",
        (getState() as ReturnType<typeof store.getState>).token.token ?? ""
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getExerciseById: builder.query<Exercise | undefined, number>({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getDoneExercisesInMonth: builder.query<any, Record<string, number>>({
      query(date) {
        return {
          url: "/api/getdoneexercisesinmonth",
          method: "POST",
          body: {
            month: date["month"],
            year: date["year"],
          },
        };
      },
    }),
  }),
});

export default exerciseApi.reducer;
export const { useGetExerciseByIdQuery, useGetDoneExercisesInMonthQuery } =
  exerciseApi;
