import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BoardList from './Board/BoardList';
import '../App.css';
import Sidebar from './Sidebar';

function Dashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <h1>Welcome</h1>
          <button className="logout-btn" onClick={logout}>Log Out</button>
        </div>
        <div className="board-list">
          <BoardList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
