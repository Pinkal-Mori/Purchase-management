import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Signup from '../components/Auth/Signup';
import Login from '../components/Auth/Login';
import '../styles/index.css';

export default function Home() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('signup');

  useEffect(()=>{
    if (user) window.location.href = "/dashboard";
  }, [user]);
const handleModalClick = (e) => {
    // Check if the click target is the modal container itself.
    if (e.target.classList.contains('modal')) {
      setOpen(false);
    }
  };

  return (
    <div>
      <header>
        <a href="https://forthtech.in/" className="logo">
          <img src="image/Long_Logo-FT.png" alt="ForthTech Logo" />
        </a>
        <div className="auth-buttons">
          <button onClick={()=>{setOpen(true); setTab('login')}} className="login-btn">Log In</button>
          <button onClick={()=>{setOpen(true); setTab('signup')}} className="signup-btn">Sign Up</button>
        </div>
      </header>

      <div className="hero-section">
        <div className="hero-content">
          <h1>Building the Future Together</h1>
          <p>A place where innovative ideas become reality. Your dedication and hard work drive our success. Welcome to the team!</p>
        </div>
      </div>

      
      {open && (
        <div className="modal" style={{ display: 'flex' }} onClick={handleModalClick}>
          <div className="modal-content">
            {/* <span className="close-btn" onClick={() => setOpen(false)}>&times;</span> */}

            {tab === 'signup' ? (
              <>
                <h2>Sign Up</h2>
                <Signup />
                <p>Already have an account? <a href="#" onClick={() => setTab('login')}>Log In</a></p>
              </>
            ) : (
                <>
                <h2>Log In</h2>
                <Login />
                <p>Don't have an account? <a href="#" onClick={() => setTab('signup')}>Sign Up</a></p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
