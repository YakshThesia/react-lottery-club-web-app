import { Box, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import HomeScreenTab from "../../Components/HomeScreenTab";

const Home = () => {
  const location = useLocation();

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
        }}
      >
        <Box sx={{width:"100%"}}>
          <HomeScreenTab userId={location?.state?.userId} />
        </Box>
      </Box>
    </>
  );
};

export default Home;
