import React, { useEffect, useState } from "react";
import api from "../../api/api";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("doctor/appointments/"); // your endpoint
      setAppointments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Doctor Appointments</h2>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            {appt.patient.username} - {appt.date} {appt.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorAppointments;
