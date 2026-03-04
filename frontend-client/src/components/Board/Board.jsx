// src/components/Board/Board.jsx
import React from 'react';

// ── SVGs de los barcos (inline, coloreados dinámicamente) ─────
const ShipSVG = ({ size, rescued }) => {
    const accent = rescued ? '#22c55e' : '#3b82f6';
    const hull   = rescued ? '#065f46' : '#1e3a6e';
    const deck   = rescued ? '#14532d' : '#1d4ed8';

    if (size <= 2) return (
        <svg viewBox="0 0 40 40" fill="none" style={{ width:'100%', height:'100%' }}>
            <rect x="3"  y="14" width="34" height="18" rx="4" fill={hull} stroke={accent} strokeWidth="1.5"/>
            <rect x="8"  y="8"  width="22" height="10" rx="2" fill={deck}/>
            <circle cx="19" cy="7" r="3.5" fill={accent} opacity="0.9"/>
            {rescued && <circle cx="19" cy="7" r="7" fill={accent} opacity="0.25"/>}
        </svg>
    );
    if (size === 3) return (
        <svg viewBox="0 0 80 40" fill="none" style={{ width:'100%', height:'100%' }}>
            <rect x="3"  y="14" width="74" height="20" rx="4" fill={hull} stroke={accent} strokeWidth="1.5"/>
            <rect x="10" y="8"  width="22" height="10" rx="2" fill={deck}/>
            <rect x="42" y="8"  width="22" height="10" rx="2" fill={deck}/>
            <circle cx="21" cy="6" r="3.5" fill={rescued ? '#22c55e' : '#dc2626'} opacity="0.9"/>
            <circle cx="53" cy="6" r="3.5" fill={rescued ? '#22c55e' : '#d97706'} opacity="0.9"/>
            {rescued && <><circle cx="21" cy="6" r="7" fill={accent} opacity="0.2"/><circle cx="53" cy="6" r="7" fill={accent} opacity="0.2"/></>}
        </svg>
    );
    return (
        <svg viewBox="0 0 120 40" fill="none" style={{ width:'100%', height:'100%' }}>
            <rect x="3"  y="14" width="114" height="20" rx="4" fill={hull} stroke={accent} strokeWidth="1.5"/>
            <rect x="10" y="8"  width="20"  height="10" rx="2" fill={deck}/>
            <rect x="42" y="8"  width="20"  height="10" rx="2" fill={deck}/>
            <rect x="74" y="8"  width="20"  height="10" rx="2" fill={deck}/>
            <circle cx="20" cy="6" r="3.5" fill={rescued ? '#22c55e' : '#dc2626'} opacity="0.9"/>
            <circle cx="52" cy="6" r="3.5" fill={rescued ? '#22c55e' : '#d97706'} opacity="0.9"/>
            <circle cx="84" cy="6" r="3.5" fill={rescued ? '#22c55e' : '#059669'} opacity="0.9"/>
            <line x1="100" y1="6" x2="100" y2="22" stroke={accent} strokeWidth="1.5"/>
            <path d="M100 6 L110 11 L100 16" fill={accent} opacity="0.8"/>
            {rescued && <><circle cx="20" cy="6" r="7" fill={accent} opacity="0.2"/><circle cx="52" cy="6" r="7" fill={accent} opacity="0.2"/><circle cx="84" cy="6" r="7" fill={accent} opacity="0.2"/></>}
        </svg>
    );
};

