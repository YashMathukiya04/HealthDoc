// src/pages/doctor/DoctorDashboard.jsx
import React from "react";

const DoctorDashboard = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👨‍⚕️ Doctor Dashboard</h2>
      <p style={styles.subtext}>Quick overview of your recent activity.</p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📅 Appointments</h3>
          <p style={styles.cardDesc}>View and manage all your upcoming appointments.</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>💊 Prescriptions</h3>
          <p style={styles.cardDesc}>Review and issue prescriptions for your patients.</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🧪 Lab Requests</h3>
          <p style={styles.cardDesc}>Track diagnostic test requests and results.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9fb",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "28px",
    color: "#333",
    marginBottom: "10px",
  },
  subtext: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  card: {
    flex: "1 1 300px",
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease",
    cursor: "pointer",
  },
  cardTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#007BFF",
  },
  cardDesc: {
    fontSize: "15px",
    color: "#444",
  },
};

export default DoctorDashboard;
