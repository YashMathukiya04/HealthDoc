// src/pages/pharmacist/MedicalStock.jsx
import React, { useEffect, useState } from "react";
import { fetchMedicines } from "../../api/api";

const MedicalStock = () => {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    fetchMedicines()
      .then((r) => setMeds(r.data))
      .catch(console.error);
  }, []);

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>💊 Medical Stock</h3>

      {meds.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Medicine Name</th>
              <th style={styles.th}>Stock (pcs)</th>
              <th style={styles.th}>Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {meds.map((m) => (
              <tr key={m.id} style={m.stock === 0 ? styles.outOfStockRow : styles.row}>
                <td style={styles.td}>{m.name}</td>
                <td style={styles.td}>{m.stock}</td>
                <td style={styles.td}>₹{m.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.noData}>No medicines found in stock.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: 30,
    maxWidth: 800,
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f7f9fc",
    minHeight: "100vh",
  },
  heading: {
    fontSize: 26,
    color: "#2c3e50",
    marginBottom: 24,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    backgroundColor: "#3498db",
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #e1e8f0",
    fontSize: 15,
    color: "#34495e",
  },
  row: {
    backgroundColor: "#fff",
  },
  outOfStockRow: {
    backgroundColor: "#ffe6e6", // light red for out of stock
  },
  noData: {
    fontStyle: "italic",
    color: "#95a5a6",
    marginTop: 20,
    textAlign: "center",
  },
};

export default MedicalStock;
