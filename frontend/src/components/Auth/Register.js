import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/users/register', form);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Error en el registro');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrarse</h2>
      <input name="name" type="text" placeholder="Nombre" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
      <button type="submit">Crear cuenta</button>
    </form>
  );
}

export default Register;
