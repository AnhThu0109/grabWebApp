import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocketData: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSocketData } = socketSlice.actions;

export default socketSlice.reducer;
