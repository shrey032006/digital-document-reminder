import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import DocumentForm from "../components/DocumentForm.jsx";
import api, { getErrorMessage } from "../api/api.js";

export default function AddDocument() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");
    try {
      await api.post("/documents", formData, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <main className="container container-narrow">
        <Link to="/dashboard" className="back-link">
          ← Back to dashboard
        </Link>
        <p className="eyebrow">New entry</p>
        <h1 className="page-title">Add a document</h1>
        <p className="page-subtitle">We'll flag it automatically as its expiry date approaches.</p>

        <div className="panel">
          <DocumentForm submitLabel="Save document" onSubmit={handleSubmit} loading={loading} error={error} />
        </div>
      </main>
    </div>
  );
}
