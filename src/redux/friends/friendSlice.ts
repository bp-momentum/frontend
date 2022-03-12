import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Friend {
  username: string;
  id?: number;
}

interface FriendState {
  friendRequests: Friend[];
  friends: Friend[] | null;
  sentRequests: Friend[] | null;
}

const initialState: FriendState = {
  friendRequests: [],
  friends: null,
  sentRequests: null,
};

export const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    setFriendRequests: (state, action: PayloadAction<Friend[]>) => {
      state.friendRequests = action.payload;
    },
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.friends = action.payload;
    },
    setSentRequests: (state, action: PayloadAction<Friend[]>) => {
      state.sentRequests = action.payload;
    },
  },
});

export const { setFriendRequests, setFriends, setSentRequests } =
  friendSlice.actions;

export default friendSlice.reducer;
