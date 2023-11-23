import axios from "axios";

const getById = async (id, url, token) => {
    try {
      const response = await axios.get(`${url}/${id}`, {
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

export default getById;