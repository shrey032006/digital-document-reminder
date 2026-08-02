import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../api/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ddrs_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const persist = (token, user) => {
    localStorage.setItem("ddrs_token", token);
    localStorage.setItem("ddrs_user", JSON.stringify(user));
    setUser(user);
  };

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      persist(res.data.token, res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      persist(res.data.token, res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const res = await api.put("/auth/me", payload);
    const token = localStorage.getItem("ddrs_token");
    persist(token, res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ddrs_token");
    localStorage.removeItem("ddrs_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
