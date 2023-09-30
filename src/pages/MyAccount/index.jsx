import { useState } from "react";

const MyAccount = () => {
  const [isAdmin, setAdmin] = useState(false);
  const a = localStorage.getItem("isAdmin")
  return(
    <>
      <h1>Hello</h1>
    </>
)
}

export default MyAccount;