import { message } from "antd";
import axios from "axios";
import { BOOKING_FORM } from "./API";
import formatPeopleId from "./formatPeopleID";
import { createNotification } from "./notificationAction";
import { addNotification } from "../redux/notificationSlide";

const submitBookingForm = async (input, id, token, dispatch) => {
  try {
    const response = await axios.post(`${BOOKING_FORM}/bookRide`, input, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    console.error("Error submit booking form:", error);
    if (error.response.status === 404) {
      const notification =
        error.response.data.message.split("!")[0] +
        ` cho đơn đặt xe ${formatPeopleId(error.response.data.data.id, "BK")}`;
      message.info(notification);
      const input = {
        text: notification,
        adminId: id,
        isErrorNoti: true,
      };
      const resNoti = await createNotification(input, token);
      if (resNoti.status === 200) {
        dispatch(addNotification(resNoti.data));
      }
    } else {
      console.log(error);
    }
  }
};

const updateBookingForm = async (id, input, token) => {
  try {
    const response = await axios.put(`${BOOKING_FORM}/${id}/update`, input, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    console.error("Error cancel booking form:", error);
  }
};

export { submitBookingForm, updateBookingForm };
