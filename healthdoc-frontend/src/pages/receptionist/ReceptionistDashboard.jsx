// src/pages/receptionist/ReceptionDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchAppointments, createAppointment } from "../../api/api";

const ReceptionDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ patient: "", doctor: "", date: "", time: "" });

  useEffect(() => {
    fetchAppointments().then((res) => setAppointments(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAppointment(form).then((res) => {
      setAppointments([...appointments, res.data]);
      setForm({ patient: "", doctor: "", date: "", time: "" });
    });
  };

  return (
    <div>
      <h2>Receptionist Dashboard</h2>

      <h3>Create Appointment</h3>
      <form onSubmit={handleSubmit}>
        <input name="patient" placeholder="Patient ID" value={form.patient} onChange={handleChange} required />
        <input name="doctor" placeholder="Doctor ID" value={form.doctor} onChange={handleChange} required />
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input type="time" name="time" value={form.time} onChange={handleChange} required />
        <button type="submit">Create</button>
      </form>

      <h3>All Appointments</h3>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            Patient: {appt.patient.username}, Doctor: {appt.doctor.username}, Date: {appt.date}, Time: {appt.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceptionDashboard;
