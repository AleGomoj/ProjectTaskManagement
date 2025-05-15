import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/api';
import '../../App.css';
import Sidebar from '../Sidebar';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');

  const isGoogleUser = user?.provider === 'google';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!form.password) {
      setMessage('Password is required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      await updateUserProfile(user.id, { password: form.password });
      setEditMode(false);
      setMessage('Password updated successfully!');
      setForm({ password: '', confirmPassword: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating password.');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="profile-container board-list">
          <h2>User Profile</h2>
          {isGoogleUser && (
            <div className="profile-warning">
              You are logged in with Google. Profile changes are not allowed.
            </div>
          )}
          <form onSubmit={handleSubmit} className="profile-form">
            <div>
              <label>New Password:</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={!editMode || isGoogleUser}
                className="profile-input"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={!editMode || isGoogleUser}
                className="profile-input"
                placeholder="Confirm new password"
              />
            </div>
            <div className="profile-actions">
              {!editMode ? (
                <button type="button" onClick={() => setEditMode(true)} disabled={isGoogleUser}>
                  Change Password
                </button>
              ) : (
                <>
                  <button type="submit" disabled={isGoogleUser}>Save</button>
                  <button type="button" onClick={() => { setEditMode(false); setForm({ password: '', confirmPassword: '' }); }}>Cancel</button>
                </>
              )}
            </div>
            {message && <div className="profile-message">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
