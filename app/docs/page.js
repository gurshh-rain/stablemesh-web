// app/docs/page.js
import Link from 'next/link';

export default function Docs() {
  return (
    <div className="page docs-page">
      <div className="noise-overlay"></div>
      
      {/* Mini Nav for Docs */}
      <nav className="navbar docs-nav">
        <div className="nav-container">
          <Link href="/" className="logo">
            <img src="/Stable.png" alt="Logo" className="site-logo" />
            <span className="logo-text">STABLEMESH</span>
          </Link>
          <Link href="/" className="btn-download-nav">BACK TO SITE</Link>
        </div>
      </nav>

      <div className="docs-layout">
        {/* Sidebar */}
        <aside className="docs-sidebar">
          <div className="sidebar-section">
            <h4>GETTING STARTED</h4>
            <a href="#install">Installation</a>
            <a href="#quickstart">Quickstart</a>
          </div>
          <div className="sidebar-section">
            <h4>CORE CONCEPTS</h4>
            <a href="#torque">Torque Logic</a>
            <a href="#com">Center of Mass</a>
            <a href="#hull">Support Hull</a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="docs-content">
          <section id="install">
            <span className="section-label">01 // SETUP</span>
            <h1>INSTALLATION</h1>
            <p>StableMesh is delivered as a single-file Python addon for Blender 3.0+.</p>
            <div className="code-block">
              <code>1. Preferences &gt; Addons &gt; Install</code>
              <code>2. Select stablemesh.py</code>
              <code>3. Enable 'Mesh: StableMesh'</code>
            </div>
          </section>

          <hr className="docs-divider" />

          <section id="torque">
            <span className="section-label">02 // PHYSICS</span>
            <h1>TORQUE LOGIC</h1>
            
            <p>
              StableMesh calculates the tipping risk by evaluating the torque generated 
              at the edge of the support hull.
            </p>
            
            <div className="math-display">
              {/* Wrapping in quotes solves the 'r is not defined' error */}
              <p>{"$\\tau = \\vec{r} \\times \\vec{F}$"}</p>
            </div>

            <div className="variable-definitions">
              <div className="var-item">
                <strong>{"{r}"} // Position Vector</strong>
                <p>The perpendicular distance from the Center of Mass (CoM) projection to the boundary of the support footprint.</p>
              </div>
              <div className="var-item">
                <strong>{"{F}"} // Force Vector</strong>
                <p>The downward force exerted by gravity ($m \cdot g$) acting upon the volumetric center.</p>
              </div>
            </div>

            <p className="docs-note">
              Note: If the projection of the Center of Mass falls outside the support hull, 
              the value of {"r"} becomes negative, indicating an immediate tipping state.
            </p>
          </section>

          <hr className="docs-divider" />

          <section id="com">
            <span className="section-label">03 // GEOMETRY</span>
            <h1>CENTER OF MASS</h1>
            
            <p>
                Unlike standard bounding-box centers, StableMesh calculates the <strong>Volumetric Center</strong>. 
                It treats the mesh as a solid manifold to ensure real-world accuracy.
            </p>
          </section>

          <hr className="docs-divider" />

          <section id="hull">
            <span className="section-label">04 // STABILITY</span>
            <h1>SUPPORT HULL</h1>
            <p>
              The Support Hull is the convex polygon formed by the mesh's lowest global Z-coordinates. 
              StableMesh automatically generates this "footprint" to determine the safe zone for the Center of Mass.
            </p>
          </section>
        </main>
      </div>

      <footer className="footer-stark">
        <div className="footer-bottom">
          <span>STABLEMESH DOCUMENTATION v1.3</span>
          <span>© 2026 SYSTEM STABLE</span>
        </div>
      </footer>
    </div>
  );
}