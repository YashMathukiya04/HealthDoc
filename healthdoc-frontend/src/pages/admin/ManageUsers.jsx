// src/pages/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("PATIENT");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const load = async () => {
    try {
      const res = await api.get("users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("users/", { username, password, role });
      setUsername("");
      setPassword("");
      setRole("PATIENT");
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👤 Manage Users</h2>

      <form onSubmit={createUser} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          style={styles.select}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="ADMIN">Admin</option>
          <option value="DOCTOR">Doctor</option>
          <option value="RECEPTIONIST">Receptionist</option>
          <option value="PHARMACIST">Pharmacist</option>
          <option value="LAB_TECHNICIAN">Lab Technician</option>
          <option value="PATIENT">Patient</option>
        </select>
        <button type="submit" style={styles.button}>Create</button>
      </form>

      <h3 style={styles.subheading}>📋 All Users</h3>
      {users.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{u.username}</td>
                <td style={styles.td}>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.loading}>Loading users...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "900px",
    margin: "0 auto",
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
    margin: "30px 0 16px",
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    alignItems: "center",
  },
  input: {
    flex: "1 1 200px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  select: {
    flex: "1 1 200px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.3s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    borderRadius: "6px",
    overflow: "hidden",
  },
  th: {
    padding: "12px",
    textAlign: "left",
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
    color: "#777",
    fontStyle: "italic",
  },
};

export default ManageUsers;
