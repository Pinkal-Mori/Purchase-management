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
            console.error("Google login failed:", err);
            toast.error("Google login failed");
          }
        }}
        onError={() => {
          toast.error("Google login failed");
        }}
        width="100%" // optional: full width button
        text="continue_with" // optional: button text style
      />
    </div>
  );
}
