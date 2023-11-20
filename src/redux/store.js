import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./userSlide";
import distanceReducer from "./distanceSlide";

export default configureStore({
	reducer: {
        user: userReducer,
        distance: distanceReducer,
    },
});