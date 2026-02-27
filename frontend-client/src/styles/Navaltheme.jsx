// src/styles/Navaltheme.jsx
// ─────────────────────────────────────────────────────────────
//  Estilos y componentes compartidos por todas las páginas con soporte para tema claro/oscuro
// ─────────────────────────────────────────────────────────────

// ── Variables CSS para temas ─────────────────────────────────
export const themeVariables = `
  :root {
    /* Tema oscuro (default) - Tonos azules oscuros */
    --bg-primary: #05080f;
    --bg-secondary: #0a1424;
    --bg-card: rgba(8, 14, 28, 0.95);
    --bg-nav: rgba(5, 8, 15, 0.95);
    --text-primary: #ffffff;
    --text-secondary: #e2e8f0;
    --text-muted: #94a3b8;
    --text-dim: #64748b;
    --border-color: rgba(37, 99, 235, 0.3);
    --border-hover: rgba(59, 130, 246, 0.6);
    --accent-primary: #2563eb;
    --accent-secondary: #3b82f6;
    --accent-glow: rgba(37, 99, 235, 0.3);
    --ocean-deep: #0a1424;
    --ocean-surface: #1e293b;
  }

  :root[data-theme="light"] {
    /* Tema claro - Tonos azules claros y blancos */
    --bg-primary: #e8f0fe;
    --bg-secondary: #ffffff;
    --bg-card: rgba(255, 255, 255, 0.95);
    --bg-nav: rgba(255, 255, 255, 0.95);
    --text-primary: #0a1424;
    --text-secondary: #1e293b;
    --text-muted: #334155;
    --text-dim: #475569;
    --border-color: rgba(37, 99, 235, 0.2);
    --border-hover: rgba(37, 99, 235, 0.4);
    --accent-primary: #2563eb;
    --accent-secondary: #3b82f6;
    --accent-glow: rgba(37, 99, 235, 0.15);
    --ocean-deep: #b8d1f0;
    --ocean-surface: #90b4e6;
  }
`;

