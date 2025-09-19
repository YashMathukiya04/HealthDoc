// src/pages/receptionist/CreateAppointment.jsx
import React, { useState, useEffect } from "react";
import api from "../../api/api";

const CreateAppointment = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ patient_id: "", doctor_id: "", date: "", time: "" });

  useEffect(() => {
    api.get("patients/").then(r => setPatients(r.data)).catch(console.error);
    api.get("doctors/").then(r => setDoctors(r.data)).catch(console.error);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("appointments/", form);
      alert("Created");
      setForm({ patient_id: "", doctor_id: "", date: "", time: "" });
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  // Styles
  const styles = {
    container: {
      padding: 30,
      maxWidth: 500,
      margin: "0 auto",
      border: "1px solid #ccc",
      borderRadius: 8,
      backgroundColor: "#f9f9f9",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
    },
    heading: {
      textAlign: "center",
      marginBottom: 20,
      color: "#333",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: 15,
    },
    select: {
      padding: 10,
      fontSize: 16,
      borderRadius: 4,
      border: "1px solid #ccc",
    },
    input: {
      padding: 10,
      fontSize: 16,
      borderRadius: 4,
      border: "1px solid #ccc",
    },
    button: {
      padding: "12px 20px",
      fontSize: 16,
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: 4,
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Appointment</h2>
      <form style={styles.form} onSubmit={submit}>
        <select
          required
          value={form.patient_id}
          onChange={e => setForm({ ...form, patient_id: e.target.value })}
          style={styles.select}
        >
          <option value="">Select patient</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>
              {p.user?.username || p.user || p.username}
            </option>
          ))}
        </select>

        <select
          required
          value={form.doctor_id}
          onChange={e => setForm({ ...form, doctor_id: e.target.value })}
          style={styles.select}
        >
          <option value="">Select doctor</option>
          {doctors.map(d => (
            <option key={d.id} value={d.id}>
              {d.user?.username || d.user || d.username}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          required
          style={styles.input}
        />

        <input
          type="time"
          value={form.time}
          onChange={e => setForm({ ...form, time: e.target.value })}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Create Appointment
        </button>
      </form>
    </div>
  );
};

export default CreateAppointment;
