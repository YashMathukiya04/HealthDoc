// src/auth/RegisterPatient.jsx
import React, { useState } from "react";
import api from "../api/api";

const RegisterPatient = () => {
  const [form, setForm] = useState({ username: "", password: "", email: "", phone: "" });
  const [msg, setMsg] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      // If backend exposes specific registration endpoint:
      await api.post("auth/register/", form);
      setMsg("Registered. If receptionist/admin approval is required, wait for verification.");
    } catch (err) {
      console.error(err);
      setMsg("Registration failed. See console.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Self-register (Patient)</h3>
      <form onSubmit={submit}>
        <input name="username" placeholder="Username" onChange={handle} required />
        <input name="password" type="password" placeholder="Password" onChange={handle} required />
        <input name="email" placeholder="Email (optional)" onChange={handle} />
        <input name="phone" placeholder="Phone (optional)" onChange={handle} />
        <button type="submit">Register</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default RegisterPatient;
