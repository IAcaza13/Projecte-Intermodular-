// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axiosConfig';
import { navalBase, OceanBG, RadarDeco } from '../styles/Navaltheme';

const styles = navalBase + `
  .profile-wrap { width:100%; max-width:700px; display:flex; flex-direction:column; gap:1.25rem; animation:fadeInUp 0.6s ease-out both; }

  /* Hero */
  .profile-hero { background:var(--bg-card); backdrop-filter:blur(12px); border:1px solid var(--border-color); border-radius:1.125rem; overflow:hidden; }
  .profile-hero-bar { height:4px; background:linear-gradient(90deg,#1d4ed8,#60a5fa,#93c5fd,#60a5fa,#1d4ed8); background-size:200% 100%; animation:bar-slide 3s linear infinite; }
  .profile-hero-body { padding:1.5rem; display:flex; align-items:center; gap:1.25rem; flex-wrap:wrap; }
  .profile-avatar { width:72px; height:72px; border-radius:50%; background:rgba(37,99,235,0.2); border:2px solid rgba(37,99,235,0.4); display:flex; align-items:center; justify-content:center; font-size:2rem; flex-shrink:0; box-shadow:0 0 20px rgba(37,99,235,0.3); }
  .profile-info-name { font-size:1.5rem; font-weight:900; letter-spacing:-0.03em; color:var(--text-primary); margin:0; }
  .profile-info-sub  { color:var(--text-muted); font-size:0.875rem; margin-top:0.25rem; }
  .profile-info-sub span { color:var(--accent-secondary); font-weight:600; }

  /* Stats */
  .profile-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:1rem; }
  .profile-stat-card { background:var(--bg-card); backdrop-filter:blur(12px); border:1px solid var(--border-color); border-radius:1rem; padding:1.25rem; text-align:center; transition:all 0.2s; }
  .profile-stat-card:hover { border-color:var(--border-hover); transform:translateY(-3px); box-shadow:var(--card-shadow-hover); }
  .profile-stat-icon  { font-size:1.5rem; margin-bottom:0.4rem; }
  .profile-stat-num   { font-size:1.75rem; font-weight:900; color:var(--accent-secondary); line-height:1; }
  .profile-stat-num--green  { color:#22c55e; }
  .profile-stat-num--yellow { color:#eab308; }
  .profile-stat-label { font-size:0.7rem; color:var(--text-dim); margin-top:0.25rem; text-transform:uppercase; letter-spacing:0.06em; }

  /* History */
  .profile-history-wrap { background:var(--bg-card); backdrop-filter:blur(12px); border:1px solid var(--border-color); border-radius:1.125rem; padding:1.25rem; overflow:hidden; }
  .profile-history-title { font-size:1rem; font-weight:700; color:var(--text-secondary); display:flex; align-items:center; gap:0.5rem; padding-bottom:0.75rem; border-bottom:1px solid var(--border-color); margin-bottom:0.875rem; }
  .profile-history-list { display:flex; flex-direction:column; gap:0.5rem; max-height:380px; overflow-y:auto; }
  .profile-history-list::-webkit-scrollbar { width:4px; }
  .profile-history-list::-webkit-scrollbar-thumb { background:rgba(37,99,235,0.3); border-radius:2px; }

  .profile-game-row { display:flex; align-items:center; gap:0.875rem; padding:0.75rem 1rem; background:var(--bg-row); border:1px solid var(--border-color); border-radius:0.625rem; transition:all 0.2s; }
  .profile-game-row:hover { border-color:var(--border-hover); background:var(--bg-row-hover); }
  .profile-game-icon   { font-size:1.4rem; line-height:1; flex-shrink:0; }
  .profile-game-info   { flex:1; min-width:0; }
  .profile-game-label  { font-size:0.82rem; font-weight:700; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .profile-game-meta   { display:flex; gap:0.75rem; margin-top:0.2rem; flex-wrap:wrap; }
  .profile-game-pill   { font-size:0.68rem; font-family:monospace; padding:1px 7px; border-radius:20px; background:rgba(37,99,235,0.1); color:var(--accent-secondary); border:1px solid rgba(37,99,235,0.2); }
  .profile-game-pill--green  { background:rgba(34,197,94,0.1); color:#22c55e; border-color:rgba(34,197,94,0.25); }
  .profile-game-pill--yellow { background:rgba(234,179,8,0.1);  color:#eab308; border-color:rgba(234,179,8,0.25); }
  .profile-game-pill--slate  { background:rgba(71,85,105,0.15); color:#94a3b8; border-color:rgba(71,85,105,0.2); }
  .profile-game-date   { font-size:0.7rem; color:var(--text-dim); text-align:right; flex-shrink:0; line-height:1.5; }

  .profile-empty      { text-align:center; padding:3rem 1rem; color:var(--text-dim); }
  .profile-empty-icon { font-size:3rem; margin-bottom:0.75rem; opacity:0.5; }
  .profile-empty-text { font-size:0.875rem; font-style:italic; }
  .profile-loading    { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; gap:1rem; }
  .profile-loading-text { font-size:0.8rem; font-weight:700; color:var(--accent-secondary); text-transform:uppercase; letter-spacing:0.12em; }
`;

