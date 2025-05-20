import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AuthForm from './components/Auth/AuthForm';
import Landing from './components/Landing';
import Profile from './components/Auth/Profile';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { useDarkModeContext } from './context/DarkModeContext';
import { useDarkMode } from './hooks/useDarkMode';
import './App.css';
import { ToastProvider } from './context/ToastContext';

function AppContent() {
  const { darkMode } = useDarkModeContext();
  useDarkMode(darkMode);
  return (
    <AuthContext.Consumer>
      {({ user }) => (
        <Routes>
          <Route path="/" element={!user ? <Landing /> : <Dashboard />} />
          <Route path="/auth" element={!user ? <AuthForm /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
        </Routes>
      )}
    </AuthContext.Consumer>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
