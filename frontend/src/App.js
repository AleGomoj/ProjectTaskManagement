import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import TaskList from './components/Task/TaskList';
import TaskForm from './components/Task/TaskForm';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/register"
          element={<Register setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/tasks/new"
          element={<TaskForm setTask={setIsAuthenticated} />}
        />
        <Route path="/tasks/:id/edit" element={<TaskForm />} />
      </Routes>
    </Router>
  );
};

export default App;
