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
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <Link to="/" style={styles.logo}>HealthDoc</Link>
        {user && (
          <div style={styles.links}>
            {user.role === "ADMIN" && (
              <>
                <Link to="/admin/dashboard" style={styles.link}>Admin</Link>
                <Link to="/admin/manage-users" style={styles.link}>Manage Users</Link>
              </>
            )}
            {user.role === "DOCTOR" && (
              <>
                <Link to="/doctor/dashboard" style={styles.link}>Doctor</Link>
                <Link to="/doctor/appointments" style={styles.link}>Appointments</Link>
              </>
            )}
            {user.role === "RECEPTIONIST" && (
              <>
                <Link to="/receptionist/dashboard" style={styles.link}>Reception</Link>
                <Link to="/receptionist/create-appointment" style={styles.link}>Create Appointment</Link>
                <Link to="/receptionist/register-patient" style={styles.link}>Register Patient</Link>
              </>
            )}
            {user.role === "PATIENT" && (
              <>
                <Link to="/patient/dashboard" style={styles.link}>My Dashboard</Link>
                <Link to="/patient/book-appointment" style={styles.link}>Book</Link>
              </>
            )}
            {user.role === "PHARMACIST" && (
              <Link to="/pharmacist/dashboard" style={styles.link}>Pharmacy</Link>
            )}
            {user.role === "LAB_TECHNICIAN" && (
              <Link to="/pathologist/dashboard" style={styles.link}>Lab</Link>
            )}
          </div>
        )}
      </div>

      <div style={styles.right}>
        {user ? (
          <button onClick={doLogout} style={styles.logoutBtn}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={{ ...styles.authButton, ...styles.login }}>Login</Link>
            <Link to="/register" style={{ ...styles.authButton, ...styles.register }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 28px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  logo: {
    fontWeight: 800,
    fontSize: "26px",
    color: "#007BFF",
    textDecoration: "none",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: "color 0.3s",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  link: {
    color: "#333",
    textDecoration: "none",
    fontSize: "16px",
    padding: "4px 8px",
    transition: "color 0.2s",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoutBtn: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "background-color 0.3s",
  },
  authButton: {
    padding: "8px 14px",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 500,
    transition: "all 0.3s ease",
    display: "inline-block",
  },
  login: {
    backgroundColor: "#007BFF",
    color: "#fff",
  },
  register: {
    backgroundColor: "#28a745",
    color: "#fff",
  },
};

export default Navbar;
