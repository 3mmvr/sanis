import React from 'react';

const About: React.FC = () => {
  return (
    <div style={{ background: 'var(--cream)', color: 'var(--navy)', minHeight: '100vh' }}>
      <nav className="navbar" style={{ background: 'white', position: 'relative', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <a href="/" className="logo">
            <img src="/assets/logo_withoutbg.png" className="logo-icon" alt="Logo" style={{ height: '36px', width: 'auto' }} />
            <span className="logo-text" style={{ transform: 'translateY(8px)' }}>SANIS</span>
          </a>
          <div className="nav-links" style={{ display: 'flex' }}>
            <a href="/" style={{ color: 'var(--navy)', textDecoration: 'none', fontWeight: 700 }}>Home</a>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="about-container" style={{ maxWidth: '900px', margin: '60px auto', padding: '60px', background: 'white', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', marginBottom: '40px', color: 'var(--navy)' }}>About Us</h1>
          
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'var(--orange)', margin: '48px 0 20px' }}>1. Our Mission</h2>
          <p style={{ fontSize: '17px', lineHeight: '1.8', color: 'var(--dark-gray)', marginBottom: '24px', textAlign: 'justify' }}>In a world where pet technology often waits for symptoms to manifest, Sanis acts sooner. Most devices track changes after a pet is already in discomfort, but our mission is to identify imbalances in the "invisible window" before they are physically observable.</p>
          
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'var(--orange)', margin: '48px 0 20px' }}>2. Our Action</h2>
          <p style={{ fontSize: '17px', lineHeight: '1.8', color: 'var(--dark-gray)', marginBottom: '24px', textAlign: 'justify' }}>We provide a fast, frictionless tool designed for the modern kitchen counter. By simply taking a photo of raw ingredients, our AI identifies components and estimates volume without the need for physical markers.</p>
          
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'var(--orange)', margin: '48px 0 20px' }}>3. Our Vision</h2>
          <div className="vision-card" style={{ background: 'var(--cream)', padding: '30px', borderRadius: '20px', marginBottom: '20px', borderLeft: '5px solid var(--teal)' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--navy)' }}>Advanced Nutritional Diagnostics</h3>
            <p style={{ margin: 0, fontSize: '15px' }}>Evaluating if every meal contains the specific nutrients required for a pet's unique health profile.</p>
          </div>
          <div className="vision-card" style={{ background: 'var(--cream)', padding: '30px', borderRadius: '20px', marginBottom: '20px', borderLeft: '5px solid var(--teal)' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--navy)' }}>Convenient Healthy Meal Prep</h3>
            <p style={{ margin: 0, fontSize: '15px' }}>Integrating with the owner's workflow to provide a faster and more efficient way to manage strategic feeding.</p>
          </div>
          <div className="vision-card" style={{ background: 'var(--cream)', padding: '30px', borderRadius: '20px', marginBottom: '20px', borderLeft: '5px solid var(--teal)' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--navy)' }}>Global Health Ecosystems</h3>
            <p style={{ margin: 0, fontSize: '15px' }}>Establishing partnerships with veterinarians and clinics to enable shared health records and proactive care.</p>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .about-container { padding: 30px !important; margin: 40px auto !important; }
          .about-container h1 { font-size: 32px !important; margin-bottom: 24px !important; }
          .about-container h2 { font-size: 22px !important; margin: 32px 0 16px !important; }
          .about-container p { font-size: 15px !important; }
          .vision-card h3 { font-size: 18px !important; }
          .vision-card p { font-size: 14px !important; }
          .vision-card { padding: 20px !important; }
        }
      `}</style>
    </div>
  );
};

export default About;
