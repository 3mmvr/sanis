
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  const navigate = useNavigate();
  const navbarRef = useRef<HTMLElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        navbarRef.current.classList.toggle('scrolled', window.scrollY > 50);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
    if (window.innerWidth > 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const [activeNavLink, setActiveNavLink] = useState('hero');
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setActiveNavLink(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    if (window.innerWidth <= 768 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const [activeFilterTab, setActiveFilterTab] = useState('all');
  const handleFilterTabClick = (tab: string) => {
    setActiveFilterTab(tab);
  };

  // Upload dropzone hover (if applicable)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.style.borderColor = '#F3A528';
      dropzoneRef.current.style.background = '#e8fbfd';
    }
  };
  const handleDragLeave = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.style.borderColor = '#27B0C1';
      dropzoneRef.current.style.background = '#F1FDFF';
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropzoneRef.current) {
      dropzoneRef.current.style.borderColor = '#27B0C1';
      dropzoneRef.current.style.background = '#F1FDFF';
    }
    console.log('File dropped:', e.dataTransfer.files);
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up-animated');
        } else {
          entry.target.classList.remove('fade-in-up-animated');
        }
      });
    }, { threshold: 0.1 });

    // Apply to elements that had fadeInUp animation in legacy styles
    document.querySelectorAll('.analysis-bubble, .suggestion-card, .fridge-tip').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);


  return (
    <div>
      {/* ===== NAVBAR ===== */}
      <nav className="navbar" id="navbar" ref={navbarRef}>
        <div className="container">
          <a href="/" className="logo" id="logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            <img src="/assets/logo_withoutbg.png" className="logo-icon" alt="Logo" style={{ height: '36px', width: 'auto' }} />
            <span className="logo-text">SANIS</span>
          </a>
          <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} id="nav-links" ref={navLinksRef}>
            <a href="#hero" className={activeNavLink === 'hero' ? 'active' : ''} onClick={(e) => handleNavLinkClick(e, 'hero')}>Home</a>
            <a href="#features" className={activeNavLink === 'features' ? 'active' : ''} onClick={(e) => handleNavLinkClick(e, 'features')}>Services</a>
            <a href="#about" className={activeNavLink === 'about' ? 'active' : ''} onClick={(e) => handleNavLinkClick(e, 'about')}>About Us</a>
            <a href="#footer" className={activeNavLink === 'footer' ? 'active' : ''} onClick={(e) => handleNavLinkClick(e, 'footer')}>Contact</a>
          </div>
          <div className="nav-right">
            <a href="/login" className="nav-login" id="login-btn" onClick={(e) => { e.preventDefault(); onSignIn(); }}>Login <svg viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1l5 5 5-5"/></svg></a>
          </div>
          <button className={`mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`} id="mobile-toggle" aria-label="Toggle menu" onClick={toggleMobileMenu} ref={mobileToggleRef}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero" id="hero">
        <div className="hero-orange-bar"></div>
        <div className="container">
          <div className="hero-image">
            <img src="/assets/hero_image1.png" alt="Cute dog looking up" loading="eager" />
          </div>
          <div className="hero-content">
            <h1>AI Pet Nutritionist</h1>
            <p>The only app your pet needs to thrive.<br />Clinical-grade food tracking, calorie counting, and health monitoring. Extend your best friend's life with AI-driven metabolic precision.</p>
            <div className="hero-cta">
              <a href="/video" className="btn btn-orange" id="try-demo-btn" onClick={(e) => { e.preventDefault(); navigate('/video'); }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 2l10 6-10 6V2z"/></svg>
                Watch Video
              </a>
              <a href="/signup" className="btn btn-outline" onClick={(e) => { e.preventDefault(); onGetStarted(); }}>Start Trial</a>
            </div>
          </div>
        </div>
        <div className="hero-food">
          <img src="/assets/foodbowl.png" alt="Premium pet food" loading="eager" />
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="features-grid-new">
            <div className="feature-card-new">
              <div className="feature-icon-new">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h4v4H4zM16 4h4v4h-4zM4 16h4v4H4zM16 16h4v4h-4zM9 9h6v6H9z"/></svg>
              </div>
              <h3>AI Vision Log</h3>
              <p>Our neural network identifies protein sources, grains, and raw additions in seconds.</p>
            </div>
            <div className="feature-card-new">
              <div className="feature-icon-new">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
              </div>
              <h3>Weight Forecast</h3>
              <p>Predict health trends and adjust portions based on real-time activity data.</p>
            </div>
            <div className="feature-card-new">
              <div className="feature-icon-new">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              </div>
              <h3>Vet-Level Insights</h3>
              <p>Receive clinically-backed advice tailored to your pet's breed and life stage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SMART ANALYSIS ===== */}
      <section className="analysis-section" id="analysis">
        <div className="container">
          <p className="section-label">AI based multi chart</p>
          <h2 className="section-title">Smart <span style={{ color: 'var(--orange)' }}>Analysis</span></h2>
          <div className="analysis-grid-new">
            <div className="analysis-left-new">
              <div className="smart-card-main">
                <div className="smart-card-main-content">
                  <p>I see you're using Chicken Kibble.<br />Since your Bulldog has had skin rashes before, chicken might be a trigger.</p>
                  <p style={{ marginTop: '20px' }}>Just add one tablespoon of Coconut Oil or half a tin of Sardines to this bowl. The Omega-3 will help soothe his skin immediately!</p>
                </div>
                <img src="/assets/doc_dog.png" alt="Doctor Dog" className="smart-doctor hidden md:block" />
              </div>
              <div className="smart-card-small-grid">
                <div className="smart-card-small">
                  <div className="smart-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M23 6l-9.5 9.5-5-5L1 18"/></svg></div>
                  <h4>Omega-3 Boost</h4>
                  <p><strong>Add:</strong> Sardines (in water, no salt) or salmon<br /><strong>Portion guide:</strong> 1-2 tsp for small dogs | 1-2 tbsp for medium/large</p>
                </div>
                <div className="smart-card-small">
                  <div className="smart-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                  <h4>Week Knees</h4>
                  <p><strong>Add:</strong> Fevicol (in water, no salt) or salmon</p>
                </div>
              </div>
            </div>
            <div className="analysis-right-new">
              <div className="fridge-card-new">
                <div className="fridge-icon"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>
                <h3>Fridge<br />Friendly Advice</h3>
                <div className="fridge-items">
                  <div className="fridge-item">Just add one tablespoon of Coconut Oil or half a tin of Sardines to this bowl. The Omega-3 will help soothe his skin immediately!</div>
                  <div className="fridge-item">Just add one tablespoon of Coconut Oil or half a tin of Sardines to this bowl. The Omega-3 will help soothe his skin immediately!</div>
                  <div className="fridge-item">Just add one tablespoon of Coconut Oil or half a tin of Sardines to this bowl. The Omega-3 will help soothe his skin immediately!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NUTRI REPORT DASHBOARD ===== */}
      <section className="report-section" id="report" style={{ background: 'var(--cream)', padding: '60px 0' }}>
        <div className="container">
          <div className="dashboard-wrapper">
            {/* Header */}
            <div className="dashboard-header">
              <div className="dash-header-left">
                <img src="/assets/logo_withoutbg.png" alt="SANIS" className="dash-logo" />
                <div className="dash-logo-text">
                  <h2>SANIS</h2>
                  <p>Proactive<br />Pet Health</p>
                </div>
              </div>
              <div className="dash-header-center">
                <h3>Personalized Nutritional Analysis Report</h3>
                <h4>Pet Health Analysis Report</h4>
              </div>
              <div className="dash-header-right">
                <p><strong>Buddy</strong> (Golden Retriever, 3 years)</p>
                <p><strong>Date:</strong> October 26, 2026</p>
              </div>
            </div>

            {/* Grid */}
            <div className="dashboard-grid">
              {/* Box 1 */}
              <div className="dash-box box-1" style={{ minHeight: '420px', paddingBottom: '40px' }}>
                <div className="box-header">1. The Executive Summary</div>
                <p className="dash-subtitle">Tracing Period: October 1, 2026 - October 26, 2026</p>
                <div className="score-display">
                  <div className="gauge-container" style={{ position: 'relative', width: '200px', height: '100px', overflow: 'hidden', marginBottom: '16px' }}>
                    {/* Background circle */}
                    <div style={{ position: 'absolute', top: '0', left: '0', width: '200px', height: '200px', borderRadius: '50%', border: '20px solid #E2E8F0', boxSizing: 'border-box' }}></div>
                    {/* Filled arc — orange on left+top, transparent on right+bottom, rotated to show left half */}
                    <div style={{ position: 'absolute', top: '0', left: '0', width: '200px', height: '200px', borderRadius: '50%', borderWidth: '20px', borderStyle: 'solid', borderColor: '#E65100 transparent transparent #E65100', boxSizing: 'border-box', transform: 'rotate(-30deg)' }}></div>
                    {/* Dial Needle */}
                    <div style={{ position: 'absolute', bottom: '0', left: '50%', width: '4px', height: '60px', background: '#111', transformOrigin: 'center bottom', transform: 'translateX(-50%) rotate(-30deg)', borderRadius: '4px' }}></div>
                    <div style={{ position: 'absolute', bottom: '-6px', left: '50%', width: '16px', height: '16px', background: '#111', borderRadius: '50%', transform: 'translateX(-50%)' }}></div>
                  </div>
                  <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#555' }}>Longevity Score</span><br />
                    <span style={{ fontSize: '32px', fontWeight: '900', color: '#111' }}>68</span><span style={{ fontSize: '14px', fontWeight: '700', color: '#555' }}>/100</span>
                  </div>
                  <div className="status-pill" style={{ background: '#FFE0B2', color: '#E65100', fontWeight: '800', fontSize: '13px', padding: '6px 16px', borderRadius: '20px' }}>Status: Action Required</div>
                </div>
                <div className="risk-text">
                  <p><strong>The Risk:</strong> Tracing over the last 26 days shows high energy but sustained low nutrient balance. This pattern is correlated with increased joint inflammation (Damp-Heat) and coat dullness. Immediate correction is required to prevent progressive issues.</p>
                </div>
              </div>

              {/* Box 2 */}
              <div className="dash-box box-2">
                <div className="box-header">2. The Total Intake</div>
                <div className="table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Nutrient Category</th>
                      <th>Average Daily<br />Amount</th>
                      <th>Current State<br />(TCM Energetics)</th>
                      <th>RAG Engine Analysis</th>
                      <th>Target Intake<br />(Optimal)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Total Protein (g)</strong></td>
                      <td>115g (Avg)</td>
                      <td>- Warming</td>
                      <td>- Optimal Level</td>
                      <td>110-125g</td>
                    </tr>
                    <tr className="alt-row">
                      <td><strong>Total Carbs (g)</strong></td>
                      <td>78g (Avg)</td>
                      <td>- Neutral</td>
                      <td>- Optimal Level</td>
                      <td>70-85g</td>
                    </tr>
                    <tr>
                      <td><strong>Total Fat (g)</strong></td>
                      <td>14.5g (Avg)</td>
                      <td>- Warming</td>
                      <td>- Slightly High. Excess Energy risk</td>
                      <td>12-14g</td>
                    </tr>
                    <tr className="critical-row">
                      <td><strong>Trace Minerals<br />(Zinc, Iron)</strong></td>
                      <td>&lt; 1% of Target</td>
                      <td>- N/A</td>
                      <td><strong>CRITICAL BLIND SPOT.</strong><br />Severe Deficiency</td>
                      <td>Meet 100% Target</td>
                    </tr>
                    <tr>
                      <td><strong>Omega-3 Fatty Acids<br />(EPA/DHA)</strong></td>
                      <td>2.5g (Avg)</td>
                      <td>- Neutral</td>
                      <td>- Balanced. Strong support</td>
                      <td>2-3g</td>
                    </tr>
                    <tr className="critical-row">
                      <td><strong>Essential Vitamins (B, E)</strong></td>
                      <td>&lt; 1% of Target</td>
                      <td>- N/A</td>
                      <td><strong>CRITICAL BLIND SPOT.</strong><br />Deficiency</td>
                      <td>Meet 100% Target</td>
                    </tr>
                    <tr>
                      <td><strong>Fiber</strong></td>
                      <td>4.2g (Avg)</td>
                      <td>- Neutral</td>
                      <td>- Optimal. Aids Digestion</td>
                      <td>4-5g</td>
                    </tr>
                  </tbody>
                </table>
                </div>{/* end table-wrapper */}
                <p className="table-footnote">(Data based on continuous RAG tracing from SANIS Clinical Database, V 4.2)</p>
              </div>

              {/* Box 3 */}
              <div className="dash-box box-3">
                <div className="box-header">3. The TCM Harmony Index</div>
                <div className="tcm-content">
                  <div className="tcm-bars">
                    <div className="progress-wrap">
                      <div className="progress-labels"><span>Cold</span><span style={{ fontWeight: '700' }}>Temperature</span><span>Hot</span></div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: '85%', background: '#F3A528' }}></div></div>
                    </div>
                    <div className="progress-wrap" style={{ marginTop: '20px' }}>
                      <div className="progress-labels"><span>Dry</span><span style={{ fontWeight: '700' }}>Moisture</span><span>Damp</span></div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: '25%', background: '#27B0C1' }}></div></div>
                    </div>
                  </div>
                  <div className="tcm-text">
                    <p><strong>Current state:<br />Excess Heat with Dryness.</strong></p>
                    <p>Body is working too hard; will manifest as skin redness, itchiness, and stiffness. He needs "Cooling" to regain harmony.</p>
                  </div>
                </div>
              </div>

              {/* Box 4 */}
              <div className="dash-box box-4">
                <div className="box-header">4. The Solution: Targeted Raw Food Strategy</div>
                <div className="solution-content">
                  {/* Left Column */}
                  <div className="solution-left-col">
                    <div className="solution-col" style={{ marginBottom: '20px' }}>
                      <p className="solution-title">Current Nutritional Problems & Needed Nutrients</p>
                      <ul className="num-list">
                        <li>1. Severe Trace Mineral Blind Spot -&gt; Need Zinc, Iron, and Selenium.</li>
                        <li>2. Sustained Trace Mineral Blind Spot -&gt; Need B-vitamins and Vitamin E.</li>
                        <li>3. Excess Energy (Warming Fats) -&gt; Need Cooling, Moisture-Rich Protein.</li>
                        <li>4. Excess TCM Heat &amp; Dryness -&gt; Need "Cooling" elements.</li>
                      </ul>
                    </div>
                    <div className="solution-col">
                      <p className="solution-title">Raw Food Strategy (per meal)</p>
                      <p className="solution-desc">Add a raw "Smart Topper" to the existing bowl:</p>
                      <ul className="num-list">
                        <li>1. <strong>Cooling Protein:</strong> Raw Duck Heart (excellent iron source).</li>
                        <li>2. <strong>Trace Mineral Booster:</strong> Pure Raw Beef Liver (rich in B-vits and essential minerals).</li>
                        <li>3. <strong>Cooling Herb:</strong> Finely pureed fresh Spinach (iron and moisture).</li>
                        <li>4. <strong>Functional Fruit:</strong> A few raw Goji Berries (antioxidants for TCM kidney support).</li>
                      </ul>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="solution-right-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <h4 style={{ marginBottom: '24px', fontWeight: '800', fontSize: '18px' }}>Before &amp; After</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%' }}>
                      {/* Imbalanced */}
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '16px', marginBottom: '4px', fontWeight: '800', color: '#E65100' }}>Imbalanced</p>
                        <svg width="220" height="220" viewBox="0 0 100 100">
                          <text x="50" y="10" fontSize="8" textAnchor="middle" fontWeight="bold" fill="#555">Reactive</text>
                          <text x="90" y="85" fontSize="8" textAnchor="middle" fontWeight="bold" fill="#555">Damp</text>
                          <text x="10" y="85" fontSize="8" textAnchor="middle" fontWeight="bold" fill="#555">Cold</text>
                          <polygon points="50,20 80,75 20,75" fill="none" stroke="#ddd" strokeWidth="1" />
                          <line x1="50" y1="50" x2="50" y2="20" stroke="#ddd" strokeWidth="1" />
                          <line x1="50" y1="50" x2="80" y2="75" stroke="#ddd" strokeWidth="1" />
                          <line x1="50" y1="50" x2="20" y2="75" stroke="#ddd" strokeWidth="1" />
                          <polygon points="50,30 65,65 35,65" fill="rgba(243,165,40,0.5)" stroke="#F3A528" strokeWidth="2" />
                        </svg>
                      </div>

                      {/* Balanced */}
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '16px', marginBottom: '4px', fontWeight: '800', color: '#27B0C1' }}>Balanced</p>
                        <svg width="220" height="220" viewBox="0 0 100 100">
                          <text x="50" y="10" fontSize="8" textAnchor="middle" fontWeight="bold" fill="#555">Reactive</text>
                          <text x="90" y="85" fontSize="8" textAnchor="middle" fontWeight="bold" fill="#555">Damp</text>
                          <text x="10" y="85" fontSize="8" textAnchor="middle" fontWeight="bold" fill="#555">Dry</text>
                          <polygon points="50,20 80,75 20,75" fill="none" stroke="#ddd" strokeWidth="1" />
                          <line x1="50" y1="50" x2="50" y2="20" stroke="#ddd" strokeWidth="1" />
                          <line x1="50" y1="50" x2="80" y2="75" stroke="#ddd" strokeWidth="1" />
                          <line x1="50" y1="50" x2="20" y2="75" stroke="#ddd" strokeWidth="1" />
                          <polygon points="50,20 80,75 20,75" fill="rgba(39,176,193,0.5)" stroke="#27B0C1" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <p style={{ textAlign: 'left', color: '#AAA', fontSize: '12px', marginTop: '10px', fontStyle: 'italic', marginLeft: '24px' }}>* This report is for reference only</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT US ===== */}
      <section className="about-section-new" id="about">
        <div className="container">
          <div className="about-grid-new">
            <div className="about-left-new">
              <div className="about-heading-stack">
                <h2 style={{ color: 'var(--navy)' }}>About</h2>
                <h2 style={{ color: 'var(--orange)' }}>US</h2>
              </div>
              <img src="/assets/cat_footer(1).png" alt="Kitten" />
            </div>
            <div className="about-right-new">
              <p>AI-Powered Pet Nutrition Guidance That Turns Complex Dietary Science Into Clear, Actionable Advice. AI Nutri Scanner Analyzes Your Pet's Meals, Health History, And Visual Food Data To Deliver Personalized Recommendations In Simple, Human Language.</p>
              <p>By Combining Nutritional AI With Practical, Fridge-Friendly Solutions, It Helps Pet Parents Make Smarter Feeding Decisions And Proactively Support Their Pet's Long-Term Health.</p>
              <a href="/about" className="btn btn-teal about-btn-new" style={{ borderRadius: '40px' }} onClick={(e) => { e.preventDefault(); navigate('/about'); }}>More</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer" id="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo" style={{ marginBottom: '16px' }}>
                <img src="/assets/logo_withoutbg.png" alt="Logo" style={{ height: '36px', width: 'auto' }} />
                <span className="logo-text">SANIS</span>
              </div>
              <p>© 2026 SANIS AI. Designed for longevity.</p>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About Us</a>
            </div>
            <div className="footer-col">
              <h4>Help</h4>
              <a href="/tc" onClick={(e) => { e.preventDefault(); navigate('/tc'); }}>Terms &amp; Conditions</a>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a href="#">Developer Blog</a><a href="#">Academy</a>
            </div>
            <div className="footer-col">
              <h4>Social</h4>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <a href="https://www.instagram.com/sanis.app?igsh=a3AwaWUzaHV5dzQw&utm_source=qr" target="_blank" style={{ display: 'flex' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="mailto:sanis.hk.official@gmail.com" style={{ display: 'flex' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom"></div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
