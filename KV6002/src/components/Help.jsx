import React from "react";
import { Box, Typography } from "@mui/material";

function Help() {
  return (
    <Box sx={{ textAlign: "center", padding: "2rem", backgroundColor: "#D08C8C" }}>
      <Typography variant="h4" sx={{ color: 'black' }}>Help Centre</Typography>
      <Typography variant="body1" sx={{ color: 'black', marginTop: '1rem' }}>
        If you need assistance, feel free to reach out to us through our contact page.
      </Typography>
    </Box>
  );
}

export default Help;
