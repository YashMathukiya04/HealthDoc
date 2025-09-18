// src/pages/pathologist/PathologistDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";

const PathologistDashboard = () => {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    api.get("lab-requests/").then(r => setRequests(r.data)).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Lab Dashboard</h2>
      <h3>Requested Tests</h3>
      <ul>{requests.map(r => <li key={r.id}>{r.test_name} — Patient: {r.patient?.user?.username || r.patient} — Status: {r.status}</li>)}</ul>
    </div>
  );
};

export default PathologistDashboard;
