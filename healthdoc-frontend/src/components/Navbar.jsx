// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const nav = useNavigate();

  const doLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    onLogout(null);
    nav("/login");
  };

  return (
    <nav style={{ padding: 12, background: "#f5f5f5", display: "flex", gap: 12, alignItems: "center" }}>
      <strong><Link to="/">HealthDoc</Link></strong>
      {user ? (
        <>
          {user.role === "ADMIN" && <>
            <Link to="/admin/dashboard">Admin</Link>
            <Link to="/admin/manage-users">Manage Users</Link>
          </>}
          {user.role === "DOCTOR" && <>
            <Link to="/doctor/dashboard">Doctor</Link>
            <Link to="/doctor/appointments">Appointments</Link>
          </>}
          {user.role === "RECEPTIONIST" && <>
            <Link to="/receptionist/dashboard">Reception</Link>
            <Link to="/receptionist/create-appointment">Create Appointment</Link>
            <Link to="/receptionist/register-patient">Register Patient</Link>
          </>}
          {user.role === "PATIENT" && <>
            <Link to="/patient/dashboard">My Dashboard</Link>
            <Link to="/patient/book-appointment">Book</Link>
          </>}
          {user.role === "PHARMACIST" && <>
            <Link to="/pharmacist/dashboard">Pharmacy</Link>
          </>}
          {user.role === "LAB_TECHNICIAN" && <>
            <Link to="/pathologist/dashboard">Lab</Link>
          </>}
          <button onClick={doLogout} style={{ marginLeft: "auto" }}>Logout</button>
        </>
      ) : (
        <div style={{ marginLeft: "auto" }}>
          <Link to="/login">Login</Link>{" "}
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
