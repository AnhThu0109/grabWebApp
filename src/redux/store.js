import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./userSlide";
import distanceReducer from "./distanceSlide";
import avatarReducer from "./avatarSlide";
import carTypeReducer from "./carTypeSlide";
import carServiceReducer from "./carServiceSlide";
import bookingFormReducer from "./bookingFormSlide";
import notificationReducer from "./notificationSlide";
import socketReducer from "./socketSlide";

export default configureStore({
	reducer: {
        user: userReducer,
        distance: distanceReducer,
        avatar: avatarReducer,
        carType: carTypeReducer,
        carService: carServiceReducer,
        bookingForm: bookingFormReducer,
        notification: notificationReducer,
        socket: socketReducer,
    },
});