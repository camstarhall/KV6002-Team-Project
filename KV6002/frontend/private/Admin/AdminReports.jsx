import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, Card, CardContent } from "@mui/material";

const AdminReports = () => {
  const [totalBookings, setTotalBookings] = useState(null); // Placeholder state for data
  const [cancelledBookings, setCancelledBookings] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch report data from the back-end
  const fetchReportData = async () => {
    try {
      // Placeholder for actual API call
      const response = await fetch("/api/reports"); // Replace with real API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }
      const data = await response.json();
      setTotalBookings(data.totalBookings);
      setCancelledBookings(data.cancelledBookings);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchReportData(); // Fetch data on component mount
  }, []);

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#D08C8C", minHeight: "80vh" }}>
      <Typography variant="h4" sx={{ color: "#7B3F3F", textAlign: "center", mb: 2 }}>
        Booking Report
      </Typography>

      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={5}>
            <Card sx={{ backgroundColor: "#7B3F3F", color: "white", borderRadius: "8px", boxShadow: 3 }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h5">Total Bookings</Typography>
                <Typography variant="h3" sx={{ fontWeight: "bold", my: 1 }}>{totalBookings || "Loading..."}</Typography>
                <Typography variant="body1">All confirmed reservations.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Card sx={{ backgroundColor: "#6a3232", color: "white", borderRadius: "8px", boxShadow: 3 }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h5">Cancelled Bookings</Typography>
                <Typography variant="h3" sx={{ fontWeight: "bold", my: 1 }}>{cancelledBookings || "Loading..."}</Typography>
                <Typography variant="body1">Total number of cancellations.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button variant="contained" sx={{ backgroundColor: "#7B3F3F", color: "white" }} onClick={fetchReportData}>
          Refresh Data
        </Button>
      </Box>
    </Box>
  );
};

export default AdminReports;
