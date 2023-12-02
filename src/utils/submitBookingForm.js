import { message } from "antd";
import axios from "axios";
import { BOOKING_FORM } from "./API";
import formatPeopleId from "./formatPeopleID";

const submitBookingForm = async (input, token) => {
    try {
      const response = await axios.post(`${BOOKING_FORM}/bookRide`, input, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching user data:", error);
      if(error.response.status === 404){
        message.error(error.response.data.message.split("!")[0] + ` cho đơn đặt xe ${formatPeopleId(error.response.data.data.id, "BK")}`);
      }
      else {
        message.error(error.message);
      }
    }
  };

export default submitBookingForm;