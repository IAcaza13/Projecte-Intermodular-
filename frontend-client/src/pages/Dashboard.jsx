import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Play, Trophy, LogOut, Ship } from 'lucide-react'; // Iconos para mejorar el diseño

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="max-w-2xl mx-auto mt-12 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
                    ¡Bienvenido, {user?.username}!
                </h1>
                <p className="text-gray-500 dark:text-gray-400">¿Qué misión vamos a cumplir hoy?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Botón Jugar */}
                <Link to="/game" className="flex flex-col items-center p-6 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all group">
                    <Play className="w-12 h-12 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="mt-4 font-bold text-lg">Nueva Partida</span>
                </Link>
                <br />
                {/* Botón Ranking */}
                <Link to="/ranking" className="flex flex-col items-center p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-all group">
                    <Trophy className="w-12 h-12 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform" />
                    <span className="mt-4 font-bold text-lg">Ver Ranking</span>
                </Link>
                <br />

                {/* Botón Perfil / Historial */}
                <Link 
    to="/profile" 
    className="flex flex-col items-center p-6 bg-green-50 dark:bg-green-900/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-all group border border-green-100 dark:border-green-800"
>
    <Ship className="w-12 h-12 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
    <span className="mt-4 font-bold text-lg">Mi Flota / Perfil</span>
</Link>
<br />
                {/* Botón Logout */}
                <button 
                    onClick={handleLogout}
                    className="flex flex-col items-center p-6 bg-red-50 dark:bg-red-900/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-all group"
                >
                    <LogOut className="w-12 h-12 text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform" />
                    <span className="mt-4 font-bold text-lg text-red-600 dark:text-red-400">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;