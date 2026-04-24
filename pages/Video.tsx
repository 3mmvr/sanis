import React from 'react';

const Video: React.FC = () => {
  return (
    <div style={{ background: 'var(--cream)', color: 'var(--navy)', display: 'flex', flexDirection: 'column', height: '100vh', margin: 0, padding: 0, fontFamily: "'DM Sans', sans-serif" }}>
      <nav className="navbar" style={{ background: 'white', position: 'relative', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <a href="/" className="logo">
            <img src="/assets/logo_withoutbg.png" className="logo-icon" alt="Logo" style={{ height: '36px', width: 'auto' }} />
            <span className="logo-text" style={{ transform: 'translateY(8px)', color: 'var(--orange)' }}>SANIS</span>
          </a>
          <div className="nav-links" style={{ display: 'flex' }}>
            <a href="/" style={{ color: 'var(--navy)', textDecoration: 'none', fontWeight: 700 }}>Home</a>
          </div>
        </div>
      </nav>
      <div className="video-container" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <video controls autoPlay style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', background: '#000' }}>
          <source src="/assets/sanis_pitch.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Video;
