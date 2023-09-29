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

  useEffect(() => {
    setRootBackground();
  }, []);
  
  return (
    <div id="notfound">
      <div class="notfound">
        <div class="notfound-404">
          <h1>Oops!</h1>
          <h2>404 - The Page can't be found</h2>
        </div>
        <Link to="/" className="rounded-4 text-white bg-">
          GO TO HOMEPAGE
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
