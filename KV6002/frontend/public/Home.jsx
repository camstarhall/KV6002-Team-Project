import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";

function Home() {
  return (
    <Box sx={{ textAlign: "center", padding: "2rem", backgroundColor: "#D08C8C" }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={4}><img src={img1} alt="Image 1" style={{ maxWidth: "100%" }} /></Grid>
        <Grid item xs={12} sm={4}><img src={img2} alt="Image 2" style={{ maxWidth: "100%" }} /></Grid>
        <Grid item xs={12} sm={4}><img src={img3} alt="Image 3" style={{ maxWidth: "100%" }} /></Grid>
      </Grid>
      <Typography variant="body1" sx={{ mt: 3, color: "black" }}>
        Join hands with us in bringing positive changes to the community. Every step makes a difference!
      </Typography>
    </Box>
  );
}

export default Home;
