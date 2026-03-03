// src/pages/GamePage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Board } from '../components/Board/Board';
import { useGame } from '../hooks/useGame';
import api from '../api/axiosConfig';
import { navalBase, OceanBG, RadarDeco } from '../styles/navalTheme';

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
  .game-btn--ghost:hover { background:rgba(15,25,50,0.9); transform:scale(1.02); }

  .game-active-wrap { width:100%; display:flex; flex-direction:column; align-items:center; gap:1.25rem; animation:fadeInUp 0.5s ease-out both; }

  .game-message-bar {
    width:100%; max-width:720px;
    background:rgba(8,14,28,0.88); backdrop-filter:blur(10px);
    border:1px solid rgba(37,99,235,0.25); border-radius:0.875rem;
    padding:0.875rem 1.25rem; display:flex; align-items:center; gap:0.75rem;
    font-weight:600; font-size:0.95rem; color:#e2e8f0; min-height:52px;
    box-sizing:border-box;
  }
  .game-message-dot { width:10px; height:10px; border-radius:50%; background:#3b82f6; flex-shrink:0; box-shadow:0 0 10px rgba(59,130,246,0.7); animation:ping-slow 1.5s ease-in-out infinite; }
  .game-message-dot--green { background:#22c55e !important; box-shadow:0 0 10px rgba(34,197,94,0.7) !important; }

  .game-won-banner {
    width:100%; max-width:720px;
    background:linear-gradient(135deg,rgba(5,46,30,0.95),rgba(6,78,52,0.95));
    border:2px solid rgba(34,197,94,0.6); border-radius:1rem;
    padding:1.5rem 2rem; text-align:center;
    box-shadow:0 0 40px rgba(34,197,94,0.3);
    animation:fadeInUp 0.5s ease-out both;
  }
  .game-won-title { font-size:1.75rem; font-weight:900; color:#22c55e; margin:0 0 0.5rem; letter-spacing:-0.02em; }
  .game-won-sub   { color:#86efac; font-size:0.9rem; margin:0 0 1.25rem; }

  .game-actions { display:flex; gap:0.75rem; flex-wrap:wrap; justify-content:center; }
`;

const GamePage = () => {
    const [gameId, setGameId]   = useState(null);
    const [loading, setLoading] = useState(false);
    const { board, shoot, message, gameWon, sunkShips, resetGame } = useGame(gameId);

    const startNewGame = async () => {
        setLoading(true);
        try {
            const { data } = await api.post('/games');
            resetGame();
            setGameId(data.game_id);
        } catch (err) {
            console.error('Error al iniciar partida', err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewGame = () => {
        setGameId(null);
        resetGame();
    };

    return (
        <>
            <style>{styles}</style>
            <div className="naval-page">
                <OceanBG />

                <nav className="naval-nav">
                    <div className="naval-nav-brand">
                        <div className="naval-nav-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <h1 className="naval-nav-title">Fleet <span>Rescue</span></h1>
                    </div>
                    <div className="naval-nav-right">
                        {gameId && !gameWon && (
                            <button className="game-btn game-btn--ghost" onClick={handleNewGame}
                                style={{padding:'0.5rem 1rem', fontSize:'0.8rem'}}>
                                ✕ Abandonar
                            </button>
                        )}
                        <Link to="/dashboard" className="naval-nav-back">← Inicio</Link>
                    </div>
                </nav>

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
                            <button className="game-btn" onClick={startNewGame} disabled={loading}>
                                {loading ? '⚓ Preparando...' : '🚀 Iniciar Misión'}
                            </button>
                        </div>
                    ) : (
                        <div className="game-active-wrap">

                            {/* Banner de victoria */}
                            {gameWon && (
                                <div className="game-won-banner">
                                    <div className="game-won-title">🏆 ¡MISIÓN CUMPLIDA!</div>
                                    <p className="game-won-sub">Has rescatado toda la flota. ¡Eres un gran capitán!</p>
                                    <div className="game-actions">
                                        <button className="game-btn" onClick={handleNewGame}>🚀 Nueva misión</button>
                                        <Link to="/ranking" className="game-btn game-btn--ghost">🏆 Ver ranking</Link>
                                    </div>
                                </div>
                            )}

                            {/* Mensaje */}
                            {!gameWon && (
                                <div className="game-message-bar">
                                    <div className={`game-message-dot${sunkShips.length > 0 ? ' game-message-dot--green' : ''}`}/>
                                    <span>{message || 'Selecciona una casilla para disparar...'}</span>
                                </div>
                            )}

                            {/* Board — ships recibe los barcos YA hundidos para resaltar + animación */}
                            <Board
                                board={board}
                                onCellClick={gameWon ? () => {} : shoot}
                                ships={sunkShips}
                            />

                            {!gameWon && (
                                <div className="game-actions">
                                    <button className="game-btn game-btn--ghost" onClick={handleNewGame}>🔄 Nueva Partida</button>
                                    <Link to="/ranking" className="game-btn game-btn--ghost">🏆 Ver Ranking</Link>
                                </div>
                            )}
                        </div>
                    )}
                </main>
                <RadarDeco />
            </div>
        </>
    );
};

export default GamePage;