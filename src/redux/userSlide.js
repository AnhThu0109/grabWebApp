import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
    location: "",
    gender: "",
    avatar: "",
    createdAt: "",
    updatedAt: "",
  }
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers:{
    userData: (state, action) => {
      state.data = {
        ...state.data,
        firstname: action.payload.firstname,
        lastname: action.payload.lastname,
        username: action.payload.username,
        email: action.payload.email,
        phone: action.payload.phone,
        location: action.payload.location,
        gender: action.payload.gender,
        avatar: action.payload.avatar,
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
      };
    },
  },
});

export const {userData} = user.actions;

export default user.reducer;
