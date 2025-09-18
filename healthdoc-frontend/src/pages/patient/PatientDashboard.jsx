// src/pages/patient/PatientDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchAppointments } from "../../api/api";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments().then((res) => {
      // filter only current patient's appointments
      const userId = JSON.parse(localStorage.getItem("user")).id;
      setAppointments(res.data.filter((appt) => appt.patient.id === userId));
    });
  }, []);

  return (
    <div>
      <h2>Patient Dashboard</h2>
      <h3>Your Appointments</h3>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            Doctor: {appt.doctor.username}, Date: {appt.date}, Time: {appt.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientDashboard;
