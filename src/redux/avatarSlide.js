import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    avatarChosenPath: "",
    avatarPath: "",
};

export const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    setAvatarChosenPath: (state, action) => {
      state.avatarChosenPath = action.payload;
    },
    setAvatarPath: (state, action) => {
      state.avatarPath = action.payload;
    },
  },
});

export const { setAvatarChosenPath, setAvatarPath } = avatarSlice.actions;

export default avatarSlice.reducer;
