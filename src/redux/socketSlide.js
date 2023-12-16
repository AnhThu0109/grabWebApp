import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocketData: (state, action) => {
      return action.payload;
    },
  },
});

// Use an async thunk action creator
export const setSocketDataAsync = (socket) => (dispatch) => {
  // const serializableData = serializeSocket(socket);
  // dispatch(socketSlice.actions.setSocketData(serializableData));
};

export const { setSocketData } = socketSlice.actions;

export default socketSlice.reducer;
