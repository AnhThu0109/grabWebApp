import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const carServiceSlice = createSlice({
  name: 'carService',
  initialState,
  reducers: {
    setCarServiceData: (state, action) => {
      return action.payload;
    },
  },
});

export const { setCarServiceData } = carServiceSlice.actions;

export default carServiceSlice.reducer;
