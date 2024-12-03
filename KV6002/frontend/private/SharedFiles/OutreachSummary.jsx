import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const OutreachSummary = () => {
  const [outreachLogs, setOutreachLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOutreachLogs();
  }, []);

  const fetchOutreachLogs = async () => {
    try {
      setLoading(true);

      const outreachCollection = collection(db, "OutreachLogs");
      const outreachSnapshot = await getDocs(outreachCollection);

      const outreachData = outreachSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const enrichedOutreachLogs = await Promise.all(
        outreachData.map(async (log) => {
          let eventTitle = "Unknown Event";
          let leaderName = "Unknown Leader";
          let leaderEmail = "N/A";

          try {
            const eventDoc = await getDoc(doc(db, "Events", log.eventId));
            if (eventDoc.exists()) {
              const eventData = eventDoc.data();
              eventTitle = eventData.Title || "Unknown Event";
            }
          } catch (eventError) {
            console.error("Error fetching event data for log:", log.id, eventError);
          }

          try {
            const leaderDoc = await getDoc(doc(db, "Users", log.leaderId));
            if (leaderDoc.exists()) {
              const leaderData = leaderDoc.data();
              leaderName = leaderData.fullName || "Unknown Leader";
              leaderEmail = leaderData.email || "N/A";
            }
          } catch (leaderError) {
            console.error("Error fetching leader data for log:", log.id, leaderError);
          }

          return {
            ...log,
            eventTitle,
            leaderName,
            leaderEmail,
          };
        })
      );

      setOutreachLogs(enrichedOutreachLogs);
    } catch (error) {
      console.error("Error fetching outreach logs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="body1">Loading Outreach Summary...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f8e8e8", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{
          color: "#7B3F3F",
          mb: 3,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Outreach Summary
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Event Title</strong></TableCell>
              <TableCell><strong>People Reached</strong></TableCell>
              <TableCell><strong>Method</strong></TableCell>
              <TableCell><strong>Details</strong></TableCell>
              <TableCell><strong>Outreach Date</strong></TableCell>
              <TableCell><strong>Leader Name</strong></TableCell>
              <TableCell><strong>Leader Email</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {outreachLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.eventTitle}</TableCell>
                <TableCell>{log.peopleReached}</TableCell>
                <TableCell>{log.method}</TableCell>
                <TableCell>{log.details || "N/A"}</TableCell>
                <TableCell>{log.outreachDate}</TableCell>
                <TableCell>{log.leaderName}</TableCell>
                <TableCell>{log.leaderEmail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OutreachSummary;
