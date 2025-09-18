import React, { useEffect, useState } from "react";
import api from "../../api/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("users/"); // replace with your endpoint
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
