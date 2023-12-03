import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notiData: [],
  isAnyUnread: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationData: (state, action) => {
      state.notiData = action.payload; // Update notiData property of the state
      state.isAnyUnread = action.payload.some(
        (notification) => !notification.isRead
      ); // Update isAnyUnread based on isRead property
    },
    addNotification: (state, action) => {
      state.notiData.unshift(action.payload);
      state.isAnyUnread = !action.payload.isRead; // Update isAnyUnread based on the new notification
    },
    deleteNotificationById: (state, action) => {
      const notificationId = action.payload;
      state.notiData = state.notiData.filter(
        (notification) => notification.id !== notificationId
      );
      state.isAnyUnread = state.notiData.some(
        (notification) => !notification.isRead
      ); // Update isAnyUnread based on isRead property
    },
    updateIsRead: (state, action) => {
      const { id, isRead } = action.payload;
      const notification = state.notiData.find(
        (notification) => notification.id === id
      );
      if (notification) {
        notification.isRead = isRead;
        state.isAnyUnread = state.notiData.some(
          (notification) => !notification.isRead
        ); // Update isAnyUnread based on isRead property
      }
    },
    updateAllAsRead: (state) => {
      state.notiData.forEach((notification) => {
        notification.isRead = true;
      });
      state.isAnyUnread = false;
    },
  },
});

export const {
  setNotificationData,
  addNotification,
  deleteNotificationById,
  updateIsRead,
  updateAllAsRead
} = notificationSlice.actions;

export default notificationSlice.reducer;
