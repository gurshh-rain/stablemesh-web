// app/page.js - Full Monochrome Astrae Style
import Link from 'next/link';

export default function Home() {
  return (
    <div className="page">
      <div className="noise-overlay"></div>

      {/* 1. TOP NAV */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="footer-logo-wrapper">
            <img src="/Stable.png" alt="StableMesh Logo" className="site-logo footer-logo" />
            <div className="logo-text">STABLEMESH</div>
          </div>
          <div className="nav-links">
            <a href="#analysis">ANALYSIS</a>
            <a href="#specs">SPECS</a>
            <Link href="/docs">DOCS</Link>
          </div>
          <a href="/stablemesh.py" download className="btn-download-nav">GET ADDON</a>
        </div>
      </nav>

      {/* 2. HERO */}
<section className="hero">
  {/* The Video Background */}
  <div className="hero-video-container">
    <video 
      autoPlay 
      muted 
      loop 
      playsInline 
      className="hero-video-bg"
    >
      <source src="/StableMesh.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    {/* Dark Overlay to make text pop */}
    <div className="video-overlay"></div>
  </div>

  <div className="hero-content">
    <div className="reveal-tag">V1.3.0 LIVE</div>
    <h1 className="giant-title">PRECISION<br/>STABILITY.</h1>
    <p className="hero-description">
      A high-performance structural analyzer for Blender. Built to eliminate tipping risks 
      through stark monochrome torque mapping.
    </p>
    <div className="hero-cta-group">
      <a href="/stablemesh.py" download className="main-button">DOWNLOAD SCRIPT</a>
      <button className="secondary-button">VIEW GITHUB</button>
    </div>
  </div>
</section>

      {/* 3. COMPARISON SECTION (The "Astrae" Look) */}
      <section id="analysis" className="comparison">
        <div className="section-header">
          <span className="section-num">01</span>
          <h2>THE ANALYSIS ENGINE</h2>
        </div>
        <div className="comparison-grid">
          <div className="comp-box">
            <span className="label">RAW MESH</span>
            <div className="box-visual raw"></div>
            <p>Undefined center of gravity. Visual-only geometry with high risk of structural failure.</p>
          </div>
          <div className="comp-box active">
            <span className="label">ANALYZED</span>
            <div className="box-visual analyzed">
              <div className="com-point"></div>
            </div>
            <p>Full volumetric calculation. Center of Mass is projected onto the support hull with millimeter precision.</p>
          </div>
        </div>
      </section>

      {/* 4. TECHNICAL SPECS (Long Scroll) */}
      <section id="specs" className="specs">
        <div className="specs-border-top"></div>
        <div className="specs-container">
          <div className="spec-item">
            <h3>TORQUE MAPPING</h3>
            <p>Calculates lever-arm length from the support boundary to determine tipping force (N⋅m).</p>
          </div>
          <div className="spec-item">
            <h3>SUPPORT HULL</h3>
            <p>Automated 2D Convex Hull generation based on the mesh’s lowest global Z-coordinates.</p>
          </div>
          <div className="spec-item">
            <h3>VOLUMETRIC COM</h3>
            <p>Calculates density-based center of mass rather than just vertex average for true physics.</p>
          </div>
          <div className="spec-item">
            <h3>LIVE VIEWPORT</h3>
            <p>Real-time attribute updating allows for mesh manipulation while viewing stability scores.</p>
          </div>
        </div>
      </section>

      {/* 5. LARGE CTA */}
      <section className="final-cta">
        <h2 className="cta-giant-text">READY TO BUILD?</h2>
        <a href="/stablemesh.py" download className="cta-circle-btn">
          <span>GET<br/>STABLE</span>
        </a>
      </section>

      {/* 6. FOOTER */}
      <footer className="footer-stark">
        <div className="footer-grid">
          <div className="footer-left">
            <div className="logo-text">STABLEMESH</div>
            <p>ADVANCED GEOMETRY UTILITIES</p>
          </div>
          <div className="footer-right">
              <div className="footer-col">
                <span>SOCIAL</span>
                <a href="#">X.COM</a>
                <a href="#">B_MARKET</a>
              </div>
              <div className="footer-col">
                <span>LEGAL</span>
                <a href="#">LICENSE</a>
                <a href="#">PRIVACY</a>
              </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SYSTEM STABLE</span>
          <span>BUILT FOR BLENDER</span>
        </div>
      </footer>
    </div>
  );
}