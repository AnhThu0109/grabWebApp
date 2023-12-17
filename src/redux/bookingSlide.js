import { createSlice } from '@reduxjs/toolkit';

const initialState = false;

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingData: (state, action) => {
      state.bookingData = action.payload;
    }
  },
});

export const { setBookingData } = bookingSlice.actions;

export default bookingSlice.reducer;
