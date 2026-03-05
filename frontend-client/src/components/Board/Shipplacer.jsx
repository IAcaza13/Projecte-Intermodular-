// src/components/Board/ShipPlacer.jsx
// Componente para que el jugador coloque sus barcos antes de la partida vs IA
import React, { useState, useCallback } from 'react';
import { SHIP_TYPES, generateShips } from '../../hooks/useAIGame';

import destroyerSrc  from '../../assets/ships/destroyer.svg';
import cruiserSrc    from '../../assets/ships/cruiser.svg';
import submarineSrc  from '../../assets/ships/submarine.svg';
import battleshipSrc from '../../assets/ships/battleship.svg';
import carrierSrc    from '../../assets/ships/carrier.svg';

const SHIP_IMG = {
    CARRIER: carrierSrc, BATTLESHIP: battleshipSrc,
    CRUISER: cruiserSrc, SUBMARINE: submarineSrc, DESTROYER: destroyerSrc,
};
const COLS = ['A','B','C','D','E','F','G','H','I','J'];
const ROWS = ['1','2','3','4','5','6','7','8','9','10'];

const STYLES = `
  @import url('https://fonts.bunny.net/css?family=share-tech-mono:400');

  @keyframes placer-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ship-placed { 0%{transform:scale(1.15)} 100%{transform:scale(1)} }

  .placer-root {
    font-family:'Share Tech Mono','Courier New',monospace;
    display:flex; flex-direction:column; align-items:center; gap:1.25rem;
    animation:placer-in 0.45s ease-out both; color:#f9fafb;
    width:100%;
  }
  .placer-title { font-size:1.1rem; font-weight:900; color:#60a5fa; letter-spacing:0.06em; text-align:center; }
  .placer-sub   { font-size:0.78rem; color:#6b7280; text-align:center; margin-top:-0.75rem; }

  .placer-layout { display:flex; gap:1.5rem; flex-wrap:wrap; justify-content:center; align-items:flex-start; width:100%; }

  /* Grid */
  .placer-frame {
    position:relative; padding:28px 10px 10px 30px;
    background:rgba(3,7,18,0.98); border:2px solid rgba(37,99,235,0.42);
    border-radius:10px; flex-shrink:0;
    box-shadow:0 0 30px rgba(37,99,235,0.15);
  }
  .placer-cols { position:absolute; top:6px; left:30px; right:10px; display:grid; grid-template-columns:repeat(10,1fr); }
  .placer-col-lbl { text-align:center; font-size:10px; color:#374151; font-weight:700; }
  .placer-rows { position:absolute; top:28px; bottom:10px; left:3px; display:flex; flex-direction:column; justify-content:space-around; }
  .placer-row-lbl { font-size:9px; color:#374151; width:20px; text-align:right; font-weight:700; }
  .placer-grid { display:grid; grid-template-columns:repeat(10,1fr); gap:3px; }

  .placer-cell {
    position:relative; width:36px; height:36px; border-radius:4px;
    border:1px solid rgba(30,58,138,0.32);
    background:linear-gradient(145deg,#050d1f,#091628);
    cursor:crosshair; transition:all 0.1s; overflow:hidden;
  }
  .placer-cell--hover    { background:linear-gradient(145deg,#0d1f40,#142a55); border-color:rgba(96,165,250,0.6); }
  .placer-cell--valid    { background:rgba(34,197,94,0.15)!important; border-color:rgba(34,197,94,0.6)!important; }
  .placer-cell--invalid  { background:rgba(239,68,68,0.15)!important; border-color:rgba(239,68,68,0.5)!important; }
  .placer-cell--occupied {
    background:linear-gradient(145deg,#0a1f3d,#0d2a52)!important;
    border-color:rgba(37,99,235,0.5)!important;
    cursor:default;
    animation:ship-placed 0.25s ease-out;
  }
  .placer-cell-ship { position:absolute; inset:1px; display:flex; align-items:center; justify-content:center; }
  .placer-cell-ship img { width:100%; height:100%; object-fit:contain; filter:brightness(0) saturate(100%) invert(55%) sepia(60%) saturate(500%) hue-rotate(190deg); }

  /* Panel de barcos */
  .placer-panel { display:flex; flex-direction:column; gap:0.75rem; min-width:200px; }
  .placer-panel-title { font-size:0.75rem; color:#6b7280; text-transform:uppercase; letter-spacing:0.1em; }

  .placer-ship-item {
    display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.875rem;
    background:rgba(8,14,28,0.8); border:1px solid rgba(37,99,235,0.2);
    border-radius:0.625rem; cursor:pointer; transition:all 0.18s;
  }
  .placer-ship-item:hover:not(.placer-ship-item--placed) { border-color:rgba(96,165,250,0.5); background:rgba(15,25,50,0.9); transform:translateX(3px); }
  .placer-ship-item--active { border-color:#60a5fa!important; background:rgba(37,99,235,0.15)!important; box-shadow:0 0 12px rgba(37,99,235,0.25); }
  .placer-ship-item--placed { opacity:0.45; cursor:default; border-color:rgba(34,197,94,0.3)!important; }
  .placer-ship-img  { width:48px; height:18px; flex-shrink:0; }
  .placer-ship-img img { width:100%; height:100%; object-fit:contain; filter:brightness(0) invert(0.7); }
  .placer-ship-item--placed .placer-ship-img img { filter:brightness(0) saturate(100%) invert(62%) sepia(60%) saturate(500%) hue-rotate(95deg); }
  .placer-ship-info { flex:1; }
  .placer-ship-name { font-size:0.75rem; font-weight:700; color:#e2e8f0; }
  .placer-ship-size { font-size:0.65rem; color:#6b7280; }
  .placer-ship-check { font-size:0.9rem; }

  .placer-rotate-btn {
    width:100%; padding:0.55rem; background:rgba(37,99,235,0.12);
    border:1px solid rgba(37,99,235,0.25); border-radius:0.5rem;
    color:#60a5fa; font-size:0.78rem; font-weight:700; cursor:pointer;
    font-family:inherit; transition:all 0.18s; letter-spacing:0.05em;
  }
  .placer-rotate-btn:hover { background:rgba(37,99,235,0.22); }

  .placer-actions { display:flex; gap:0.625rem; width:100%; flex-wrap:wrap; justify-content:center; }
  .placer-btn {
    padding:0.7rem 1.5rem; font-size:0.85rem; font-weight:700;
    border-radius:0.625rem; border:none; cursor:pointer; font-family:inherit; transition:all 0.18s;
  }
  .placer-btn--primary { background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff; box-shadow:0 3px 14px rgba(37,99,235,0.4); }
  .placer-btn--primary:hover { transform:scale(1.03); box-shadow:0 6px 20px rgba(37,99,235,0.55); }
  .placer-btn--primary:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
  .placer-btn--ghost { background:rgba(8,14,28,0.8); border:1px solid rgba(37,99,235,0.25); color:#94a3b8; }
  .placer-btn--ghost:hover { background:rgba(15,25,50,0.9); color:#cbd5e1; }
`;

