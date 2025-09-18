// src/pages/patient/PatientDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    api.get("appointments/").then(res => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const filtered = res.data.filter(a => {
          // try multiple possible shapes
          if (a.patient && typeof a.patient === "object") return a.patient.user?.id === user.id || a.patient.id === user.id;
          return false;
        });
        setAppointments(filtered);
      }
    }).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Patient Dashboard</h2>
      <h3>Your appointments</h3>
      <ul>
        {appointments.map(a => <li key={a.id}>Dr: {a.doctor?.user?.username || a.doctor?.user || a.doctor} - {a.date} {a.time} - {a.status}</li>)}
      </ul>
    </div>
  );
};

export default PatientDashboard;
