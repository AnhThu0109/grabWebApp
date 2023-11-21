import axios from "axios";

const getUserById = async (userId, url, token) => {
    try {
      const response = await axios.get(`${url}/${userId}`, {
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

export default getUserById;