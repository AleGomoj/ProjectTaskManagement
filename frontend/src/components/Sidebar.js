import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";
import { useDarkModeContext } from "../context/DarkModeContext";
import Swal from 'sweetalert2';

const navItems = [
  { to: "/", icon: "🏠", label: "Home" },
  { to: "/tasks", icon: "🗂️", label: "Tasks" },
  { to: "/users", icon: "👥", label: "Users" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

const BottomNav = ({ location, darkMode, setDarkMode, onLogout }) => (
  <nav className="bottom-nav" aria-label="Mobile navigation">
    {navItems.map((item) => (
      <Link
        key={item.to}
        to={item.to}
        className={location.pathname === item.to ? "active" : ""}
        aria-label={item.label}
      >
        <span>{item.icon}</span>
      </Link>
    ))}
    <button
      className="darkmode-toggle-btn"
      onClick={() => setDarkMode((prev) => !prev)}
      aria-label="Toggle dark mode"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
    <button
      className="logout-btn"
      onClick={onLogout}
      aria-label="Log out"
    >
      <span role="img" aria-label="logout">🚪</span>
    </button>
  </nav>
);

const Sidebar = () => {
  const location = useLocation();
  const { darkMode, setDarkMode } = useDarkModeContext();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showFullLogo, setShowFullLogo] = useState(false);

  useEffect(() => {
    let timeout;
    if (hovered || focused) {
      timeout = setTimeout(() => setShowFullLogo(true), 100);
    } else {
      setShowFullLogo(false);
    }
    return () => clearTimeout(timeout);
  }, [hovered, focused]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Log out?',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c83fd',
      cancelButtonColor: '#f67280',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        window.location.href = '/auth';
      }
    });
  };

  return (
    <>
      <nav
        className="sidebar"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        tabIndex={-1}
        style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'space-between' }}
      >
        <div className="sidebar-logo" style={{ transition: 'width 0.3s' }}>{showFullLogo ? "TaskFlow" : "TF"}</div>
        <ul style={{ flex: 1 }}>
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={location.pathname === item.to ? "active" : ""}
              >
                <span>{item.icon}</span>
                <span style={{ display: "inline-block", minWidth: 60 }}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, alignItems: 'flex-start', width: '100%' }}>
          <button
            className="darkmode-toggle-btn"
            onClick={() => setDarkMode((prev) => !prev)}
            style={{ width: "90%", alignSelf: 'flex-start', textAlign: 'left' }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button
            className="logout-btn"
            style={{ width: "90%", alignSelf: 'flex-start', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={handleLogout}
            aria-label="Log out"
          >
            <span role="img" aria-label="logout">🚪</span>
            {showFullLogo && <span>Log Out</span>}
          </button>
        </div>
      </nav>
      {/* Bottom navigation for mobile */}
      <BottomNav location={location} darkMode={darkMode} setDarkMode={setDarkMode} onLogout={handleLogout} />
    </>
  );
};

export default Sidebar;
