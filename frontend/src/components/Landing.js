import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <h1>TaskFlow</h1>
      <p>Organiza tus tareas y proyectos de forma sencilla y visual.<br />
      Minimalista, rápido y seguro. ¡Empieza ahora gratis!</p>
      <button className="landing-btn" onClick={() => navigate('/auth')}>
        Empezar
      </button>
    </div>
  );
};

export default Landing;
