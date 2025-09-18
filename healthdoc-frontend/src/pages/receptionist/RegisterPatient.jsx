import React, { useState } from "react";
import api from "../../api/api";

const RegisterPatient = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("users/", { username, password, role: "PATIENT" });
      alert("Patient registered!");
    } catch (error) {
      console.error(error);
      alert("Error registering patient");
    }
  };

  return (
    <div>
      <h2>Register Patient</h2>
      <form onSubmit={handleRegister}>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPatient;
