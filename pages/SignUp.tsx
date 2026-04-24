import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

interface SignUpProps {
  onSignup: (email: string, password: string, fullName: string) => void;
  onLoginClick: () => void;
  onGuestContinue?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignup, onLoginClick, onGuestContinue }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onSignup(email, password, fullName);
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
          <h1>Create Account</h1>
          <p>Start your pet's health journey</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>FULL NAME</label>
            <input type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>PASSWORD</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>CONFIRM PASSWORD</label>
            <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-auth-primary">Create Account</button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link" onClick={onLoginClick}>Sign In</Link></p>
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

export default SignUp;
