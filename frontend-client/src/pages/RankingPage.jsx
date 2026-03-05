// src/pages/RankingPage.jsx
import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { navalBase, OceanBG, RadarDeco, ThemeToggleBtn } from '../styles/Navaltheme';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    BarElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const styles = navalBase + `
  .rank-wrap { width:100%; max-width:800px; display:flex; flex-direction:column; gap:1.25rem; animation:fadeInUp 0.6s ease-out both; }

  /* Chart card */
  .rank-chart-card { background:var(--bg-card); backdrop-filter:blur(12px); border:1px solid var(--border-color); border-radius:1.125rem; overflow:hidden; }
  .rank-chart-bar  { height:4px; background:linear-gradient(90deg,#1d4ed8,#60a5fa,#93c5fd,#60a5fa,#1d4ed8); background-size:200% 100%; animation:bar-slide 3s linear infinite; }
  .rank-chart-body { padding:1.5rem; }
  .rank-chart-title { font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em; margin:0 0 1rem; }

  /* Table card */
  .rank-table-card   { background:var(--bg-card); backdrop-filter:blur(12px); border:1px solid var(--border-color); border-radius:1.125rem; overflow:hidden; }
  .rank-table-header { padding:1rem 1.5rem; border-bottom:1px solid var(--border-color); font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em; }

  .rank-table { width:100%; border-collapse:collapse; }
  .rank-table thead tr { border-bottom:1px solid var(--border-color); }
  .rank-table th { padding:0.75rem 1rem; text-align:left; font-size:0.68rem; font-weight:700; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.08em; white-space:nowrap; }
  .rank-table td { padding:0.875rem 1rem; border-bottom:1px solid var(--border-color); font-size:0.875rem; color:var(--text-secondary); transition:background 0.15s; }
  .rank-table tbody tr:last-child td { border-bottom:none; }
  .rank-table tbody tr:hover td { background:var(--bg-row-hover); }

  /* Position badge */
  .rank-pos { font-weight:900; font-size:0.9rem; width:32px; height:32px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; }
  .rank-pos--1 { background:rgba(234,179,8,0.15);  color:#eab308; border:1px solid rgba(234,179,8,0.35); }
  .rank-pos--2 { background:rgba(148,163,184,0.12); color:#94a3b8; border:1px solid rgba(148,163,184,0.28); }
  .rank-pos--3 { background:rgba(249,115,22,0.13);  color:#f97316; border:1px solid rgba(249,115,22,0.32); }
  .rank-pos--n { background:rgba(37,99,235,0.1);    color:var(--accent-secondary); border:1px solid rgba(37,99,235,0.22); }

  .rank-username { font-weight:700; color:var(--text-secondary); }
  .rank-attempts { color:var(--accent-secondary); font-weight:700; font-family:monospace; font-size:1rem; }
  .rank-time     { font-family:monospace; font-size:0.82rem; color:var(--text-muted); }
  .rank-accuracy { font-family:monospace; font-size:0.82rem; }

  /* Accuracy bar */
  .rank-acc-wrap { display:flex; align-items:center; gap:6px; }
  .rank-acc-track { flex:1; height:5px; background:rgba(37,99,235,0.1); border-radius:3px; overflow:hidden; min-width:50px; }
  .rank-acc-fill  { height:100%; border-radius:3px; background:linear-gradient(90deg,#16a34a,#22c55e); }

  .rank-empty      { text-align:center; padding:3rem 1rem; color:var(--text-dim); }
  .rank-empty-icon { font-size:3rem; margin-bottom:0.75rem; opacity:0.45; }
  .rank-loading    { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; gap:1rem; }
  .rank-loading-text { font-size:0.8rem; font-weight:700; color:var(--accent-secondary); text-transform:uppercase; letter-spacing:0.12em; }
`;

const MEDALS   = { 1: '🥇', 2: '🥈', 3: '🥉' };
const POS_CLS  = { 1: 'rank-pos--1', 2: 'rank-pos--2', 3: 'rank-pos--3' };

