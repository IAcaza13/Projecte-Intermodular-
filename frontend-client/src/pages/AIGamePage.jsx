// src/pages/AIGamePage.jsx
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAIGame } from '../hooks/useAIGame';
import { ShipPlacer } from '../components/Board/Shipplacer';
import { RescueOverlay, WinOverlay } from '../components/Board/Board';
import { navalBase, OceanBG, RadarDeco, ThemeToggleBtn } from '../styles/Navaltheme';

import destroyerSrc  from '../assets/ships/destroyer.svg';
import cruiserSrc    from '../assets/ships/cruiser.svg';
import submarineSrc  from '../assets/ships/submarine.svg';
import battleshipSrc from '../assets/ships/battleship.svg';
import carrierSrc    from '../assets/ships/carrier.svg';

const SHIP_IMG = {
    CARRIER: carrierSrc, BATTLESHIP: battleshipSrc,
    CRUISER: cruiserSrc, SUBMARINE: submarineSrc, DESTROYER: destroyerSrc,
};
const SHIP_NAMES_ES = {
    CARRIER:'Portaviones', BATTLESHIP:'Acorazado',
    CRUISER:'Crucero', SUBMARINE:'Submarino', DESTROYER:'Destructor',
};
const COLS = ['A','B','C','D','E','F','G','H','I','J'];
const ROWS = ['1','2','3','4','5','6','7','8','9','10'];

// ── Filtro CSS por estado ─────────────────────────────────────
const FILTER_BLUE  = 'brightness(0) saturate(100%) invert(55%) sepia(40%) saturate(400%) hue-rotate(190deg) brightness(1.05)';
const FILTER_GREEN = 'brightness(0) saturate(100%) invert(62%) sepia(60%) saturate(500%) hue-rotate(95deg) brightness(1.1) drop-shadow(0 0 4px rgba(34,197,94,0.8))';
const FILTER_RED   = 'brightness(0) saturate(100%) invert(30%) sepia(80%) saturate(600%) hue-rotate(340deg) brightness(0.9)';

