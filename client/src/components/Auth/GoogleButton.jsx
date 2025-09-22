import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function GoogleButton() {
  const { setUser } = useAuth();

  return (
    <div className="social-btn google-btn">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const res = await api.post("/auth/google-login", {
              tokenId: credentialResponse.credential,
            });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            toast.success("Logged in with Google!");
          } catch (err) {
            const message = err.response?.data?.message || "Google login failed";
            console.error("Google login failed:", err);

            // Here's the new logic to handle a specific error from the backend.
            if (message.includes("Signed up with Google")) {
              toast.info("This email is already registered with a password. Please log in using your email and password.");
            } else {
              toast.error(message);
            }
          }
        }}
        onError={() => {
          toast.error("Google login failed");
        }}
        width="100%"
        text="continue_with"
      />
    </div>
  );
}