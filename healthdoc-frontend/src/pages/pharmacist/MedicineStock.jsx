// src/pages/pharmacist/MedicalStock.jsx
import React, { useEffect, useState } from "react";
import { fetchMedicines } from "../../api/api";

const MedicalStock = () => {
  const [meds, setMeds] = useState([]);
  useEffect(() => {
    fetchMedicines().then(r => setMeds(r.data)).catch(console.error);
  }, []);
  return (
    <div>
      <h3>Stock</h3>
      <ul>{meds.map(m => <li key={m.id}>{m.name} — {m.stock} pcs — ₹{m.price}</li>)}</ul>
    </div>
  );
};

export default MedicalStock;
