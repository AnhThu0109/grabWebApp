import axios from "axios";
import { LOGIN } from "./API";

async function loginUser(credentials) {
  // await axios.post(LOGIN, credentials, {
  //   headers: { 'Content-Type': 'application/json' }
  // })
  //   .then(response => {
  //     console.log(response);
  //     return response;})
  //   .catch(error => {
  //     console.error(error);
  //     throw error;
  //   });

    await axios.post(LOGIN, credentials, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {return response;})
    .catch(error => {
          console.error(error);
          throw error;
        });
}

export default loginUser;