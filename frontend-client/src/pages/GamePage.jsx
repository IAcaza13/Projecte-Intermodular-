// src/pages/GamePage.jsx
import { useState } from 'react';
import { Board } from '../components/Board/Board';
import { useGame } from '../hooks/useGame';
import api from '../api/axiosConfig';
import { navalBase, OceanBG, RadarDeco } from '../styles/Navaltheme';

const styles = navalBase + `
  .game-start-wrap {
    display:flex; flex-direction:column; align-items:center;
    justify-content:center; flex:1; gap:2rem;
    animation:fadeInUp 0.6s ease-out both;
  }
  .game-start-icon { font-size:5rem; line-height:1; filter:drop-shadow(0 0 30px rgba(59,130,246,0.5)); animation:ship-bob 4s ease-in-out infinite; }
  .game-start-title { font-size:clamp(1.75rem,4vw,2.5rem); font-weight:900; letter-spacing:-0.04em; color:#fff; margin:0; text-align:center; }
  .game-start-title span { color:#60a5fa; }
  .game-start-sub  { color:#9ca3af; text-align:center; font-size:0.9rem; line-height:1.6; max-width:340px; margin:0; }

  .game-btn {
    padding:0.9rem 2.5rem;
    background:linear-gradient(135deg,#2563eb,#1d4ed8);
    color:#fff; font-weight:700; font-size:1.05rem; font-family:inherit;
    border:none; border-radius:0.75rem; cursor:pointer;
    display:inline-flex; align-items:center; gap:0.6rem;
    transition:all 0.2s; box-shadow:0 4px 18px rgba(37,99,235,0.4);
    text-decoration:none;
  }
  .game-btn:hover { background:linear-gradient(135deg,#1d4ed8,#1e40af); transform:scale(1.04); box-shadow:0 8px 28px rgba(37,99,235,0.55); }
  .game-btn:active  { transform:scale(0.98); }
  .game-btn--ghost  { background:rgba(8,14,28,0.8); border:1px solid rgba(37,99,235,0.3); box-shadow:none; }
  .game-btn--ghost:hover { background:rgba(15,25,50,0.9); box-shadow:0 4px 18px rgba(37,99,235,0.2); transform:scale(1.02); }

  .game-active-wrap { width:100%; max-width:560px; display:flex; flex-direction:column; align-items:center; gap:1.5rem; animation:fadeInUp 0.5s ease-out both; }

  .game-message-bar {
    width:100%; background:rgba(8,14,28,0.88); backdrop-filter:blur(10px);
    border:1px solid rgba(37,99,235,0.25); border-radius:0.875rem;
    padding:0.875rem 1.25rem; display:flex; align-items:center; gap:0.75rem;
    font-weight:600; font-size:0.95rem; color:#e2e8f0; min-height:52px;
    box-sizing:border-box;
  }
  .game-message-dot { width:10px; height:10px; border-radius:50%; background:#3b82f6; flex-shrink:0; box-shadow:0 0 10px rgba(59,130,246,0.7); animation:ping-slow 1.5s ease-in-out infinite; }

  .game-board-wrap { width:100%; background:rgba(8,14,28,0.88); backdrop-filter:blur(10px); border:1px solid rgba(37,99,235,0.25); border-radius:1rem; padding:1.25rem; box-sizing:border-box; }

  .game-legend { display:flex; justify-content:center; gap:1.5rem; flex-wrap:wrap; background:rgba(8,14,28,0.7); border:1px solid rgba(37,99,235,0.15); border-radius:0.75rem; padding:0.75rem 1.25rem; font-size:0.8rem; color:#9ca3af; }
  .game-legend-item { display:flex; align-items:center; gap:0.4rem; }
  .game-legend-dot  { width:12px; height:12px; border-radius:3px; flex-shrink:0; }

  .game-actions { display:flex; gap:0.75rem; flex-wrap:wrap; justify-content:center; }
`;

const GamePage = () => {
    const [gameId, setGameId] = useState(null);
    const { board, shoot, message } = useGame(gameId);

    const startNewGame = async () => {
        try {
            const { data } = await api.post('/games');
            setGameId(data.game_id);
        } catch (err) { console.error('Error al iniciar partida', err); }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="naval-page">
                <OceanBG />

                <main className="naval-main">
                    {!gameId ? (
                        <div className="game-start-wrap">
                            <div className="game-start-icon">🛳️</div>
                            <div style={{textAlign:'center'}}>
                                <h2 className="game-start-title">¡Zarpa a <span>rescatar</span> la flota!</h2>
                                <p className="game-start-sub" style={{marginTop:'0.75rem'}}>
                                    Localiza y rescata todos los barcos perdidos en el océano antes de quedarte sin intentos.
                                </p>
                            </div>
                            <button className="game-btn" onClick={startNewGame}>🚀 Iniciar Misión</button>
                        </div>
                    ) : (
                        <div className="game-active-wrap">
                            <div className="game-message-bar">
                                <div className="game-message-dot"/>
                                <span>{message || 'Selecciona una casilla para disparar...'}</span>
                            </div>
                            <div className="game-board-wrap">
                                <Board board={board} onCellClick={shoot} />
                            </div>
                            <div className="game-legend">
                                <div className="game-legend-item"><div className="game-legend-dot" style={{background:'#22c55e'}}/>Rescatado ⚓</div>
                                <div className="game-legend-item"><div className="game-legend-dot" style={{background:'#475569'}}/>Agua 💧</div>
                                <div className="game-legend-item"><div className="game-legend-dot" style={{background:'#1d4ed8'}}/>Sin explorar</div>
                            </div>
                            <div className="game-actions">
                                <button className="game-btn game-btn--ghost" onClick={() => setGameId(null)}>🔄 Nueva Partida</button>
                                <a href="/ranking" className="game-btn game-btn--ghost">🏆 Ver Ranking</a>
                            </div>
                        </div>
                    )}
                </main>
                <RadarDeco />
            </div>
        </>
    );
};

export default GamePage;