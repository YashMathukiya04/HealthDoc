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
      await api.post("auth/register/", form);
      setMsg("✅ Registered successfully. If receptionist/admin approval is required, wait for verification.");
    } catch (err) {
      console.error(err);
      setMsg("❌ Registration failed. See console for details.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Patient Self-Registration</h2>
        <form onSubmit={submit} style={styles.form}>
          <input
            style={styles.input}
            name="username"
            placeholder="Username"
            onChange={handle}
            required
          />
          <input
            style={styles.input}
            name="password"
            type="password"
            placeholder="Password"
            onChange={handle}
            required
          />
          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="Email (optional)"
            onChange={handle}
          />
          <input
            style={styles.input}
            name="phone"
            placeholder="Phone (optional)"
            onChange={handle}
          />
          <button type="submit" style={styles.button}>Register</button>
        </form>
        {msg && <p style={styles.message}>{msg}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "30px 40px",
    borderRadius: 10,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    maxWidth: 400,
    width: "100%",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: 15,
    padding: "10px 15px",
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  button: {
    padding: "10px 15px",
    borderRadius: 5,
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  message: {
    marginTop: 15,
    textAlign: "center",
    color: "#555",
  },
};

export default RegisterPatient;
