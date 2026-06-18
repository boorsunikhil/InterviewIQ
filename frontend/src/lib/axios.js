
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3030/api" : "/api",
  withCredentials: true, // sends cookies (for session-based auth)
  headers: { "Content-Type": "application/json" },
});

export default api;