// src/pages/pharmacist/MedicineStock.jsx
import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/medicines/";

const MedicineStock = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        // ✅ Fix: Use data.results because the API is paginated
        setMedicines(Array.isArray(data.results) ? data.results : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching medicines:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading medicines...</p>;

  return (
    <div>
      <h3>Medicine Stock</h3>
      {medicines.length === 0 ? (
        <p>No medicines available</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Manufacturer</th>
              <th>Stock</th>
              <th>Price (₹)</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.name}</td>
                <td>{m.description || "—"}</td>
                <td>{m.manufacturer || "—"}</td>
                <td>{m.stock}</td>
                <td>{m.price ? Number(m.price).toFixed(2) : "N/A"}</td>
                <td>{m.expiry_date || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MedicineStock;
