import React, { useEffect, useState } from "react";
import api from "../../api/api";

const MedicalStock = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await api.get("medicines/");
      setMedicines(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Medical Stock</h2>
      <ul>
        {medicines.map((med) => (
          <li key={med.id}>{med.name} - ₹{med.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default MedicalStock;
