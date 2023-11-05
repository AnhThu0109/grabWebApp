import { Link } from "react-router-dom";
import "./style.css";
import { useEffect } from "react";
import setRootBackground from "../../utils/setRootBackground";

function NotFound() {
  useEffect(() => {
    setRootBackground("--bg-color1", "#BFEBE3");
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
          }}
        >
          GO TO HOMEPAGE
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
