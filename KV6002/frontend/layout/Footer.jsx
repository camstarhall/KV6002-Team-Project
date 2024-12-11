import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { Facebook, Instagram, LinkedIn, YouTube } from "@mui/icons-material";

function Footer() {
  return (
    <Box sx={{ backgroundColor: "#7B3F3F", padding: "1rem", color: "white", textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.25rem",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: "1rem" }}>
          {/* Updated Contact Us link to point to /help */}
          <Link href="/help" sx={{ color: "white" }}>
            Contact Us
          </Link>
          <Link href="/privacy" sx={{ color: "white" }}>
            Privacy Notice
          </Link>
          <Link href="/terms" sx={{ color: "white" }}>
            Terms
          </Link>
        </Box>
        <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="https://facebook.com" target="_blank" sx={{ color: "white" }}>
            <Facebook />
          </Link>
          <Link href="https://instagram.com" target="_blank" sx={{ color: "white" }}>
            <Instagram />
          </Link>
          <Link href="https://linkedin.com" target="_blank" sx={{ color: "white" }}>
            <LinkedIn />
          </Link>
          <Link href="https://youtube.com" target="_blank" sx={{ color: "white" }}>
            <YouTube />
          </Link>
        </Box>
      </Box>
      <Typography variant="body2" sx={{ color: "white", padding: "1rem 0" }}>
        Together, we can make a difference in our community.
      </Typography>
      <Typography variant="body2" sx={{ color: "white", padding: "1rem 0" }}>
        &copy; 2024 Rose Charity Event Management. All Rights Reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