const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '—';
    if (seconds === 0) return '—';          // partida sin tiempo registrado
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${String(s).padStart(2,'0')}s` : `${s}s`;
};

const getChartOptions = () => {
    const style   = getComputedStyle(document.documentElement);
    const tick    = style.getPropertyValue('--chart-tick').trim()  || '#6b7280';
    const grid    = style.getPropertyValue('--chart-grid').trim()  || 'rgba(37,99,235,0.08)';
    const ttBg    = style.getPropertyValue('--tooltip-bg').trim()  || 'rgba(8,14,28,0.95)';
    const ttText  = style.getPropertyValue('--tooltip-text').trim()|| '#e2e8f0';
    return {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: ttBg, borderColor: 'rgba(37,99,235,0.4)', borderWidth: 1,
                titleColor: ttText, bodyColor: tick,
                callbacks: {
                    label: (ctx) => ` ${ctx.parsed.y} intentos`,
                },
            },
        },
        scales: {
            x: { ticks:{ color:tick, font:{ size:11 } }, grid:{ color:grid }, border:{ color:grid } },
            y: {
                ticks:{ color:tick, font:{ size:11 }, stepSize:1 },
                grid:{ color:grid }, border:{ color:grid },
                title:{ display:true, text:'Intentos', color:tick, font:{ size:10 } },
            },
        },
    };
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
            data:  top10.map(r => r.attempts),
            backgroundColor: top10.map((_, i) =>
                i === 0 ? 'rgba(234,179,8,0.7)'
                : i === 1 ? 'rgba(148,163,184,0.6)'
                : i === 2 ? 'rgba(249,115,22,0.6)'
                : 'rgba(37,99,235,0.55)'
            ),
            borderColor: top10.map((_, i) =>
                i === 0 ? '#eab308' : i === 1 ? '#94a3b8' : i === 2 ? '#f97316' : '#3b82f6'
            ),
            borderWidth: 1.5,
            borderRadius: 6,
        }],
    };

    return (
        <>
            <style>{styles}</style>
            <div className="naval-page">
                <OceanBG />

                <nav className="naval-nav">
                    <div className="naval-nav-brand">
                        <div className="naval-nav-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <h1 className="naval-nav-title">Fleet <span>Rescue</span></h1>
                    </div>
                    <div className="naval-nav-right">
                        <ThemeToggleBtn />
                        <Link to="/dashboard" className="naval-nav-back">← Inicio</Link>
                    </div>
                </nav>

                <main className="naval-main">
                    {loading ? (
                        <div className="rank-loading">
                            <div className="naval-spinner"/>
                            <p className="rank-loading-text">Cargando clasificación...</p>
                        </div>
                    ) : (
                        <div className="rank-wrap">

                            <div style={{ textAlign:'center' }}>
                                <h2 className="naval-section-title">🏆 Hall de la <span>Fama</span></h2>
                                <p className="naval-section-sub">
                                    Mejores capitanes — ordenados por menos intentos, luego por menor tiempo
                                </p>
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
                                    {/* Gráfico de barras */}
                                    <div className="rank-chart-card">
                                        <div className="rank-chart-bar"/>
                                        <div className="rank-chart-body">
                                            <p className="rank-chart-title">
                                                Top {top10.length} — Intentos para ganar (menos = mejor)
                                            </p>
                                            <Bar data={chartData} options={getChartOptions()}/>
                                        </div>
                                    </div>

                                    {/* Tabla completa */}
                                    <div className="rank-table-card">
                                        <div className="rank-table-header">
                                            📋 Clasificación completa · {rankings.length} capitán{rankings.length !== 1 ? 'es' : ''}
                                        </div>
                                        <div style={{ overflowX:'auto' }}>
                                            <table className="rank-table">
                                                <thead>
                                                    <tr>
                                                        <th>Pos.</th>
                                                        <th>Capitán</th>
                                                        <th>Intentos</th>
                                                        <th>Precisión</th>
                                                        <th>Tiempo</th>
                                                        <th>Fecha</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rankings.map((row, i) => {
                                                        const pos      = i + 1;
                                                        const accuracy = row.attempts > 0
                                                            ? Math.round((row.hits / row.attempts) * 100)
                                                            : 0;
                                                        return (
                                                            <tr key={row.user_id || i}>
                                                                <td>
                                                                    <span className={`rank-pos ${POS_CLS[pos] || 'rank-pos--n'}`}>
                                                                        {pos}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span className="rank-username">
                                                                        {MEDALS[pos] && <span style={{ marginRight:'5px' }}>{MEDALS[pos]}</span>}
                                                                        {row.username}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span className="rank-attempts">{row.attempts}</span>
                                                                </td>
                                                                <td>
                                                                    <div className="rank-acc-wrap">
                                                                        <div className="rank-acc-track">
                                                                            <div className="rank-acc-fill" style={{ width:`${accuracy}%` }}/>
                                                                        </div>
                                                                        <span className="rank-accuracy" style={{
                                                                            color: accuracy >= 50 ? '#22c55e' : accuracy >= 30 ? '#eab308' : '#94a3b8'
                                                                        }}>
                                                                            {accuracy}%
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span className="rank-time">⏱ {formatTime(row.total_time)}</span>
                                                                </td>
                                                                <td style={{ color:'var(--text-dim)', fontSize:'0.78rem' }}>
                                                                    {new Date(row.updated_at || row.created_at).toLocaleDateString('es-ES')}
                                                                </td>
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