// src/pages/patient/PatientDashboard.jsx

import React, { useEffect, useState } from "react";
import api from "../../api/api";

const safeDate = (dateStr) => {
  if (!dateStr) return "-";
  const parsed = new Date(dateStr);
  return isNaN(parsed) ? dateStr : parsed.toLocaleString();
};

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);

  useEffect(() => {
    api.get("patient/appointments/")
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Error fetching appointments:", err));

    api.get("patient/prescriptions/")
      .then((res) => setPrescriptions(res.data))
      .catch((err) => console.error("Error fetching prescriptions:", err));

    api.get("patient/lab-reports/")
      .then((res) => setLabReports(res.data))
      .catch((err) => console.error("Error fetching lab reports:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>

      {/* ----------------- Appointments ----------------- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Appointments</h2>
        {appointments.length > 0 ? (
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Doctor Name</th>
                <th className="border p-2">Specialization</th>
                <th className="border p-2">Appointment Date</th>
                <th className="border p-2">Reason</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td className="border p-2">
                    {a.doctor?.user?.username || "-"}
                  </td>
                  <td className="border p-2">
                    {a.doctor?.specialization || "-"}
                  </td>
                  <td className="border p-2">
                    {safeDate(`${a.date}T${a.time}`)}
                  </td>
                  <td className="border p-2">{a.reason || "-"}</td>
                  <td className="border p-2">{a.status || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No appointments found.</p>
        )}
      </section>

      {/* ----------------- Prescriptions ----------------- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Prescriptions</h2>
        {prescriptions.length > 0 ? (
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Doctor</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Notes</th>
                <th className="border p-2">Medicines</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p) => (
                <tr key={p.id}>
                  <td className="border p-2">
                    {p.doctor?.user?.username || "-"}
                  </td>
                  <td className="border p-2">{safeDate(p.created_at)}</td>
                  <td className="border p-2">{p.notes || "-"}</td>
                  <td className="border p-2">
                    {p.medicines && p.medicines.length > 0
                      ? p.medicines.map((m) => m.medicine_name).join(", ")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No prescriptions found.</p>
        )}
      </section>

      {/* ----------------- Lab Reports ----------------- */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Lab Reports</h2>
        {labReports.length > 0 ? (
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Test Name</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {labReports.map((r) => (
                <tr key={r.id}>
                  <td className="border p-2">{r.test_name}</td>
                  <td className="border p-2">{safeDate(r.created_at)}</td>
                  <td className="border p-2">{r.status}</td>
                  <td className="border p-2">{r.result || "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No lab reports found.</p>
        )}
      </section>
    </div>
  );
};

export default PatientDashboard;
