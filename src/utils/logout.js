import { LOGOUT } from "./API";

async function logoutUser(token) {
  return fetch(LOGOUT, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(token),
  })
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

const logOut = async (token) => {
  let tokenUser = {
    "accessToken": token
  }
  await logoutUser(tokenUser)
  localStorage.clear();
}

export {logoutUser, logOut};