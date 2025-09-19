// src/pages/pathologist/PathologistDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";

const PathologistDashboard = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api
      .get("lab-requests/")
      .then((r) => setRequests(r.data))
      .catch(console.error);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#ffc107"; // Yellow
      case "COMPLETED":
        return "#28a745"; // Green
      case "CANCELLED":
        return "#dc3545"; // Red
      default:
        return "#6c757d"; // Gray
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧬 Lab Dashboard</h2>
      <h3 style={styles.subheading}>Requested Tests</h3>

      {requests.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Test Name</th>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r, index) => (
              <tr key={r.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{r.test_name}</td>
                <td style={styles.td}>{r.patient?.user?.username || r.patient}</td>
                <td
                  style={{
                    ...styles.td,
                    color: getStatusColor(r.status),
                    fontWeight: "bold",
                  }}
                >
                  {r.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.loading}>No lab requests found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
    backgroundColor: "#f9fafc",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    fontSize: "28px",
    color: "#333",
    marginBottom: "10px",
  },
  subheading: {
    fontSize: "20px",
    color: "#555",
    margin: "20px 0 10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  },
  th: {
    padding: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    textAlign: "left",
    borderBottom: "2px solid #0056b3",
    fontWeight: "bold",
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
  loading: {
    fontStyle: "italic",
    color: "#777",
    marginTop: "20px",
  },
};

export default PathologistDashboard;
