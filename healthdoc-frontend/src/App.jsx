// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./auth/Login";
import RegisterPatient from "./auth/RegisterPatient";
import { setAuthToken, fetchCurrentUser } from "./api/api";

// Pages (admin)
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
// doctor
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
// receptionist
import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard";
import CreateAppointment from "./pages/receptionist/CreateAppointment";
import RegisterPatientPage from "./pages/receptionist/CreateAppointment"; // optional
// patient
import PatientDashboard from "./pages/patient/PatientDashboard";
import BookAppointment from "./pages/patient/BookAppointment";
// pharmacist
import PharmacistDashboard from "./pages/pharmacist/PharmacistDashboard";
// pathologist
import PathologistDashboard from "./pages/pathologist/PathologistDashboard";

const App = () => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      setAuthToken(token);
      // try refresh current user in case localStorage has stale user
      fetchCurrentUser().then(res => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }).catch(() => {
        setUser(null);
        localStorage.removeItem("user");
      });
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} onLogout={setUser} />
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<RegisterPatient />} />
        <Route path="/unauthorized" element={<div>Unauthorized</div>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute user={user} allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/manage-users" element={<ProtectedRoute user={user} allowedRoles={["ADMIN"]}><ManageUsers /></ProtectedRoute>} />

        {/* Doctor */}
        <Route path="/doctor/dashboard" element={<ProtectedRoute user={user} allowedRoles={["DOCTOR"]}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute user={user} allowedRoles={["DOCTOR"]}><DoctorAppointments /></ProtectedRoute>} />

        {/* Receptionist */}
        <Route path="/receptionist/dashboard" element={<ProtectedRoute user={user} allowedRoles={["RECEPTIONIST"]}><ReceptionistDashboard /></ProtectedRoute>} />
        <Route path="/receptionist/create-appointment" element={<ProtectedRoute user={user} allowedRoles={["RECEPTIONIST"]}><CreateAppointment /></ProtectedRoute>} />
        <Route path="/receptionist/register-patient" element={<ProtectedRoute user={user} allowedRoles={["RECEPTIONIST"]}><RegisterPatientPage /></ProtectedRoute>} />

        {/* Patient */}
        <Route path="/patient/dashboard" element={<ProtectedRoute user={user} allowedRoles={["PATIENT"]}><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient/book-appointment" element={<ProtectedRoute user={user} allowedRoles={["PATIENT"]}><BookAppointment /></ProtectedRoute>} />

        {/* Pharmacist */}
        <Route path="/pharmacist/dashboard" element={<ProtectedRoute user={user} allowedRoles={["PHARMACIST"]}><PharmacistDashboard /></ProtectedRoute>} />

        {/* Pathologist */}
        <Route path="/pathologist/dashboard" element={<ProtectedRoute user={user} allowedRoles={["PATHOLOGIST"]}><PathologistDashboard /></ProtectedRoute>} />

        {/* default */}
        <Route path="/" element={user ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} /> : <Navigate to="/login" />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
