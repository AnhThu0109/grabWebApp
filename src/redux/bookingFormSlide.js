import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

export const bookingFormSlice = createSlice({
  name: 'bookingForm',
  initialState,
  reducers: {
    setBookingFormData: (state, action) => {
      return action.payload;
    },
  },
});

export const { setBookingFormData } = bookingFormSlice.actions;

export default bookingFormSlice.reducer;
