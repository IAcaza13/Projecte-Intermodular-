// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { navalBase, OceanBG, RadarDeco } from '../../styles/Navaltheme';

const styles = navalBase + `
  @keyframes bar-slide { 0%{background-position:0% 0} 100%{background-position:200% 0} }
  @keyframes float     { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
  @keyframes ship-bob  { 0%,100%{transform:translateY(0px) rotate(-1deg)} 50%{transform:translateY(-9px) rotate(1deg)} }
  @keyframes ship-enter{ from{opacity:0;transform:translateX(-50px) translateY(8px)} to{opacity:1;transform:translateX(0) translateY(0)} }
  @keyframes title-glow{ 0%,100%{text-shadow:0 0 20px rgba(96,165,250,0.4)} 50%{text-shadow:0 0 40px rgba(96,165,250,0.9),0 0 80px rgba(37,99,235,0.3)} }

  /* Page override para login (centrado) */
  .fleet-page {
    font-family:'Instrument Sans',ui-sans-serif,system-ui,sans-serif;
    min-height:100vh; background:#05080f; color:#f9fafb;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:2rem 1rem; position:relative; overflow:hidden;
  }
  .fleet-page::before {
    content:''; position:fixed; inset:0;
    background-image:
      linear-gradient(rgba(59,130,246,0.06) 1px,transparent 1px),
      linear-gradient(90deg,rgba(59,130,246,0.06) 1px,transparent 1px);
    background-size:40px 40px; pointer-events:none; z-index:0;
  }

  .fleet-content {
    position:relative; z-index:10; width:100%; max-width:448px;
    animation:fadeInUp 0.7s ease-out both;
  }

  /* Logo area */
  .fleet-logo-wrap   { text-align:center; margin-bottom:1.75rem; position:relative; z-index:10; }
  .fleet-ship-wrap   { animation:ship-bob 4s ease-in-out infinite, ship-enter 0.9s ease-out both; margin-bottom:0.25rem; }
  .fleet-logo-icon   {
    display:inline-flex; align-items:center; justify-content:center;
    width:68px; height:68px; background:#2563eb; border-radius:50%;
    margin-bottom:0.875rem; box-shadow:0 0 28px rgba(37,99,235,0.55);
    transition:all 0.3s ease; cursor:pointer;
    animation:float 6s ease-in-out infinite;
  }
  .fleet-logo-icon:hover { transform:rotate(6deg) scale(1.08); box-shadow:0 0 50px rgba(59,130,246,0.8); }
  .fleet-title {
    font-size:2.4rem; font-weight:900; letter-spacing:-0.05em;
    text-transform:uppercase; font-style:italic; color:#60a5fa;
    margin:0; line-height:1; animation:title-glow 3s ease-in-out infinite;
  }
  .fleet-title span  { color:#fff; }
  .fleet-subtitle    { color:#9ca3af; margin-top:0.5rem; font-size:0.875rem; }

  /* Card */
  .fleet-card {
    background:rgba(8,14,28,0.93); backdrop-filter:blur(16px);
    border-radius:1.25rem; border:1px solid rgba(37,99,235,0.3);
    box-shadow:0 30px 70px rgba(0,0,0,0.65),inset 0 1px 0 rgba(96,165,250,0.08);
    overflow:hidden;
  }
  .fleet-card-bar {
    height:4px;
    background:linear-gradient(90deg,#1d4ed8,#60a5fa,#93c5fd,#60a5fa,#1d4ed8);
    background-size:200% 100%; animation:bar-slide 3s linear infinite;
  }
  .fleet-card-body { padding:2rem; }

  .fleet-form-title  { font-size:1.5rem; font-weight:700; text-align:center; color:#fff; margin:0 0 0.5rem; }
  .fleet-form-desc   { text-align:center; color:#9ca3af; font-size:0.875rem; margin:0 0 2rem; }
  .fleet-error {
    background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.4);
    color:#fca5a5; padding:0.75rem 1rem; border-radius:0.5rem;
    font-size:0.875rem; margin-bottom:1.25rem;
  }

  /* Form fields */
  .fleet-form  { display:flex; flex-direction:column; gap:1.25rem; }
  .fleet-field { display:flex; flex-direction:column; gap:0.5rem; }
  .fleet-label { font-size:0.875rem; font-weight:500; color:#d1d5db; }
  .fleet-input-wrap  { position:relative; }
  .fleet-input-icon  {
    position:absolute; left:0.75rem; top:50%; transform:translateY(-50%);
    color:#6b7280; pointer-events:none; width:20px; height:20px;
  }
  .fleet-input {
    width:100%; padding:0.75rem 0.75rem 0.75rem 2.5rem;
    background:#0c1626; border:1px solid #1e3a5f;
    border-radius:0.5rem; color:#fff; font-size:1rem; font-family:inherit;
    outline:none; transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;
    box-sizing:border-box;
  }
  .fleet-input::placeholder { color:#4b5563; }
  .fleet-input:focus { border-color:#3b82f6; background:#091220; box-shadow:0 0 0 3px rgba(59,130,246,0.2); }

  .fleet-row       { display:flex; align-items:center; justify-content:space-between; font-size:0.875rem; }
  .fleet-remember  { display:flex; align-items:center; gap:0.5rem; color:#9ca3af; cursor:pointer; }
  .fleet-remember input[type="checkbox"] { accent-color:#3b82f6; width:16px; height:16px; cursor:pointer; }
  .fleet-forgot    { color:#60a5fa; text-decoration:none; font-size:0.8rem; }
  .fleet-forgot:hover { text-decoration:underline; }

  .fleet-btn {
    width:100%; padding:0.875rem;
    background:linear-gradient(135deg,#2563eb,#1d4ed8);
    color:#fff; font-weight:700; font-size:1rem; font-family:inherit;
    border:none; border-radius:0.5rem; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:0.5rem;
    transition:all 0.2s; box-shadow:0 4px 15px rgba(37,99,235,0.35);
  }
  .fleet-btn:hover { background:linear-gradient(135deg,#1d4ed8,#1e40af); transform:scale(1.02); box-shadow:0 8px 25px rgba(37,99,235,0.55); }
  .fleet-btn:active   { transform:scale(0.99); }
  .fleet-btn:disabled { opacity:0.7; cursor:not-allowed; transform:none; }
  .fleet-btn svg { transition:transform 0.2s; }
  .fleet-btn:hover svg { transform:rotate(12deg); }

  .fleet-link-row { text-align:center; font-size:0.875rem; color:#9ca3af; margin-top:0.5rem; }
  .fleet-link     { color:#60a5fa; font-weight:500; text-decoration:none; }
  .fleet-link:hover { text-decoration:underline; }

  .fleet-card-footer { position:relative; height:48px; overflow:hidden; color:#060d1a; }
  .fleet-help { margin-top:1.5rem; text-align:center; font-size:0.875rem; color:#6b7280; }
`;

