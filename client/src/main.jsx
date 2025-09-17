import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import App from "./router";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="806511796227-8i4imq0r6j6ck6l05u6evi08hsp343ns.apps.googleusercontent.com">
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <App Protected={Protected} />
      </BrowserRouter>
    </AuthProvider>
      </GoogleOAuthProvider>
  </React.StrictMode>
);



