// src/pages/receptionist/ReceptionistDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchAppointments } from "../../api/api";

const ReceptionistDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    fetchAppointments().then(r => setAppointments(r.data)).catch(console.error);
  }, []);
  return (
    <div style={{ padding: 20 }}>
      <h2>Reception Dashboard</h2>
      <h3>Appointments</h3>
      <ul>
        {appointments.map(a => <li key={a.id}>Patient: {a.patient?.user?.username || a.patient} — Doctor: {a.doctor?.user?.username || a.doctor} — {a.date} {a.time} — {a.status}</li>)}
      </ul>
    </div>
  );
};

export default ReceptionistDashboard;
