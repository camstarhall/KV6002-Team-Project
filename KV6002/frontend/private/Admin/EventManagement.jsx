// src/components/EventManagement.jsx

import React, { useState } from "react";
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Input } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

const EventManagement = () => {
  const [events, setEvents] = useState(JSON.parse(localStorage.getItem("events")) || []);
  const [eventData, setEventData] = useState({ title: "", date: "", location: "", capacity: "", description: "", image: null });
  const [editIndex, setEditIndex] = useState(null);

  const handleAddOrUpdateEvent = () => {
    if (!eventData.title || !eventData.date || !eventData.location || !eventData.capacity || !eventData.description) return;

    const newEvent = {
      ...eventData,
      id: editIndex !== null ? events[editIndex].id : uuidv4(),
      imageUrl: eventData.image ? URL.createObjectURL(eventData.image) : null, // Set image URL
    };
    const updatedEvents = editIndex !== null
      ? events.map((event, index) => (index === editIndex ? newEvent : event))
      : [...events, newEvent];

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setEventData({ title: "", date: "", location: "", capacity: "", description: "", image: null });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEventData(events[index]);
    setEditIndex(index);
  };

  const handleDelete = (id) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ color: "#7B3F3F", mb: 2 }}>Manage Events</Typography>
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField label="Title" value={eventData.title} onChange={(e) => setEventData({ ...eventData, title: e.target.value })} />
        <TextField label="Date" type="date" value={eventData.date} onChange={(e) => setEventData({ ...eventData, date: e.target.value })} InputLabelProps={{ shrink: true }} />
        <TextField label="Location" value={eventData.location} onChange={(e) => setEventData({ ...eventData, location: e.target.value })} />
        <TextField label="Capacity" type="number" value={eventData.capacity} onChange={(e) => setEventData({ ...eventData, capacity: e.target.value })} />
        <TextField label="Description" value={eventData.description} onChange={(e) => setEventData({ ...eventData, description: e.target.value })} multiline rows={3} />
        <Input type="file" onChange={(e) => setEventData({ ...eventData, image: e.target.files[0] })} />
        <Button variant="contained" sx={{ backgroundColor: "#7B3F3F", color: "white" }} onClick={handleAddOrUpdateEvent}>
          {editIndex !== null ? "Update Event" : "Add Event"}
        </Button>
      </Box>
      <List>
        {events.map((event, index) => (
          <ListItem
            key={event.id}
            sx={{
              mb: 1,
              backgroundColor: "#f8e8e8", // Light background for better contrast
              borderRadius: "4px",
              boxShadow: 1,
              padding: "1rem",
            }}
          >
            {event.imageUrl && <img src={event.imageUrl} alt={event.title} style={{ width: "100px", height: "auto", marginRight: "1rem" }} />}
            <ListItemText
              primary={
                <Typography variant="h6" sx={{ color: "#7B3F3F" }}> {/* Dark pink color for title */}
                  {event.title}
                </Typography>
              }
              secondary={
                <>
                  <Typography sx={{ color: "#333" }}>Date: {event.date}</Typography>
                  <Typography sx={{ color: "#333" }}>Location: {event.location}</Typography>
                  <Typography sx={{ color: "#333" }}>Capacity: {event.capacity}</Typography>
                  <Typography sx={{ color: "#333" }}>Description: {event.description}</Typography>
                  <Typography sx={{ color: "#333" }}>Spaces Left: {event.capacity}</Typography>
                  <Typography variant="caption" sx={{ color: "gray" }}>Created On: {new Date().toLocaleDateString()}</Typography>
                </>
              }
            />
            <IconButton color="primary" onClick={() => handleEdit(index)}><Edit /></IconButton>
            <IconButton color="error" onClick={() => handleDelete(event.id)}><Delete /></IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default EventManagement;