// ── CSS base compartido con variables ────────────────────────
export const navalBase = `
  @import url('https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700');

  * {
    transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, color 0.2s ease;
  }

  /* Keyframes */
  @keyframes ocean-scroll  { 0%{transform:translateX(0)}    100%{transform:translateX(-50%)} }
  @keyframes ocean-scroll2 { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
  @keyframes ship-bob      { 0%,100%{transform:translateY(0px) rotate(-0.8deg)} 50%{transform:translateY(-8px) rotate(0.8deg)} }
  @keyframes ship-enter    { from{opacity:0;transform:translateX(-80px)} to{opacity:1;transform:translateX(0)} }
  @keyframes fadeInUp      { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ping-slow     { 75%,100%{transform:scale(1.5);opacity:0} }
  @keyframes bar-slide     { 0%{background-position:0% 0} 100%{background-position:200% 0} }
  @keyframes glow-pulse    { 0%,100%{text-shadow:0 0 15px var(--accent-glow)} 50%{text-shadow:0 0 30px var(--accent-secondary)} }
  @keyframes spin          { to{transform:rotate(360deg)} }

  /* Página base */
  .naval-page {
    font-family:'Instrument Sans',ui-sans-serif,system-ui,sans-serif;
    min-height:100vh; 
    background: var(--bg-primary); 
    color: var(--text-primary);
    position:relative; 
    overflow-x:hidden;
    display:flex; 
    flex-direction:column;
  }

  /* Grid decorativo de fondo */
  .naval-page::before {
    content:''; 
    position:fixed; 
    inset:0;
    background-image:
      linear-gradient(var(--accent-secondary) 0.5px, transparent 0.5px),
      linear-gradient(90deg, var(--accent-secondary) 0.5px, transparent 0.5px);
    background-size:40px 40px; 
    opacity: 0.08; 
    pointer-events:none; 
    z-index:0;
  }

  /* Mar */
  .naval-ocean {
    position:fixed; 
    bottom:0; 
    left:0; 
    width:100%; 
    height:180px;
    pointer-events:none; 
    z-index:1; 
    overflow:hidden;
  }

  .ocean-track {
    position:absolute; 
    bottom:0; 
    left:0; 
    width:200%; 
    height:100%; 
    display:flex;
  }

  .ocean-track svg {
    flex-shrink:0; 
    width:50%; 
    height:100%;
  }

  .ocean-track--front { 
    animation:ocean-scroll 22s linear infinite; 
    opacity:0.9;
  }

  .ocean-track--back { 
    animation:ocean-scroll2 15s linear infinite; 
    opacity:0.4;
  }

  /* Barco flotante */
  .naval-ship-scene {
    position:fixed; 
    bottom:140px; 
    left:50%; 
    transform:translateX(-50%);
    z-index:2; 
    pointer-events:none;
    animation:ship-bob 5s ease-in-out infinite, ship-enter 1s ease-out both;
    filter: drop-shadow(0 5px 15px rgba(0,0,0,0.3));
    opacity:0.9;
  }

  [data-theme="light"] .naval-ship-scene {
    filter: drop-shadow(0 5px 15px rgba(0,0,0,0.15));
    opacity:1;
  }

  /* Navbar */
  .naval-nav {
    position:relative; 
    z-index:20;
    display:flex; 
    align-items:center; 
    justify-content:space-between;
    padding:0.75rem 2rem;
    background: var(--bg-nav);
    backdrop-filter:blur(10px);
    border-bottom:2px solid var(--accent-primary);
    box-shadow:0 2px 15px rgba(0,0,0,0.2);
  }

  .naval-nav-brand { 
    display:flex; 
    align-items:center; 
    gap:0.75rem; 
    text-decoration:none; 
  }

  .naval-nav-icon {
    display:flex; 
    align-items:center; 
    justify-content:center;
    width:38px; 
    height:38px; 
    background: var(--accent-primary); 
    border-radius:8px;
    box-shadow:0 0 12px var(--accent-glow); 
    flex-shrink:0;
  }

  .naval-nav-icon svg {
    width:20px;
    height:20px;
    stroke: white;
  }

  .naval-nav-title {
    font-size:1.3rem; 
    font-weight:900; 
    letter-spacing:-0.03em;
    text-transform:uppercase; 
    font-style:italic; 
    color: var(--accent-secondary); 
    margin:0;
  }

  .naval-nav-title span { 
    color: var(--text-primary); 
  }

  .naval-nav-right { 
    display:flex; 
    align-items:center; 
    gap:1.25rem; 
  }

  .naval-user-name {
    font-size:0.9rem;
    color: var(--text-muted);
  }

  .naval-user-name strong {
    color: var(--accent-secondary);
    font-weight:600;
  }

  .naval-nav-back {
    display:flex; 
    align-items:center; 
    gap:0.3rem;
    color: var(--text-muted); 
    text-decoration:none; 
    font-size:0.9rem;
    font-weight:500;
    transition:color 0.2s;
    padding:0.3rem 0.8rem;
    border-radius:6px;
    background: var(--bg-card);
    border:1px solid var(--border-color);
  }

  .naval-nav-back:hover { 
    color: var(--accent-secondary);
    border-color: var(--accent-secondary);
    background: var(--bg-secondary);
  }

  /* Contenedor principal */
  .naval-main {
    position:relative; 
    z-index:10; 
    flex:1;
    display:flex; 
    flex-direction:column; 
    align-items:center;
    padding:2rem 1.5rem 10rem;
    width:100%; 
    max-width:1200px;
    margin:0 auto;
    box-sizing:border-box;
  }

  /* Títulos */
  .naval-section-title {
    font-size:clamp(1.6rem,4vw,2.3rem); 
    font-weight:900;
    letter-spacing:-0.03em; 
    color: var(--text-primary); 
    margin:0 0 0.3rem; 
    text-align:center;
  }

  .naval-section-title span { 
    color: var(--accent-secondary); 
  }

  .naval-section-sub { 
    color: var(--text-muted); 
    font-size:0.95rem; 
    text-align:center; 
    margin:0 0 2rem; 
  }

  /* Cards */
  .naval-card {
    background: var(--bg-card); 
    backdrop-filter:blur(8px);
    border:1px solid var(--border-color); 
    border-radius:1rem;
    transition:all 0.25s ease; 
    overflow:hidden;
  }

  .naval-card:hover {
    border-color: var(--accent-secondary); 
    transform:translateY(-3px);
    box-shadow:0 10px 25px rgba(0,0,0,0.15);
  }

  .naval-card-bar {
    height:3px;
    background:linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), var(--accent-primary));
    background-size:200% 100%; 
    animation:bar-slide 3s linear infinite;
  }

  /* Stats */
  .naval-stat {
    background: var(--bg-card); 
    border:1px solid var(--border-color);
    border-radius:0.75rem; 
    padding:0.8rem 1.2rem; 
    text-align:center;
    min-width:85px; 
  }

  .naval-stat-num { 
    font-size:1.6rem; 
    font-weight:900; 
    color: var(--accent-secondary); 
    line-height:1; 
  }

  .naval-stat-label { 
    font-size:0.65rem; 
    color: var(--text-dim); 
    margin-top:0.2rem; 
    text-transform:uppercase; 
    letter-spacing:0.05em; 
  }

  /* Spinner */
  .naval-spinner {
    width:45px; 
    height:45px;
    border:3px solid var(--border-color); 
    border-top-color: var(--accent-primary);
    border-radius:50%; 
    animation:spin 0.8s linear infinite; 
  }

  /* Radar decorativo */
  .naval-radar {
    position:fixed; 
    bottom:1rem; 
    right:1rem;
    width:65px; 
    height:65px; 
    opacity:0.15; 
    pointer-events:none; 
    z-index:5;
  }

  .naval-radar-ring {
    position:absolute; 
    inset:0; 
    border:1.5px solid var(--accent-secondary); 
    border-radius:50%;
    animation:ping-slow 3s cubic-bezier(0,0,0.2,1) infinite;
  }

  .naval-radar-ring:nth-child(2) { 
    inset:7px;  
    border-color: var(--accent-primary); 
    animation-delay:0.5s; 
  }

  .naval-radar-ring:nth-child(3) { 
    inset:14px; 
    border-color: var(--text-muted); 
    animation-delay:1s; 
  }

  @media(max-width:640px){
    .naval-main { padding:1.5rem 1rem 8rem; }
    .naval-nav  { padding:0.75rem 1rem; }
    .naval-nav-right { gap:0.75rem; }
    .naval-user-name { display:none; }
  }
`;

