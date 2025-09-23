import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import GoogleButton from "./GoogleButton";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState(""); // ✅ for email or contact number
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(loginId, password);
      toast.success("Login successful!");
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.customMessage;
      const detail = error.response?.data?.detail;

      console.error("Frontend Login Error:", { status, message, detail });

      if (status === 404) {
        toast.error("Don't have an account? Please sign up first.");
      } else if (status === 400) {
        // Here's the new logic
        if (message && message.includes("Signed up with Google")) {
          toast.info(
            "You signed up with Google. Please use the Google login button."
          );
        } else if (message?.toLowerCase().includes("password")) {
          toast.error("Invalid password.");
        } else if (message?.toLowerCase().includes("required")) {
          toast.error("Email/Contact and password are required.");
        } else {
          toast.error(message || "Bad request.");
        }
      } else if (status === 500) {
        toast.error(message || "Server error. Please try again later.");
      } else {
        toast.error(message || "Unexpected error occurred.");
      }
    }
  };

  return (
    <div className="auth-form">
      <p className="welcome-message">Welcome Back</p>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Email or Contact Number"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          required
        />
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div style={{ textAlign: "right" }}>
          <button
            type="button"
            className="forgot-password"
            style={{
              background: "transparent",
              color: "#ff2424",
              cursor: "pointer",
              border: 0,
              padding: 0,
              marginBottom: 10,
            }}
            onClick={() => setShowForgot(true)}
          >
            Forgot password
          </button>
        </div>

        <button className="btn" type="submit">
          Log In
        </button>
      </form>

      <div className="social-login">
        <div className="or-divider">Or</div>
        <GoogleButton />
      </div>

      {showForgot && (
        <div
          className="modal"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              width: 360,
              maxWidth: "90%",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 12 }}>Reset your password</h3>
            <p style={{ marginTop: 0, color: "#666" }}>
              Enter your account email to receive an OTP.
            </p>
            <input
              type="email"
              placeholder="Email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 8 }}
            />
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <button
                onClick={() => setShowForgot(false)}
                className="btn"
                style={{ background: "#eee", color: "#333" }}
              >
                Cancel
              </button>
              <button
                className="btn"
                disabled={isSending || !forgotEmail}
                onClick={async () => {
                  try {
                    setIsSending(true);
                    await api.post("/auth/forgot-password", {
                      email: forgotEmail,
                    });
                    toast.success(
                      "If that account exists, an OTP has been sent to your email."
                    );
                    setShowForgot(false);
                    navigate("/reset-password", {
                      state: { email: forgotEmail },
                    });
                  } catch (e) {
                    const msg = e.response?.data?.message;
                    if (msg && msg.includes("Google")) {
                      toast.info(
                        "You signed up with Google. Please use the Google login button."
                      );
                    } else {
                      toast.error(msg || "Failed to send OTP");
                    }
                  } finally {
                    setIsSending(false);
                  }
                }}
              >
                {isSending ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
