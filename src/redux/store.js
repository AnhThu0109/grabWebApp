import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./userSlide";
import distanceReducer from "./distanceSlide";
import avatarReducer from "./avatarSlide";
import carTypeReducer from "./carTypeSlide";
import carServiceReducer from "./carServiceSlide";

export default configureStore({
	reducer: {
        user: userReducer,
        distance: distanceReducer,
        avatar: avatarReducer,
        carType: carTypeReducer,
        carService: carServiceReducer,
    },
});