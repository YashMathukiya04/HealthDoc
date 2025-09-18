// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../api/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then((res) => setUsers(res.data));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>All Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - Role: {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
