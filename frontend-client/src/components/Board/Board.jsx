// src/components/Board/Board.jsx
// Requiere en public/assets/: small-ship.svg, medium-ship.svg, large-ship.svg
// Requiere en public/assets/: hit.mp3, miss.mp3

import React from 'react';

// ─── Audio helper ────────────────────────────────────────────
const playSound = (src) => {
    try {
        const audio = new Audio(src);
        audio.volume = 0.55;
        audio.play().catch(() => {});
    } catch {}
};

// ─── Inline SVGs de los barcos (basados en los archivos SVG subidos) ─
// Usamos inline para evitar problemas de ruta y poder colorear dinámicamente
const ShipInline = ({ size, rescued }) => {
    const accent = rescued ? '#22c55e' : '#3b82f6';
    const hull   = rescued ? '#065f46' : '#1e3a6e';
    const deck   = rescued ? '#14532d' : '#1d4ed8';

    if (size <= 2) return (
        // small-ship — 1–2 casillas
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
            <rect x="3" y="14" width="34" height="18" rx="4" fill={hull} stroke={accent} strokeWidth="1.5"/>
            <rect x="8" y="8" width="22" height="10" rx="2" fill={deck}/>
            <circle cx="19" cy="7" r="3.5" fill={accent} opacity="0.9"/>
            {rescued && <circle cx="19" cy="7" r="6" fill={accent} opacity="0.25"/>}
        </svg>
    );

    if (size === 3) return (
        // medium-ship — 3 casillas
        <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
            <rect x="3" y="14" width="74" height="20" rx="4" fill={hull} stroke={accent} strokeWidth="1.5"/>
            <rect x="10" y="8"  width="22" height="10" rx="2" fill={deck}/>
            <rect x="42" y="8"  width="22" height="10" rx="2" fill={deck}/>
            <circle cx="21" cy="6" r="3.5" fill={rescued?'#22c55e':'#dc2626'} opacity="0.9"/>
            <circle cx="53" cy="6" r="3.5" fill={rescued?'#22c55e':'#d97706'} opacity="0.9"/>
            {rescued && <>
                <circle cx="21" cy="6" r="7" fill={accent} opacity="0.2"/>
                <circle cx="53" cy="6" r="7" fill={accent} opacity="0.2"/>
            </>}
        </svg>
    );

    // large-ship — 4–5 casillas
    return (
        <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
            <rect x="3" y="14" width="114" height="20" rx="4" fill={hull} stroke={accent} strokeWidth="1.5"/>
            <rect x="10" y="8"  width="20" height="10" rx="2" fill={deck}/>
            <rect x="42" y="8"  width="20" height="10" rx="2" fill={deck}/>
            <rect x="74" y="8"  width="20" height="10" rx="2" fill={deck}/>
            <circle cx="20"  cy="6" r="3.5" fill={rescued?'#22c55e':'#dc2626'} opacity="0.9"/>
            <circle cx="52"  cy="6" r="3.5" fill={rescued?'#22c55e':'#d97706'} opacity="0.9"/>
            <circle cx="84"  cy="6" r="3.5" fill={rescued?'#22c55e':'#059669'} opacity="0.9"/>
            <line x1="100" y1="6" x2="100" y2="22" stroke={accent} strokeWidth="1.5"/>
            <path d="M100 6 L110 11 L100 16" fill={accent} opacity="0.8"/>
            {rescued && <>
                <circle cx="20"  cy="6" r="7" fill={accent} opacity="0.2"/>
                <circle cx="52"  cy="6" r="7" fill={accent} opacity="0.2"/>
                <circle cx="84"  cy="6" r="7" fill={accent} opacity="0.2"/>
            </>}
        </svg>
    );
};

