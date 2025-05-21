import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './ForgotPassword.css';
import { jwtDecode } from 'jwt-decode';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '']);
const [timer, setTimer] = useState(180);

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
  }, []);

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://paurehber.ilknurdogan.dev/api/auth/forgot-password', { email });
      setStep(2);
      setError('');
    } catch (err) {
      setError('Kod gönderilirken bir hata oluştu.');
    }
  };

  const handleValidateCode = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://paurehber.ilknurdogan.dev/api/auth/validate-reset-code', {
        email,
        resetCode: parseInt(codeDigits.join('')),
      });
      setStep(3);
      setError('');
    } catch (err) {
      setError('Kod doğrulanamadı.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://paurehber.ilknurdogan.dev/api/auth/reset-password', {
        email,
        newPassword,
        resetCode: parseInt(codeDigits.join('')),
      });
      setSuccess('Şifre başarıyla değiştirildi. Giriş sayfasına yönlendiriliyorsunuz...');
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Şifre güncellenemedi.');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleDigitChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...codeDigits];
    updated[index] = value;
    setCodeDigits(updated);
  
    // Otomatik sonraki inputa geç
    if (value && index < 3) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [step, timer]);

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2 className="forgot-password-title">ŞİFREMİ UNUTTUM</h2>

        {step === 1 && (
          <>
            <p className="forgot-password-description">
              Lütfen kayıt olduğunuz e-posta adresinizi giriniz. Sıfırlama kodunu e-posta adresinize gönderiyoruz.
            </p>
            <form onSubmit={handleSendCode} className="forgot-password-form">
              <input
                type="email"
                placeholder="E-posta"
                className="forgot-password-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="forgot-password-button">Kodu Gönder</button>
          
            </form>
          </>
        )}

{step === 2 && (
  <>
    <p className="forgot-password-description">
      E-posta adresinize gelen 4 haneli kodu giriniz.
    </p>

    <form onSubmit={handleValidateCode} className="forgot-password-form">
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
        {codeDigits.map((digit, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(e.target.value, index)}
            className="forgot-password-input"
            style={{ width: '3rem', textAlign: 'center', fontSize: '1.5rem' }}
            required
          />
        ))}
      </div>

      <button type="submit" className="forgot-password-button" disabled={timer <= 0}>
        Kodu Doğrula
      </button>

      <div style={{ textAlign: 'center', marginTop: 10, color: 'gray' }}>
        Kalan süre: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
      </div>
    
    </form>
  </>
)}

        {step === 3 && (
          <>
            <p className="forgot-password-description">Yeni şifrenizi giriniz.</p>
            <form onSubmit={handleResetPassword} className="forgot-password-form">
              <input
                type="password"
                placeholder="Yeni Şifre"
                className="forgot-password-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit" className="forgot-password-button">Şifreyi Değiştir</button>
            </form>
          </>
        )}

        {error && <div style={{ color: 'var(--delete-color)', marginTop: 12 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 12 }}>{success}</div>}
      </div>
    </div>
  );
};

export default ForgotPassword;