// ── CSS ───────────────────────────────────────────────────────
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
  @keyframes ship-cell-glow {
    0%,100%{box-shadow:0 0 10px rgba(34,197,94,0.5),inset 0 0 10px rgba(34,197,94,0.15)}
    50%{box-shadow:0 0 28px rgba(34,197,94,0.9),inset 0 0 20px rgba(34,197,94,0.3)}
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
  @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(900%)} }
  @keyframes board-in { from{opacity:0;transform:translateY(18px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes last-glow {
    0%,100%{box-shadow:0 0 0 2px rgba(250,204,21,0.7)}
    50%{box-shadow:0 0 0 3px rgba(250,204,21,0.9),0 0 12px rgba(250,204,21,0.4)}
  }
  @keyframes progress-in { from{width:0%} }
  @keyframes coord-flash { 0%,100%{color:#374151} 50%{color:#60a5fa} }

  /* ── RESCUE OVERLAY ── */
  @keyframes cable-drop  { 0%{top:-120px} 100%{top:calc(50% - 80px)} }
  @keyframes cable-lift  { 0%{top:calc(50% - 80px)} 100%{top:-320px} }
  @keyframes ship-tilt   { 0%{transform:translateX(-50%) translateY(0) rotate(0deg)} 100%{transform:translateX(-50%) translateY(20px) rotate(8deg)} }
  @keyframes ship-ascend {
    0%  {transform:translateX(-50%) translateY(20px) rotate(8deg);filter:sepia(0.8) hue-rotate(340deg) brightness(0.6)}
    40% {transform:translateX(-50%) translateY(-30px) rotate(-3deg);filter:sepia(0) brightness(1.3)}
    100%{transform:translateX(-50%) translateY(-320px) rotate(-2deg) scale(0.7);opacity:0;filter:sepia(0) brightness(1)}
  }
  @keyframes bubble-rise { 0%{transform:translateY(0);opacity:0.8} 100%{transform:translateY(-340px);opacity:0} }
  @keyframes overlay-in  { from{opacity:0} to{opacity:1} }
  @keyframes overlay-out { from{opacity:1} to{opacity:0} }
  @keyframes title-pop {
    0%{transform:scale(0.6) translateY(20px);opacity:0}
    60%{transform:scale(1.08) translateY(-4px);opacity:1}
    100%{transform:scale(1) translateY(0);opacity:1}
  }
  @keyframes badge-pop {
    0%{transform:scale(0) rotate(-10deg);opacity:0}
    60%{transform:scale(1.12) rotate(3deg);opacity:1}
    100%{transform:scale(1) rotate(0deg);opacity:1}
  }
  @keyframes twinkle { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.5)} }

  /* ── WIN OVERLAY ── */
  @keyframes confetti-fall {
    0%  {transform:translateY(-20px) rotate(0deg);opacity:1}
    100%{transform:translateY(100vh) rotate(720deg);opacity:0}
  }
  @keyframes win-title {
    0%{transform:scale(0.5);opacity:0}
    70%{transform:scale(1.1)}
    100%{transform:scale(1);opacity:1}
  }
  @keyframes countdown { from{width:100%} to{width:0%} }

  /* ── ROOT ── */
  .br-root {
    font-family:'Share Tech Mono','Courier New',monospace;
    display:flex; flex-direction:column; align-items:center; gap:14px;
    animation:board-in 0.55s ease-out both;
    user-select:none; color:#f9fafb; position:relative;
  }

  /* HUD */
  .br-hud {
    width:100%; max-width:700px;
    display:flex; align-items:center; gap:10px;
    background:rgba(3,7,18,0.92); border:1px solid rgba(37,99,235,0.28);
    border-radius:8px; padding:8px 14px; box-shadow:0 2px 16px rgba(0,0,0,0.4);
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
  .br-progress-fill   { height:100%; background:linear-gradient(90deg,#1d4ed8,#60a5fa); border-radius:3px; transition:width 0.4s ease; }

  /* FRAME */
  .br-frame {
    position:relative; padding:32px 12px 12px 34px;
    background:rgba(3,7,18,0.98); border:2px solid rgba(37,99,235,0.42); border-radius:12px;
    box-shadow:0 0 0 1px rgba(96,165,250,0.05),0 0 40px rgba(37,99,235,0.18),0 24px 60px rgba(0,0,0,0.65);
    overflow:hidden;
  }
  .br-frame-bar { position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,transparent,#1d4ed8 25%,#60a5fa 50%,#1d4ed8 75%,transparent); }
  .br-corner { position:absolute; width:13px; height:13px; border-style:solid; border-color:rgba(96,165,250,0.45); }
  .br-corner--tl{top:7px;left:7px;border-width:2px 0 0 2px}
  .br-corner--tr{top:7px;right:7px;border-width:2px 2px 0 0}
  .br-corner--bl{bottom:7px;left:7px;border-width:0 0 2px 2px}
  .br-corner--br{bottom:7px;right:7px;border-width:0 2px 2px 0}
  .br-scanline { position:absolute; left:0; right:0; height:70px; pointer-events:none; z-index:10; background:linear-gradient(transparent,rgba(59,130,246,0.03),transparent); animation:scanline 8s linear infinite; }

  .br-cols { position:absolute; top:8px; left:34px; right:12px; display:grid; grid-template-columns:repeat(10,1fr); }
  .br-col-lbl { text-align:center; font-size:12px; font-weight:700; color:#374151; letter-spacing:0.07em; }
  .br-col-lbl.hl { color:#60a5fa; animation:coord-flash 0.7s ease-out; }
  .br-rows { position:absolute; top:32px; bottom:12px; left:4px; display:flex; flex-direction:column; justify-content:space-around; }
  .br-row-lbl { font-size:11px; font-weight:700; color:#374151; width:22px; text-align:right; }
  .br-row-lbl.hl { color:#60a5fa; animation:coord-flash 0.7s ease-out; }

  .br-grid { display:grid; grid-template-columns:repeat(10,1fr); gap:5px; }

  /* CELL */
  .br-cell {
    position:relative; aspect-ratio:1/1; min-width:50px; min-height:50px;
    border-radius:5px; border:1px solid rgba(30,58,138,0.32);
    background:linear-gradient(145deg,#050d1f 0%,#091628 55%,#0a1a2e 100%);
    cursor:pointer; overflow:hidden;
    transition:border-color 0.12s,background 0.12s,transform 0.1s,box-shadow 0.12s;
  }
  .br-cell--idle:hover {
    background:linear-gradient(145deg,#0d1f40 0%,#142a55 55%,#1a3466 100%);
    border-color:rgba(96,165,250,0.65); transform:scale(1.08);
    box-shadow:0 0 0 1px rgba(96,165,250,0.18),0 0 14px rgba(59,130,246,0.28);
    z-index:4;
  }
  .br-cell--idle:hover .br-xhair { opacity:1; }
  .br-cell--idle:hover .br-coord  { color:rgba(147,197,253,0.6); }
  .br-cell--click { animation:ripple-ring 0.5s ease-out; border-color:rgba(96,165,250,0.9)!important; z-index:5; }
  .br-cell--hit {
    background:linear-gradient(145deg,#022c22 0%,#064e3b 50%,#065f46 100%);
    border-color:rgba(34,197,94,0.48); cursor:default;
    animation:cell-explode 0.45s cubic-bezier(0.36,0.07,0.19,0.97) both, hit-pulse 2.2s ease-in-out 0.5s infinite;
  }
  .br-cell--rescued {
    background:linear-gradient(145deg,#022c22 0%,#064e3b 50%,#065f46 100%);
    border-color:rgba(34,197,94,0.9)!important; cursor:default;
    animation:ship-cell-glow 1.8s ease-in-out infinite!important;
    box-shadow:0 0 18px rgba(34,197,94,0.5),inset 0 0 14px rgba(34,197,94,0.2)!important;
  }
  .br-cell--miss {
    background:linear-gradient(145deg,#0f172a 0%,#1e293b 55%,#243447 100%);
    border-color:rgba(71,85,105,0.38); cursor:default;
    animation:cell-splash 0.32s ease-out both;
  }
  .br-last { position:absolute; inset:0; border-radius:5px; border:2px solid rgba(250,204,21,0.75); pointer-events:none; z-index:6; animation:last-glow 1.4s ease-in-out infinite; }
  .br-coord { position:absolute; top:3px; left:3px; font-size:8px; color:rgba(96,165,250,0.18); pointer-events:none; z-index:2; line-height:1; transition:color 0.12s; }
  .br-xhair { position:absolute; inset:0; opacity:0; pointer-events:none; z-index:3; transition:opacity 0.12s; }
  .br-xhair::before,.br-xhair::after { content:''; position:absolute; background:rgba(96,165,250,0.4); border-radius:1px; }
  .br-xhair::before { width:1px; height:52%; top:24%; left:50%; transform:translateX(-50%); }
  .br-xhair::after  { height:1px; width:52%; left:24%; top:50%; transform:translateY(-50%); }
  .br-hit-icon  { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:20px; z-index:3; animation:icon-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
  .br-miss-icon { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:18px; z-index:3; opacity:0.65; animation:water-drop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
  .br-ship-img  { position:absolute; inset:2px; z-index:3; display:flex; align-items:center; justify-content:center; animation:icon-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  /* LEGEND */
  .br-legend {
    display:flex; align-items:center; justify-content:center; gap:18px; flex-wrap:wrap;
    padding:7px 16px; background:rgba(3,7,18,0.85);
    border:1px solid rgba(37,99,235,0.16); border-radius:8px;
    font-size:11px; color:#6b7280; letter-spacing:0.04em;
  }
  .br-legend-item { display:flex; align-items:center; gap:6px; }
  .br-swatch { width:12px; height:12px; border-radius:3px; border:1px solid transparent; flex-shrink:0; }
  .br-swatch--idle    { background:linear-gradient(145deg,#050d1f,#091628); border-color:rgba(30,58,138,0.45); }
  .br-swatch--hit     { background:linear-gradient(145deg,#022c22,#065f46); border-color:rgba(34,197,94,0.45); }
  .br-swatch--rescued { background:linear-gradient(145deg,#022c22,#065f46); border-color:rgba(34,197,94,0.9); box-shadow:0 0 8px rgba(34,197,94,0.5); }
  .br-swatch--miss    { background:linear-gradient(145deg,#0f172a,#243447); border-color:rgba(71,85,105,0.38); }

  /* ══ RESCUE OVERLAY ══════════════════════════════════════ */
  .resc-overlay {
    position:fixed; inset:0; z-index:1000;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    background:linear-gradient(to bottom,rgba(30,100,220,0.94),rgba(5,20,45,0.97));
    overflow:hidden;
    animation:overlay-in 0.35s ease-out both;
  }
  .resc-overlay.resc-leaving { animation:overlay-out 0.55s ease-in both; pointer-events:none; }

  .resc-scene {
    position:relative; width:220px; height:340px;
    display:flex; align-items:flex-end; justify-content:center; margin-bottom:16px;
  }

  .resc-cable {
    position:absolute; left:50%; transform:translateX(-50%);
    width:3px; border-radius:2px;
    background:linear-gradient(to bottom,rgba(255,255,255,0.7),rgba(255,255,255,0.15));
    box-shadow:0 0 8px rgba(255,255,255,0.25);
  }
  .resc-cable::after {
    content:'⚓'; position:absolute; bottom:-30px; left:-18px;
    font-size:30px; filter:drop-shadow(0 0 10px rgba(34,197,94,0.9));
  }
  .resc-cable--dropping { top:-20px; height:260px; animation:cable-drop 1.8s cubic-bezier(0.4,0,0.2,1) forwards; }
  .resc-cable--lifting  { top:calc(50% - 100px); height:260px; animation:cable-lift 2s cubic-bezier(0.4,0,0.2,1) forwards; }

  .resc-ship {
    position:absolute; bottom:0; left:50%;
    transform:translateX(-50%);
    font-size:76px; line-height:1;
    filter:sepia(0.8) hue-rotate(340deg) brightness(0.55);
    z-index:2;
  }
  .resc-ship--tilting  { animation:ship-tilt 1s ease-in-out forwards; }
  .resc-ship--ascending{ animation:ship-ascend 2.2s cubic-bezier(0.4,0,0.2,1) 0.3s forwards; }

  .resc-bubble {
    position:absolute; background:rgba(255,255,255,0.3);
    border-radius:50%; animation:bubble-rise linear infinite;
  }
  .resc-star { position:absolute; font-size:1.3rem; animation:twinkle ease-in-out infinite; }

  .resc-title {
    font-family:'Share Tech Mono',monospace;
    font-size:clamp(1.4rem,4vw,2rem); font-weight:900;
    letter-spacing:0.1em; text-transform:uppercase; color:#22c55e; text-align:center;
    text-shadow:0 0 20px rgba(34,197,94,0.7),0 0 40px rgba(34,197,94,0.4);
    animation:title-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.15s both;
  }
  .resc-sub {
    font-family:'Share Tech Mono',monospace;
    font-size:0.9rem; color:#86efac; letter-spacing:0.12em; text-transform:uppercase;
    margin-top:5px; text-align:center; opacity:0.85;
    animation:title-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.35s both;
  }
  .resc-badge {
    margin-top:18px; display:flex; align-items:center; gap:12px;
    background:rgba(5,46,30,0.85); border:2px solid rgba(34,197,94,0.55);
    border-radius:12px; padding:10px 20px;
    box-shadow:0 0 24px rgba(34,197,94,0.3);
    animation:badge-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.55s both;
  }
  .resc-badge-ship  { width:90px; height:34px; }
  .resc-badge-name  { font-family:'Share Tech Mono',monospace; font-size:0.9rem; color:#86efac; letter-spacing:0.07em; }
  .resc-badge-size  { font-size:0.72rem; color:#4ade80; opacity:0.75; }

  /* ══ WIN OVERLAY ═════════════════════════════════════════ */
  .win-overlay {
    position:fixed; inset:0; z-index:1001;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    background:linear-gradient(135deg,rgba(5,46,30,0.97),rgba(3,10,25,0.98));
    overflow:hidden; animation:overlay-in 0.4s ease-out both;
  }
  .win-confetti {
    position:absolute; width:10px; height:10px; border-radius:2px;
    animation:confetti-fall linear forwards;
  }
  .win-title {
    font-family:'Share Tech Mono',monospace;
    font-size:clamp(2rem,5vw,3rem); font-weight:900;
    color:#22c55e; letter-spacing:0.06em; text-align:center; margin:0;
    text-shadow:0 0 30px rgba(34,197,94,0.8),0 0 60px rgba(34,197,94,0.4);
    animation:win-title 0.7s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .win-sub {
    font-family:'Share Tech Mono',monospace;
    font-size:1rem; color:#86efac; letter-spacing:0.1em; margin-top:8px; text-align:center;
    animation:title-pop 0.5s ease-out 0.3s both;
  }
  .win-ships {
    display:flex; gap:12px; margin-top:20px; flex-wrap:wrap; justify-content:center;
    animation:title-pop 0.5s ease-out 0.5s both;
  }
  .win-ship-chip {
    background:rgba(5,46,30,0.8); border:1px solid rgba(34,197,94,0.5);
    border-radius:8px; padding:6px 14px; font-size:0.75rem; color:#4ade80;
    letter-spacing:0.06em; font-family:'Share Tech Mono',monospace;
  }
  .win-countdown {
    margin-top:24px; width:280px; height:4px;
    background:rgba(34,197,94,0.15); border-radius:2px; overflow:hidden;
    animation:title-pop 0.4s ease-out 0.7s both;
  }
  .win-countdown-bar {
    height:100%; background:linear-gradient(90deg,#16a34a,#22c55e);
    border-radius:2px;
    animation:countdown 4s linear 1s forwards;
  }
  .win-redirect-label {
    font-size:0.75rem; color:#4b5563; letter-spacing:0.08em; margin-top:6px;
    font-family:'Share Tech Mono',monospace;
    animation:title-pop 0.4s ease-out 0.8s both;
  }
`;

// ── Constantes ────────────────────────────────────────────────
const COLS = ['A','B','C','D','E','F','G','H','I','J'];
const ROWS = ['1','2','3','4','5','6','7','8','9','10'];
const SHIP_NAMES = { 2:'DESTRUCTOR', 3:'CRUCERO', 4:'ACORAZADO', 5:'PORTAVIONES' };
const STARS = [
    {top:'6%',left:'10%',d:'0s'},{top:'12%',left:'82%',d:'0.4s'},
    {top:'4%',left:'52%',d:'0.8s'},{top:'18%',left:'28%',d:'1.2s'},
    {top:'8%',left:'68%',d:'0.2s'},{top:'22%',left:'88%',d:'0.6s'},
    {top:'2%',left:'38%',d:'1s'},
];
const CONFETTI_COLORS = ['#22c55e','#60a5fa','#eab308','#f97316','#a78bfa','#34d399'];

// ── RescueOverlay ─────────────────────────────────────────────
const RescueOverlay = ({ ship, onDone }) => {
    const [phase, setPhase] = React.useState('dropping');
    const name = SHIP_NAMES[ship.size] || 'BARCO';

    React.useEffect(() => {
        const t1 = setTimeout(() => setPhase('lifting'),  2000);
        const t2 = setTimeout(() => setPhase('leaving'),  4400);
        const t3 = setTimeout(() => onDone(),             5000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    const bubbles = React.useMemo(() =>
        Array.from({ length: 28 }, (_, i) => ({
            id: i,
            size: Math.random() * 8 + 4,
            left: Math.random() * 100,
            dur:  Math.random() * 2 + 2,
            del:  Math.random() * 4,
            bot:  Math.random() * 25,
        }))
    , []);

    return (
        <div className={`resc-overlay${phase === 'leaving' ? ' resc-leaving' : ''}`}>
            {STARS.map((s, i) => (
                <span key={i} className="resc-star"
                    style={{ top:s.top, left:s.left, animationDelay:s.d, animationDuration:'1.6s' }}>
                    ✦
                </span>
            ))}
            {bubbles.map(b => (
                <div key={b.id} className="resc-bubble" style={{
                    width: b.size+'px', height: b.size+'px',
                    left: b.left+'%', bottom: b.bot+'%',
                    animationDuration: b.dur+'s', animationDelay: b.del+'s',
                }}/>
            ))}

            <div className="resc-title">¡ RESCATE EXITOSO !</div>
            <div className="resc-sub">Barco recuperado</div>

            <div className="resc-scene">
                <div className={`resc-cable resc-cable--${phase === 'dropping' ? 'dropping' : 'lifting'}`}/>
                <div className={`resc-ship resc-ship--${phase === 'dropping' ? 'tilting' : 'ascending'}`}>
                    🚢
                </div>
            </div>

            <div className="resc-badge">
                <div className="resc-badge-ship">
                    <ShipSVG size={ship.size} rescued={true}/>
                </div>
                <div>
                    <div className="resc-badge-name">{name}</div>
                    <div className="resc-badge-size">{ship.size} casillas</div>
                </div>
            </div>
        </div>
    );
};

// ── WinOverlay ────────────────────────────────────────────────
const WinOverlay = ({ sunkShips, onRedirect }) => {
    React.useEffect(() => {
        // Redirigir al ranking después de 5 segundos
        const t = setTimeout(() => onRedirect(), 5000);
        return () => clearTimeout(t);
    }, []);

    const confetti = React.useMemo(() =>
        Array.from({ length: 40 }, (_, i) => ({
            id: i,
            color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            left:  Math.random() * 100,
            delay: Math.random() * 2,
            dur:   Math.random() * 2 + 2,
            size:  Math.random() * 8 + 6,
        }))
    , []);

    return (
        <div className="win-overlay">
            {confetti.map(c => (
                <div key={c.id} className="win-confetti" style={{
                    background: c.color,
                    left: c.left+'%', top: '-20px',
                    width: c.size+'px', height: c.size+'px',
                    animationDuration: c.dur+'s',
                    animationDelay: c.delay+'s',
                }}/>
            ))}

            <div style={{ fontSize:'4rem', marginBottom:'8px' }}>🏆</div>
            <h2 className="win-title">¡ MISIÓN CUMPLIDA !</h2>
            <p className="win-sub">Has rescatado toda la flota</p>

            <div className="win-ships">
                {sunkShips.map((s, i) => (
                    <div key={i} className="win-ship-chip">
                        {SHIP_NAMES[s.size] || 'BARCO'} ✓
                    </div>
                ))}
            </div>

            <div className="win-countdown">
                <div className="win-countdown-bar"/>
            </div>
            <div className="win-redirect-label">Redirigiendo al ranking...</div>
        </div>
    );
};

// ── Board ─────────────────────────────────────────────────────
export const Board = ({ board, onCellClick, ships = [], gameWon = false, onGameWon }) => {
    const [clicking, setClicking]   = React.useState(null);
    const [lastShot, setLastShot]   = React.useState(null);
    const [hovered, setHovered]     = React.useState(null);

    // Cola de rescates pendientes de mostrar (un overlay a la vez)
    const [rescueQueue, setRescueQueue] = React.useState([]);
    const [showingRescue, setShowingRescue] = React.useState(null);

    // Seguimiento de qué barcos ya se mostraron
    const shownKeysRef = React.useRef(new Set());

    // Encolar nuevos barcos rescatados
    React.useEffect(() => {
        ships.forEach(ship => {
            const key = ship.positions?.map(p => `${p.x}-${p.y}`).join(',') || ship.type;
            if (!shownKeysRef.current.has(key)) {
                shownKeysRef.current.add(key);
                setRescueQueue(q => [...q, { ...ship, _key: key }]);
            }
        });
    }, [ships]);

    // Mostrar de uno en uno
    React.useEffect(() => {
        if (!showingRescue && rescueQueue.length > 0) {
            setShowingRescue(rescueQueue[0]);
            setRescueQueue(q => q.slice(1));
        }
    }, [rescueQueue, showingRescue]);

    const handleRescueDone = () => setShowingRescue(null);

    // Click
    const handleClick = (x, y) => {
        if (board[y][x] || gameWon) return;
        setClicking({ x, y });
        setLastShot({ x, y });
        setTimeout(() => setClicking(null), 550);
        onCellClick(x, y);
    };

    // Helpers
    const isRescuedCell = (x, y) =>
        ships.some(s => s.positions?.some(p => p.x === x && p.y === y));

    const getShipSize = (x, y) => {
        const s = ships.find(s => s.positions?.some(p => p.x === x && p.y === y));
        return s?.size || s?.positions?.length || 0;
    };

    // Stats
    const flat   = board.flat();
    const hits   = flat.filter(c => c === 'hit').length;
    const misses = flat.filter(c => c === 'miss').length;
    const shots  = hits + misses;
    const pct    = Math.round((shots / flat.length) * 100);

    return (
        <>
            <style>{STYLES}</style>

            {/* Rescue overlay (barco individual) */}
            {showingRescue && !gameWon && (
                <RescueOverlay ship={showingRescue} onDone={handleRescueDone}/>
            )}

            {/* Win overlay (todos rescatados) */}
            {gameWon && (
                <WinOverlay
                    sunkShips={ships}
                    onRedirect={() => onGameWon?.()}
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
                        <span className="br-stat-val br-stat-val--yellow">{ships.length}</span>
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
                        {COLS.map((l, i) => (
                            <span key={l} className={`br-col-lbl${hovered?.x === i ? ' hl' : ''}`}>{l}</span>
                        ))}
                    </div>
                    <div className="br-rows">
                        {ROWS.map((l, i) => (
                            <span key={l} className={`br-row-lbl${hovered?.y === i ? ' hl' : ''}`}>{l}</span>
                        ))}
                    </div>

                    <div className="br-grid">
                        {board.map((row, y) =>
                            row.map((cell, x) => {
                                const isClick   = clicking?.x === x && clicking?.y === y;
                                const isLast    = lastShot?.x === x && lastShot?.y === y && !!cell;
                                const isRescued = cell === 'hit' && isRescuedCell(x, y);
                                const shipSize  = getShipSize(x, y);

                                let cls = 'br-cell';
                                if (!cell)          cls += ' br-cell--idle';
                                if (isRescued)      cls += ' br-cell--rescued';
                                else if (cell === 'hit')  cls += ' br-cell--hit';
                                if (cell === 'miss') cls += ' br-cell--miss';
                                if (isClick)        cls += ' br-cell--click';

                                return (
                                    <div key={`${x}-${y}`} className={cls}
                                        onClick={() => handleClick(x, y)}
                                        onMouseEnter={() => setHovered({ x, y })}
                                        onMouseLeave={() => setHovered(null)}
                                        title={`${COLS[x]}${ROWS[y]}`}
                                    >
                                        <span className="br-coord">{COLS[x]}{y + 1}</span>
                                        {!cell && <div className="br-xhair"/>}
                                        {isLast && <div className="br-last"/>}

                                        {cell === 'hit' && shipSize > 0 && (
                                            <div className="br-ship-img">
                                                <ShipSVG size={shipSize} rescued={isRescued}/>
                                            </div>
                                        )}
                                        {cell === 'hit' && !shipSize && (
                                            <div className="br-hit-icon">⚓</div>
                                        )}
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
                    <div className="br-legend-item"><div className="br-swatch br-swatch--idle"/> Sin explorar</div>
                    <div className="br-legend-item"><div className="br-swatch br-swatch--hit"/> Impactado</div>
                    <div className="br-legend-item"><div className="br-swatch br-swatch--rescued"/> Rescatado ⚓</div>
                    <div className="br-legend-item"><div className="br-swatch br-swatch--miss"/> Agua 💧</div>
                </div>
            </div>
        </>
    );
};