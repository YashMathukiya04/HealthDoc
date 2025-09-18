// src/pages/pharmacist/PharmacistDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchAppointments, fetchUsers } from "../../api/api";

const PharmacistDashboard = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetchUsers().then((res) => {
      // Example: you can fetch medicines if your API supports
      setMedicines(res.data.filter((item) => item.role === "medicine"));
    });
  }, []);

  return (
    <div>
      <h2>Pharmacist Dashboard</h2>
      <h3>Medicine Stock</h3>
      <ul>
        {medicines.map((med) => (
          <li key={med.id}>{med.name} - Price: {med.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default PharmacistDashboard;
