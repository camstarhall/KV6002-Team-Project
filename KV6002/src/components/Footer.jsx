import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { Facebook, Instagram, LinkedIn, YouTube } from "@mui/icons-material";

function Footer() {
  return (
    <Box className="footer">
      <Box className="footer-content">
        <Box className="footer-links">
          <Link href="/contact" className="footer-link-button">Contact Us</Link>
          <Link href="/privacy" className="footer-link-button">Privacy Notice</Link>
          <Link href="/terms" className="footer-link-button">Terms and Conditions</Link>
          <Link href="/accessibility" className="footer-link-button">Accessibility Statement</Link>
          <Link href="/cookies" className="footer-link-button">Cookies Policy</Link>
        </Box>

        <Box className="footer-social">
          <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
            Follow us on:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Link href="https://www.facebook.com" target="_blank" className="footer-icon">
              <Facebook />
            </Link>
            <Link href="https://www.linkedin.com" target="_blank" className="footer-icon">
              <LinkedIn />
            </Link>
            <Link href="https://www.instagram.com" target="_blank" className="footer-icon">
              <Instagram />
            </Link>
            <Link href="https://www.youtube.com" target="_blank" className="footer-icon">
              <YouTube />
            </Link>
          </Box>
        </Box>
      </Box>
      
      {/* Centering the sentences above the copyright notice */}
      <Typography variant="body2" sx={{ color: 'white', textAlign: 'center', padding: '0.5rem 0' }}>
        Together, we can make a difference in our community.
      </Typography>
      <Typography variant="body2" sx={{ color: 'white', textAlign: 'center', padding: '0.5rem 0' }}>
        Your support empowers those in need.
      </Typography>

      {/* Copyright notice at the bottom */}
      <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', padding: '1rem' }}>
        &copy; 2024 Charity Organization. All Rights Reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
