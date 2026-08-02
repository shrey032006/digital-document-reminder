import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/dashboard" className="nav-brand">
          <span className="nav-mark">◈</span>
          <span className="nav-brand-text">
            Docket<span className="nav-brand-sub">.reminder</span>
          </span>
        </Link>

        {user && (
          <nav className="nav-links">
            <Link to="/dashboard" className={isActive("/dashboard") ? "nav-link active" : "nav-link"}>
              Dashboard
            </Link>
            <Link to="/documents/add" className={isActive("/documents/add") ? "nav-link active" : "nav-link"}>
              Add document
            </Link>
            <Link to="/profile" className={isActive("/profile") ? "nav-link active" : "nav-link"}>
              Profile
            </Link>
          </nav>
        )}

        {user && (
          <div className="nav-user">
            <span className="nav-user-name">{user.name}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
