import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RegisterForm } from './components/Auth/RegisterForm';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/UI/ThemeToggle';
import  GamePage  from './pages/GamePage';
import  RankingPage  from './pages/RankingPage';
import { LoginForm } from './components/Auth/LoginForm';
import Dashboard from './pages/Dashboard';
import { Anchor } from 'lucide-react'; // Importamos un icono temático

// Componente de Ruta Privada corregido
const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    // Navigate no lleva 'element', solo 'to'
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
      <ThemeProvider>
        <AuthProvider>
            {/* Contenedor principal con fuente más "gaming" y transiciones */}
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
                
                <BrowserRouter>
                    {/* Header temático estilo Radar/Naval */}
                    <nav className="p-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b-2 border-blue-500 dark:border-blue-700 sticky top-0 z-50 shadow-lg">
                        <div className="flex items-center gap-2 group">
                            <div className="p-2 bg-blue-600 rounded-lg group-hover:rotate-12 transition-transform">
                                <Anchor className="text-white" size={24} />
                            </div>
                            <h1 className="font-black text-2xl tracking-tighter uppercase italic text-blue-700 dark:text-blue-400">
                                Fleet <span className="text-slate-800 dark:text-white">Rescue</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Aquí podrías añadir un indicador de "Radar activo" o similar */}
                            <div className="hidden md:block h-2 w-32 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 animate-[pulse_2s_infinite] w-full"></div>
                            </div>
                            <ThemeToggle />
                        </div>
                    </nav>

                    {/* Contenedor de las páginas con un fondo sutil de rejilla naval */}
                    <main className="relative">
                        {/* Decoración de fondo (opcional, estilo coordenadas) */}
                        <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', size: '40px 40px' }}></div>
                        </div>

                        <div className="relative z-10 p-4">
                            <Routes>
                                <Route path="/register" element={<RegisterForm />} />
                                <Route path="/login" element={<LoginForm />} />
                                
                                <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
                                <Route path="/game" element={<PrivateRoute> <GamePage /> </PrivateRoute>} />
                                <Route path="/ranking" element={< PrivateRoute><RankingPage /></PrivateRoute>} />
                                
                                <Route path="/" element={<PrivateRoute> <Navigate to="/dashboard" /> </PrivateRoute>} />
                                
                                {/* Catch-all para rutas inexistentes */}
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </div>
                    </main>
                </BrowserRouter>
            </div>
        </AuthProvider>
      </ThemeProvider>
    );
}

export default App;