const SHIP_NAMES_ES = {
    CARRIER: 'Portaviones', BATTLESHIP: 'Acorazado',
    CRUISER: 'Crucero', SUBMARINE: 'Submarino', DESTROYER: 'Destructor',
};

export function ShipPlacer({ onReady }) {
    const [placedShips, setPlacedShips] = useState([]); // [{type, size, positions}]
    const [selected, setSelected]       = useState(SHIP_TYPES[0]); // barco activo
    const [direction, setDirection]     = useState('h');            // 'h' | 'v'
    const [hoverCell, setHoverCell]     = useState(null);

    const occupiedMap = React.useMemo(() => {
        const m = {};
        placedShips.forEach(s => s.positions.forEach(p => { m[`${p.x}-${p.y}`] = s.type; }));
        return m;
    }, [placedShips]);

    const canPlace = (x, y, size, dir) => {
        for (let i = 0; i < size; i++) {
            const nx = x + (dir === 'h' ? i : 0);
            const ny = y + (dir === 'v' ? i : 0);
            if (nx > 9 || ny > 9) return false;
            if (occupiedMap[`${nx}-${ny}`]) return false;
        }
        return true;
    };

    const getPreviewCells = (x, y) => {
        if (!selected || !x === null) return [];
        const cells = [];
        for (let i = 0; i < selected.size; i++) {
            cells.push({
                x: x + (direction === 'h' ? i : 0),
                y: y + (direction === 'v' ? i : 0),
            });
        }
        return cells;
    };

    const handleCellClick = (x, y) => {
        if (!selected) return;
        if (!canPlace(x, y, selected.size, direction)) return;

        const positions = [];
        for (let i = 0; i < selected.size; i++) {
            positions.push({
                x: x + (direction === 'h' ? i : 0),
                y: y + (direction === 'v' ? i : 0),
            });
        }

        const newPlaced = [...placedShips, { ...selected, positions }];
        setPlacedShips(newPlaced);

        // Seleccionar siguiente barco pendiente
        const nextShip = SHIP_TYPES.find(s => !newPlaced.some(p => p.type === s.type));
        setSelected(nextShip || null);
    };

    const previewCells    = hoverCell ? getPreviewCells(hoverCell.x, hoverCell.y) : [];
    const isPreviewValid  = hoverCell ? canPlace(hoverCell.x, hoverCell.y, selected?.size, direction) : false;
    const allPlaced       = placedShips.length === SHIP_TYPES.length;

    const handleRandom = () => {
        const ships = generateShips();
        setPlacedShips(ships);
        setSelected(null);
    };

    const handleReset = () => {
        setPlacedShips([]);
        setSelected(SHIP_TYPES[0]);
    };

    return (
        <>
            <style>{STYLES}</style>
            <div className="placer-root">
                <div className="placer-title">⚓ COLOCA TU FLOTA</div>
                <p className="placer-sub">
                    Haz clic en el tablero para colocar cada barco · R para rotar
                </p>

                <div className="placer-layout">
                    {/* Grid */}
                    <div className="placer-frame"
                        onKeyDown={e => e.key === 'r' || e.key === 'R' ? setDirection(d => d === 'h' ? 'v' : 'h') : null}
                        tabIndex={0}
                    >
                        <div className="placer-cols">
                            {COLS.map(l => <span key={l} className="placer-col-lbl">{l}</span>)}
                        </div>
                        <div className="placer-rows">
                            {ROWS.map(l => <span key={l} className="placer-row-lbl">{l}</span>)}
                        </div>
                        <div className="placer-grid">
                            {Array(10).fill(null).map((_, y) =>
                                Array(10).fill(null).map((__, x) => {
                                    const key       = `${x}-${y}`;
                                    const occupied  = occupiedMap[key];
                                    const inPreview = previewCells.some(c => c.x === x && c.y === y);
                                    const isHover   = hoverCell?.x === x && hoverCell?.y === y;

                                    let cls = 'placer-cell';
                                    if (occupied)         cls += ' placer-cell--occupied';
                                    else if (inPreview)   cls += isPreviewValid ? ' placer-cell--valid' : ' placer-cell--invalid';
                                    else if (isHover)     cls += ' placer-cell--hover';

                                    const shipHere = occupied
                                        ? placedShips.find(s => s.positions.some(p => p.x === x && p.y === y))
                                        : null;

                                    return (
                                        <div key={key} className={cls}
                                            onClick={() => !occupied && selected && handleCellClick(x, y)}
                                            onMouseEnter={() => setHoverCell({ x, y })}
                                            onMouseLeave={() => setHoverCell(null)}
                                        >
                                            {shipHere && (
                                                <div className="placer-cell-ship">
                                                    <img src={SHIP_IMG[shipHere.type]} alt={shipHere.type}/>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Panel */}
                    <div className="placer-panel">
                        <div className="placer-panel-title">Tu flota</div>
                        {SHIP_TYPES.map(ship => {
                            const placed  = placedShips.some(p => p.type === ship.type);
                            const active  = selected?.type === ship.type;
                            return (
                                <div key={ship.type}
                                    className={`placer-ship-item${active ? ' placer-ship-item--active' : ''}${placed ? ' placer-ship-item--placed' : ''}`}
                                    onClick={() => !placed && setSelected(ship)}
                                >
                                    <div className="placer-ship-img">
                                        <img src={SHIP_IMG[ship.type]} alt={ship.type}/>
                                    </div>
                                    <div className="placer-ship-info">
                                        <div className="placer-ship-name">{SHIP_NAMES_ES[ship.type]}</div>
                                        <div className="placer-ship-size">{ship.size} casillas</div>
                                    </div>
                                    <div className="placer-ship-check">{placed ? '✅' : active ? '👆' : '○'}</div>
                                </div>
                            );
                        })}

                        <button className="placer-rotate-btn" onClick={() => setDirection(d => d === 'h' ? 'v' : 'h')}>
                            🔄 Rotar ({direction === 'h' ? 'Horizontal' : 'Vertical'})
                        </button>
                    </div>
                </div>

                <div className="placer-actions">
                    <button className="placer-btn placer-btn--ghost" onClick={handleRandom}>
                        🎲 Aleatorio
                    </button>
                    <button className="placer-btn placer-btn--ghost" onClick={handleReset}>
                        ↩ Reiniciar
                    </button>
                    <button className="placer-btn placer-btn--primary"
                        disabled={!allPlaced}
                        onClick={() => onReady(placedShips)}
                    >
                        🚀 ¡Iniciar batalla!
                    </button>
                </div>
            </div>
        </>
    );
}