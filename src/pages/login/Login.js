import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const { exp } = jwtDecode(token);
      return exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (isTokenValid()) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('https://paurehber.ilknurdogan.dev/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success && data.payload?.token) {
        localStorage.setItem('token', data.payload.token);
        navigate('/'); // ✅ Başarılı girişten sonra yönlendirme
      } else {
        setError(data.message || 'Giriş başarısız');
      }
    } catch (err) {
      setError('Sunucu hatası');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate('/forgot-password'); // ✅ Şifremi unuttum yönlendirmesi
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">PAU REHBER'E HOŞGELDİNİZ</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="e-posta"
            className="login-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            className="login-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">GİRİŞ YAP</button>
        </form>
        {error && <div style={{ color: 'var(--delete-color)', marginTop: 12 }}>{error}</div>}

        <div className="login-forgot">
          <button onClick={handleForgotPassword} className="forgot-link">
            Şifremi Unuttum
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
