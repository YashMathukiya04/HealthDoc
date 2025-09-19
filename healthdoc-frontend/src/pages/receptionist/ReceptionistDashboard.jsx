// src/pages/receptionist/ReceptionistDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchAppointments } from "../../api/api";

const ReceptionistDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    fetchAppointments().then(r => setAppointments(r.data)).catch(console.error);
  }, []);

  // Styles
  const styles = {
    container: {
      padding: 30,
      maxWidth: 800,
      margin: "0 auto",
      border: "1px solid #ccc",
      borderRadius: 8,
      backgroundColor: "#f9f9f9",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
    },
    heading: {
      textAlign: "center",
      marginBottom: 20,
      color: "#333",
    },
    subheading: {
      color: "#555",
      marginBottom: 15,
    },
    list: {
      listStyleType: "none",
      paddingLeft: 0,
    },
    listItem: {
      padding: 10,
      marginBottom: 10,
      backgroundColor: "#fff",
      borderRadius: 4,
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      fontSize: 16,
    },
    listItemTitle: {
      fontWeight: "bold",
      color: "#007bff",
    },
    status: (status) => ({
      color: status === "Confirmed" ? "green" : status === "Pending" ? "orange" : "red",
      fontWeight: "bold",
    }),
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Reception Dashboard</h2>
      <h3 style={styles.subheading}>Appointments</h3>
      <ul style={styles.list}>
        {appointments.map(a => (
          <li key={a.id} style={styles.listItem}>
            <span style={styles.listItemTitle}>Patient: </span>
            {a.patient?.user?.username || a.patient} — 
            <span style={styles.listItemTitle}> Doctor: </span>
            {a.doctor?.user?.username || a.doctor} — 
            <span style={styles.listItemTitle}>Date & Time: </span>
            {a.date} {a.time} — 
            <span style={styles.status(a.status)}>{a.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceptionistDashboard;
