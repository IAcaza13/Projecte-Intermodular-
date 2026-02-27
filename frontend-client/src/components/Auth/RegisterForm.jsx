// src/components/auth/RegisterForm.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { navalBase, OceanBG, RadarDeco } from '../../styles/Navaltheme';

const styles = navalBase + `
  @keyframes bar-slide  { 0%{background-position:0% 0} 100%{background-position:200% 0} }
  @keyframes float      { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
  @keyframes title-glow { 0%,100%{text-shadow:0 0 20px rgba(96,165,250,0.4)} 50%{text-shadow:0 0 40px rgba(96,165,250,0.9)} }

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
  .fleet-content { position:relative; z-index:10; width:100%; max-width:448px; animation:fadeInUp 0.7s ease-out both; }

  .fleet-logo-wrap { text-align:center; margin-bottom:1.75rem; }
  .fleet-logo-icon {
    display:inline-flex; align-items:center; justify-content:center;
    width:68px; height:68px; background:#2563eb; border-radius:50%;
    margin-bottom:0.875rem; box-shadow:0 0 28px rgba(37,99,235,0.55);
    transition:all 0.3s; cursor:pointer; animation:float 6s ease-in-out infinite;
  }
  .fleet-logo-icon:hover { transform:rotate(6deg) scale(1.08); }
  .fleet-title {
    font-size:2.4rem; font-weight:900; letter-spacing:-0.05em;
    text-transform:uppercase; font-style:italic; color:#60a5fa;
    margin:0; line-height:1; animation:title-glow 3s ease-in-out infinite;
  }
  .fleet-title span  { color:#fff; }
  .fleet-subtitle    { color:#9ca3af; margin-top:0.5rem; font-size:0.875rem; }

  .fleet-card {
    background:rgba(8,14,28,0.93); backdrop-filter:blur(16px);
    border-radius:1.25rem; border:1px solid rgba(37,99,235,0.3);
    box-shadow:0 30px 70px rgba(0,0,0,0.65); overflow:hidden;
  }
  .fleet-card-bar {
    height:4px;
    background:linear-gradient(90deg,#1d4ed8,#60a5fa,#93c5fd,#60a5fa,#1d4ed8);
    background-size:200% 100%; animation:bar-slide 3s linear infinite;
  }
  .fleet-card-body { padding:2rem; }

  .fleet-form-title { font-size:1.5rem; font-weight:700; text-align:center; color:#fff; margin:0 0 0.5rem; }
  .fleet-form-desc  { text-align:center; color:#9ca3af; font-size:0.875rem; margin:0 0 1.5rem; }
  .fleet-error {
    background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.4);
    color:#fca5a5; padding:0.75rem 1rem; border-radius:0.5rem;
    font-size:0.875rem; margin-bottom:1.25rem;
  }

  .fleet-form  { display:flex; flex-direction:column; gap:1rem; }
  .fleet-field { display:flex; flex-direction:column; gap:0.4rem; }
  .fleet-label { font-size:0.875rem; font-weight:500; color:#d1d5db; }
  .fleet-input-wrap { position:relative; }
  .fleet-input-icon {
    position:absolute; left:0.75rem; top:50%; transform:translateY(-50%);
    color:#6b7280; pointer-events:none; width:20px; height:20px;
  }
  .fleet-input {
    width:100%; padding:0.75rem 0.75rem 0.75rem 2.5rem;
    background:#0c1626; border:1px solid #1e3a5f;
    border-radius:0.5rem; color:#fff; font-size:1rem; font-family:inherit;
    outline:none; transition:border-color 0.2s,box-shadow 0.2s; box-sizing:border-box;
  }
  .fleet-input::placeholder { color:#4b5563; }
  .fleet-input:focus { border-color:#3b82f6; background:#091220; box-shadow:0 0 0 3px rgba(59,130,246,0.2); }
  .fleet-field-error { font-size:0.75rem; color:#f87171; }
  .fleet-hint        { font-size:0.75rem; color:#6b7280; }

  .fleet-terms { display:flex; align-items:flex-start; gap:0.75rem; font-size:0.875rem; color:#9ca3af; cursor:pointer; }
  .fleet-terms input[type="checkbox"] { accent-color:#3b82f6; width:16px; height:16px; margin-top:2px; flex-shrink:0; cursor:pointer; }
  .fleet-terms a { color:#60a5fa; text-decoration:none; }
  .fleet-terms a:hover { text-decoration:underline; }

  .fleet-btn {
    width:100%; padding:0.875rem;
    background:linear-gradient(135deg,#2563eb,#1d4ed8);
    color:#fff; font-weight:700; font-size:1rem; font-family:inherit;
    border:none; border-radius:0.5rem; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:0.5rem;
    transition:all 0.2s; margin-top:0.25rem;
    box-shadow:0 4px 15px rgba(37,99,235,0.35);
  }
  .fleet-btn:hover { background:linear-gradient(135deg,#1d4ed8,#1e40af); transform:scale(1.02); box-shadow:0 8px 25px rgba(37,99,235,0.55); }
  .fleet-btn:active   { transform:scale(0.99); }
  .fleet-btn:disabled { opacity:0.7; cursor:not-allowed; transform:none; }
  .fleet-btn svg { transition:transform 0.2s; }
  .fleet-btn:hover svg { transform:rotate(12deg); }

  .fleet-link-row { text-align:center; font-size:0.875rem; color:#9ca3af; }
  .fleet-link     { color:#60a5fa; font-weight:500; text-decoration:none; }
  .fleet-link:hover { text-decoration:underline; }

  .fleet-card-footer { position:relative; height:48px; overflow:hidden; color:#060d1a; }
  .fleet-help { margin-top:1.5rem; text-align:center; font-size:0.875rem; color:#6b7280; }
`;

