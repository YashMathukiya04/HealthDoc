// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import api, { setAuthToken } from "./api/api";

// Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import MedicalStock from "./pages/admin/MedicalStock.jsx";

import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
import DoctorAppointments from "./pages/doctor/DoctorAppointments.jsx";

import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard.jsx";
import CreateAppointment from "./pages/receptionist/CreateAppointment.jsx";
import RegisterPatient from "./pages/receptionist/RegisterPatient.jsx";

import PatientDashboard from "./pages/patient/PatientDashboard.jsx";
import BookAppointments from "./pages/patient/BookAppointments.jsx";

// Role-Based Route Wrapper
const PrivateRoute = ({ children, allowedRoles, userRole }) => {
  if (!userRole) return <Navigate to="/login" />; // not logged in
  if (!allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" />; // no access
  return children;
};

const App = () => {
  const [user, setUser] = useState(null); // store user info (role, username)

  useEffect(() => {
    // Example: fetch current logged-in user
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      api.get("current-user/")
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* ----- Admin Routes ----- */}
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute allowedRoles={["ADMIN"]} userRole={user?.role}>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/manage-users" 
          element={
            <PrivateRoute allowedRoles={["ADMIN"]} userRole={user?.role}>
              <ManageUsers />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/medical-stock" 
          element={
            <PrivateRoute allowedRoles={["ADMIN"]} userRole={user?.role}>
              <MedicalStock />
            </PrivateRoute>
          } 
        />

        {/* ----- Doctor Routes ----- */}
        <Route 
          path="/doctor/dashboard" 
          element={
            <PrivateRoute allowedRoles={["DOCTOR"]} userRole={user?.role}>
              <DoctorDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/doctor/appointments" 
          element={
            <PrivateRoute allowedRoles={["DOCTOR"]} userRole={user?.role}>
              <DoctorAppointments />
            </PrivateRoute>
          } 
        />

        {/* ----- Receptionist Routes ----- */}
        <Route 
          path="/receptionist/dashboard" 
          element={
            <PrivateRoute allowedRoles={["RECEPTIONIST"]} userRole={user?.role}>
              <ReceptionistDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/receptionist/create-appointment" 
          element={
            <PrivateRoute allowedRoles={["RECEPTIONIST"]} userRole={user?.role}>
              <CreateAppointment />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/receptionist/register-patient" 
          element={
            <PrivateRoute allowedRoles={["RECEPTIONIST"]} userRole={user?.role}>
              <RegisterPatient />
            </PrivateRoute>
          } 
        />

        {/* ----- Patient Routes ----- */}
        <Route 
          path="/patient/dashboard" 
          element={
            <PrivateRoute allowedRoles={["PATIENT"]} userRole={user?.role}>
              <PatientDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/patient/book-appointment" 
          element={
            <PrivateRoute allowedRoles={["PATIENT"]} userRole={user?.role}>
              <BookAppointments />
            </PrivateRoute>
          } 
        />

        {/* ----- Public / Fallback Routes ----- */}
        <Route path="/" element={<Navigate to={user ? `/${user.role.toLowerCase()}/dashboard` : "/login"} />} />
        <Route path="/login" element={<div>Login Page (to implement)</div>} />
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
