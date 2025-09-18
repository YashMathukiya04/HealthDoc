// src/pages/patient/BookAppointment.jsx
import React, { useEffect, useState } from "react";
import { fetchDoctors, createAppointment } from "../../api/api";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    fetchDoctors().then(r => setDoctors(r.data)).catch(console.error);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Login required");
    try {
      // payload: doctor_id and patient_id or patient (depends on backend serializer)
      await createAppointment({ doctor_id: doctorId, patient_id: user.id, date, time });
      alert("Booked");
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Book Appointment</h2>
      <form onSubmit={submit}>
        <select value={doctorId} onChange={(e)=>setDoctorId(e.target.value)} required>
          <option value="">Select doctor</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{d.user?.username || d.user || d.username} — {d.specialization || d.role}</option>)}
        </select>
        <div><input type="date" value={date} onChange={e=>setDate(e.target.value)} required /></div>
        <div><input type="time" value={time} onChange={e=>setTime(e.target.value)} required /></div>
        <button type="submit">Book</button>
      </form>
    </div>
  );
};

export default BookAppointment;
