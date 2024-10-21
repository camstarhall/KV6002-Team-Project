import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import LoginIcon from "@mui/icons-material/Login";

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Language Icon on the left */}
        <IconButton
          edge="start"
          color="inherit"
        >
          <LanguageIcon />
        </IconButton>

        {/* Search bar in the middle */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              position: "relative",
              borderRadius: 1,
              bgcolor: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchIcon sx={{ padding: "0 8px" }} />
            <InputBase
              placeholder="Search…"
              sx={{ color: "inherit", width: "300px" }}
            />
          </Box>
        </Box>

        {/* Login Icon on the right */}
        <IconButton
          edge="end"
          color="inherit"
        >
          <LoginIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