// Formatea segundos → "1m 23s" o "45s"
const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

export default function ProfilePage() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/history')
            .then(r => setHistory(r.data))
            .catch(e => console.error('Error historial:', e))
            .finally(() => setLoading(false));
    }, []);

    // ── Estadísticas globales calculadas desde el historial ──
    const totalGames  = history.length;
    const wins        = history.filter(g => g.won).length;

    // % de aciertos global: suma de todos los hits / suma de todos los attempts
    const totalHits     = history.reduce((acc, g) => acc + (g.hits     || 0), 0);
    const totalAttempts = history.reduce((acc, g) => acc + (g.attempts || 0), 0);
    const accuracy      = totalAttempts > 0 ? Math.round((totalHits / totalAttempts) * 100) : 0;

    return (
        <>
            <style>{styles}</style>
            <div className="naval-page">
                <OceanBG />

                <main className="naval-main">
                    {loading ? (
                        <div className="profile-loading">
                            <div className="naval-spinner"/>
                            <p className="profile-loading-text">Sincronizando bitácora...</p>
                        </div>
                    ) : (
                        <div className="profile-wrap">

                            {/* ── Hero ── */}
                            <div className="profile-hero">
                                <div className="profile-hero-bar"/>
                                <div className="profile-hero-body">
                                    <div className="profile-avatar">🛡️</div>
                                    <div>
                                        <h2 className="profile-info-name">Perfil del Capitán</h2>
                                        <p className="profile-info-sub">
                                            Comandante: <span>{user?.username || user?.name || '—'}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Stats: Partidas · Victorias · % Aciertos ── */}
                            <div className="profile-stats">
                                <div className="profile-stat-card">
                                    <div className="profile-stat-icon">⚔️</div>
                                    <div className="profile-stat-num">{totalGames}</div>
                                    <div className="profile-stat-label">Incursiones</div>
                                </div>
                                <div className="profile-stat-card">
                                    <div className="profile-stat-icon">🏆</div>
                                    <div className="profile-stat-num profile-stat-num--green">{wins}</div>
                                    <div className="profile-stat-label">Victorias</div>
                                </div>
                                <div className="profile-stat-card">
                                    <div className="profile-stat-icon">🎯</div>
                                    <div className="profile-stat-num profile-stat-num--yellow">{accuracy}%</div>
                                    <div className="profile-stat-label">Precisión de rescate</div>
                                </div>
                            </div>

                            {/* ── Historial ── */}
                            <div className="profile-history-wrap">
                                <div className="profile-history-title">
                                    🗓️ Historial de Rescate
                                </div>

                                {history.length > 0 ? (
                                    <div className="profile-history-list">
                                        {history.map(game => (
                                            <div key={game.id} className="profile-game-row">
                                                <div className="profile-game-icon">
                                                    {game.won ? '✅' : '💀'}
                                                </div>
                                                <div className="profile-game-info">
                                                    <div className="profile-game-label">
                                                        {game.won ? 'Misión Cumplida' : 'Nave Perdida'}
                                                    </div>
                                                    <div className="profile-game-meta">
                                                        <span className="profile-game-pill">
                                                            🎯 {game.attempts} intentos
                                                        </span>
                                                        <span className="profile-game-pill profile-game-pill--green">
                                                            ⚓ {game.hits} impactos
                                                        </span>
                                                        <span className="profile-game-pill profile-game-pill--yellow">
                                                            {game.accuracy}% precisión
                                                        </span>
                                                        {game.won && game.total_time > 0 && (
                                                            <span className="profile-game-pill profile-game-pill--slate">
                                                                ⏱ {formatTime(game.total_time)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="profile-game-date">
                                                    {new Date(game.created_at).toLocaleDateString('es-ES')}<br/>
                                                    {new Date(game.created_at).toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="profile-empty">
                                        <div className="profile-empty-icon">⚓</div>
                                        <p className="profile-empty-text">
                                            No se han detectado movimientos en tu radar naval.
                                        </p>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </main>
                <RadarDeco />
            </div>
        </>
    );
}
