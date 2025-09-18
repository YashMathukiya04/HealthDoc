// src/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, fetchCurrentUser, setAuthToken } from "../api/api";

const Login = ({ onLogin }) => {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await login(username, password);
      const { access, refresh } = res.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      setAuthToken(access);

      const userRes = await fetchCurrentUser();
      localStorage.setItem("user", JSON.stringify(userRes.data));
      onLogin(userRes.data);
      nav(`/${userRes.data.role.toLowerCase()}/dashboard`);
    } catch (error) {
      console.error(error);
      setErr("Invalid credentials or server error.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {err && <div style={styles.error}>{err}</div>}
        <form onSubmit={submit} style={styles.form}>
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
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(to right, #4facfe, #00f2fe)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#333",
  },
  error: {
    marginBottom: "15px",
    color: "#e74c3c",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 15px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    padding: "12px 15px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4facfe",
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

// Optional: hover effect
styles.input[":focus"] = { borderColor: "#4facfe" };
styles.button[":hover"] = { backgroundColor: "#00f2fe" };

export default Login;
