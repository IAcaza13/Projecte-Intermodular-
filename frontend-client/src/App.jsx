import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RegisterForm } from './components/Auth/RegisterForm';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/UI/ThemeToggle';
// Otros componentes...

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
      <ThemeProvider>
        <AuthProvider>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-500">
                <nav className="p-4 flex justify-between items-center bg-white dark:bg-slate-800 shadow-md">
                    <span className="font-bold text-xl">Fleet Rescue</span>
                    <ThemeToggle />
                </nav>
                <BrowserRouter>
                    <Routes>
                        <Route path="/register" element={<RegisterForm />} />
                        {/* Ruta protegida para el juego [cite: 70] */}
                        <Route path="/game" element={<PrivateRoute> <GamePage /> </PrivateRoute>} />
                        <Route path="/ranking" element={< PrivateRoute><RankingPage /></PrivateRoute>} />
                        {/* Redirige a /game por defecto si el usuario está autenticado */}
                        <Route path="/" element={<PrivateRoute> <Navigate to="/game" /> </PrivateRoute>} />
                    </Routes>
                </BrowserRouter>
            </div>
        </AuthProvider>
      </ThemeProvider>
    );
}

export default App
