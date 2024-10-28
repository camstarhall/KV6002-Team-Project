import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const events = [
  { id: 1, name: "Charity Run", date: "2024-11-01", location: "City Park", createdAt: "2024-10-01 10:00 AM" },
  { id: 2, name: "Food Drive", date: "2024-12-01", location: "Community Center", createdAt: "2024-10-05 09:30 AM" },
  { id: 3, name: "Community Clean-up", date: "2024-10-15", location: "Beachfront", createdAt: "2024-10-10 02:45 PM" },
];

function EventListAdminView() {
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    organizer: "",
    location: "",
    date: "",
    time: "",
    capacity: "",
    description: "",
    image: null,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleImageUpload = (e) => {
    setNewEvent({ ...newEvent, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Data:", newEvent);
    handleClose();
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f5f5f5", minHeight: "80vh" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" style={{ color: 'black', marginBottom: '1rem' }}>Events</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
          Create Event
        </Button>
      </Box>

      <TableContainer sx={{ backgroundColor: "white", borderRadius: "8px", boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Created At</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.createdAt}</TableCell>
                <TableCell>
                  <IconButton color="primary" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose} aria-labelledby="create-event-modal" aria-describedby="form-to-create-event">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>Create New Event</Typography>
          <TextField label="Title" name="title" fullWidth margin="normal" value={newEvent.title} onChange={handleInputChange} />
          <TextField label="Organizer" name="organizer" fullWidth margin="normal" value={newEvent.organizer} onChange={handleInputChange} />
          <TextField label="Location" name="location" fullWidth margin="normal" value={newEvent.location} onChange={handleInputChange} />
          <TextField label="Date" name="date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={newEvent.date} onChange={handleInputChange} />
          <TextField label="Time" name="time" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={newEvent.time} onChange={handleInputChange} />
          <TextField label="Capacity" name="capacity" type="number" fullWidth margin="normal" value={newEvent.capacity} onChange={handleInputChange} />
          <TextField label="Description" name="description" fullWidth margin="normal" multiline rows={3} value={newEvent.description} onChange={handleInputChange} />
          <Button variant="contained" component="label" fullWidth sx={{ marginTop: 2 }}>
            Upload Picture
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>Submit</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default EventListAdminView;
