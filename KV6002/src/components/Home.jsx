import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import img1 from "../assets/img1.jpg"; // Importing the local image
import img2 from "../assets/img2.jpg"; // Importing the local image
import img3 from "../assets/img3.jpg"; // Importing the local image

function Home() {
  return (
    <Box
      className="main-content"
      sx={{ textAlign: "center", padding: "2rem 1rem", backgroundColor: "#D08C8C", marginTop: 0 }}
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <img
            src={img1}
            alt="Charity Image 1"
            style={{ width: "100%", height: "auto", maxWidth: "350px" }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <img
            src={img2}
            alt="Charity Image 2"
            style={{ width: "100%", height: "auto", maxWidth: "350px" }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <img
            src={img3}
            alt="Charity Image 3"
            style={{ width: "100%", height: "auto", maxWidth: "350px" }}
          />
        </Grid>
      </Grid>

      {/* Updated this section for the text under images */}
      <Typography variant="body1" mt={3} sx={{ textAlign: 'center', fontSize: '1.25rem', color: 'black' }}>
        Join hands with us in bringing positive changes to the community.
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', fontSize: '1.25rem', color: 'black' }}>
        Every step makes a difference!
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', fontSize: '1.25rem', color: 'black' }}>
        Together we can create a brighter future for those in need.
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', fontSize: '1.25rem', color: 'black' }}>
        Your support helps us reach more people in our community.
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', fontSize: '1.25rem', color: 'black' }}>
        Together, we can provide essential resources to those who need it most.
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', fontSize: '1.25rem', color: 'black' }}>
        Volunteer opportunities are available for anyone looking to make an impact.
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', fontSize: '1.25rem', color: 'black' }}>
        Each donation brings us one step closer to our goals.
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', fontSize: '1.25rem', color: 'black' }}>
        Join us in our mission to make a difference today.
      </Typography>
    </Box>
  );
}

export default Home;
