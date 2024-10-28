import React from "react";
import { Box, Typography } from "@mui/material";

function About() {
  return (
    <Box sx={{ textAlign: "center", padding: "2rem", backgroundColor: "#D08C8C" }}>
      <Typography variant="h4" sx={{ color: 'black' }}>About Us</Typography>
      <Typography variant="body1" sx={{ color: 'black', marginTop: '1rem' }}>
        We are a charity organization dedicated to making a positive impact in the community.
      </Typography>
    </Box>
  );
}

export default About;