const LockIcon = () => (
    <svg className="fleet-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
    </svg>
);

export const RegisterForm = () => {
    const [formData, setFormData]     = useState({ username:'', email:'', password:'', password_confirmation:'' });
    const [termsAccepted, setTerms]   = useState(false);
    const [errors, setErrors]         = useState({});
    const [loading, setLoading]       = useState(false);
    const navigate = useNavigate();

    const handleChange = field => e => setFormData({ ...formData, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); setLoading(true);
        try {
            await api.post('/register', formData);
            navigate('/login');
        } catch (err) {
            if (err.response?.status === 400 || err.response?.status === 422) {
                setErrors(err.response.data.errors || err.response.data);
            } else {
                setErrors({ general: 'Error inesperado. Inténtalo de nuevo.' });
            }
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
                    <div className="fleet-logo-wrap">
                        <div className="fleet-logo-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <h1 className="fleet-title">Fleet <span>Rescue</span></h1>
                        <p className="fleet-subtitle">¡Rescata la flota perdida!</p>
                    </div>

                    <div className="fleet-card">
                        <div className="fleet-card-bar"/>
                        <div className="fleet-card-body">
                            <h2 className="fleet-form-title">Únete a la flota</h2>
                            <p className="fleet-form-desc">Crea tu cuenta y comienza el rescate</p>
                            {errors.general && <div className="fleet-error">{errors.general}</div>}

                            <form onSubmit={handleSubmit} className="fleet-form">
                                {/* Username */}
                                <div className="fleet-field">
                                    <label className="fleet-label" htmlFor="username">Nombre de usuario</label>
                                    <div className="fleet-input-wrap">
                                        <svg className="fleet-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                        </svg>
                                        <input id="username" type="text" className="fleet-input" placeholder="capitan_awesome"
                                            value={formData.username} onChange={handleChange('username')} required autoFocus/>
                                    </div>
                                    {errors.username && <span className="fleet-field-error">{errors.username[0]}</span>}
                                </div>

                                {/* Email */}
                                <div className="fleet-field">
                                    <label className="fleet-label" htmlFor="reg-email">Email</label>
                                    <div className="fleet-input-wrap">
                                        <svg className="fleet-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                        </svg>
                                        <input id="reg-email" type="email" className="fleet-input" placeholder="capitan@flota.com"
                                            value={formData.email} onChange={handleChange('email')} required/>
                                    </div>
                                    {errors.email && <span className="fleet-field-error">{errors.email[0]}</span>}
                                </div>

                                {/* Password */}
                                <div className="fleet-field">
                                    <label className="fleet-label" htmlFor="reg-password">Contraseña</label>
                                    <div className="fleet-input-wrap">
                                        <LockIcon/>
                                        <input id="reg-password" type="password" className="fleet-input" placeholder="••••••••"
                                            value={formData.password} onChange={handleChange('password')} required/>
                                    </div>
                                    {errors.password && <span className="fleet-field-error">{errors.password[0]}</span>}
                                    <span className="fleet-hint">Mínimo 6 caracteres</span>
                                </div>

                                {/* Confirm password */}
                                <div className="fleet-field">
                                    <label className="fleet-label" htmlFor="reg-confirm">Confirmar contraseña</label>
                                    <div className="fleet-input-wrap">
                                        <LockIcon/>
                                        <input id="reg-confirm" type="password" className="fleet-input" placeholder="••••••••"
                                            value={formData.password_confirmation} onChange={handleChange('password_confirmation')} required/>
                                    </div>
                                </div>

                                {/* Terms */}
                                <label className="fleet-terms">
                                    <input type="checkbox" checked={termsAccepted} onChange={e => setTerms(e.target.checked)} required/>
                                    <span>Acepto los <a href="#">términos del servicio</a> y la <a href="#">política de privacidad</a></span>
                                </label>

                                <button type="submit" className="fleet-btn" disabled={loading}>
                                    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
                                    </svg>
                                    {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                                </button>

                                <p className="fleet-link-row">
                                    ¿Ya tienes cuenta?{' '}
                                    <Link to="/login" className="fleet-link">Inicia sesión</Link>
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
                        ¿Ya eres parte de la flota?{' '}
                        <Link to="/login" className="fleet-link">Inicia sesión</Link>
                    </div>
                </div>

                <RadarDeco />
            </div>
        </>
    );
};