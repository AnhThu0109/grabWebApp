import axios from "axios";
import { NOTIFICATION } from "./API";

const createNotification = async (input, token) => {
  try {
    const response = await axios.post(
      `${NOTIFICATION}`,
      {
        text: input.text,
        adminId: input.adminId,
        isErrorNoti: input.isErrorNoti,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error create notification:", error);
    throw error;
  }
};

const getNotificationsById = async (adminId, token) => {
  try {
    const response = await axios.get(`${NOTIFICATION}/admin/${adminId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

const updateNotification = async (id, isRead, token) => {
  try {
    const response = await axios.put(
      `${NOTIFICATION}/${id}`,
      {
        isRead,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error update notification:", error);
    throw error;
  }
};

const deleteNotification = async (id, token) => {
  try {
    const response = await axios.delete(`${NOTIFICATION}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    console.error("Error delete notifications:", error);
    throw error;
  }
};

const updateAllNotifications = async (id, token) => {
  try {
    const response = await axios.put(
      `${NOTIFICATION}/updateAll/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error update all notifications:", error);
    throw error;
  }
};

export {
  getNotificationsById,
  createNotification,
  updateNotification,
  deleteNotification,
  updateAllNotifications,
};
