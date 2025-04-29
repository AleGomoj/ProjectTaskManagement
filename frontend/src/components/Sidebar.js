import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Task Management</h2>
      <ul>
        <li><Link to="/tasks">Tasks</Link></li>
        <li><Link to="/users">Users</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