const styles = navalBase + `
  /* ── Layout ── */
  .ai-wrap {
    width:100%; display:flex; flex-direction:column; align-items:center;
    gap:1.25rem; animation:fadeInUp 0.5s ease-out both;
  }

  /* ── Message bar ── */
  .ai-msg {
    width:100%; max-width:1100px;
    background:rgba(8,14,28,0.9); border:1px solid rgba(37,99,235,0.25);
    border-radius:0.875rem; padding:0.75rem 1.25rem;
    display:flex; align-items:center; gap:0.75rem;
    font-weight:600; font-size:0.9rem; color:#e2e8f0; min-height:48px;
    box-sizing:border-box;
  }
  .ai-msg-dot {
    width:10px; height:10px; border-radius:50%; flex-shrink:0;
    background:#3b82f6; box-shadow:0 0 8px rgba(59,130,246,0.7);
    animation:ping-slow 1.5s ease-in-out infinite;
  }
  .ai-msg-dot--thinking { background:#eab308!important; box-shadow:0 0 8px rgba(234,179,8,0.7)!important; }
  .ai-msg-dot--hit      { background:#22c55e!important; box-shadow:0 0 8px rgba(34,197,94,0.7)!important; }
  .ai-msg-dot--miss     { background:#94a3b8!important; box-shadow:none!important; animation:none!important; }

  /* ── Dual boards layout ── */
  .ai-boards {
    display:flex; gap:2rem; flex-wrap:wrap; justify-content:center;
    align-items:flex-start; width:100%; max-width:1100px;
  }
  .ai-board-col { display:flex; flex-direction:column; align-items:center; gap:0.75rem; }
  .ai-board-label {
    font-family:'Share Tech Mono',monospace;
    font-size:0.78rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase;
    padding:4px 14px; border-radius:20px;
  }
  .ai-board-label--attack  { background:rgba(37,99,235,0.15); color:#60a5fa; border:1px solid rgba(37,99,235,0.3); }
  .ai-board-label--defense { background:rgba(239,68,68,0.1);  color:#f87171; border:1px solid rgba(239,68,68,0.25); }

  /* ── Mini board (defensa, no clickable) ── */
  .ai-mini-frame {
    position:relative; padding:26px 8px 8px 28px;
    background:rgba(3,7,18,0.95); border:2px solid rgba(239,68,68,0.25);
    border-radius:10px; box-shadow:0 0 20px rgba(239,68,68,0.08);
  }
  .ai-mini-frame .br-frame-bar { background:linear-gradient(90deg,transparent,#dc2626 25%,#f87171 50%,#dc2626 75%,transparent); }

  /* ── Sunk ship list ── */
  .ai-sunk-list {
    display:flex; flex-wrap:wrap; gap:0.4rem; justify-content:center;
    max-width:520px;
  }
  .ai-sunk-chip {
    display:flex; align-items:center; gap:5px;
    padding:3px 10px; border-radius:20px; font-size:0.7rem; font-weight:700;
    font-family:'Share Tech Mono',monospace; letter-spacing:0.04em;
  }
  .ai-sunk-chip--attack  { background:rgba(34,197,94,0.12); color:#4ade80; border:1px solid rgba(34,197,94,0.3); }
  .ai-sunk-chip--defense { background:rgba(239,68,68,0.12); color:#f87171; border:1px solid rgba(239,68,68,0.25); }
  .ai-sunk-chip img { width:28px; height:11px; object-fit:contain; }

  /* ── End screen ── */
  .ai-end {
    position:fixed; inset:0; z-index:900;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    overflow:hidden; animation:overlay-fadein 0.4s ease-out both;
  }
  .ai-end--won  { background:linear-gradient(135deg,rgba(5,46,30,0.97),rgba(3,10,25,0.98)); }
  .ai-end--lost { background:linear-gradient(135deg,rgba(46,5,5,0.97),rgba(25,3,3,0.98)); }
  @keyframes overlay-fadein { from{opacity:0} to{opacity:1} }
  @keyframes confetti-fall  { 0%{transform:translateY(-20px) rotate(0);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
  @keyframes end-title { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }

  .ai-end-confetti { position:absolute; border-radius:2px; animation:confetti-fall linear forwards; }
  .ai-end-icon  { font-size:5rem; margin-bottom:0.5rem; }
  .ai-end-title {
    font-family:'Share Tech Mono',monospace; font-size:clamp(1.8rem,5vw,2.8rem);
    font-weight:900; letter-spacing:0.08em; text-align:center; margin:0;
    animation:end-title 0.7s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .ai-end-title--won  { color:#22c55e; text-shadow:0 0 30px rgba(34,197,94,0.8); }
  .ai-end-title--lost { color:#ef4444; text-shadow:0 0 30px rgba(239,68,68,0.8); }
  .ai-end-sub   { font-family:'Share Tech Mono',monospace; font-size:0.9rem; color:#9ca3af; margin:0.5rem 0 1.5rem; letter-spacing:0.08em; text-align:center; }
  .ai-end-actions { display:flex; gap:0.75rem; flex-wrap:wrap; justify-content:center; }

  .ai-btn {
    padding:0.75rem 1.75rem; font-size:0.9rem; font-weight:700; border-radius:0.75rem;
    border:none; cursor:pointer; font-family:inherit; transition:all 0.2s;
    display:inline-flex; align-items:center; gap:0.5rem; text-decoration:none;
  }
  .ai-btn--primary { background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff; box-shadow:0 4px 16px rgba(37,99,235,0.4); }
  .ai-btn--primary:hover { transform:scale(1.04); box-shadow:0 8px 24px rgba(37,99,235,0.55); }
  .ai-btn--ghost  { background:rgba(8,14,28,0.85); border:1px solid rgba(37,99,235,0.3); color:#94a3b8; }
  .ai-btn--ghost:hover  { background:rgba(15,25,50,0.9); color:#cbd5e1; }

  /* ── Board cells shared ── */
  @import url('https://fonts.bunny.net/css?family=share-tech-mono:400');
  @keyframes cell-explode {
    0%{transform:scale(1)} 25%{transform:scale(1.35) rotate(3deg)}
    55%{transform:scale(0.88)} 100%{transform:scale(1)}
  }
  @keyframes cell-splash { 0%{transform:scale(1)} 40%{transform:scale(0.82)} 100%{transform:scale(1)} }
  @keyframes hit-pulse {
    0%,100%{box-shadow:0 0 8px rgba(34,197,94,0.4)} 50%{box-shadow:0 0 22px rgba(34,197,94,0.7)}
  }
  @keyframes ai-hit-pulse {
    0%,100%{box-shadow:0 0 8px rgba(239,68,68,0.4)} 50%{box-shadow:0 0 22px rgba(239,68,68,0.7)}
  }
  @keyframes last-glow {
    0%,100%{box-shadow:0 0 0 2px rgba(250,204,21,0.7)} 50%{box-shadow:0 0 0 3px rgba(250,204,21,1),0 0 12px rgba(250,204,21,0.4)}
  }
  @keyframes ripple-ring {
    0%{box-shadow:0 0 0 0 rgba(96,165,250,0.7)} 100%{box-shadow:0 0 0 10px rgba(96,165,250,0)}
  }
  @keyframes icon-pop { 0%{transform:scale(0) rotate(-15deg);opacity:0} 60%{transform:scale(1.3)} 100%{transform:scale(1);opacity:1} }
  @keyframes water-drop { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2);opacity:0.9} 100%{transform:scale(1);opacity:0.65} }
  @keyframes coord-flash { 0%,100%{color:#374151} 50%{color:#60a5fa} }
  @keyframes ship-cell-glow {
    0%,100%{box-shadow:0 0 10px rgba(34,197,94,0.5)} 50%{box-shadow:0 0 28px rgba(34,197,94,0.9)}
  }
  @keyframes ai-last-glow {
    0%,100%{box-shadow:0 0 0 2px rgba(248,113,113,0.7)} 50%{box-shadow:0 0 0 3px rgba(248,113,113,1),0 0 12px rgba(248,113,113,0.4)}
  }

  .br-root { font-family:'Share Tech Mono',monospace; display:flex; flex-direction:column; align-items:center; gap:10px; color:#f9fafb; }
  .br-frame {
    position:relative; padding:28px 10px 10px 30px;
    background:rgba(3,7,18,0.98); border:2px solid rgba(37,99,235,0.42); border-radius:10px;
    box-shadow:0 0 30px rgba(37,99,235,0.15); overflow:hidden;
  }
  .br-frame-bar { position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,transparent,#1d4ed8 25%,#60a5fa 50%,#1d4ed8 75%,transparent); }
  .br-cols { position:absolute; top:6px; left:30px; right:10px; display:grid; grid-template-columns:repeat(10,1fr); }
  .br-col-lbl { text-align:center; font-size:10px; font-weight:700; color:#374151; }
  .br-col-lbl.hl { color:#60a5fa; animation:coord-flash 0.7s ease-out; }
  .br-rows { position:absolute; top:28px; bottom:10px; left:3px; display:flex; flex-direction:column; justify-content:space-around; }
  .br-row-lbl { font-size:9px; font-weight:700; color:#374151; width:20px; text-align:right; }
  .br-row-lbl.hl { color:#60a5fa; animation:coord-flash 0.7s ease-out; }
  .br-grid { display:grid; grid-template-columns:repeat(10,1fr); gap:3px; }

  /* Células ataque */
  .br-cell {
    position:relative; width:42px; height:42px; border-radius:4px;
    border:1px solid rgba(30,58,138,0.32);
    background:linear-gradient(145deg,#050d1f,#091628);
    cursor:pointer; overflow:hidden; transition:all 0.1s;
  }
  .br-cell--idle:hover { background:linear-gradient(145deg,#0d1f40,#142a55); border-color:rgba(96,165,250,0.6); transform:scale(1.1); z-index:4; }
  .br-cell--idle:hover .br-xhair { opacity:1; }
  .br-cell--click { animation:ripple-ring 0.5s ease-out; }
  .br-cell--hit   { background:linear-gradient(145deg,#022c22,#065f46); border-color:rgba(34,197,94,0.5); cursor:default; animation:cell-explode 0.4s both, hit-pulse 2s ease-in-out 0.5s infinite; }
  .br-cell--miss  { background:linear-gradient(145deg,#0f172a,#1e293b); border-color:rgba(71,85,105,0.38); cursor:default; animation:cell-splash 0.3s both; }
  .br-cell--sunk  { border-color:rgba(34,197,94,0.9)!important; animation:ship-cell-glow 1.8s ease-in-out infinite!important; box-shadow:0 0 14px rgba(34,197,94,0.4)!important; }
  .br-last-attack { position:absolute; inset:0; border-radius:4px; border:2px solid rgba(250,204,21,0.8); pointer-events:none; z-index:6; animation:last-glow 1.4s ease-in-out infinite; }

  /* Células defensa */
  .df-cell {
    position:relative; width:42px; height:42px; border-radius:4px;
    border:1px solid rgba(30,58,138,0.2); background:linear-gradient(145deg,#050d1f,#091628);
    cursor:default; overflow:hidden;
  }
  .df-cell--ship  { background:linear-gradient(145deg,#0a1f3d,#0d2a52)!important; border-color:rgba(37,99,235,0.4)!important; }
  .df-cell--hit   { background:linear-gradient(145deg,#3b0000,#5c0a0a)!important; border-color:rgba(239,68,68,0.5)!important; animation:cell-explode 0.4s both, ai-hit-pulse 2s ease-in-out 0.5s infinite; }
  .df-cell--miss  { background:linear-gradient(145deg,#0f172a,#1e293b)!important; border-color:rgba(71,85,105,0.3)!important; animation:cell-splash 0.3s both; }
  .df-cell--sunk  { border-color:rgba(239,68,68,0.85)!important; box-shadow:0 0 12px rgba(239,68,68,0.35)!important; }
  .df-last { position:absolute; inset:0; border-radius:4px; border:2px solid rgba(248,113,113,0.85); pointer-events:none; z-index:6; animation:ai-last-glow 1.2s ease-in-out infinite; }

  /* Shared internals */
  .br-coord { position:absolute; top:2px; left:2px; font-size:7px; color:rgba(96,165,250,0.15); pointer-events:none; z-index:2; }
  .br-xhair { position:absolute; inset:0; opacity:0; pointer-events:none; z-index:3; }
  .br-xhair::before,.br-xhair::after { content:''; position:absolute; background:rgba(96,165,250,0.4); border-radius:1px; }
  .br-xhair::before { width:1px; height:50%; top:25%; left:50%; transform:translateX(-50%); }
  .br-xhair::after  { height:1px; width:50%; left:25%; top:50%; transform:translateY(-50%); }
  .br-hit-icon  { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:18px; z-index:3; animation:icon-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
  .br-miss-icon { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:16px; z-index:3; opacity:0.6; animation:water-drop 0.4s both; }
  .br-ship-img  { position:absolute; inset:1px; z-index:3; display:flex; align-items:center; justify-content:center; animation:icon-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
`;