// Barco pequeño para la pantalla de login
const LoginShip = () => (
    <svg width="200" height="72" viewBox="0 0 200 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 50 L32 36 L168 36 L185 50 L172 62 L28 62 Z" fill="#1e3a6e" stroke="#3b82f6" strokeWidth="1.5"/>
        <rect x="60" y="22" width="60" height="14" rx="3" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1"/>
        <rect x="78" y="10" width="32" height="13" rx="2" fill="#2563eb" stroke="#93c5fd" strokeWidth="1"/>
        <rect x="96" y="3"  width="9"  height="10" rx="1" fill="#172554" stroke="#60a5fa" strokeWidth="1"/>
        <circle cx="100" cy="1"  r="3.5" fill="#1e293b" opacity="0.7"/>
        <circle cx="96"  cy="-3" r="2.5" fill="#1e293b" opacity="0.45"/>
        <line x1="88" y1="10" x2="88" y2="1"  stroke="#93c5fd" strokeWidth="1.5"/>
        <line x1="88" y1="3"  x2="104" y2="6" stroke="#93c5fd" strokeWidth="1"/>
        <circle cx="82"  cy="29" r="3.5" fill="#bfdbfe" opacity="0.9"/>
        <circle cx="94"  cy="29" r="3.5" fill="#bfdbfe" opacity="0.9"/>
        <circle cx="106" cy="29" r="3.5" fill="#bfdbfe" opacity="0.7"/>
        <rect x="160" y="40" width="28" height="5" rx="2" fill="#1e3a6e" stroke="#3b82f6" strokeWidth="1"/>
        <line x1="28" y1="58" x2="172" y2="58" stroke="#60a5fa" strokeWidth="1" opacity="0.35"/>
        <path d="M35 64 Q100 68 165 64" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.25"/>
    </svg>
);

