// src/api/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach access token if present
export const setAuthToken = (access) => {
  if (access) {
    api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Auth helpers (SimpleJWT)
export const login = (username, password) => api.post("auth/token/", { username, password });
export const refreshToken = (refresh) => api.post("auth/token/refresh/", { refresh });

// Current user
export const fetchCurrentUser = () => api.get("current-user/");

// Generic helpers
export const fetchUsers = () => api.get("users/");
export const fetchAppointments = () => api.get("appointments/");
export const createAppointment = (payload) => api.post("appointments/", payload);
export const fetchDoctors = () => api.get("doctors/");
export const fetchMedicines = () => api.get("medicines/");

export default api;
