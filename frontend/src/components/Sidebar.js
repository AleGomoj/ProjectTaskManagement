import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

const navItems = [
  { to: "/", icon: "🏠", label: "Inicio" },
  { to: "/tasks", icon: "🗂️", label: "Tareas" },
  { to: "/users", icon: "👥", label: "Usuarios" },
  { to: "/profile", icon: "👤", label: "Perfil" },
];

const Sidebar = () => {
  const location = useLocation();
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
    </nav>
  );
};

export default Sidebar;
