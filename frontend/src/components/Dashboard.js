import React from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import TaskList from "./TaskList";
import UserList from "./UserList";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes>
          <Route path="/tasks" element={<TaskList />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
