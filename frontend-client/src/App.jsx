// App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RegisterForm } from './components/auth/RegisterForm';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/UI/ThemeToggle';
import GamePage from './pages/GamePage';
import RankingPage from './pages/RankingPage';
import { LoginForm } from './components/auth/LoginForm';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';

// Importamos los estilos navales
import { navalBase } from './styles/Navaltheme';

// Ruta privada: redirige a /login si no hay usuario autenticado
const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

// NAVBAR ÚNICO con estilo naval
const NavBar = () => {
    const location = useLocation();
    const authRoutes = ['/login', '/register'];
    const { user } = useAuth();

    // Si estamos en login o register, no renderizamos el navbar
    if (authRoutes.includes(location.pathname)) return null;

    return (
        <>
            <style>{navalBase}</style>
            <nav className="naval-nav">
                <Link to="/dashboard" className="naval-nav-brand" style={{ textDecoration: 'none' }}>
                    <div className="naval-nav-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    <h1 className="naval-nav-title">Fleet <span>Rescue</span></h1>
                </Link>
                
                <div className="naval-nav-right">
                    {/* Nombre del usuario (estilo de Dashboard) */}
                    <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                        👤 <strong style={{ color: '#e2e8f0' }}>{user?.username || 'Capitán'}</strong>
                    </span>
                    
                    {/* ThemeToggle integrado */}
                    <ThemeToggle />
                    
                    {/* Enlace de navegación según la página */}
                    {location.pathname === '/game' && (
                        <button className="game-btn game-btn--ghost" 
                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                            ✕ Abandonar
                        </button>
                    )}
                    
                    <Link to="/dashboard" className="naval-nav-back" style={{ marginLeft: '0.5rem' }}>
                        ← Inicio
                    </Link>
                </div>
            </nav>
        </>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    {/* NavBar único con estilo naval */}
                    <NavBar />

                    <main className="relative">
                        {/* Fondo decorativo sutil */}
                        <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                        </div>

                        <div className="relative z-10">
                            <Routes>
                                {/* Rutas públicas — pantalla completa sin navbar */}
                                <Route path="/login" element={<LoginForm />} />
                                <Route path="/register" element={<RegisterForm />} />

                                {/* Rutas privadas */}
                                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                                <Route path="/game" element={<PrivateRoute><GamePage /></PrivateRoute>} />
                                <Route path="/ranking" element={<PrivateRoute><RankingPage /></PrivateRoute>} />
                                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

                                {/* Redireccionamientos */}
                                <Route path="/" element={<PrivateRoute><Navigate to="/dashboard" /></PrivateRoute>} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </div>
                    </main>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;