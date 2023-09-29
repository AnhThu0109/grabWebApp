import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./userSlide";

export default configureStore({
	reducer: {
        user: userReducer,
    },
});