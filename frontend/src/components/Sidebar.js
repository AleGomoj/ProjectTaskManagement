import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";
import { useDarkModeContext } from "../context/DarkModeContext";

const navItems = [
  { to: "/", icon: "🏠", label: "Home" },
  { to: "/tasks", icon: "🗂️", label: "Tasks" },
  { to: "/users", icon: "👥", label: "Users" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

const Sidebar = () => {
  const location = useLocation();
  const { darkMode, setDarkMode } = useDarkModeContext();

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">TF</div>
      <ul>
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
      <button
        className="darkmode-toggle-btn"
        onClick={() => setDarkMode((prev) => !prev)}
        style={{ marginTop: 24, width: "90%" }}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </nav>
  );
};

export default Sidebar;
