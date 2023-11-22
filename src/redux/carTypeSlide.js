import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const carTypeSlice = createSlice({
  name: 'carType',
  initialState,
  reducers: {
    setCarTypeData: (state, action) => {
      return action.payload;
    },
  },
});

export const { setCarTypeData } = carTypeSlice.actions;

export default carTypeSlice.reducer;
