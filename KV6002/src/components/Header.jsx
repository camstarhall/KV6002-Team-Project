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
        <Button
          variant="contained"
          sx={{ backgroundColor: "green", color: "white" }}
        >
          Language
        </Button>
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
        <img
          src={charityLogo}
          alt="Charity Logo"
          style={{ width: "150px", marginRight: "auto" }}
        />
        <nav style={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
          <Link
            to="/"
            style={{
              margin: "0 1rem",
              color: "black",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Home
          </Link>
          <Link
            to="/events"
            style={{
              margin: "0 1rem",
              color: "black",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Events
          </Link>
          <Link
            to="/about"
            style={{
              margin: "0 1rem",
              color: "black",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            About Us
          </Link>
          <Link
            to="/help"
            style={{
              margin: "0 1rem",
              color: "black",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Help Centre
          </Link>
          <Link
            to="/events-list-admin-view"
            style={{
              margin: "0 1rem",
              color: "black",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Events Admin View
          </Link>
          <Link
            to="/login"
            style={{
              margin: "0 1rem",
              color: "black",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </nav>
        <IconButton sx={{ color: "black" }}>
          <LanguageIcon />
        </IconButton>
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
