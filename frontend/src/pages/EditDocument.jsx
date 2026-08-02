import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import DocumentForm from "../components/DocumentForm.jsx";
import api, { getErrorMessage } from "../api/api.js";

export default function EditDocument() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/documents/${id}`)
      .then((res) => setDoc(res.data.document))
      .catch((err) => setFetchError(getErrorMessage(err)));
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");
    try {
      await api.put(`/documents/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
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
        <p className="eyebrow">Edit entry</p>
        <h1 className="page-title">Update document</h1>
        <p className="page-subtitle">Renewed it already? Update the expiry date to reset the clock.</p>

        {fetchError && <div className="alert alert-error">{fetchError}</div>}

        {doc && (
          <div className="panel">
            <DocumentForm initial={doc} submitLabel="Save changes" onSubmit={handleSubmit} loading={loading} error={error} />
          </div>
        )}
      </main>
    </div>
  );
}
