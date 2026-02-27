// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axiosConfig';
import { navalBase, OceanBG, RadarDeco } from '../styles/Navaltheme';

const styles = navalBase + `
  .profile-wrap { width:100%; max-width:680px; display:flex; flex-direction:column; gap:1.25rem; animation:fadeInUp 0.6s ease-out both; }

  /* Hero */
  .profile-hero { background:rgba(8,14,28,0.9); backdrop-filter:blur(12px); border:1px solid rgba(37,99,235,0.25); border-radius:1.125rem; overflow:hidden; }
  .profile-hero-bar { height:4px; background:linear-gradient(90deg,#1d4ed8,#60a5fa,#93c5fd,#60a5fa,#1d4ed8); background-size:200% 100%; animation:bar-slide 3s linear infinite; }
  .profile-hero-body { padding:1.5rem; display:flex; align-items:center; gap:1.25rem; flex-wrap:wrap; }
  .profile-avatar { width:72px; height:72px; border-radius:50%; background:rgba(37,99,235,0.2); border:2px solid rgba(37,99,235,0.4); display:flex; align-items:center; justify-content:center; font-size:2rem; flex-shrink:0; box-shadow:0 0 20px rgba(37,99,235,0.25); }
  .profile-info-name { font-size:1.5rem; font-weight:900; letter-spacing:-0.03em; color:#fff; margin:0; }
  .profile-info-sub  { color:#9ca3af; font-size:0.875rem; margin-top:0.25rem; }
  .profile-info-sub span { color:#60a5fa; font-weight:600; }

  /* Stats */
  .profile-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:1rem; }
  .profile-stat-card { background:rgba(8,14,28,0.9); backdrop-filter:blur(12px); border:1px solid rgba(37,99,235,0.2); border-radius:1rem; padding:1.25rem; text-align:center; transition:all 0.2s; }
  .profile-stat-card:hover { border-color:rgba(96,165,250,0.4); transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,0.4); }
  .profile-stat-icon  { font-size:1.5rem; margin-bottom:0.4rem; }
  .profile-stat-num   { font-size:1.75rem; font-weight:900; color:#60a5fa; line-height:1; }
  .profile-stat-num--green  { color:#22c55e; }
  .profile-stat-num--yellow { color:#eab308; }
  .profile-stat-label { font-size:0.7rem; color:#6b7280; margin-top:0.25rem; text-transform:uppercase; letter-spacing:0.06em; }

  /* History */
  .profile-history-wrap { background:rgba(8,14,28,0.88); backdrop-filter:blur(12px); border:1px solid rgba(37,99,235,0.2); border-radius:1.125rem; padding:1.25rem; overflow:hidden; }
  .profile-history-title { font-size:1rem; font-weight:700; color:#e2e8f0; display:flex; align-items:center; gap:0.5rem; padding-bottom:0.75rem; border-bottom:1px solid rgba(37,99,235,0.15); margin-bottom:0.875rem; }
  .profile-history-list { display:flex; flex-direction:column; gap:0.625rem; max-height:340px; overflow-y:auto; }
  .profile-history-list::-webkit-scrollbar { width:4px; }
  .profile-history-list::-webkit-scrollbar-thumb { background:rgba(37,99,235,0.3); border-radius:2px; }

  .profile-game-row { display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; background:rgba(5,8,15,0.6); border:1px solid rgba(37,99,235,0.1); border-radius:0.625rem; transition:all 0.2s; }
  .profile-game-row:hover { border-color:rgba(96,165,250,0.3); background:rgba(10,20,40,0.7); }
  .profile-game-badge  { display:flex; align-items:center; gap:0.625rem; }
  .profile-game-result { font-size:1.25rem; line-height:1; }
  .profile-game-label  { font-size:0.8rem; font-weight:700; color:#e2e8f0; }
  .profile-game-score  { font-size:0.7rem; color:#6b7280; margin-top:0.1rem; font-family:monospace; }
  .profile-game-date   { font-size:0.7rem; color:#6b7280; text-align:right; }

  .profile-empty      { text-align:center; padding:3rem 1rem; color:#4b5563; }
  .profile-empty-icon { font-size:3rem; margin-bottom:0.75rem; opacity:0.5; }
  .profile-empty-text { font-size:0.875rem; font-style:italic; }

  .profile-loading      { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; gap:1rem; }
  .profile-loading-text { font-size:0.8rem; font-weight:700; color:#3b82f6; text-transform:uppercase; letter-spacing:0.12em; }
`;

export default function ProfilePage() {
    const { user } = useAuth();
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/history')
            .then(r => setHistoryData(r.data))
            .catch(e => console.error('Error historial:', e))
            .finally(() => setLoading(false));
    }, []);

    const totalGames = historyData.length;
    const wins       = historyData.filter(g => g.win === 1 || g.win === true).length;
    const winRate    = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

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
                            <div className="profile-hero">
                                <div className="profile-hero-bar"/>
                                <div className="profile-hero-body">
                                    <div className="profile-avatar">🛡️</div>
                                    <div>
                                        <h2 className="profile-info-name">Perfil del Capitán</h2>
                                        <p className="profile-info-sub">Comandante: <span>{user?.username}</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-stats">
                                {[['⚔️',totalGames,'Incursiones',''],['🏆',wins,'Victorias','--green'],['📊',winRate+'%','Tasa de éxito','--yellow']].map(([icon,val,label,cls]) => (
                                    <div key={label} className="profile-stat-card">
                                        <div className="profile-stat-icon">{icon}</div>
                                        <div className={`profile-stat-num${cls}`}>{val}</div>
                                        <div className="profile-stat-label">{label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="profile-history-wrap">
                                <div className="profile-history-title">🗓️ Historial de Combate</div>
                                {historyData.length > 0 ? (
                                    <div className="profile-history-list">
                                        {historyData.map(game => (
                                            <div key={game.id} className="profile-game-row">
                                                <div className="profile-game-badge">
                                                    <div className="profile-game-result">{game.win ? '✅' : '💀'}</div>
                                                    <div>
                                                        <div className="profile-game-label">{game.win ? 'Misión Cumplida' : 'Nave Perdida'}</div>
                                                        <div className="profile-game-score">PUNTOS: {game.score || 0}</div>
                                                    </div>
                                                </div>
                                                <div className="profile-game-date">
                                                    {new Date(game.created_at).toLocaleDateString()}<br/>
                                                    {new Date(game.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="profile-empty">
                                        <div className="profile-empty-icon">⚓</div>
                                        <p className="profile-empty-text">No se han detectado movimientos en tu radar naval.</p>
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