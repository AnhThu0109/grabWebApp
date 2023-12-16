import axios from "axios";

const updateInformation = async (input, userId, token, url) => {
  const response = await axios.put(`${url}/${userId}`, input, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return response;
};

export default updateInformation;
