import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css'; // Unified auth styles (matches front-end)

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  onSignupClick: () => void;
  onGuestContinue: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoogleLogin, onSignupClick, onGuestContinue }) => {
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="btn-auth-google btn-disabled-google" 
            type="button" 
            onClick={() => {
              alert("Google Login will be available soon! Please use email or Guest Mode for testing.");
            }}
            style={{ filter: 'grayscale(1)', opacity: 0.7 }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: '10px' }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#34A853" d="M9.64 28.91c-.61-1.84-.95-3.81-.95-5.91s.34-4.07.95-5.91l-7.98-6.19C.92 15.46 0 19.59 0 24s.92 8.54 2.61 13.09l7.03-5.09z"/>
              <path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.03 5.09C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign in with Google (Coming Soon)
          </button>
          
          <button className="btn-auth-secondary" type="button" onClick={onGuestContinue}>Continue as Guest</button>
        </div>
        <p className="auth-note">Your data will be stored locally on this device</p>

        <p className="auth-legal">
          By continuing, you agree to our <Link to="/tc">Terms & Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
