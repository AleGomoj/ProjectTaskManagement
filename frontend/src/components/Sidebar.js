import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

const navItems = [
  { to: "/", icon: "🏠", label: "Home" },
  { to: "/tasks", icon: "🗂️", label: "Tasks" },
  { to: "/users", icon: "👥", label: "Users" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

const Sidebar = () => {
  const location = useLocation();
  const [isWide, setIsWide] = useState(false);

  // Detect hover using mouse events for instant change
  const handleMouseEnter = () => setIsWide(true);
  const handleMouseLeave = () => setIsWide(false);

  return (
    <nav
      className="sidebar"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-logo">{isWide ? "TaskFlow" : "TF"}</div>
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
    </nav>
  );
};

export default Sidebar;
