import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Home from "./public_components/Home";
import Login from "./public_components/Authentication/Login";
import Register from "./public_components/Register";
import EventList from "./public_components/Events/EventList";
import EventDetails from "./public_components/Events/EventDetails";
import AdminDashboard from "./private/Admin/AdminDashboard";
import LeaderDashboard from "./private/LocalLeader/LeaderDashboard";
import CharityStaffDashboard from "./private/CharityStaff/CharityStaffDashboard"; // Import Staff Dashboard
import UserDashboard from "./private/Admin/UserDashboard";
import ResetPassword from "./public_components/Authentication/ResetPassword";
import Feedback from "./public_components/Feedback";
import About from "./public_components/About";
import Help from "./public_components/Help"; // Import Help component

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
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} /> {/* Added Route for Help */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
