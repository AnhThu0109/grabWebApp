// distanceSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

export const distanceSlice = createSlice({
  name: 'distance',
  initialState,
  reducers: {
    setDistanceData: (state, action) => {
      return action.payload;
    },
  },
});

export const { setDistanceData } = distanceSlice.actions;

export default distanceSlice.reducer;