export const LoginForm = () => {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const { login }   = useAuth();
    const navigate    = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch {
            setError('Credenciales incorrectas. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="fleet-page">
                <OceanBG />

                <div className="fleet-content">
                    {/* Logo + barco */}
                    <div className="fleet-logo-wrap">
                        <div className="fleet-ship-wrap"><LoginShip /></div>
                        <div className="fleet-logo-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <h1 className="fleet-title">Fleet <span>Rescue</span></h1>
                        <p className="fleet-subtitle">¡Rescata la flota perdida!</p>
                    </div>

                    {/* Card */}
                    <div className="fleet-card">
                        <div className="fleet-card-bar"/>
                        <div className="fleet-card-body">
                            <h2 className="fleet-form-title">Bienvenido de vuelta</h2>
                            <p className="fleet-form-desc">Introduce tus credenciales para continuar</p>
                            {error && <div className="fleet-error">{error}</div>}

                            <form onSubmit={handleSubmit} className="fleet-form">
                                <div className="fleet-field">
                                    <label className="fleet-label" htmlFor="email">Email</label>
                                    <div className="fleet-input-wrap">
                                        <svg className="fleet-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                        </svg>
                                        <input id="email" type="email" className="fleet-input" placeholder="tu@email.com"
                                            value={email} onChange={e => setEmail(e.target.value)} required autoFocus/>
                                    </div>
                                </div>

                                <div className="fleet-field">
                                    <label className="fleet-label" htmlFor="password">Contraseña</label>
                                    <div className="fleet-input-wrap">
                                        <svg className="fleet-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                                        </svg>
                                        <input id="password" type="password" className="fleet-input" placeholder="••••••••"
                                            value={password} onChange={e => setPassword(e.target.value)} required/>
                                    </div>
                                </div>

                                <div className="fleet-row">
                                    <label className="fleet-remember">
                                        <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/>
                                        Recordarme
                                    </label>
                                    <a href="#" className="fleet-forgot">¿Olvidaste tu contraseña?</a>
                                </div>

                                <button type="submit" className="fleet-btn" disabled={loading}>
                                    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                    {loading ? 'Entrando...' : 'Iniciar Sesión'}
                                </button>

                                <p className="fleet-link-row">
                                    ¿No tienes cuenta?{' '}
                                    <Link to="/register" className="fleet-link">Regístrate aquí</Link>
                                </p>
                            </form>
                        </div>

                        <div className="fleet-card-footer">
                            <svg style={{position:'absolute',bottom:0,width:'100%',height:'48px',color:'#060d1a'}}
                                preserveAspectRatio="none" viewBox="0 0 1200 120">
                                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>

                    <div className="fleet-help">
                        ¿Eres un nuevo recluta?{' '}
                        <Link to="/register" className="fleet-link">Únete a la flota</Link>
                    </div>
                </div>

                <RadarDeco />
            </div>
        </>
    );
};