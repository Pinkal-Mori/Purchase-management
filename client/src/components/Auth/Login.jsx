import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import GoogleButton from "./GoogleButton";

export default function Login({ onSwitch }) {
  const { login } = useAuth();

  const [loginId, setLoginId] = useState(""); // ✅ for email or contact number
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        if (message && message.includes("Google વડે સાઇનઅપ કર્યું છે")) {
          toast.info("You signed up with Google. Please use the Google login button.");
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
        <button className="btn" type="submit">
          Log In
        </button>
      </form>

      <div className="social-login">
        <div className="or-divider">Or</div>
        <GoogleButton />
      </div>
    </div>
  );
}