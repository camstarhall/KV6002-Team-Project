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
  LinearProgress,
} from "@mui/material";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [formData, setFormData] = useState({
    Title: "",
    Date: "",
    Location: "",
    Description: "",
    imageURL: "",
    Capacity: 0,
    Status: "Active", // Default status
  });
  const [filters, setFilters] = useState({
    searchTitle: "",
    startDate: "",
    endDate: "",
    status: "All", // Default to all statuses
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, "Events");
      const eventDocs = await getDocs(eventsCollection);
      const eventsData = eventDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
      setFilteredEvents(eventsData); // Initialize filtered events
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to fetch events.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    let filtered = events;

    if (filters.searchTitle) {
      filtered = filtered.filter((event) =>
        event.Title.toLowerCase().includes(filters.searchTitle.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (event) => new Date(event.Date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (event) => new Date(event.Date) <= new Date(filters.endDate)
      );
    }

    if (filters.status !== "All") {
      filtered = filtered.filter((event) => event.Status === filters.status);
    }

    setFilteredEvents(filtered);
  };

  const clearFilters = () => {
    setFilters({
      searchTitle: "",
      startDate: "",
      endDate: "",
      status: "All",
    });
    setFilteredEvents(events); // Reset to all events
  };

  const handleOpenModal = (event = null) => {
    setError("");
    if (event) {
      setFormData(event);
      setIsEdit(true);
      setCurrentEventId(event.id);
      setImagePreview(event.imageURL);
    } else {
      setFormData({
        Title: "",
        Date: "",
        Location: "",
        Description: "",
        imageURL: "",
        Capacity: 0,
        Status: "Active",
      });
      setImagePreview(null);
      setIsEdit(false);
      setCurrentEventId(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsEdit(false);
    setCurrentEventId(null);
    setUploading(false);
    setUploadProgress(0);
    setImagePreview(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const today = new Date();
    const eventDate = new Date(formData.Date);

    if (eventDate < today.setHours(0, 0, 0, 0)) {
      setError("The event date cannot be in the past. Please select a valid date.");
      return;
    }

    if (formData.Capacity <= 0) {
      setError("The event capacity must be greater than 0.");
      return;
    }

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
      alert("Failed to save event.");
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
      alert("Failed to delete event.");
    }
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f8e8e8" }}>
      <Typography variant="h4" sx={{ color: "#7B3F3F", mb: 3 }}>
        Event Management
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Search by Title"
          name="searchTitle"
          value={filters.searchTitle}
          onChange={handleFilterChange}
          fullWidth
        />
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          value={filters.startDate}
          onChange={handleFilterChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          name="endDate"
          type="date"
          value={filters.endDate}
          onChange={handleFilterChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Status"
          name="status"
          select
          value={filters.status}
          onChange={handleFilterChange}
          fullWidth
          sx={{ width: "200px" }}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Cancelled">Cancelled</option>
        </TextField>
        <Button variant="contained" onClick={applyFilters}>
          Search
        </Button>
        <Button variant="outlined" onClick={clearFilters}>
          Clear Filters
        </Button>
      </Box>

      <Button
        variant="contained"
        onClick={() => handleOpenModal()}
        sx={{ mb: 3 }}
      >
        Add Event
      </Button>

      {filteredEvents.map((event) => (
        <Card
          key={event.id}
          sx={{
            mb: 2,
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: event.Status === "Cancelled" ? 0.5 : 1,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                textDecoration: event.Status === "Cancelled" ? "line-through" : "none",
              }}
            >
              {event.Title} {event.Status === "Cancelled" && "(Cancelled)"}
            </Typography>
            <Typography>Date: {event.Date}</Typography>
            <Typography>Location: {event.Location}</Typography>
            <Typography>Capacity: {event.Capacity}</Typography>
            {event.imageURL && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={event.imageURL}
                  alt={event.Title}
                  style={{ maxWidth: "15%", height: "auto" }}
                />
              </Box>
            )}
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
            width: { xs: "90%", sm: "500px" },
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {isEdit ? "Edit Event" : "Add Event"}
          </Typography>
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            label="Title"
            name="Title"
            value={formData.Title}
            onChange={(e) =>
              setFormData({ ...formData, Title: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Date"
            name="Date"
            type="date"
            value={formData.Date}
            onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            label="Location"
            name="Location"
            value={formData.Location}
            onChange={(e) =>
              setFormData({ ...formData, Location: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Description"
            name="Description"
            value={formData.Description}
            onChange={(e) =>
              setFormData({ ...formData, Description: e.target.value })
            }
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Capacity"
            name="Capacity"
            type="number"
            value={formData.Capacity}
            onChange={(e) =>
              setFormData({
                ...formData,
                Capacity: parseInt(e.target.value, 10),
              })
            }
            fullWidth
            sx={{ mb: 2 }}
            required
            inputProps={{ min: 0 }}
          />
          <Button type="submit" variant="contained" fullWidth>
            {isEdit ? "Update Event" : "Add Event"}
          </Button>
        </Box>
      </Modal>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
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
            Delete Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EventManagement;
