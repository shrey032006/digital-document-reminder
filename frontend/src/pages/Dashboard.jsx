import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import DocumentCard from "../components/DocumentCard.jsx";
import SummaryTile from "../components/SummaryTile.jsx";
import api, { getErrorMessage } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [summary, setSummary] = useState({ total: 0, expired: 0, urgent: 0, soon: 0, valid: 0 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("expiry");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/documents", { params: { search, status, sort } });
      setDocuments(res.data.documents);
      setSummary(res.data.summary);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, status, sort]);

  useEffect(() => {
    const t = setTimeout(fetchDocuments, 250); // debounce search
    return () => clearTimeout(t);
  }, [fetchDocuments]);

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete "${doc.documentName}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/documents/${doc._id}`);
      setDocuments((prev) => prev.filter((d) => d._id !== doc._id));
      fetchDocuments();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="page">
      <Navbar />
      <main className="container">
        <div className="page-head">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1 className="page-title">Good to see you, {user?.name?.split(" ")[0]}.</h1>
            <p className="page-subtitle">Every renewal date, tracked and stamped.</p>
          </div>
          <Link to="/documents/add" className="btn btn-primary">
            + Add document
          </Link>
        </div>

        <div className="tiles">
          <SummaryTile label="Total" value={summary.total} tone="ink" active={status === "all"} onClick={() => setStatus("all")} />
          <SummaryTile
            label="Expired"
            value={summary.expired}
            tone="rust"
            active={status === "expired"}
            onClick={() => setStatus("expired")}
          />
          <SummaryTile
            label="Urgent (≤7d)"
            value={summary.urgent}
            tone="rust"
            active={status === "urgent"}
            onClick={() => setStatus("urgent")}
          />
          <SummaryTile
            label="Expiring soon"
            value={summary.soon}
            tone="brass"
            active={status === "soon"}
            onClick={() => setStatus("soon")}
          />
          <SummaryTile label="Valid" value={summary.valid} tone="moss" active={status === "valid"} onClick={() => setStatus("valid")} />
        </div>

        <div className="toolbar">
          <input
            type="search"
            className="search-input"
            placeholder="Search documents by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="expiry">Sort by expiry date</option>
            <option value="name">Sort by name</option>
          </select>
          {status !== "all" && (
            <button className="btn btn-ghost btn-sm" onClick={() => setStatus("all")}>
              Clear filter
            </button>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <p className="empty-state">Loading your documents…</p>
        ) : documents.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">Nothing here yet.</p>
            <p>Add your first document — Aadhaar, PAN, passport, insurance — and we'll track the clock for you.</p>
            <Link to="/documents/add" className="btn btn-primary">
              + Add document
            </Link>
          </div>
        ) : (
          <div className="doc-grid">
            {documents.map((doc) => (
              <DocumentCard key={doc._id} doc={doc} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
