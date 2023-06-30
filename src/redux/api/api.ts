import { Exercise } from "@api/exercise";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * A caching api for exercise information.
 */
export const Api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: window._env_.BACKEND_URL,
  }),
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getExerciseById: builder.query<Exercise | undefined, number>({
      query(exerciseId) {
        return {
          url: `/api/getexercise/${exerciseId}/`,
          method: "GET",
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
          credentials: "include",
          body: {
            month: date["month"],
            year: date["year"],
          },
        };
      },
    }),
  }),
});

export default Api.reducer;
export const { useGetExerciseByIdQuery, useGetDoneExercisesInMonthQuery } = Api;
