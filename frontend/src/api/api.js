import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 8000,
});

// Turns any axios error into a clear, honest message instead of a generic one.
export function getErrorMessage(err) {
  if (err.response) {
    // Server responded, but with an error status
    return err.response.data?.message || `Server error (${err.response.status}).`;
  }
  if (err.request) {
    // Request was sent but no response came back at all
    return "Can't reach the server. Is the backend running on http://localhost:5000? Also check the backend terminal for MongoDB connection errors.";
  }
  return err.message || "Something went wrong.";
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ddrs_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("ddrs_token");
      localStorage.removeItem("ddrs_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
