// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7B3F3F", // Darker shade for primary elements
    },
    background: {
      default: "#F8E8E8", // Light pink background for better contrast
    },
    text: {
      primary: "#333", // Darker text color for readability
      secondary: "#4A4A4A",
    },
  },
});

export default theme;
