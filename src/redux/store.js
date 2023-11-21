import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./userSlide";
import distanceReducer from "./distanceSlide";
import avatarReducer from "./avatarSlide";

export default configureStore({
	reducer: {
        user: userReducer,
        distance: distanceReducer,
        avatar: avatarReducer,
    },
});