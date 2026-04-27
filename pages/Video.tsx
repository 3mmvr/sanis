import React from 'react';
import { useNavigate } from 'react-router-dom';

const Video: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: 'var(--cream)', color: 'var(--navy)', display: 'flex', flexDirection: 'column', height: '100vh', margin: 0, padding: 0, fontFamily: "'DM Sans', sans-serif" }}>
      <nav className="navbar" style={{ background: 'white', position: 'relative', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <a href="/" className="logo">
            <img src="/assets/logo_withoutbg.png" className="logo-icon" alt="Logo" style={{ height: '36px', width: 'auto' }} />
            <span className="logo-text" style={{ transform: 'translateY(8px)', color: 'var(--orange)' }}>SANIS</span>
          </a>
          <div className="nav-links" style={{ display: 'flex' }}>
            <a href="/" style={{ color: 'var(--navy)', textDecoration: 'none', fontWeight: 700 }} onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          </div>
        </div>
      </nav>
      <div className="video-container" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <iframe 
          src="https://www.youtube.com/embed/O11W5cxVnRU" 
          width="100%" 
          height="100%" 
          style={{ minHeight: '60vh', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', background: '#000', border: 'none' }} 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Video;
