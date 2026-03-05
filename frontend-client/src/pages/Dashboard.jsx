// src/pages/Dashboard.jsx
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { navalBase, OceanBG, RadarDeco, ShipSVG, ThemeToggleBtn } from '../styles/Navaltheme';

const styles = navalBase + `
  .dash-wrap {
    width:100%; max-width:720px;
    display:flex; flex-direction:column; gap:1.75rem;
    animation:fadeInUp 0.6s ease-out both;
  }
  .dash-hero { text-align:center; }
  .dash-ship-wrap { animation:ship-bob 4s ease-in-out infinite; display:inline-block; margin-bottom:0.5rem; }
  .dash-title { font-size:clamp(1.75rem,4vw,2.5rem); font-weight:900; letter-spacing:-0.04em; color:#fff; margin:0; }
  .dash-title span { color:#60a5fa; }
  .dash-sub { color:#6b7280; font-size:0.9rem; margin-top:0.4rem; }

  .dash-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1rem; }

  .dash-card {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:0.75rem; padding:1.75rem 1.25rem;
    background:var(--bg-card); backdrop-filter:blur(12px);
    border:1px solid var(--border-color); border-radius:1.125rem;
    text-decoration:none; cursor:pointer; font-family:inherit;
    transition:all 0.22s; text-align:center;
    box-shadow:0 4px 20px rgba(0,0,0,0.3);
  }
  .dash-card:hover { transform:translateY(-5px); border-color:var(--border-hover); box-shadow:var(--card-shadow-hover); }
  .dash-card-icon  { font-size:2.5rem; line-height:1; transition:transform 0.2s; }
  .dash-card:hover .dash-card-icon { transform:scale(1.15); }
  .dash-card-title { font-size:1rem; font-weight:800; color:#fff; margin:0; }
  .dash-card-sub   { font-size:0.75rem; color:#6b7280; margin:0; }

  .dash-card--blue:hover   { border-color:rgba(59,130,246,0.6)!important;  box-shadow:0 8px 32px rgba(37,99,235,0.25)!important; }
  .dash-card--purple:hover { border-color:rgba(168,85,247,0.6)!important;  box-shadow:0 8px 32px rgba(147,51,234,0.25)!important; }
  .dash-card--yellow:hover { border-color:rgba(234,179,8,0.6)!important;   box-shadow:0 8px 32px rgba(202,138,4,0.25)!important; }
  .dash-card--green:hover  { border-color:rgba(34,197,94,0.6)!important;   box-shadow:0 8px 32px rgba(22,163,74,0.25)!important; }
  .dash-card--red:hover    { border-color:rgba(239,68,68,0.5)!important;   box-shadow:0 8px 32px rgba(220,38,38,0.2)!important; }

  .dash-badge {
    font-size:0.6rem; font-weight:800; letter-spacing:0.08em;
    background:linear-gradient(135deg,#7c3aed,#a855f7);
    color:#fff; padding:2px 8px; border-radius:20px; text-transform:uppercase;
  }
`;

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <style>{styles}</style>
            <div className="naval-page">
                <OceanBG />
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
                        <Link to="/profile" className="naval-nav-back">👤 {user?.username}</Link>
                    </div>
                </nav>

                <main className="naval-main">
                    <div className="dash-wrap">
                        <div className="dash-hero">
                            <div className="dash-ship-wrap"><ShipSVG /></div>
                            <h2 className="dash-title">¡Bienvenido, <span>{user?.username}</span>!</h2>
                            <p className="dash-sub">¿Qué misión vamos a cumplir hoy, Capitán?</p>
                        </div>

                        <div className="dash-grid">
                            <Link to="/game" className="dash-card dash-card--blue">
                                <div className="dash-card-icon">🎮</div>
                                <p className="dash-card-title">Modo Campaña</p>
                                <p className="dash-card-sub">Rescata la flota</p>
                            </Link>

                            <Link to="/ai-game" className="dash-card dash-card--purple">
                                <div className="dash-card-icon">🤖</div>
                                <p className="dash-card-title">vs Máquina</p>
                                <p className="dash-card-sub">Batalla naval contra IA</p>
                            </Link>

                            <Link to="/ranking" className="dash-card dash-card--yellow">
                                <div className="dash-card-icon">🏆</div>
                                <p className="dash-card-title">Ranking</p>
                                <p className="dash-card-sub">Hall de la Fama</p>
                            </Link>

                            <Link to="/profile" className="dash-card dash-card--green">
                                <div className="dash-card-icon">🛡️</div>
                                <p className="dash-card-title">Mi Perfil</p>
                                <p className="dash-card-sub">Estadísticas e historial</p>
                            </Link>

                            <button className="dash-card dash-card--red" onClick={() => { logout(); navigate('/login'); }}>
                                <div className="dash-card-icon">🚪</div>
                                <p className="dash-card-title" style={{color:'#f87171'}}>Cerrar Sesión</p>
                                <p className="dash-card-sub">Hasta la próxima</p>
                            </button>
                        </div>
                    </div>
                </main>
                <RadarDeco />
            </div>
        </>
    );
}