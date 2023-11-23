import axios from "axios";

const getLocationByName = async (url, locationName, token) => {
  try {
    const input = {
      locationName,
    };
    const response = await axios.post(url, input, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export default getLocationByName;
