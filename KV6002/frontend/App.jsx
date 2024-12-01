import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Home from "./public/Home";
import Login from "./public/Authentication/Login";
import Register from "./public/Register";
import EventList from "./public/Events/EventList";
import EventDetails from "./public/Events/EventDetails";
import AdminDashboard from "./private/Admin/AdminDashboard";
import LeaderDashboard from "./private/LocalLeader/LeaderDashboard";
import CharityStaffDashboard from "./private/CharityStaff/CharityStaffDashboard"; // Import Staff Dashboard
import UserDashboard from "./private/Admin/UserDashboard";
import ResetPassword from "./public/Authentication/ResetPassword";
import Feedback from "./public/Feedback";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/leader-dashboard" element={<LeaderDashboard />} />
        <Route path="/staff-dashboard" element={<CharityStaffDashboard />} /> {/* New Route */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
