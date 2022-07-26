import { Exercise } from "@api/exercise";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { store } from "../store";
import { Friend } from "@api/friend";

/**
 * A caching api for exercise information.
 */
export const Api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: window._env_.BACKEND_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set(
        "Session-Token",
        (getState() as ReturnType<typeof store.getState>).token.token ?? ""
      );
      return headers;
    },
  }),
  refetchOnFocus: true,
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
    getFriendById: builder.query<Friend | undefined, string>({
      query(username) {
        return {
          url: "/api/getprofileoffriend",
          method: "POST",
          body: {
            username,
          },
        };
      },
      transformResponse(response: {
        success: boolean;
        data: Friend;
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

export default Api.reducer;
export const {
  useGetExerciseByIdQuery,
  useGetDoneExercisesInMonthQuery,
  useGetFriendByIdQuery,
} = Api;
