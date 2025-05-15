import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../App.css';
import Sidebar from './Sidebar';

const Landing = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:4000/api/google/login', {
        credential: credentialResponse.credential,
      });
      if (!res.data.token) throw new Error(res.data.message || 'No token recibido');
      login(res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error con Google');
      console.error('Google login error:', err.response?.data || err);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="landing">
          <h1>TaskFlow</h1>
          <p>Organiza tus tareas y proyectos de forma sencilla y visual.<br />
          Minimalista, rápido y seguro. ¡Empieza ahora gratis!</p>
          <button className="landing-btn" onClick={() => navigate('/auth')}>
            Empezar
          </button>
          <div style={{ marginTop: 24 }}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
