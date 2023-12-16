import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookingData: [],
  bookingHistory: [],
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingData: (state, action) => {
      state.bookingData = action.payload;
    },
    setBookingHistory: (state, action) => {
      state.bookingHistory = action.payload;
    },
  },
});

export const { setBookingData, setBookingHistory } = bookingSlice.actions;

export default bookingSlice.reducer;