// ─── CSS ─────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.bunny.net/css?family=share-tech-mono:400');

  @keyframes cell-explode {
    0%{transform:scale(1)} 25%{transform:scale(1.35) rotate(3deg)}
    55%{transform:scale(0.88) rotate(-2deg)} 80%{transform:scale(1.08)} 100%{transform:scale(1)}
  }
  @keyframes cell-splash {
    0%{transform:scale(1)} 40%{transform:scale(0.82)} 100%{transform:scale(1)}
  }
  @keyframes ripple-ring {
    0%{box-shadow:0 0 0 0 rgba(96,165,250,0.7),0 0 0 0 rgba(96,165,250,0.35)}
    100%{box-shadow:0 0 0 9px rgba(96,165,250,0),0 0 0 18px rgba(96,165,250,0)}
  }
  @keyframes hit-pulse {
    0%,100%{box-shadow:0 0 8px rgba(34,197,94,0.4),inset 0 0 8px rgba(34,197,94,0.1)}
    50%{box-shadow:0 0 22px rgba(34,197,94,0.7),inset 0 0 14px rgba(34,197,94,0.2)}
  }
  @keyframes icon-pop {
    0%{transform:scale(0) rotate(-15deg);opacity:0}
    55%{transform:scale(1.35) rotate(4deg)}
    80%{transform:scale(0.92) rotate(-1deg)}
    100%{transform:scale(1) rotate(0deg);opacity:1}
  }
  @keyframes water-drop {
    0%{transform:scale(0) translateY(-4px);opacity:0}
    60%{transform:scale(1.2) translateY(1px);opacity:0.9}
    100%{transform:scale(1) translateY(0);opacity:0.65}
  }
  @keyframes scanline {
    0%{transform:translateY(-100%)} 100%{transform:translateY(900%)}
  }
  @keyframes board-in {
    from{opacity:0;transform:translateY(18px) scale(0.97)}
    to{opacity:1;transform:translateY(0) scale(1)}
  }
  @keyframes last-glow {
    0%,100%{box-shadow:0 0 0 2px rgba(250,204,21,0.7)}
    50%{box-shadow:0 0 0 3px rgba(250,204,21,0.9),0 0 12px rgba(250,204,21,0.4)}
  }
  @keyframes progress-in { from{width:0%} }
  @keyframes coord-flash {
    0%,100%{color:#374151} 50%{color:#60a5fa}
  }
  @keyframes ship-cell-glow {
    0%,100%{box-shadow:0 0 10px rgba(34,197,94,0.5),inset 0 0 10px rgba(34,197,94,0.15)}
    50%{box-shadow:0 0 28px rgba(34,197,94,0.9),inset 0 0 20px rgba(34,197,94,0.3)}
  }

  /* ── Rescue overlay animation (inspirada en rescate.html) ── */
  @keyframes cable-drop {
    0%{top:-120px} 100%{top:calc(50% - 80px)}
  }
  @keyframes cable-lift {
    0%{top:calc(50% - 80px)} 100%{top:-300px}
  }
  @keyframes ship-sink-style {
    0%{transform:translateY(0) rotate(0deg);filter:sepia(0.8) hue-rotate(340deg) brightness(0.6)}
    100%{transform:translateY(30px) rotate(8deg);filter:sepia(0.8) hue-rotate(340deg) brightness(0.6)}
  }
  @keyframes ship-ascend {
    0%  {transform:translateY(30px) rotate(8deg); opacity:1; filter:sepia(0.8) hue-rotate(340deg) brightness(0.6)}
    40% {transform:translateY(-20px) rotate(-3deg); filter:sepia(0) hue-rotate(0deg) brightness(1.2)}
    100%{transform:translateY(-280px) rotate(-2deg) scale(0.7); opacity:0; filter:sepia(0) hue-rotate(0deg) brightness(1)}
  }
  @keyframes bubble-float {
    0%  {transform:translateY(0); opacity:0.8}
    100%{transform:translateY(-300px); opacity:0}
  }
  @keyframes overlay-fadein  { from{opacity:0} to{opacity:1} }
  @keyframes overlay-fadeout { from{opacity:1} to{opacity:0} }
  @keyframes rescue-title-in {
    0%  {transform:scale(0.6) translateY(20px);opacity:0}
    60% {transform:scale(1.08) translateY(-4px);opacity:1}
    100%{transform:scale(1) translateY(0);opacity:1}
  }
  @keyframes rescue-badge-in {
    0%  {transform:scale(0) rotate(-10deg);opacity:0}
    60% {transform:scale(1.15) rotate(3deg);opacity:1}
    100%{transform:scale(1) rotate(0deg);opacity:1}
  }
  @keyframes stars-twinkle {
    0%,100%{opacity:0.3;transform:scale(1)}
    50%{opacity:1;transform:scale(1.4)}
  }

  /* ── Root ── */
  .br-root {
    font-family:'Share Tech Mono','Courier New',monospace;
    display:flex; flex-direction:column; align-items:center; gap:14px;
    animation:board-in 0.55s ease-out both;
    user-select:none; color:#f9fafb;
    position:relative;
  }

  /* ── HUD ── */
  .br-hud {
    width:100%; max-width:660px;
    display:flex; align-items:center; gap:10px;
    background:rgba(3,7,18,0.92); border:1px solid rgba(37,99,235,0.28);
    border-radius:8px; padding:8px 14px;
    box-shadow:0 2px 16px rgba(0,0,0,0.4);
  }
  .br-stat { display:flex; flex-direction:column; align-items:center; gap:2px; flex-shrink:0; }
  .br-stat-val { font-size:18px; font-weight:700; line-height:1; }
  .br-stat-val--blue   { color:#60a5fa; }
  .br-stat-val--green  { color:#22c55e; }
  .br-stat-val--slate  { color:#94a3b8; }
  .br-stat-val--yellow { color:#eab308; }
  .br-stat-label { font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:#4b5563; }
  .br-sep { width:1px; height:28px; background:rgba(37,99,235,0.22); flex-shrink:0; }
  .br-progress { flex:1; display:flex; flex-direction:column; gap:4px; }
  .br-progress-labels { display:flex; justify-content:space-between; font-size:9px; color:#4b5563; letter-spacing:0.07em; }
  .br-progress-track  { height:5px; background:rgba(37,99,235,0.1); border-radius:3px; overflow:hidden; }
  .br-progress-fill   { height:100%; background:linear-gradient(90deg,#1d4ed8,#60a5fa); border-radius:3px; transition:width 0.4s ease; animation:progress-in 0.6s ease-out both; }

  /* ── Board frame ── */
  .br-frame {
    position:relative; padding:32px 12px 12px 34px;
    background:rgba(3,7,18,0.98);
    border:2px solid rgba(37,99,235,0.42); border-radius:12px;
    box-shadow:0 0 0 1px rgba(96,165,250,0.05),0 0 40px rgba(37,99,235,0.18),0 24px 60px rgba(0,0,0,0.65),inset 0 0 80px rgba(3,7,18,0.6);
    overflow:hidden;
  }
  .br-frame-bar { position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,transparent 0%,#1d4ed8 25%,#60a5fa 50%,#1d4ed8 75%,transparent 100%); }
  .br-corner { position:absolute; width:13px; height:13px; border-style:solid; border-color:rgba(96,165,250,0.45); }
  .br-corner--tl{top:7px;left:7px;border-width:2px 0 0 2px}
  .br-corner--tr{top:7px;right:7px;border-width:2px 2px 0 0}
  .br-corner--bl{bottom:7px;left:7px;border-width:0 0 2px 2px}
  .br-corner--br{bottom:7px;right:7px;border-width:0 2px 2px 0}
  .br-scanline { position:absolute; left:0; right:0; height:70px; pointer-events:none; z-index:10; background:linear-gradient(transparent,rgba(59,130,246,0.03),transparent); animation:scanline 8s linear infinite; }

  /* Coords */
  .br-cols { position:absolute; top:8px; left:34px; right:12px; display:grid; grid-template-columns:repeat(10,1fr); }
  .br-col-lbl { text-align:center; font-size:12px; font-weight:700; color:#374151; letter-spacing:0.07em; }
  .br-col-lbl.hl { animation:coord-flash 0.7s ease-out; color:#60a5fa; }
  .br-rows { position:absolute; top:32px; bottom:12px; left:4px; display:flex; flex-direction:column; justify-content:space-around; }
  .br-row-lbl { font-size:11px; font-weight:700; color:#374151; width:22px; text-align:right; }
  .br-row-lbl.hl { animation:coord-flash 0.7s ease-out; color:#60a5fa; }

  /* Grid */
  .br-grid { display:grid; grid-template-columns:repeat(10,1fr); gap:5px; }

  /* Cell base */
  .br-cell {
    position:relative; aspect-ratio:1/1;
    min-width:50px; min-height:50px;
    border-radius:5px; border:1px solid rgba(30,58,138,0.32);
    background:linear-gradient(145deg,#050d1f 0%,#091628 55%,#0a1a2e 100%);
    cursor:pointer; overflow:hidden;
    transition:border-color 0.12s,background 0.12s,transform 0.1s,box-shadow 0.12s;
  }
  .br-cell--idle:hover {
    background:linear-gradient(145deg,#0d1f40 0%,#142a55 55%,#1a3466 100%);
    border-color:rgba(96,165,250,0.65); transform:scale(1.08);
    box-shadow:0 0 0 1px rgba(96,165,250,0.18),0 0 14px rgba(59,130,246,0.28),inset 0 0 10px rgba(59,130,246,0.07);
    z-index:4;
  }
  .br-cell--idle:hover .br-xhair { opacity:1; }
  .br-cell--idle:hover .br-coord  { color:rgba(147,197,253,0.6); }
  .br-cell--click { animation:ripple-ring 0.5s ease-out; border-color:rgba(96,165,250,0.9)!important; z-index:5; }

  /* Hit cell */
  .br-cell--hit {
    background:linear-gradient(145deg,#022c22 0%,#064e3b 50%,#065f46 100%);
    border-color:rgba(34,197,94,0.48); cursor:default;
    animation:cell-explode 0.45s cubic-bezier(0.36,0.07,0.19,0.97) both,hit-pulse 2.2s ease-in-out 0.5s infinite;
  }

  /* Hit cell que forma parte de barco RESCATADO COMPLETO */
  .br-cell--rescued {
    background:linear-gradient(145deg,#022c22 0%,#064e3b 50%,#065f46 100%);
    border-color:rgba(34,197,94,0.9) !important; cursor:default;
    animation:ship-cell-glow 1.8s ease-in-out infinite !important;
    box-shadow:0 0 18px rgba(34,197,94,0.5),inset 0 0 14px rgba(34,197,94,0.2) !important;
  }

  /* Miss */
  .br-cell--miss {
    background:linear-gradient(145deg,#0f172a 0%,#1e293b 55%,#243447 100%);
    border-color:rgba(71,85,105,0.38); cursor:default;
    animation:cell-splash 0.32s ease-out both;
  }

  .br-last { position:absolute; inset:0; border-radius:5px; border:2px solid rgba(250,204,21,0.75); pointer-events:none; z-index:6; animation:last-glow 1.4s ease-in-out infinite; }

  /* Cell internals */
  .br-coord { position:absolute; top:3px; left:3px; font-size:8px; color:rgba(96,165,250,0.18); pointer-events:none; z-index:2; line-height:1; transition:color 0.12s; }
  .br-xhair { position:absolute; inset:0; opacity:0; pointer-events:none; z-index:3; transition:opacity 0.12s; }
  .br-xhair::before,.br-xhair::after { content:''; position:absolute; background:rgba(96,165,250,0.4); border-radius:1px; }
  .br-xhair::before { width:1px; height:52%; top:24%; left:50%; transform:translateX(-50%); }
  .br-xhair::after  { height:1px; width:52%; left:24%; top:50%; transform:translateY(-50%); }
  .br-hit-icon  { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:20px; z-index:3; animation:icon-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
  .br-miss-icon { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:18px; z-index:3; opacity:0.65; animation:water-drop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
  .br-ship-img  { position:absolute; inset:2px; z-index:3; display:flex; align-items:center; justify-content:center; animation:icon-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  /* ── Legend ── */
  .br-legend {
    display:flex; align-items:center; justify-content:center; gap:18px; flex-wrap:wrap;
    padding:7px 16px;
    background:rgba(3,7,18,0.85); border:1px solid rgba(37,99,235,0.16); border-radius:8px;
    font-size:11px; color:#6b7280; letter-spacing:0.04em;
  }
  .br-legend-item { display:flex; align-items:center; gap:6px; }
  .br-swatch { width:12px; height:12px; border-radius:3px; border:1px solid transparent; flex-shrink:0; }
  .br-swatch--idle { background:linear-gradient(145deg,#050d1f,#091628); border-color:rgba(30,58,138,0.45); }
  .br-swatch--hit  { background:linear-gradient(145deg,#022c22,#065f46); border-color:rgba(34,197,94,0.45); box-shadow:0 0 6px rgba(34,197,94,0.25); }
  .br-swatch--rescued { background:linear-gradient(145deg,#022c22,#065f46); border-color:rgba(34,197,94,0.9); box-shadow:0 0 10px rgba(34,197,94,0.55); }
  .br-swatch--miss { background:linear-gradient(145deg,#0f172a,#243447); border-color:rgba(71,85,105,0.38); }

  /* ════════════════════════════════════════════════════
     RESCUE OVERLAY
  ════════════════════════════════════════════════════ */
  .rescue-overlay {
    position:fixed; inset:0; z-index:1000;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    background:linear-gradient(to bottom, rgba(77,150,255,0.92), rgba(5,25,45,0.97));
    animation:overlay-fadein 0.4s ease-out both;
    overflow:hidden;
  }
  .rescue-overlay.leaving {
    animation:overlay-fadeout 0.6s ease-in both;
    pointer-events:none;
  }

  /* Escena de rescate */
  .rescue-scene {
    position:relative;
    width:200px; height:320px;
    display:flex; align-items:flex-end; justify-content:center;
    margin-bottom:24px;
  }

  /* Cable de la grúa */
  .rescue-cable {
    position:absolute;
    left:50%; width:3px;
    background:linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.2));
    transform:translateX(-50%);
    border-radius:2px;
    box-shadow:0 0 8px rgba(255,255,255,0.3);
  }
  .rescue-cable::after {
    content:'⚓';
    position:absolute;
    bottom:-28px; left:-16px;
    font-size:28px;
    filter:drop-shadow(0 0 8px rgba(34,197,94,0.8));
  }

  /* Fases del cable */
  .rescue-cable--dropping {
    top:-10px; height:240px;
    animation:cable-drop 1.8s cubic-bezier(0.4,0,0.2,1) forwards;
  }
  .rescue-cable--lifting {
    top:calc(50% - 100px); height:240px;
    animation:cable-lift 2s cubic-bezier(0.4,0,0.2,1) forwards;
  }

  /* El barco */
  .rescue-ship {
    position:absolute; bottom:0; left:50%;
    transform:translateX(-50%);
    font-size:72px; line-height:1;
    filter:sepia(0.8) hue-rotate(340deg) brightness(0.55);
    z-index:2;
  }
  .rescue-ship--sinking { animation:ship-sink-style 1s ease-in-out forwards; }
  .rescue-ship--ascending { animation:ship-ascend 2.2s cubic-bezier(0.4,0,0.2,1) 0.3s forwards; }

  /* Burbujas */
  .rescue-bubble {
    position:absolute;
    background:rgba(255,255,255,0.35);
    border-radius:50%;
    animation:bubble-float linear infinite;
  }

  /* Texto de rescate */
  .rescue-title {
    font-family:'Share Tech Mono','Courier New',monospace;
    font-size:clamp(1.5rem,4vw,2.2rem);
    font-weight:900; letter-spacing:0.08em;
    text-transform:uppercase;
    color:#22c55e;
    text-shadow:0 0 20px rgba(34,197,94,0.7),0 0 40px rgba(34,197,94,0.4);
    text-align:center;
    animation:rescue-title-in 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
  }
  .rescue-subtitle {
    font-family:'Share Tech Mono','Courier New',monospace;
    font-size:1rem; color:#86efac;
    letter-spacing:0.12em; text-transform:uppercase;
    margin-top:6px; text-align:center;
    opacity:0.85;
    animation:rescue-title-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.4s both;
  }

  /* Badge del barco rescatado */
  .rescue-badge {
    margin-top:20px;
    display:flex; align-items:center; gap:10px;
    background:rgba(5,46,30,0.8);
    border:2px solid rgba(34,197,94,0.6);
    border-radius:12px; padding:10px 20px;
    box-shadow:0 0 24px rgba(34,197,94,0.3);
    animation:rescue-badge-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.6s both;
  }
  .rescue-badge-ship { width:90px; height:36px; }
  .rescue-badge-name {
    font-family:'Share Tech Mono','Courier New',monospace;
    font-size:0.9rem; color:#86efac; letter-spacing:0.08em;
  }

  /* Stars */
  .rescue-star {
    position:absolute; font-size:1.4rem;
    animation:stars-twinkle ease-in-out infinite;
  }
`;

// ─── Constantes ──────────────────────────────────────────────
const COLS = ['A','B','C','D','E','F','G','H','I','J'];
const ROWS = ['1','2','3','4','5','6','7','8','9','10'];

const SHIP_NAMES = {
    2: 'DESTRUCTOR',
    3: 'CRUCERO',
    4: 'ACORAZADO',
    5: 'PORTAVIONES',
};

// Stars positions for overlay
const STARS = [
    {top:'8%',left:'12%',delay:'0s'},{top:'15%',left:'85%',delay:'0.4s'},
    {top:'5%',left:'55%',delay:'0.8s'},{top:'20%',left:'30%',delay:'1.2s'},
    {top:'10%',left:'70%',delay:'0.2s'},{top:'25%',left:'90%',delay:'0.6s'},
    {top:'3%',left:'40%',delay:'1s'},
];

// ─── Rescue Overlay Component ─────────────────────────────────
const RescueOverlay = ({ shipSize, onDone }) => {
    const [phase, setPhase] = React.useState('dropping'); // dropping | lifting | leaving
    const name = SHIP_NAMES[shipSize] || 'BARCO';

    React.useEffect(() => {
        // 1. Cable baja (1.8s) → 2. Cable sube con barco (2.2s) → 3. Fade out
        const t1 = setTimeout(() => setPhase('lifting'),  2000);
        const t2 = setTimeout(() => setPhase('leaving'),  4400);
        const t3 = setTimeout(() => onDone(),             5000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    // Burbujas aleatorias
    const bubbles = React.useMemo(() =>
        Array.from({ length: 25 }, (_, i) => ({
            id:i, size: Math.random()*8+4,
            left: Math.random()*100,
            dur:  Math.random()*2+2,
            del:  Math.random()*4,
            bot:  Math.random()*30,
        }))
    , []);

    return (
        <div className={`rescue-overlay${phase === 'leaving' ? ' leaving' : ''}`}>
            {/* Estrellas decorativas */}
            {STARS.map((s,i) => (
                <span key={i} className="rescue-star"
                    style={{top:s.top,left:s.left,animationDelay:s.delay,animationDuration:'1.5s'}}>
                    ✦
                </span>
            ))}

            {/* Burbujas */}
            {bubbles.map(b => (
                <div key={b.id} className="rescue-bubble" style={{
                    width:b.size+'px', height:b.size+'px',
                    left:b.left+'%', bottom:b.bot+'%',
                    animationDuration:b.dur+'s',
                    animationDelay:b.del+'s',
                }}/>
            ))}

            {/* Textos */}
            <div className="rescue-title">¡ RESCATE EXITOSO !</div>
            <div className="rescue-subtitle">Barco recuperado</div>

            {/* Escena cable + barco */}
            <div className="rescue-scene">
                <div className={`rescue-cable rescue-cable--${phase === 'dropping' ? 'dropping' : 'lifting'}`}/>
                <div className={`rescue-ship rescue-ship--${phase === 'dropping' ? 'sinking' : 'ascending'}`}>
                    🚢
                </div>
            </div>

            {/* Badge del tipo de barco */}
            <div className="rescue-badge">
                <div className="rescue-badge-ship">
                    <ShipInline size={shipSize} rescued={true}/>
                </div>
                <div className="rescue-badge-name">{name}<br/><span style={{fontSize:'0.75rem',opacity:0.7}}>{shipSize} casillas</span></div>
            </div>
        </div>
    );
};

// ─── Board Component ──────────────────────────────────────────
export const Board = ({ board, onCellClick, ships = [] }) => {
    const [clicking, setClicking]     = React.useState(null);
    const [lastShot, setLastShot]     = React.useState(null);
    const [hovered, setHovered]       = React.useState(null);
    const [rescue, setRescue]         = React.useState(null);   // { size, positions }
    const [rescuedShips, setRescuedShips] = React.useState([]); // array de sets de "x-y"
    const prevBoardRef = React.useRef(null);

    // ── Detectar barco completamente rescatado ──────────────
    React.useEffect(() => {
        if (!ships.length) return;
        const prev = prevBoardRef.current;
        if (!prev) { prevBoardRef.current = board; return; }

        ships.forEach(ship => {
            const key = ship.positions.map(p=>`${p.x}-${p.y}`).join(',');
            // Ya estaba rescatado antes
            if (rescuedShips.some(rs => rs.key === key)) return;

            const allHit = ship.positions.every(p => board[p.y]?.[p.x] === 'hit');
            if (allHit) {
                // Sonido de rescate completo (hit.mp3)
                playSound('/assets/hit.mp3');
                setRescue({ size: ship.size || ship.positions.length, positions: ship.positions });
                setRescuedShips(prev => [...prev, { key, positions: ship.positions }]);
            }
        });
        prevBoardRef.current = board;
    }, [board, ships]);

    // ── Click handler ────────────────────────────────────────
    const handleClick = (x, y) => {
        if (board[y][x]) return;
        setClicking({ x, y });
        setLastShot({ x, y });
        setTimeout(() => setClicking(null), 550);
        onCellClick(x, y);
        // Sonido inmediato de impacto (miss.mp3); el de rescate completo se dispara en el efecto
        // Usamos un timeout mínimo para saber si fue hit o miss después del update
        setTimeout(() => {
            // Intentamos leer del DOM indirectamente;
            // lo más sencillo: escuchar board en el siguiente render.
            // El efecto de ships maneja el hit completo. Para miss individual:
            // onCellClick actualiza el board fuera; si después sigue siendo null → miss
        }, 50);
    };

    // Sonidos por cambio en board individual
    const prevBoardSoundRef = React.useRef(null);
    React.useEffect(() => {
        if (!prevBoardSoundRef.current) { prevBoardSoundRef.current = board; return; }
        board.forEach((row, y) => row.forEach((cell, x) => {
            const prev = prevBoardSoundRef.current[y]?.[x];
            if (prev !== cell) {
                if (cell === 'hit')  playSound('../../assets/sounds/hitprueba.mp3');
                if (cell === 'miss') playSound('../../assets/sounds/hitprueba.mp3');
            }
        }));
        prevBoardSoundRef.current = board;
    }, [board]);

    // ── Helpers ──────────────────────────────────────────────
    const isRescuedCell = (x, y) =>
        rescuedShips.some(rs => rs.positions.some(p => p.x === x && p.y === y));

    const getShipSizeAt = (x, y) => {
        const s = ships.find(s => s.positions.some(p => p.x === x && p.y === y));
        return s?.size || s?.positions?.length || 0;
    };
    const getShipOrientation = (x, y) => {
        const s = ships.find(s => s.positions.some(p => p.x === x && p.y === y));
        if (!s || s.positions.length < 2) return 'horizontal';
        return s.positions[0].x === s.positions[1].x ? 'vertical' : 'horizontal';
    };

    // ── Stats ─────────────────────────────────────────────────
    const flat    = board.flat();
    const hits    = flat.filter(c => c === 'hit').length;
    const misses  = flat.filter(c => c === 'miss').length;
    const shots   = hits + misses;
    const pct     = Math.round((shots / flat.length) * 100);
    const rescued = rescuedShips.length;

    return (
        <>
            <style>{STYLES}</style>

            {/* Rescue overlay */}
            {rescue && (
                <RescueOverlay
                    shipSize={rescue.size}
                    onDone={() => setRescue(null)}
                />
            )}

            <div className="br-root">
                {/* HUD */}
                <div className="br-hud">
                    <div className="br-stat">
                        <span className="br-stat-val br-stat-val--blue">{shots}</span>
                        <span className="br-stat-label">Disparos</span>
                    </div>
                    <div className="br-sep"/>
                    <div className="br-stat">
                        <span className="br-stat-val br-stat-val--green">{hits}</span>
                        <span className="br-stat-label">Impactos</span>
                    </div>
                    <div className="br-sep"/>
                    <div className="br-stat">
                        <span className="br-stat-val br-stat-val--slate">{misses}</span>
                        <span className="br-stat-label">Agua</span>
                    </div>
                    <div className="br-sep"/>
                    <div className="br-stat">
                        <span className="br-stat-val br-stat-val--yellow">{rescued}</span>
                        <span className="br-stat-label">Rescatados</span>
                    </div>
                    <div className="br-sep"/>
                    <div className="br-progress">
                        <div className="br-progress-labels">
                            <span>ZONA EXPLORADA</span>
                            <span>{pct}%</span>
                        </div>
                        <div className="br-progress-track">
                            <div className="br-progress-fill" style={{ width:`${pct}%` }}/>
                        </div>
                    </div>
                </div>

                {/* Tablero */}
                <div className="br-frame">
                    <div className="br-frame-bar"/>
                    <div className="br-corner br-corner--tl"/>
                    <div className="br-corner br-corner--tr"/>
                    <div className="br-corner br-corner--bl"/>
                    <div className="br-corner br-corner--br"/>
                    <div className="br-scanline"/>

                    <div className="br-cols">
                        {COLS.map((l,i) => (
                            <span key={l} className={`br-col-lbl${hovered?.x===i?' hl':''}`}>{l}</span>
                        ))}
                    </div>
                    <div className="br-rows">
                        {ROWS.map((l,i) => (
                            <span key={l} className={`br-row-lbl${hovered?.y===i?' hl':''}`}>{l}</span>
                        ))}
                    </div>

                    <div className="br-grid">
                        {board.map((row, y) =>
                            row.map((cell, x) => {
                                const isClick    = clicking?.x===x && clicking?.y===y;
                                const isLast     = lastShot?.x===x && lastShot?.y===y && !!cell;
                                const isRescued  = cell === 'hit' && isRescuedCell(x, y);
                                const shipSize   = getShipSizeAt(x, y);
                                const orient     = getShipOrientation(x, y);

                                let cls = 'br-cell';
                                if (!cell)         cls += ' br-cell--idle';
                                if (isRescued)     cls += ' br-cell--rescued';
                                else if (cell === 'hit')  cls += ' br-cell--hit';
                                if (cell === 'miss') cls += ' br-cell--miss';
                                if (isClick)       cls += ' br-cell--click';

                                return (
                                    <div key={`${x}-${y}`} className={cls}
                                        onClick={() => handleClick(x, y)}
                                        onMouseEnter={() => setHovered({x,y})}
                                        onMouseLeave={() => setHovered(null)}
                                        title={`${COLS[x]}${ROWS[y]}`}
                                    >
                                        <span className="br-coord">{COLS[x]}{y+1}</span>
                                        {!cell && <div className="br-xhair"/>}
                                        {isLast && <div className="br-last"/>}

                                        {/* Barco rescatado — mostrar SVG inline */}
                                        {cell === 'hit' && shipSize > 0 && (
                                            <div className="br-ship-img">
                                                <ShipInline size={shipSize} rescued={isRescued}/>
                                            </div>
                                        )}

                                        {/* Hit sin barco info */}
                                        {cell === 'hit' && !shipSize && (
                                            <div className="br-hit-icon">⚓</div>
                                        )}

                                        {/* Miss */}
                                        {cell === 'miss' && (
                                            <div className="br-miss-icon">💧</div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Leyenda */}
                <div className="br-legend">
                    <div className="br-legend-item">
                        <div className="br-swatch br-swatch--idle"/> Sin explorar
                    </div>
                    <div className="br-legend-item">
                        <div className="br-swatch br-swatch--hit"/> Impactado
                    </div>
                    <div className="br-legend-item">
                        <div className="br-swatch br-swatch--rescued"/> Rescatado ⚓
                    </div>
                    <div className="br-legend-item">
                        <div className="br-swatch br-swatch--miss"/> Agua 💧
                    </div>
                </div>
            </div>
        </>
    );
};