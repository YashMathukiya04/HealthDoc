// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../api/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers().then(r => setUsers(r.data)).catch(console.error);
  }, []);
  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>
      <h3>All Users</h3>
      <ul>
        {users.map(u => <li key={u.id}>{u.username} — {u.role}</li>)}
      </ul>
    </div>
  );
};

export default AdminDashboard;
