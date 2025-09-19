import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (loginId, password) => {
    try {
      const res = await api.post("/auth/login", { email: loginId, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      err.customMessage = err.response?.data?.message || "Login failed";
      throw err;
    }
  };

  const signup = async (payload) => {
    try {
      const res = await api.post("/auth/signup", payload);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const requestPasswordReset = async (email) => {
    await api.post("/auth/forgot-password", { email });
  };

  const verifyOTP = async (email, otp) => {
    await api.post("/auth/verify-otp", { email, otp });
  };

  const resetPassword = async (email, otp, newPassword) => {
    await api.post("/auth/reset-password", { email, otp, newPassword });
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout, loading, requestPasswordReset, verifyOTP, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
