import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const SocialShareButtons = ({ event }) => {
  const eventURL = `https://www.myevents.com/events/${event.id}`;
  const encodedTitle = encodeURIComponent(event.Title);
  const encodedDescription = encodeURIComponent(event.Description);

  return (
    <Box sx={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${eventURL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outlined" color="primary">Facebook</Button>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${eventURL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outlined" color="secondary">Twitter</Button>
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle} - ${eventURL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outlined" color="success">WhatsApp</Button>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${eventURL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outlined" color="info">LinkedIn</Button>
      </a>
    </Box>
  );
};

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    Title: "",
    Date: "",
    Location: "",
    Description: "",
    imageUrl: "",
    Capacity: 0,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const eventsCollection = collection(db, "Events");
    const eventDocs = await getDocs(eventsCollection);
    const eventsData = eventDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEvents(eventsData);
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setFormData(event);
      setIsEdit(true);
      setCurrentEventId(event.id);
    } else {
      setFormData({
        Title: "",
        Date: "",
        Location: "",
        Description: "",
        imageUrl: "",
        Capacity: 0,
      });
      setIsEdit(false);
      setCurrentEventId(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsEdit(false);
    setCurrentEventId(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const eventsCollection = collection(db, "Events");

    try {
      if (isEdit && currentEventId) {
        const eventDoc = doc(db, "Events", currentEventId);
        await updateDoc(eventDoc, formData);
      } else {
        await addDoc(eventsCollection, formData);
      }
      fetchEvents();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteEventId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteEventId(null);
  };

  const handleDelete = async () => {
    try {
      if (deleteEventId) {
        const eventDoc = doc(db, "Events", deleteEventId);
        await deleteDoc(eventDoc);
        fetchEvents();
        handleCloseDeleteDialog();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f8e8e8" }}>
      <Typography variant="h4" sx={{ color: "#7B3F3F", mb: 3 }}>
        Event Management
      </Typography>

      <Button
        variant="contained"
        onClick={() => handleOpenModal()}
        sx={{ mb: 3 }}
      >
        Add Event
      </Button>

      {events.map((event) => (
        <Card
          key={event.id}
          sx={{
            mb: 2,
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography variant="h6">{event.Title}</Typography>
            <Typography>Date: {event.Date}</Typography>
            <Typography>Location: {event.Location}</Typography>
            <Typography>Capacity: {event.Capacity}</Typography>
            <SocialShareButtons event={event} /> {/* Add Share Buttons */}
          </CardContent>
          <Box>
            <IconButton color="primary" onClick={() => handleOpenModal(event)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleOpenDeleteDialog(event.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Card>
      ))}

      {/* Modal for Add/Edit */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {isEdit ? "Edit Event" : "Add Event"}
          </Typography>
          <TextField
            label="Title"
            name="Title"
            value={formData.Title}
            onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Date"
            name="Date"
            type="date"
            value={formData.Date}
            onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Location"
            name="Location"
            value={formData.Location}
            onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="Description"
            value={formData.Description}
            onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Capacity"
            name="Capacity"
            type="number"
            value={formData.Capacity}
            onChange={(e) => setFormData({ ...formData, Capacity: parseInt(e.target.value, 10) })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth>
            {isEdit ? "Update Event" : "Add Event"}
          </Button>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EventManagement;