// ── Componente: Barco SVG ────────────────────────────────
export const ShipSVG = ({ width = 200, height = 70 }) => (
    <svg width={width} height={height} viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 50 L32 35 L168 35 L185 50 L172 62 L28 62 Z" fill="var(--accent-primary)" stroke="var(--accent-secondary)" strokeWidth="1.5" opacity="0.9"/>
        <rect x="58" y="22" width="62" height="14" rx="3" fill="var(--accent-primary)" stroke="var(--accent-secondary)" strokeWidth="1"/>
        <rect x="78" y="10" width="32" height="12" rx="2" fill="var(--accent-secondary)" stroke="#93c5fd" strokeWidth="1"/>
        <rect x="94" y="3" width="9" height="9" rx="1" fill="#172554" stroke="var(--accent-secondary)" strokeWidth="1"/>
        <circle cx="98" cy="1.5" r="3" fill="#1e293b" opacity="0.6"/>
        <circle cx="102" cy="12" r="2.5" fill="white" opacity="0.8"/>
        <circle cx="115" cy="12" r="2.5" fill="white" opacity="0.8"/>
    </svg>
);

// ── Componente: Mar animado ──────────────────────────────────
const WaveShape = ({ className }) => (
    <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className={className}>
        <path d="M0,50 C200,80 400,20 600,50 C800,80 1000,20 1200,50 L1200,100 L0,100 Z" fill="currentColor"/>
    </svg>
);

export const OceanBG = () => (
    <div className="naval-ocean">
        <div className="ocean-track ocean-track--back" style={{color: 'var(--ocean-deep)'}}>
            <WaveShape />
            <WaveShape />
        </div>
        <div className="ocean-track ocean-track--front" style={{color: 'var(--ocean-surface)'}}>
            <WaveShape />
            <WaveShape />
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