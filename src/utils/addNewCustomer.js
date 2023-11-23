import axios from "axios";

const createCustomer = async (url, input) => {
    try {
      const response = await axios.post(`${url}/register`, input);
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error; 
    }
  };

export default createCustomer;