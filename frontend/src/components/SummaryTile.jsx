import React from "react";

export default function SummaryTile({ label, value, tone, active, onClick }) {
  return (
    <button
      type="button"
      className={`tile tile-${tone}${active ? " tile-active" : ""}`}
      onClick={onClick}
    >
      <span className="tile-value">{value}</span>
      <span className="tile-label">{label}</span>
    </button>
  );
}
