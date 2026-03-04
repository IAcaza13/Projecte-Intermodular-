// src/pages/Dashboard.jsx
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { navalBase, OceanBG, ShipSVG, RadarDeco } from '../styles/Navaltheme';

const styles = navalBase + `
  .db-hero { text-align:center; margin-bottom:2.5rem; animation:fadeInUp 0.6s ease-out both; }
  .db-hero-greeting { font-size:clamp(1.75rem,4vw,2.75rem); font-weight:900; letter-spacing:-0.04em; color:var(--text-primary); margin:0 0 0.5rem; }
  .db-hero-greeting span { color:var(--accent-secondary); }
  .db-hero-sub { color:var(--text-muted); font-size:1rem; margin:0; }

  .db-stats { display:flex; gap:1rem; margin-bottom:2.5rem; flex-wrap:wrap; justify-content:center; animation:fadeInUp 0.6s ease-out 0.1s both; }

  .db-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr));
    gap:1rem; width:100%; max-width:700px;
    animation:fadeInUp 0.6s ease-out 0.2s both;
  }

  .db-menu-card {
    background:var(--bg-card); backdrop-filter:blur(12px);
    border:1px solid var(--border-color); border-radius:1rem;
    padding:1.5rem; text-decoration:none; color:inherit;
    display:flex; flex-direction:column; align-items:center;
    gap:0.75rem; text-align:center;
    transition:all 0.25s ease; position:relative; overflow:hidden;
  }
  .db-menu-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,#1d4ed8,#60a5fa,#93c5fd,#60a5fa,#1d4ed8);
    background-size:200% 100%; opacity:0; transition:opacity 0.25s;
    animation:bar-slide 2.5s linear infinite;
  }
  .db-menu-card:hover { border-color:var(--border-hover); transform:translateY(-6px); box-shadow:var(--card-shadow-hover); }
  .db-menu-card:hover::before { opacity:1; }
  .db-menu-card:hover .db-card-icon { transform:scale(1.15) rotate(5deg); }
  .db-menu-card--primary { border-color:rgba(37,99,235,0.4); }

  .db-card-icon { width:54px; height:54px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.6rem; transition:transform 0.25s; }
  .db-card-icon--blue   { background:rgba(37,99,235,0.2);  box-shadow:0 0 16px rgba(37,99,235,0.2); }
  .db-card-icon--purple { background:rgba(124,58,237,0.2); box-shadow:0 0 16px rgba(124,58,237,0.15); }
  .db-card-icon--teal   { background:rgba(20,184,166,0.2); box-shadow:0 0 16px rgba(20,184,166,0.15); }
  .db-card-icon--red    { background:rgba(239,68,68,0.15); box-shadow:0 0 14px rgba(239,68,68,0.1); }
  .db-card-title { font-size:1rem; font-weight:700; color:var(--text-secondary); }
  .db-card-desc  { font-size:0.78rem; color:var(--text-dim); line-height:1.45; }

  .db-logout-btn {
    all:unset; box-sizing:border-box;
    background:var(--bg-card); backdrop-filter:blur(12px);
    border:1px solid rgba(239,68,68,0.18); border-radius:1rem;
    padding:1.5rem; width:100%;
    display:flex; flex-direction:column; align-items:center;
    gap:0.75rem; text-align:center;
    transition:all 0.25s ease; cursor:pointer; position:relative; overflow:hidden;
  }
  .db-logout-btn:hover { border-color:rgba(239,68,68,0.5); transform:translateY(-6px); box-shadow:var(--card-shadow-hover); }
  .db-logout-btn:hover .db-card-icon { transform:scale(1.15) rotate(5deg); }

  @media(max-width:480px){ .db-grid { grid-template-columns:1fr 1fr; } }
`;

const menuItems = [
    { to:'/game',    icon:'\u{1F680}', cls:'db-card-icon--blue',   title:'Nueva Partida',    desc:'Zarpa a rescatar la flota perdida', primary:true },
    { to:'/ranking', icon:'\u{1F3C6}', cls:'db-card-icon--purple', title:'Ver Ranking',       desc:'Compara tu posicion con otros capitanes' },
    { to:'/profile', icon:'\u2693',    cls:'db-card-icon--teal',   title:'Mi Flota / Perfil', desc:'Gestiona tu perfil y estadisticas' },
];

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <>
            <style>{styles}</style>
            <div className="naval-page">
                <OceanBG />
                <div className="naval-ship-scene"><ShipSVG /></div>

                <main className="naval-main">
                    <div className="db-hero">
                        <h2 className="db-hero-greeting">
                            {'Bienvenido, '}<span>{user?.username || 'Capitan'}</span>{'!'}
                        </h2>
                        <p className="db-hero-sub">{'Que mision vamos a cumplir hoy?'}</p>
                    </div>

                    <div className="db-grid">
                        {menuItems.map(item => (
                            <Link key={item.to} to={item.to}
                                className={`db-menu-card${item.primary?' db-menu-card--primary':''}`}>
                                <div className={`db-card-icon ${item.cls}`}>{item.icon}</div>
                                <div className="db-card-title">{item.title}</div>
                                <div className="db-card-desc">{item.desc}</div>
                            </Link>
                        ))}
                        <button className="db-logout-btn" onClick={handleLogout}>
                            <div className="db-card-icon db-card-icon--red">{'\u{1F6AA}'}</div>
                            <div className="db-card-title" style={{color:'#fca5a5'}}>Cerrar Sesion</div>
                            <div className="db-card-desc">Abandonar el puente de mando</div>
                        </button>
                    </div>
                </main>

                <RadarDeco />
            </div>
        </>
    );
}
