import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

function Dashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Panel</h2>
        <ul>
          <li><a href="#">Tareas</a></li>
          <li><a href="#">Usuarios</a></li>
          <li><a href="#">Perfil</a></li>
        </ul>
      </aside>
      <div className="main-content">
        <div className="header">
          <h1>Bienvenido</h1>
          <button className="logout-btn" onClick={logout}>Cerrar sesión</button>
        </div>
        <div className="task-list">
          <ul>
            <li>Tarea 1</li>
            <li>Tarea 2</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
