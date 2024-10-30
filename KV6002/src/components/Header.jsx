import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  InputBase,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import charityLogo from "../assets/Rose_logo.png";
import "../App.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Box>
      {/* Top Part of the Header */}
      <Box
        sx={{
          backgroundColor: "#7B3F3F",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        {/* Burger Icon for Menu */}
        <IconButton
          onClick={toggleMenu}
          sx={{ color: "white" }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ color: "white", textAlign: "center", flexGrow: 1 }}
        >
          Together we can make a difference
        </Typography>
      </Box>

      {/* Drawer for Menu Links */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={toggleMenu}
      >
        <Box
          sx={{ width: 250, padding: "1rem" }}
          onClick={toggleMenu}
        >
          <List>
            <ListItem
              button
              component={Link}
              to="/"
            >
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/events"
            >
              <ListItemText primary="Events" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/about"
            >
              <ListItemText primary="About Us" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/help"
            >
              <ListItemText primary="Help Centre" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/events-list-admin-view"
            >
              <ListItemText primary="Events Admin View" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/login"
            >
              <ListItemText primary="Login" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Bottom Part of the Header */}
      <Box
        sx={{
          backgroundColor: "#D08C8C",
          display: "flex",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        {/* Language Button */}
        <IconButton sx={{ color: "black" }}>
          <LanguageIcon />
        </IconButton>

        {/* Logo */}
        <img
          src={charityLogo}
          alt="Charity Logo"
          style={{ width: "75px", marginLeft: "1rem", marginRight: "auto" }}
        />

        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            maxWidth: "400px",
            margin: "0 2rem",
          }}
        >
          <InputBase
            placeholder="Search by event name"
            sx={{
              backgroundColor: "white",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              width: "100%",
            }}
          />
          <IconButton
            type="submit"
            aria-label="search"
            sx={{ color: "black" }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Login Button */}
        <Button
          component={Link}
          to="/login"
          startIcon={<AccountCircleIcon />}
          sx={{
            color: "black",
            textTransform: "none",
            fontWeight: "bold",
            marginLeft: "auto",
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default Header;
