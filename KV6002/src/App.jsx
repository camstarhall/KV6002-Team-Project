import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import AdminDashboard from "./components/AdminDashboard";
import LeaderDashboard from "./components/LeaderDashboard";
import UserDashboard from "./components/UserDashboard";
import ResetPassword from "./components/ResetPassword";
import Feedback from "./components/Feedback";
import LogoutButton from "./components/LogoutButton";
import ProtectedRoute from "./components/ProtectedRoute";
import RSVPReport from "./components/RSVPReport";

function App() {
  return (
    <Router>
      <Header>
        <LogoutButton />
      </Header>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/events"
          element={<EventList />}
        />
        <Route
          path="/event/:id"
          element={<EventDetails />}
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard/reports"
          element={<RSVPReport />}
        />
        <Route
          path="/leader-dashboard"
          element={
            <ProtectedRoute role="localLeader">
              <LeaderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="normalUser">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
        <Route
          path="/feedback"
          element={<Feedback />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
