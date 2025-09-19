// src/pages/patient/BookAppointment.jsx
import React, { useEffect, useState } from "react";
import { fetchDoctors, createAppointment } from "../../api/api";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    fetchDoctors()
      .then((r) => setDoctors(r.data))
      .catch(console.error);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Login required");
    try {
      await createAppointment({
        doctor_id: doctorId,
        patient_id: user.id,
        date,
        time,
      });
      alert("Appointment booked successfully!");
      setDoctorId("");
      setDate("");
      setTime("");
    } catch (err) {
      console.error(err);
      alert("Failed to book appointment");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📅 Book an Appointment</h2>
      <form onSubmit={submit} style={styles.form}>
        <label style={styles.label}>Select Doctor:</label>
        <select
          style={styles.select}
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
        >
          <option value="">-- Choose Doctor --</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.user?.username || d.user || d.username} — {d.specialization || d.role}
            </option>
          ))}
        </select>

        <label style={styles.label}>Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
          required
        />

        <label style={styles.label}>Select Time:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>Book Appointment</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9fb",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "26px",
    color: "#333",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  label: {
    fontWeight: 600,
    color: "#444",
    fontSize: "15px",
  },
  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    marginTop: "10px",
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default BookAppointment;
