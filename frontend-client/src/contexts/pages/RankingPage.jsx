// src/pages/RankingPage.jsx
import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { navalBase, OceanBG, RadarDeco } from '../styles/Navaltheme';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const styles = navalBase + `
  .rank-wrap { width:100%; max-width:760px; display:flex; flex-direction:column; gap:1.25rem; animation:fadeInUp 0.6s ease-out both; }

  /* Chart */
  .rank-chart-card { background:rgba(8,14,28,0.9); backdrop-filter:blur(12px); border:1px solid rgba(37,99,235,0.22); border-radius:1.125rem; overflow:hidden; }
  .rank-chart-bar  { height:4px; background:linear-gradient(90deg,#1d4ed8,#60a5fa,#93c5fd,#60a5fa,#1d4ed8); background-size:200% 100%; animation:bar-slide 3s linear infinite; }
  .rank-chart-body { padding:1.5rem; }
  .rank-chart-title { font-size:0.8rem; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.08em; margin:0 0 1rem; }

  /* Table */
  .rank-table-card   { background:rgba(8,14,28,0.9); backdrop-filter:blur(12px); border:1px solid rgba(37,99,235,0.22); border-radius:1.125rem; overflow:hidden; }
  .rank-table-header { padding:1rem 1.5rem; border-bottom:1px solid rgba(37,99,235,0.15); font-size:0.8rem; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.08em; }
  .rank-table        { width:100%; border-collapse:collapse; }
  .rank-table thead tr { border-bottom:1px solid rgba(37,99,235,0.15); }
  .rank-table th { padding:0.75rem 1.25rem; text-align:left; font-size:0.7rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.08em; white-space:nowrap; }
  .rank-table td { padding:0.875rem 1.25rem; border-bottom:1px solid rgba(37,99,235,0.08); font-size:0.875rem; color:#d1d5db; transition:background 0.15s; }
  .rank-table tbody tr:last-child td { border-bottom:none; }
  .rank-table tbody tr:hover td { background:rgba(15,25,50,0.6); }

  .rank-pos     { font-weight:900; font-size:1rem; width:32px; height:32px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; }
  .rank-pos--1  { background:rgba(234,179,8,0.15);  color:#eab308; border:1px solid rgba(234,179,8,0.3); }
  .rank-pos--2  { background:rgba(148,163,184,0.12); color:#94a3b8; border:1px solid rgba(148,163,184,0.25); }
  .rank-pos--3  { background:rgba(180,83,9,0.15);   color:#f97316; border:1px solid rgba(249,115,22,0.3); }
  .rank-pos--n  { background:rgba(37,99,235,0.1);   color:#60a5fa; border:1px solid rgba(37,99,235,0.2); }
  .rank-username { font-weight:700; color:#e2e8f0; }

  .rank-empty      { text-align:center; padding:3rem 1rem; color:#4b5563; }
  .rank-empty-icon { font-size:3rem; margin-bottom:0.75rem; opacity:0.45; }
  .rank-loading    { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; gap:1rem; }
  .rank-loading-text { font-size:0.8rem; font-weight:700; color:#3b82f6; text-transform:uppercase; letter-spacing:0.12em; }
`;

const MEDALS  = { 1:'🥇', 2:'🥈', 3:'🥉' };
const POS_CLS = { 1:'rank-pos--1', 2:'rank-pos--2', 3:'rank-pos--3' };

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { display:false },
        tooltip: { backgroundColor:'rgba(8,14,28,0.95)', borderColor:'rgba(37,99,235,0.4)', borderWidth:1, titleColor:'#e2e8f0', bodyColor:'#9ca3af' },
    },
    scales: {
        x: { ticks:{ color:'#6b7280', font:{ size:11 } }, grid:{ color:'rgba(37,99,235,0.08)' }, border:{ color:'rgba(37,99,235,0.15)' } },
        y: { ticks:{ color:'#6b7280', font:{ size:11 } }, grid:{ color:'rgba(37,99,235,0.08)' }, border:{ color:'rgba(37,99,235,0.15)' } },
    },
};

export default function RankingPage() {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        api.get('/rankings')
            .then(r => setRankings(r.data))
            .catch(e => console.error('Error ranking:', e))
            .finally(() => setLoading(false));
    }, []);

    const top10 = rankings.slice(0, 10);
    const chartData = {
        labels: top10.map(r => r.username),
        datasets: [{
            label: 'Intentos',
            data: top10.map(r => r.attempts),
            backgroundColor: top10.map((_,i) => i===0?'rgba(234,179,8,0.7)':i===1?'rgba(148,163,184,0.6)':i===2?'rgba(249,115,22,0.6)':'rgba(37,99,235,0.55)'),
            borderColor:      top10.map((_,i) => i===0?'#eab308':i===1?'#94a3b8':i===2?'#f97316':'#3b82f6'),
            borderWidth:1.5, borderRadius:6,
        }],
    };

    return (
        <>
            <style>{styles}</style>
            <div className="naval-page">
                <OceanBG />

                <main className="naval-main">
                    {loading ? (
                        <div className="rank-loading">
                            <div className="naval-spinner"/>
                            <p className="rank-loading-text">Cargando clasificación...</p>
                        </div>
                    ) : (
                        <div className="rank-wrap">
                            <div style={{textAlign:'center'}}>
                                <h2 className="naval-section-title">🏆 Hall de la <span>Fama</span></h2>
                                <p className="naval-section-sub">Los mejores capitanes de Fleet Rescue</p>
                            </div>

                            {rankings.length === 0 ? (
                                <div className="rank-chart-card">
                                    <div className="rank-chart-bar"/>
                                    <div className="rank-empty">
                                        <div className="rank-empty-icon">🗺️</div>
                                        <p>Aún no hay capitanes en el ranking.<br/>¡Sé el primero en jugar!</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="rank-chart-card">
                                        <div className="rank-chart-bar"/>
                                        <div className="rank-chart-body">
                                            <p className="rank-chart-title">Top 10 — Menos intentos para ganar</p>
                                            <Bar data={chartData} options={chartOptions}/>
                                        </div>
                                    </div>

                                    <div className="rank-table-card">
                                        <div className="rank-table-header">📋 Clasificación completa</div>
                                        <div style={{overflowX:'auto'}}>
                                            <table className="rank-table">
                                                <thead>
                                                    <tr>
                                                        <th>Pos.</th><th>Capitán</th>
                                                        <th>Intentos</th><th>Tiempo</th><th>Fecha</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rankings.map((row, i) => {
                                                        const pos = i + 1;
                                                        return (
                                                            <tr key={i}>
                                                                <td><span className={`rank-pos ${POS_CLS[pos]||'rank-pos--n'}`}>{pos}</span></td>
                                                                <td><span className="rank-username">{MEDALS[pos]&&<span>{MEDALS[pos]} </span>}{row.username}</span></td>
                                                                <td style={{color:'#60a5fa',fontWeight:700}}>{row.attempts}</td>
                                                                <td>{row.total_time}s</td>
                                                                <td style={{color:'#6b7280',fontSize:'0.78rem'}}>{new Date(row.updated_at).toLocaleDateString()}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </main>
                <RadarDeco />
            </div>
        </>
    );
}