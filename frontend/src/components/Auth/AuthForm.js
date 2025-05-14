import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../App.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:4000/api/users/login', { email: form.email, password: form.password });
        login(res.data.token);
        navigate('/');
      } else {
        await axios.post('http://localhost:4000/api/users/register', form);
        setIsLogin(true);
        setForm({ name: '', email: '', password: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
        {!isLogin && (
          <input
            name="name"
            type="text"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
            className="auth-input"
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="auth-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="auth-input"
        />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Crear cuenta'}
        </button>
        <div className="auth-toggle" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          <span style={{ color: '#7c83fd', cursor: 'pointer', fontWeight: 500 }}>
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <span style={{ fontSize: 22, verticalAlign: 'middle', marginLeft: 4, display: 'inline-block', transform: isLogin ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}>➔</span>
          </span>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
