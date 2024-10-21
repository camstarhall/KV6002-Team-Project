import { useState } from "react";
import "./App.css";
import * as React from "react";
import Button from "@mui/material/Button";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EventCard from "./components/EventCard";
import EventList from "./components/EventList";
import { Box } from "@mui/material";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh", // Ensure the layout fills the whole viewport height
          display: "flex",
          flexDirection: "column",
          // gap between each element
          gap: "16px",
        }}
      >
        <Header />
        <EventList />
        <p>TEST</p>
        <Footer />
      </Box>
    </>
  );
}

export default App;
