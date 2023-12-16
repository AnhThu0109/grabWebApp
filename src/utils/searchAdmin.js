import axios from "axios";

const searchAdminByKeyword = async (url, keyword, token) => {
    try {
      const response = await axios.get(`${url}/search?keyword=${keyword}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return error; 
    }
  };

export default searchAdminByKeyword;