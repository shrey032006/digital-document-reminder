import React from "react";
import { Link } from "react-router-dom";
import ExpiryStamp from "./ExpiryStamp.jsx";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DocumentCard({ doc, onDelete }) {
  return (
    <article className={`doc-card doc-card-${doc.status}`}>
      <div className="doc-card-top">
        <div>
          <p className="doc-card-category">{doc.category}</p>
          <h3 className="doc-card-title">{doc.documentName}</h3>
          {doc.documentNumber && <p className="doc-card-number">No. {doc.documentNumber}</p>}
        </div>
        <ExpiryStamp status={doc.status} daysLeft={doc.daysLeft} />
      </div>

      <dl className="doc-card-dates">
        <div>
          <dt>Issued</dt>
          <dd>{formatDate(doc.issueDate)}</dd>
        </div>
        <div>
          <dt>Expires</dt>
          <dd>{formatDate(doc.expiryDate)}</dd>
        </div>
      </dl>

      {doc.notes && <p className="doc-card-notes">{doc.notes}</p>}

      <div className="doc-card-actions">
        {doc.filePath && (
          <a
            href={(import.meta.env.VITE_API_URL || "/api").replace(/\/api$/, "") + doc.filePath}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-sm"
          >
            View file
          </a>
        )}
        <Link to={`/documents/${doc._id}/edit`} className="btn btn-ghost btn-sm">
          Edit
        </Link>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(doc)}>
          Delete
        </button>
      </div>
    </article>
  );
}
