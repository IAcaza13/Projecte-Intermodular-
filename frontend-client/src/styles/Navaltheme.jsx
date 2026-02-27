// ─────────────────────────────────────────────────────────────
//  src/styles/navalTheme.js
//  Estilos y componentes compartidos por todas las páginas.
//  Uso:
//    import { navalBase, OceanBG, ShipSVG, RadarDeco } from '../styles/navalTheme';
// ─────────────────────────────────────────────────────────────

// ── CSS base compartido ──────────────────────────────────────
export const navalBase = `
  @import url('https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700');

  /* Keyframes */
  @keyframes ocean-scroll  { 0%{transform:translateX(0)}    100%{transform:translateX(-50%)} }
  @keyframes ocean-scroll2 { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
  @keyframes ship-bob      { 0%,100%{transform:translateY(0px) rotate(-0.8deg)} 50%{transform:translateY(-10px) rotate(0.8deg)} }
  @keyframes ship-enter    { from{opacity:0;transform:translateX(-80px)} to{opacity:1;transform:translateX(0)} }
  @keyframes fadeInUp      { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ping-slow     { 75%,100%{transform:scale(1.5);opacity:0} }
  @keyframes bar-slide     { 0%{background-position:0% 0} 100%{background-position:200% 0} }
  @keyframes glow-pulse    { 0%,100%{text-shadow:0 0 20px rgba(96,165,250,0.4)} 50%{text-shadow:0 0 40px rgba(96,165,250,0.9),0 0 80px rgba(37,99,235,0.3)} }
  @keyframes spin          { to{transform:rotate(360deg)} }

  /* Página base */
  .naval-page {
    font-family:'Instrument Sans',ui-sans-serif,system-ui,sans-serif;
    min-height:100vh; background:#05080f; color:#f9fafb;
    position:relative; overflow-x:hidden;
    display:flex; flex-direction:column;
  }
  .naval-page::before {
    content:''; position:fixed; inset:0;
    background-image:
      linear-gradient(rgba(59,130,246,0.055) 1px,transparent 1px),
      linear-gradient(90deg,rgba(59,130,246,0.055) 1px,transparent 1px);
    background-size:44px 44px; pointer-events:none; z-index:0;
  }

  /* Ocean */
  .naval-ocean {
    position:fixed; bottom:0; left:0; width:100%; height:200px;
    pointer-events:none; z-index:1; overflow:hidden;
  }
  .ocean-track { position:absolute; bottom:0; left:0; width:200%; height:100%; display:flex; }
  .ocean-track svg { flex-shrink:0; width:50%; height:100%; }
  .ocean-track--front { animation:ocean-scroll 18s linear infinite; }
  .ocean-track--back  { animation:ocean-scroll2 11s linear infinite; opacity:0.4; }

  /* Ship flotando sobre el mar */
  .naval-ship-scene {
    position:fixed; bottom:152px; left:50%; transform:translateX(-50%);
    z-index:2; pointer-events:none;
    animation:ship-bob 5s ease-in-out infinite, ship-enter 1s ease-out both;
  }

  /* Navbar compartido */
  .naval-nav {
    position:relative; z-index:20;
    display:flex; align-items:center; justify-content:space-between;
    padding:1rem 2rem;
    background:rgba(5,8,15,0.88); backdrop-filter:blur(12px);
    border-bottom:1px solid rgba(37,99,235,0.25);
    box-shadow:0 2px 20px rgba(0,0,0,0.4);
  }
  .naval-nav-brand { display:flex; align-items:center; gap:0.6rem; cursor:pointer; }
  .naval-nav-icon {
    display:flex; align-items:center; justify-content:center;
    width:40px; height:40px; background:#2563eb; border-radius:10px;
    box-shadow:0 0 16px rgba(37,99,235,0.4); flex-shrink:0;
  }
  .naval-nav-title {
    font-size:1.35rem; font-weight:900; letter-spacing:-0.04em;
    text-transform:uppercase; font-style:italic; color:#60a5fa; margin:0;
  }
  .naval-nav-title span { color:#fff; }
  .naval-nav-right { display:flex; align-items:center; gap:1rem; }
  .naval-nav-back {
    display:flex; align-items:center; gap:0.4rem;
    color:#9ca3af; text-decoration:none; font-size:0.875rem;
    transition:color 0.2s;
  }
  .naval-nav-back:hover { color:#60a5fa; }

  /* Contenedor principal de cada página */
  .naval-main {
    position:relative; z-index:10; flex:1;
    display:flex; flex-direction:column; align-items:center;
    padding:2.5rem 1.5rem 13rem;
    width:100%; box-sizing:border-box;
  }

  /* Títulos de sección */
  .naval-section-title {
    font-size:clamp(1.5rem,3.5vw,2.25rem); font-weight:900;
    letter-spacing:-0.04em; color:#fff; margin:0 0 0.4rem; text-align:center;
    animation:glow-pulse 3s ease-in-out infinite;
  }
  .naval-section-title span { color:#60a5fa; }
  .naval-section-sub { color:#9ca3af; font-size:0.9rem; text-align:center; margin:0 0 2rem; }

  /* Card base reutilizable */
  .naval-card {
    background:rgba(8,14,28,0.9); backdrop-filter:blur(12px);
    border:1px solid rgba(37,99,235,0.22); border-radius:1rem;
    transition:all 0.25s ease; position:relative; overflow:hidden;
  }
  .naval-card:hover {
    border-color:rgba(96,165,250,0.45); transform:translateY(-4px);
    box-shadow:0 16px 40px rgba(0,0,0,0.5),0 0 28px rgba(37,99,235,0.18);
  }
  .naval-card-bar {
    height:3px;
    background:linear-gradient(90deg,#1d4ed8,#60a5fa,#1d4ed8);
    background-size:200% 100%; animation:bar-slide 3s linear infinite;
  }

  /* Stat pill */
  .naval-stat {
    background:rgba(10,20,40,0.8); border:1px solid rgba(37,99,235,0.2);
    border-radius:0.875rem; padding:1rem 1.5rem; text-align:center;
    min-width:90px; backdrop-filter:blur(8px);
  }
  .naval-stat-num   { font-size:1.75rem; font-weight:900; color:#60a5fa; line-height:1; }
  .naval-stat-label { font-size:0.7rem; color:#6b7280; margin-top:0.2rem; text-transform:uppercase; letter-spacing:0.06em; }

  /* Spinner de carga */
  .naval-spinner {
    width:48px; height:48px;
    border:3px solid rgba(37,99,235,0.2); border-top-color:#3b82f6;
    border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto;
  }

  /* Radar decorativo */
  .naval-radar {
    position:fixed; bottom:1.25rem; right:1.25rem;
    width:72px; height:72px; opacity:0.18; pointer-events:none; z-index:5;
  }
  .naval-radar-ring {
    position:absolute; inset:0; border:2px solid #3b82f6; border-radius:50%;
    animation:ping-slow 3s cubic-bezier(0,0,0.2,1) infinite;
  }
  .naval-radar-ring:nth-child(2) { inset:8px;  border-color:#60a5fa; animation-delay:0.5s; }
  .naval-radar-ring:nth-child(3) { inset:16px; border-color:#93c5fd; animation-delay:1s; }

  @media(max-width:480px){
    .naval-main { padding:2rem 1rem 12rem; }
    .naval-nav  { padding:0.875rem 1rem; }
  }
`;

