import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        p: 2,
        mt: "auto", // Ensure the footer moves to the bottom
        width: "100%", // Full width footer
      }}
      component="footer"
    >
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
      >
        © 2023 Charity Organization
      </Typography>
    </Box>
  );
}

export default Footer;
