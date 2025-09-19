// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../api/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((r) => setUsers(r.data))
      .catch(console.error);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👩‍💼 Admin Dashboard</h2>

      <div style={styles.section}>
        <h3 style={styles.subheading}>📋 All Users</h3>

        {users.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>No.</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{u.username}</td>
                  <td style={styles.td}>{u.email || "—"}</td>
                  <td style={styles.td}>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.loading}>Loading users...</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    fontSize: "28px",
    color: "#333",
    marginBottom: "20px",
  },
  subheading: {
    fontSize: "22px",
    color: "#444",
    marginBottom: "16px",
  },
  section: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontWeight: "bold",
    borderBottom: "2px solid #0056b3",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    color: "#333",
  },
  rowEven: {
    backgroundColor: "#f9f9f9",
  },
  rowOdd: {
    backgroundColor: "#ffffff",
  },
  loading: {
    fontStyle: "italic",
    color: "#777",
  },
};

export default AdminDashboard;