// ── Componente: Barco SVG ────────────────────────────────────
export const ShipSVG = ({ width = 220, height = 78 }) => (
    <svg width={width} height={height} viewBox="0 0 220 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 55 L36 40 L184 40 L202 55 L188 68 L32 68 Z" fill="#1e3a6e" stroke="#3b82f6" strokeWidth="1.5"/>
        <rect x="65" y="25" width="68" height="15" rx="3" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1"/>
        <rect x="85" y="12" width="36" height="14" rx="2" fill="#2563eb" stroke="#93c5fd" strokeWidth="1"/>
        <rect x="104" y="4"  width="10" height="11" rx="1" fill="#172554" stroke="#60a5fa" strokeWidth="1"/>
        <circle cx="109" cy="2"  r="4"   fill="#1e293b" opacity="0.7"/>
        <circle cx="104" cy="-2" r="2.8" fill="#1e293b" opacity="0.45"/>
        <line x1="96" y1="12" x2="96" y2="2"  stroke="#93c5fd" strokeWidth="1.5"/>
        <line x1="96" y1="4"  x2="114" y2="7" stroke="#93c5fd" strokeWidth="1"/>
        <circle cx="90"  cy="32" r="3.5" fill="#bfdbfe" opacity="0.9"/>
        <circle cx="103" cy="32" r="3.5" fill="#bfdbfe" opacity="0.9"/>
        <circle cx="116" cy="32" r="3.5" fill="#bfdbfe" opacity="0.7"/>
        <rect x="176" y="44" width="30" height="5" rx="2" fill="#1e3a6e" stroke="#3b82f6" strokeWidth="1"/>
        <line x1="32" y1="64" x2="188" y2="64" stroke="#60a5fa" strokeWidth="1" opacity="0.3"/>
        <path d="M40 70 Q110 75 180 70" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.22"/>
    </svg>
);

// ── Componente: Mar animado ──────────────────────────────────
const WaveShape = ({ color }) => (
    <path d="M0,60 C200,110 400,10 600,60 C800,110 1000,10 1200,60 L1200,120 L0,120 Z" fill={color}/>
);

export const OceanBG = () => (
    <div className="naval-ocean">
        <div className="ocean-track ocean-track--back">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none"><WaveShape color="#0c2040"/></svg>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none"><WaveShape color="#0c2040"/></svg>
        </div>
        <div className="ocean-track ocean-track--front">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none"><WaveShape color="#060e1e"/></svg>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none"><WaveShape color="#060e1e"/></svg>
        </div>
    </div>
);

// ── Componente: Radar decorativo ─────────────────────────────
export const RadarDeco = () => (
    <div className="naval-radar">
        <div className="naval-radar-ring"/>
        <div className="naval-radar-ring"/>
        <div className="naval-radar-ring"/>
    </div>
);

// ── Componente: Navbar compartido ────────────────────────────
// Usa Link de react-router-dom internamente
import { Link } from 'react-router-dom';

export const NavalNavbar = ({ rightSlot = null }) => (
    <nav className="naval-nav">
        <Link to="/dashboard" className="naval-nav-brand" style={{ textDecoration:'none' }}>
            <div className="naval-nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                    fill="none" stroke="white" strokeWidth="2.2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
            </div>
            <h1 className="naval-nav-title">Fleet <span>Rescue</span></h1>
        </Link>
        <div className="naval-nav-right">
            {rightSlot}
        </div>
    </nav>
);