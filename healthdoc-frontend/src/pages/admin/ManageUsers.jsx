// src/pages/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("PATIENT");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const load = async () => {
    const res = await api.get("users/");
    setUsers(res.data);
  };

  useEffect(() => { load(); }, []);

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("users/", { username, password, role });
      setUsername(""); setPassword("");
      load();
    } catch (err) { console.error(err); alert("Failed create"); }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Manage Users</h2>
      <form onSubmit={createUser}>
        <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} required />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="ADMIN">Admin</option>
          <option value="DOCTOR">Doctor</option>
          <option value="RECEPTIONIST">Receptionist</option>
          <option value="PHARMACIST">Pharmacist</option>
          <option value="LAB_TECHNICIAN">Lab Technician</option>
          <option value="PATIENT">Patient</option>
        </select>
        <button type="submit">Create</button>
      </form>

      <h3>Users</h3>
      <ul>
        {users.map(u => <li key={u.id}>{u.username} — {u.role}</li>)}
      </ul>
    </div>
  );
};

export default ManageUsers;
