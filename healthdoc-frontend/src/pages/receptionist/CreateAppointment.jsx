import React, { useState } from "react";
import api from "../../api/api";

const CreateAppointment = () => {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("appointments/", { patient: patientId, doctor: doctorId, date, time });
      alert("Appointment created!");
    } catch (error) {
      console.error(error);
      alert("Error creating appointment");
    }
  };

  return (
    <div>
      <h2>Create Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        <input placeholder="Doctor ID" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateAppointment;
