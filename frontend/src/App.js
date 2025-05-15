import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AuthForm from './components/Auth/AuthForm';
import Landing from './components/Landing';
import Profile from './components/Auth/Profile';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthContext.Consumer>
          {({ user }) => (
            <Routes>
              <Route path="/" element={!user ? <Landing /> : <Dashboard />} />
              <Route path="/auth" element={!user ? <AuthForm /> : <Navigate to="/" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
            </Routes>
          )}
        </AuthContext.Consumer>
      </Router>
    </AuthProvider>
  );
}

export default App;
