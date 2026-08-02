import React, { useState } from "react";

const CATEGORIES = [
  "Aadhaar",
  "PAN",
  "Passport",
  "Driving License",
  "Insurance",
  "Vehicle Registration",
  "Educational Certificate",
  "Other",
];

function toInputDate(d) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export default function DocumentForm({ initial, submitLabel, onSubmit, loading, error }) {
  const [form, setForm] = useState({
    documentName: initial?.documentName || "",
    documentNumber: initial?.documentNumber || "",
    category: initial?.category || "Aadhaar",
    issueDate: toInputDate(initial?.issueDate),
    expiryDate: toInputDate(initial?.expiryDate),
    notes: initial?.notes || "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (file) data.append("file", file);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="alert alert-error">{error}</div>}

      <label className="field">
        <span>Document name</span>
        <input
          type="text"
          name="documentName"
          value={form.documentName}
          onChange={handleChange}
          placeholder="e.g. Passport"
          required
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Category</span>
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Document number</span>
          <input
            type="text"
            name="documentNumber"
            value={form.documentNumber}
            onChange={handleChange}
            placeholder="Optional"
          />
        </label>
      </div>

      <div className="field-row">
        <label className="field">
          <span>Issue date</span>
          <input type="date" name="issueDate" value={form.issueDate} onChange={handleChange} />
        </label>

        <label className="field">
          <span>Expiry date</span>
          <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} required />
        </label>
      </div>

      <label className="field">
        <span>Notes</span>
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes" rows={3} />
      </label>

      <label className="field">
        <span>Attach file (PDF or image, optional)</span>
        <input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={(e) => setFile(e.target.files[0])} />
        {initial?.filePath && !file && <p className="field-hint">A file is already attached — choose a new one to replace it.</p>}
      </label>

      <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
        {loading ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
