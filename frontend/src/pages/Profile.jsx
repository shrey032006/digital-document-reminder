import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../api/api.js";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await updateProfile({
        name,
        ...(newPassword ? { currentPassword, newPassword } : {}),
      });
      setMessage("Profile updated.");
      setCurrentPassword("");
      setNewPassword("");
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
        <p className="eyebrow">Account</p>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">{user?.email}</p>

        <div className="panel">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="form">
            <label className="field">
              <span>Name</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <hr className="divider" />
            <p className="field-hint">Leave the password fields blank to keep your current password.</p>

            <label className="field">
              <span>Current password</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Required to set a new password"
              />
            </label>

            <label className="field">
              <span>New password</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
              />
            </label>

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
