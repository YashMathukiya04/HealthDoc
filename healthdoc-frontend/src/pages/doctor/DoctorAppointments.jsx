// src/pages/doctor/DoctorAppointments.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api
      .get("appointments/")
      .then((res) => {
        setAppointments(res.data);
      })
      .catch(console.error);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "#28a745"; // green
      case "PENDING":
        return "#ffc107"; // yellow
      case "CANCELLED":
        return "#dc3545"; // red
      default:
        return "#6c757d"; // gray
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🗓️ Doctor Appointments</h2>

      {appointments.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, index) => (
              <tr key={a.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>
                  {a.patient?.user?.username || a.patient?.user || a.patient}
                </td>
                <td style={styles.td}>{a.date}</td>
                <td style={styles.td}>{a.time}</td>
                <td style={{ ...styles.td, color: getStatusColor(a.status), fontWeight: 600 }}>
                  {a.status}
                </td>
                <td style={{ ...styles.td, color: getStatusColor(a.status), fontWeight: 600 }}>
                  <button>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.loading}>No appointments found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
    backgroundColor: "#f9f9fb",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "26px",
    color: "#333",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  th: {
    padding: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: "2px solid #0056b3",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    color: "#333",
    fontSize: "15px",
  },
  rowEven: {
    backgroundColor: "#f8f9fa",
  },
  rowOdd: {
    backgroundColor: "#ffffff",
  },
  loading: {
    fontStyle: "italic",
    color: "#777",
    marginTop: "20px",
  },
};

export default DoctorAppointments;
