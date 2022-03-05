import { Friend } from "@api/friend";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { serverUrl } from "@util/api";
import { store } from "../store";

export const friendApi = createApi({
  reducerPath: "friendApi",
  baseQuery: fetchBaseQuery({
    baseUrl: serverUrl,
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
        console.log(response);
        if (response.success) {
          return response.data;
        }
        return undefined;
      },
    }),
  }),
});

export default friendApi.reducer;
export const { useGetFriendByIdQuery } = friendApi;
