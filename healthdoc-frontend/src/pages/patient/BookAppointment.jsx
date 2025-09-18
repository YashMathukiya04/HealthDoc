import React, { useEffect, useState } from "react";
import api from "../../api/api";

const BookAppointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("doctors/");
      setDoctors(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBook = async () => {
    try {
      await api.post("appointments/", { doctor: selectedDoctor, date, time });
      alert("Appointment booked!");
    } catch (error) {
      console.error(error);
      alert("Error booking appointment");
    }
  };

  return (
    <div>
      <h2>Book Appointment</h2>
      <select onChange={(e) => setSelectedDoctor(e.target.value)} value={selectedDoctor}>
        <option value="">Select Doctor</option>
        {doctors.map((doc) => <option key={doc.id} value={doc.id}>{doc.username}</option>)}
      </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <button onClick={handleBook}>Book</button>
    </div>
  );
};

export default BookAppointments;
