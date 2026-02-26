import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axiosConfig'; // <--- Importamos TU instancia configurada
import { Shield, Anchor, History, Loader2, Trophy, Skull, Swords } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuth(); // Ya no necesitamos el token aquí si tu 'api' lo añade solo
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Usamos el método .get() de tu instancia 'api'
                // La URL se simplifica porque la baseURL ya está definida
                const response = await api.get('/history'); 
                setHistoryData(response.data);
            } catch (error) {
                console.error("Error al obtener historial naval:", error);
                // Aquí podrías manejar el error 401 si el token expiró
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Estadísticas derivadas de la respuesta del servidor
    const totalGames = historyData.length;
    const wins = historyData.filter(game => game.win === 1 || game.win === true).length;

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
            <p className="mt-4 font-black text-blue-600 animate-pulse tracking-widest">SINCRONIZANDO BITÁCORA...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-t-4 border-blue-600">
            {/* Cabecera del Perfil */}
            <div className="flex items-center gap-6 mb-8 pb-6 border-b dark:border-slate-700">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Shield className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-black uppercase italic text-slate-800 dark:text-white leading-tight">Perfil del Capitán</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Comandante: <span className="text-blue-600 dark:text-blue-400 font-bold">{user?.username}</span>
                    </p>
                </div>
            </div>

            {/* Grid de Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase font-black text-slate-400 tracking-widest">Incursiones</p>
                        <p className="text-3xl font-black">{totalGames}</p>
                    </div>
                    <Swords className="text-slate-300 dark:text-slate-600" size={40} />
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase font-black text-slate-400 tracking-widest">Victorias</p>
                        <p className="text-3xl font-black text-green-500">{wins}</p>
                    </div>
                    <Trophy className="text-yellow-500" size={40} />
                </div>
            </div>

            {/* Historial de Partidas */}
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase tracking-tight">
                <History className="text-blue-500" /> Historial de Combate
            </h3>

            <div className="space-y-3">
                {historyData.length > 0 ? (
                    historyData.map((game) => (
                        <div key={game.id} className="group p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all shadow-sm">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    {game.win ? <Trophy className="text-green-500" /> : <Skull className="text-red-500" />}
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 uppercase text-sm">
                                            {game.win ? 'Misión Cumplida' : 'Nave Perdida'}
                                        </p>
                                        <p className="text-xs text-slate-500 font-mono">PUNTOS: {game.score || 0}</p>
                                    </div>
                                </div>
                                <div className="text-right text-[10px] text-slate-400 font-bold uppercase">
                                    {new Date(game.created_at).toLocaleDateString()}
                                    <br />
                                    {new Date(game.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <Anchor className="mx-auto text-slate-300 mb-2" size={48} />
                        <p className="text-slate-500 italic font-medium">No se han detectado movimientos en tu radar naval.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;