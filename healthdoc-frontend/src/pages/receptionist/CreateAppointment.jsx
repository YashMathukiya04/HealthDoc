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
      await api.post("appointments/", { patient_id: form.patient_id, doctor_id: form.doctor_id, date: form.date, time: form.time });
      alert("Created");
      setForm({ patient_id: "", doctor_id: "", date: "", time: "" });
    } catch (err) { console.error(err); alert("Failed"); }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Appointment</h2>
      <form onSubmit={submit}>
        <select required value={form.patient_id} onChange={e=>setForm({...form, patient_id: e.target.value})}>
          <option value="">Select patient</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.user?.username || p.user || p.username}</option>)}
        </select>
        <select required value={form.doctor_id} onChange={e=>setForm({...form, doctor_id: e.target.value})}>
          <option value="">Select doctor</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{d.user?.username || d.user || d.username}</option>)}
        </select>
        <div><input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} required /></div>
        <div><input type="time" value={form.time} onChange={e=>setForm({...form, time: e.target.value})} required /></div>
        <button>Create</button>
      </form>
    </div>
  );
};

export default CreateAppointment;
