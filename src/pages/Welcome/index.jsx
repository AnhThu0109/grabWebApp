import { Box, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import setRootBackground from "../../utils/setRootBackground";

const Welcome = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const setNavigateTime = () => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  useEffect(() => {
    setRootBackground("--bg-color1", "#BFEBE3");
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = 20;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    setNavigateTime();
    return () => {
      clearInterval(timer);
      clearTimeout(setNavigateTime);
    };
  }, []);
  return (
    <div className="d-flex align-items-center flex-column">
      <img
        alt="welcomeImage"
        src="/images/gifDriver.gif"
        className="welcomeImg"
      />
      <Box className="progressBar mt-3">
        <LinearProgress variant="determinate" value={progress} />
      </Box>
    </div>
  );
};

export default Welcome;
