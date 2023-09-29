import { Box, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import "./style.css";

const Welcome = () => {
    const [progress, setProgress] = useState(0);
    const setRootBackground = () => {
        document.documentElement.style.setProperty(
          "--bg-color1",
          "#BFEBE3" // Replace with your desired background color for the login page
        );
      };

    useEffect(() => {
        setRootBackground();
        const timer = setInterval(() => {
          setProgress((oldProgress) => {
            if (oldProgress === 100) {
              return 0;
            }
            const diff = 20;
            return Math.min(oldProgress + diff, 100);
          });
        }, 500);
    
        return () => {
          clearInterval(timer);
        };
      }, []);
    return(
        <div className="d-flex align-items-center flex-column">
            <img alt="welcomeImage" src="https://assets.materialup.com/uploads/dcb15c3c-52ef-4c2a-a5ab-8d9f08cf19ce/animated_teaser.gif" className="welcomeImg"/>
            <Box className="progressBar mt-3">
                <LinearProgress variant="determinate" value={progress} />
            </Box>
        </div>
    )
}

export default Welcome;