// ── Confetti para pantalla final ──────────────────────────────
const CONFETTI_COLORS = ['#22c55e','#60a5fa','#eab308','#f97316','#a78bfa','#ef4444'];
function Confetti({ won }) {
    const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        left:  Math.random() * 100,
        delay: Math.random() * 2,
        dur:   Math.random() * 2 + 2,
        size:  Math.random() * 8 + 5,
    }));
    return pieces.map(c => (
        <div key={c.id} className="ai-end-confetti" style={{
            background: c.color, left: c.left+'%', top: '-20px',
            width: c.size+'px', height: c.size+'px',
            animationDuration: c.dur+'s', animationDelay: c.delay+'s',
        }}/>
    ));
}

// ── Tablero de ATAQUE (el jugador dispara aquí) ───────────────
function AttackBoard({ board, aiShips, aiSunk, onShoot, aiThinking, lastShot }) {
    const [hovered, setHovered] = useState(null);
    const [clicking, setClicking] = useState(null);

    const isSunkCell = (x, y) => aiSunk.some(s => s.positions.some(p => p.x === x && p.y === y));
    const getShipAt  = (x, y) => aiSunk.find(s => s.positions.some(p => p.x === x && p.y === y));

    const handleClick = (x, y) => {
        if (board[y][x] || aiThinking) return;
        setClicking({ x, y });
        setTimeout(() => setClicking(null), 500);
        onShoot(x, y);
    };

    return (
        <div className="br-root">
            <div className="br-frame">
                <div className="br-frame-bar"/>
                <div className="br-cols">{COLS.map((l, i) => <span key={l} className={`br-col-lbl${hovered?.x===i?' hl':''}`}>{l}</span>)}</div>
                <div className="br-rows">{ROWS.map((l, i) => <span key={l} className={`br-row-lbl${hovered?.y===i?' hl':''}`}>{l}</span>)}</div>
                <div className="br-grid">
                    {board.map((row, y) => row.map((cell, x) => {
                        const isClick  = clicking?.x===x && clicking?.y===y;
                        const isLast   = lastShot?.x===x && lastShot?.y===y && !!cell;
                        const isSunk   = cell==='hit' && isSunkCell(x, y);
                        const shipHere = getShipAt(x, y);

                        let cls = 'br-cell';
                        if (!cell)        cls += ' br-cell--idle';
                        if (isSunk)       cls += ' br-cell--sunk';
                        else if (cell==='hit')  cls += ' br-cell--hit';
                        if (cell==='miss') cls += ' br-cell--miss';
                        if (isClick)      cls += ' br-cell--click';

                        return (
                            <div key={`${x}-${y}`} className={cls}
                                onClick={() => handleClick(x, y)}
                                onMouseEnter={() => setHovered({x,y})}
                                onMouseLeave={() => setHovered(null)}
                                title={`${COLS[x]}${y+1}`}
                            >
                                <span className="br-coord">{COLS[x]}{y+1}</span>
                                {!cell && <div className="br-xhair"/>}
                                {isLast && <div className="br-last-attack"/>}
                                {cell==='hit' && shipHere && (
                                    <div className="br-ship-img">
                                        <img src={SHIP_IMG[shipHere.type]} alt={shipHere.type}
                                            style={{ width:'100%', height:'100%', objectFit:'contain', filter: FILTER_GREEN }}/>
                                    </div>
                                )}
                                {cell==='hit' && !shipHere && <div className="br-hit-icon">⚓</div>}
                                {cell==='miss' && <div className="br-miss-icon">💧</div>}
                            </div>
                        );
                    }))}
                </div>
            </div>
        </div>
    );
}

