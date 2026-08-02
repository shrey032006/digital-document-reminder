import React, { useEffect, useState } from "react";
import api from "../api/api.js";

// Pings the backend's health endpoint on mount so connection problems are
// visible immediately, before the user even submits a form.
export default function BackendStatus() {
  const [state, setState] = useState("checking"); // checking | ok | down

  useEffect(() => {
    let cancelled = false;
    api
      .get("/health")
      .then(() => !cancelled && setState("ok"))
      .catch(() => !cancelled && setState("down"));
    return () => {
      cancelled = true;
    };
  }, []);

  if (state !== "down") return null;

  return (
    <div className="alert alert-error" style={{ marginBottom: 16 }}>
      Can't reach the backend server at{" "}
      <code>{(import.meta.env.VITE_API_URL || "/api")}</code>. Make sure it's
      running (<code>npm run dev</code> inside the <code>backend</code>{" "}
      folder) and check its terminal for a MongoDB connection error.
    </div>
  );
}
