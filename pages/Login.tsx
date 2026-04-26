import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css'; // Unified auth styles (matches front-end)

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onSignupClick: () => void;
  onGuestContinue: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSignupClick, onGuestContinue }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748B', textDecoration: 'none', fontWeight: 800, fontSize: '14px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Back to Home
          </Link>
        </div>
        <div className="auth-logo-section">
          <Link to="/" className="logo-box-auth">
            <img src="/assets/logo_withoutbg.png" alt="Logo" className="auth-logo-img" />
            <span className="auth-logo-text">SANIS</span>
          </Link>
        </div>

        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Continue tracking your pet's nutrition</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label>PASSWORD</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Link to="#" className="forgot-pass-link">Forgot Password?</Link>
          </div>

          <button type="submit" className="btn-auth-primary">Sign In</button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup" className="auth-link" onClick={onSignupClick}>Sign Up</Link></p>
        </div>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button className="btn-auth-secondary" onClick={onGuestContinue}>Continue as Guest</button>
        <p className="auth-note">Your data will be stored locally on this device</p>

        <p className="auth-legal">
          By continuing, you agree to our <Link to="/tc">Terms & Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
