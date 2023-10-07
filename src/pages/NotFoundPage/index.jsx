import { Link } from "react-router-dom";
import "./style.css";
import { useEffect } from "react";

function NotFound() {
  const setRootBackground = () => {
    document.documentElement.style.setProperty(
      "--bg-color1",
      "#BFEBE3" // Replace with your desired background color for the login page
    );
  };

  const resetRootBackground = () => {
    document.documentElement.style.setProperty(
      "--bg-color1",
      "#F6F1F1" // Replace with your desired background color for the login page
    );
  };

  useEffect(() => {
    setRootBackground();
  }, []);

  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>Oops!</h1>
          <h2>404 - The Page can't be found</h2>
        </div>
        <Link
          to="/"
          className="rounded-4 text-white bg-"
          onClick={() => {
            localStorage.setItem("active", 1);
            resetRootBackground();
          }}
        >
          GO TO HOMEPAGE
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
