// App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RegisterForm } from './components/auth/RegisterForm';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ThemeToggle } from './components/UI/ThemeToggle';
import GamePage from './pages/GamePage';
import RankingPage from './pages/RankingPage';
import { LoginForm } from './components/auth/LoginForm';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import { navalBase, themeVariables } from './styles/Navaltheme';

// Ruta privada
const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

// Navbar único
const NavBar = () => {
    const location = useLocation();
    const authRoutes = ['/login', '/register'];
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    if (authRoutes.includes(location.pathname)) return null;

    return (
        <nav className="naval-nav">
            <Link to="/dashboard" className="naval-nav-brand">
                <div className="naval-nav-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                </div>
                <h1 className="naval-nav-title">Fleet<span>Rescue</span></h1>
            </Link>
            
            <div className="naval-nav-right">
                <span className="naval-user-name">
                    👤 <strong>{user?.username || 'Capitán'}</strong>
                </span>
                
                {/* Botón de tema simplificado - solo texto */}
                <button
                    onClick={toggleTheme}
                    className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                    style={{
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    {isDark ? '🌙 Oscuro' : '☀️ Claro '}
                </button>
                
                {location.pathname === '/game' && (
                    <button className="naval-nav-back" style={{ background:'var(--bg-card)' }}>
                        ✕ Abandonar
                    </button>
                )}
                
                <Link to="/dashboard" className="naval-nav-back">
                    ← Inicio
                </Link>
            </div>
        </nav>
    );
};

function AppContent() {
    return (
        <BrowserRouter>
            <NavBar />
            <main className="relative">
                <div className="relative z-10">
                    <Routes>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/game" element={<PrivateRoute><GamePage /></PrivateRoute>} />
                        <Route path="/ranking" element={<PrivateRoute><RankingPage /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                        <Route path="/" element={<PrivateRoute><Navigate to="/dashboard" /></PrivateRoute>} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </main>
        </BrowserRouter>
    );
}

function App() {
    return (
        <ThemeProvider>
            <style>{themeVariables}</style>
            <style>{navalBase}</style>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;