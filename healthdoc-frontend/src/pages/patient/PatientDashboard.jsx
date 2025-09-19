// src/pages/patient/PatientDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api
      .get("appointments/")
      .then((res) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          const filtered = res.data.filter((a) => {
            if (a.patient && typeof a.patient === "object")
              return a.patient.user?.id === user.id || a.patient.id === user.id;
            return false;
          });
          setAppointments(filtered);
        }
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
      <h2 style={styles.heading}>🧑‍⚕️ Patient Dashboard</h2>
      <h3 style={styles.subheading}>Your Appointments</h3>

      {appointments.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>No.</th>
              <th style={styles.th}>Doctor</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, index) => (
              <tr key={a.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>
                  {a.doctor?.user?.username || a.doctor?.user || a.doctor}
                </td>
                <td style={styles.td}>{a.date}</td>
                <td style={styles.td}>{a.time}</td>
                <td style={{ ...styles.td, color: getStatusColor(a.status), fontWeight: "bold" }}>
                  {a.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.noData}>No appointments found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "28px",
    color: "#333",
    marginBottom: "10px",
  },
  subheading: {
    fontSize: "20px",
    color: "#555",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
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
    fontSize: "15px",
    color: "#333",
  },
  rowEven: {
    backgroundColor: "#f8f9fa",
  },
  rowOdd: {
    backgroundColor: "#ffffff",
  },
  noData: {
    fontStyle: "italic",
    color: "#888",
    marginTop: "20px",
  },
};

export default PatientDashboard;
