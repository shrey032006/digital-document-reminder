import React from "react";

const STATUS_COPY = {
  expired: (days) => `EXPIRED ${Math.abs(days)}D AGO`,
  urgent: (days) => `${days}D LEFT`,
  soon: (days) => `${days}D LEFT`,
  valid: () => "VALID",
};

export default function ExpiryStamp({ status, daysLeft }) {
  const label = (STATUS_COPY[status] || STATUS_COPY.valid)(daysLeft);

  return (
    <div className={`stamp stamp-${status}`} title={`Status: ${status}`}>
      <svg viewBox="0 0 100 100" className="stamp-ring" aria-hidden="true">
        <circle cx="50" cy="50" r="46" />
      </svg>
      <span className="stamp-text">{label}</span>
    </div>
  );
}