// ── Tablero de DEFENSA (tablero del jugador, donde dispara la IA) ─
function DefenseBoard({ board, playerShips, playerSunk, lastAiShot }) {
    const isSunkCell  = (x, y) => playerSunk.some(s => s.positions.some(p => p.x===x && p.y===y));
    const isShipCell  = (x, y) => playerShips.some(s => s.positions.some(p => p.x===x && p.y===y));
    const getShipAt   = (x, y) => playerShips.find(s => s.positions.some(p => p.x===x && p.y===y));

    return (
        <div className="br-root">
            <div className="br-frame ai-mini-frame">
                <div className="br-frame-bar"/>
                <div className="br-cols">{COLS.map(l => <span key={l} className="br-col-lbl">{l}</span>)}</div>
                <div className="br-rows">{ROWS.map(l => <span key={l} className="br-row-lbl">{l}</span>)}</div>
                <div className="br-grid">
                    {board.map((row, y) => row.map((cell, x) => {
                        const isLast  = lastAiShot?.x===x && lastAiShot?.y===y;
                        const isSunk  = isSunkCell(x, y);
                        const hasShip = isShipCell(x, y);
                        const ship    = getShipAt(x, y);

                        let cls = 'df-cell';
                        if (hasShip && !cell)  cls += ' df-cell--ship';
                        if (isSunk)            cls += ' df-cell--sunk';
                        else if (cell==='hit') cls += ' df-cell--hit';
                        if (cell==='miss')     cls += ' df-cell--miss';

                        return (
                            <div key={`${x}-${y}`} className={cls}>
                                {isLast && <div className="df-last"/>}
                                {hasShip && !cell && ship && (
                                    <div className="br-ship-img">
                                        <img src={SHIP_IMG[ship.type]} alt={ship.type}
                                            style={{ width:'100%', height:'100%', objectFit:'contain', filter: isSunk ? FILTER_RED : FILTER_BLUE }}/>
                                    </div>
                                )}
                                {cell==='hit' && <div className="br-hit-icon" style={{fontSize:'16px'}}>💥</div>}
                                {cell==='miss' && <div className="br-miss-icon" style={{fontSize:'14px'}}>💧</div>}
                            </div>
                        );
                    }))}
                </div>
            </div>
        </div>
    );
}

