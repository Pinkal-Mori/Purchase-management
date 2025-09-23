import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from 'react-toastify';
import GoogleButton from "./GoogleButton";

export default function Signup({ onSwitch }) {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🆕 નવું ફંક્શન જે માત્ર નંબરો જ સ્વીકારે
  const handleContactChange = (e) => {
    const value = e.target.value;
    // રેગ્યુલર એક્સપ્રેશન જે માત્ર અંકોને સ્વીકારે
    if (/^\d*$/.test(value)) {
      setContact(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // 10-અંકનું વેલિડેશન (સબમિટ કરતી વખતે)
    const contactNumberPattern = /^\d{10}$/;
    if (!contactNumberPattern.test(contact)) {
        toast.error("Please enter a valid 10-digit contact number.");
        return; 
    }
    
    try {
      await signup({ name, contact, email, password });
      toast.success("Signup successful!");
      // redirect or close modal here
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Signup failed";
      
      if (message.includes("Signed up with Google")) {
        toast.info("This email is already registered with Google. Please use the Google Sign-up button.");
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <div className="auth-form">
      <p className="welcome-message">Create your account</p>
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Username" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="input-group">
          <input 
            type="tel" 
            placeholder="Contact Number (10 digits)" 
            value={contact} 
            onChange={handleContactChange} // 🆕 અહીં આ નવું ફંક્શન વાપરવામાં આવ્યું છે
            required 
          />
        </div>
        <div className="input-group">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="input-group">
          <div className="password-input-container">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <span 
              className="password-toggle-icon" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button className="btn primary-btn" type="submit">Sign Up</button>
      </form>

      <div className="social-login">
        <div className="or-divider">Or</div>
        <GoogleButton />
      </div>
    </div>
  );
}