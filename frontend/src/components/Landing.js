import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import '../App.css';

const GOOGLE_CLIENT_ID = '977150192945-nlprf1aebgcsr5vu7v95jg87qif009gb.apps.googleusercontent.com';
const Landing = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:4000/api/google/login', {
        credential: credentialResponse.credential,
      });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error con Google');
    }
  };

  return (
    <div className="landing">
      <h1>TaskFlow</h1>
      <p>Organiza tus tareas y proyectos de forma sencilla y visual.<br />
      Minimalista, rápido y seguro. ¡Empieza ahora gratis!</p>
      <button className="landing-btn" onClick={() => navigate('/auth')}>
        Empezar
      </button>
      <div style={{ marginTop: 24 }}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert('Error con Google')}
            width="260"
            theme="filled_blue"
            text="signin_with"
            shape="pill"
            logo_alignment="center"
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default Landing;