// ── Página principal ──────────────────────────────────────────
export default function AIGamePage() {
    const {
        phase,
        aiBoard, aiShips, aiRescued,
        playerBoard, playerShips, playerRescued,
        playerShoot, startGame, resetGame,
        message, aiThinking, lastAiShot,
    } = useAIGame();

    const [lastPlayerShot, setLastPlayerShot] = useState(null);

    // ── Cola de rescates (reutiliza el mismo sistema que Board.jsx) ──
    const [rescueQueue,    setRescueQueue]    = useState([]);
    const [showingRescue,  setShowingRescue]  = useState(null);
    const shownKeysRef = React.useRef(new Set());

    // Encolar nuevos barcos rescatados por el jugador
    React.useEffect(() => {
        aiRescued.forEach(ship => {
            const key = ship.positions?.map(p => `${p.x}-${p.y}`).join(',') || ship.type;
            if (!shownKeysRef.current.has(key)) {
                shownKeysRef.current.add(key);
                setRescueQueue(q => [...q, { ...ship, _key: key }]);
            }
        });
    }, [aiRescued]);

    // Mostrar uno a la vez
    React.useEffect(() => {
        if (!showingRescue && rescueQueue.length > 0) {
            setShowingRescue(rescueQueue[0]);
            setRescueQueue(q => q.slice(1));
        }
    }, [rescueQueue, showingRescue]);

    const handleShoot = useCallback((x, y) => {
        setLastPlayerShot({ x, y });
        playerShoot(x, y);
    }, [playerShoot]);

    const dotClass = aiThinking
        ? 'ai-msg-dot ai-msg-dot--thinking'
        : message.includes('💥') || message.includes('🚢') || message.includes('🏆')
            ? 'ai-msg-dot ai-msg-dot--hit'
            : message.includes('💧') || message.includes('falló')
                ? 'ai-msg-dot ai-msg-dot--miss'
                : 'ai-msg-dot';

    return (
        <>
            <style>{styles}</style>
            <div className="naval-page">
                <OceanBG />

                {/* Nav */}
                <nav className="naval-nav">
                    <div className="naval-nav-brand">
                        <div className="naval-nav-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                fill="none" stroke="white" strokeWidth="2.2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <h1 className="naval-nav-title">Fleet <span>Rescue</span></h1>
                    </div>
                    <div className="naval-nav-right">
                        <ThemeToggleBtn />
                        {phase !== 'setup' && (
                            <button className="ai-btn ai-btn--ghost"
                                style={{padding:'0.45rem 0.9rem', fontSize:'0.78rem'}}
                                onClick={resetGame}>
                                ✕ Abandonar
                            </button>
                        )}
                        <Link to="/dashboard" className="naval-nav-back">← Inicio</Link>
                    </div>
                </nav>

                <main className="naval-main">
                    {/* ── FASE: COLOCAR BARCOS ── */}
                    {phase === 'setup' && (
                        <ShipPlacer onReady={startGame}/>
                    )}

                    {/* ── Overlay de rescate individual ── */}
                    {showingRescue && phase === 'playing' && (
                        <RescueOverlay ship={showingRescue} onDone={() => setShowingRescue(null)}/>
                    )}

                    {/* ── Overlay de victoria total ── */}
                    {phase === 'won' && (
                        <WinOverlay
                            sunkShips={aiRescued}
                            onRedirect={() => resetGame()}
                        />
                    )}

                    {/* ── FASE: JUGANDO ── */}
                    {phase === 'playing' && (
                        <div className="ai-wrap">
                            {/* Barra de mensaje */}
                            <div className="ai-msg">
                                <div className={dotClass}/>
                                <span>{aiThinking ? '🤖 La IA está calculando su disparo...' : (message || 'Selecciona una casilla para disparar.')}</span>
                            </div>

                            <div className="ai-boards">
                                {/* Tablero de ataque */}
                                <div className="ai-board-col">
                                    <span className="ai-board-label ai-board-label--attack">
                                        🎯 Flota a rescatar — dispara aquí
                                    </span>
                                    <AttackBoard
                                        board={aiBoard}
                                        aiShips={aiShips}
                                        aiSunk={aiRescued}
                                        onShoot={handleShoot}
                                        aiThinking={aiThinking}
                                        lastShot={lastPlayerShot}
                                    />
                                    {/* Barcos rescatados por el jugador */}
                                    {aiRescued.length > 0 && (
                                        <div className="ai-sunk-list">
                                            {aiRescued.map(s => (
                                                <div key={s.type} className="ai-sunk-chip ai-sunk-chip--attack">
                                                    <img src={SHIP_IMG[s.type]} alt={s.type} style={{ filter: FILTER_GREEN }}/>
                                                    {SHIP_NAMES_ES[s.type]} ⚓
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Tablero de defensa */}
                                <div className="ai-board-col">
                                    <span className="ai-board-label ai-board-label--defense">
                                        🛡️ Tu flota — defensa
                                    </span>
                                    <DefenseBoard
                                        board={playerBoard}
                                        playerShips={playerShips}
                                        playerSunk={playerRescued}
                                        lastAiShot={lastAiShot}
                                    />
                                    {/* Tus barcos localizados por la IA */}
                                    {playerRescued.length > 0 && (
                                        <div className="ai-sunk-list">
                                            {playerRescued.map(s => (
                                                <div key={s.type} className="ai-sunk-chip ai-sunk-chip--defense">
                                                    <img src={SHIP_IMG[s.type]} alt={s.type} style={{ filter: FILTER_RED }}/>
                                                    {SHIP_NAMES_ES[s.type]} 🔍
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── FASE: VICTORIA — manejada por WinOverlay arriba ── */}

                    {/* ── FASE: DERROTA ── */}
                    {phase === 'lost' && (
                        <div className="ai-end ai-end--lost">
                            <div className="ai-end-icon">💀</div>
                            <h2 className="ai-end-title ai-end-title--lost">DERROTA</h2>
                            <p className="ai-end-sub">La IA ha localizado toda tu flota</p>
                            <div className="ai-end-actions">
                                <button className="ai-btn ai-btn--primary" onClick={resetGame}>🔄 Revancha</button>
                                <Link to="/dashboard" className="ai-btn ai-btn--ghost">🏠 Inicio</Link>
                            </div>
                        </div>
                    )}
                </main>
                <RadarDeco />
            </div>
        </>
    );
}