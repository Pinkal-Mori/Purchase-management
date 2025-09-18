import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
// import '../..//styles/web.css';
// import '../..//styles/index.css';

export default function Header({ onOpenBucket }) {
  const { user, logout, setUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();   // 👈 current route

  // 👉 Hide header completely on /requirements
  if (location.pathname.startsWith("/requirements")) {
    return null;
  }

  const initial = user?.name?.[0]?.toUpperCase() || '?';

  const savePassword = async (e) => {
    e.preventDefault();
    setMsg("");
    if (newPassword !== confirmPassword) { setMsg("New passwords do not match"); return; }
    try {
      await api.post('/auth/password', { oldPassword, newPassword });
      setMsg("Password changed successfully!");
      setTimeout(()=>setSettingsOpen(false), 800);
    } catch (e) {
      setMsg(e.response?.data?.message || "Error");
    }
  };

  const onUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const image = ev.target.result;
      const res = await api.post('/auth/profile-image', { image });
      setUser({ ...user, profileImage: res.data.profileImage });
    };
    reader.readAsDataURL(file);
  };
const handleModalClick = (e) => {
    // Check if the click target is the modal container itself
    if (e.target.classList.contains('modal1')) {
        setSettingsOpen(false);
    }
};
  return (
    <header className="header">
      <div className="left-header">
        <Link to="/requirements" className="part1-button">Add Requirement</Link>
        <button onClick={onOpenBucket} className="part1-button">Link New Store </button>
      </div>
      <div className="right-header">
        <div className="profile-container" onClick={()=>setDropdownOpen(!dropdownOpen)}>
          {user?.profileImage ? (
            <img id="profileImage" src={user.profileImage} style={{display: "block"}} alt="Profile" />
          ) : (
            <span id="profileInitial">{initial}</span>
          )}
        </div>

        {dropdownOpen && (
          <div className="profile-dropdown" style={{display:'block'}}>
            <div className="dropdown-header">
              {user?.profileImage ? (
                <img id="dropdownProfileImage" src={user.profileImage} alt="Profile" />
              ) : (
                <span id="dropdownProfileInitial">{initial}</span>
              )}
              <div className="user-info">
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
              </div>
            </div>
            <div className="dropdown-list">
              <button className="dropdown-item" onClick={()=>{setSettingsOpen(true); setDropdownOpen(false)}}>⚙️ Settings</button>
              <button className="dropdown-item" onClick={()=>{logout(); navigate('/')}}>🚪 Logout</button>
            </div>
          </div>
        )}

        {settingsOpen && (
          <div className="modal1" style={{display:'flex'}} onClick={handleModalClick}>
            <div className="modal-content1">
              {/* <span className="close-btn1" onClick={()=>setSettingsOpen(false)}>&times;</span> */}
              <div className="settings-section">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> <span>{user?.name}</span></p>
                <p><strong>Email:</strong> <span>{user?.email}</span></p>
              </div>
              <div className="settings-section">
                <h3>Upload Profile Picture</h3>
                <input type="file" accept="image/*" onChange={onUpload} />
                {user?.profileImage && (<img id="previewProfilePic" className="profile-pic-preview" src={user.profileImage} />)}

                {user?.signup_method !== 'google' ? (
                  <>
                    <h3>Change Password</h3>
                    <form onSubmit={savePassword}>
                      <input type="password" placeholder="Old Password" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} required />
                      <input type="password" placeholder="New Password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
                      <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required />
                      <button type="submit">Update Password</button>
                      <p id="password-message" className="message">{msg}</p>
                    </form>
                  </>
                ) : (
                  <>
                    <h3>Password</h3>
                    <p>You're signed in with Google. Manage your password in your Google Account.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
