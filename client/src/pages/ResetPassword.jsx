import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("otp"); // "otp" or "password"
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("No email provided. Please start the reset process from login.");
      navigate("/");
    }
  }, [email, navigate]);

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified successfully!");
      setStep("password");
    } catch (e) {
      toast.error(e.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", { email, otp, newPassword });
      toast.success("Password reset successful! Please log in with your new password.");
      navigate("/");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP sent again to your email");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form" style={{ maxWidth: 420, margin: "40px auto" }}>
      {step === "otp" ? (
        <>
          <p className="welcome-message">Enter OTP</p>
          <p style={{ color: "#666", marginBottom: 20 }}>
            We sent a 6-digit OTP to <strong>{email}</strong>
          </p>
          <form onSubmit={verifyOTP}>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              required
              style={{ textAlign: "center", fontSize: "18px", letterSpacing: "2px" }}
            />
            <button className="btn" disabled={loading || otp.length !== 6} type="submit">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button
              type="button"
              onClick={resendOTP}
              disabled={loading}
              style={{ background: "transparent", color: "#007bff", textDecoration: "underline", cursor: "pointer", border: 0, padding: 0 }}
            >
              {loading ? "Sending..." : "Resend OTP"}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="welcome-message">Set New Password</p>
          <p style={{ color: "#666", marginBottom: 20 }}>
            Enter your new password for <strong>{email}</strong>
          </p>
          <form onSubmit={resetPassword}>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button className="btn" disabled={loading} type="submit">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button
              type="button"
              onClick={() => setStep("otp")}
              style={{ background: "transparent", color: "#666", textDecoration: "underline", cursor: "pointer", border: 0, padding: 0 }}
            >
              Back to OTP
            </button>
          </div>
        </>
      )}
    </div>
  );
}

