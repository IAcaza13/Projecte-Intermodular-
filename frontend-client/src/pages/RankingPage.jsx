import React, { useEffect, useState, Link } from 'react';
import api from '../api/axiosConfig';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RankingPage = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const { data } = await api.get('/rankings');
                setRankings(data);
                if (data.length === 0) {
                    alert("Aún no hay jugadores en el ranking. ¡Sé el primero en jugar!");
                }
            } catch (error) {
                console.error("Error al cargar el ranking", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRankings();
    }, []);

    // Configuración de los datos del gráfico
    const chartData = {
        labels: rankings.map(r => r.username),
        datasets: [
            {
                label: 'Intentos para ganar',
                data: rankings.map(r => r.attempts),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    if (loading) return <div className="text-center mt-10">Cargando clasificación...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-xl rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-8">🏆 Hall de la Fama - Fleet Rescue</h1>
    
            {/* Gráfico de rendimiento */}
            <div className="mb-10 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <Bar data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Top 10 Jugadores (Menos intentos)' } } }} />
            </div>

            {/* Tabla de Ranking */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-3">Posición</th>
                            <th className="p-3">Usuario</th>
                            <th className="p-3">Intentos</th>
                            <th className="p-3">Tiempo (s)</th>
                            <th className="p-3">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.map((row, index) => (
                            <tr key={index} className="border-b dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <td className="p-3 font-bold">{index + 1}º</td>
                                <td className="p-3 text-blue-600 dark:text-blue-400">{row.username}</td>
                                <td className="p-3">{row.attempts}</td>
                                <td className="p-3">{row.total_time}s</td>
                                <td className="p-3 text-sm text-gray-500">
                                    {new Date(row.updated_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RankingPage;