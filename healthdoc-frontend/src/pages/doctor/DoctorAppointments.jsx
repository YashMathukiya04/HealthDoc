// src/pages/doctor/DoctorAppointments.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    api.get("appointments/").then(res => {
      // backend filters by role; if not, filter client-side by doctor id
      setAppointments(res.data);
    }).catch(console.error);
  }, []);
  return (
    <div style={{ padding: 20 }}>
      <h2>Doctor Appointments</h2>
      <ul>
        {appointments.map(a => (
          <li key={a.id}>{a.patient?.user?.username || a.patient?.user || a.patient} — {a.date} {a.time} ({a.status})</li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorAppointments;
