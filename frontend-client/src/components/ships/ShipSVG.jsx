// src/components/ships/ShipSVG.jsx
// Nota: useTheme es opcional — si el contexto no está disponible, usa dark por defecto
import React from 'react';

let useThemeSafe;
try {
    // Intentamos importar; si falla (e.g. fuera del provider) usamos fallback
    const ctx = require('../../contexts/ThemeContext');
    useThemeSafe = ctx.useTheme;
} catch {
    useThemeSafe = () => ({ theme: 'dark' });
}

const getShipColors = (isDark) => ({
    fill:   isDark ? '#bfdbfe' : '#1e3a6e',
    stroke: isDark ? '#60a5fa' : '#1d4ed8',
});

// Destroyer — 2 casillas
export const Destroyer = ({ className = '', orientation = 'horizontal' }) => {
    let theme = 'dark';
    try { theme = useThemeSafe().theme; } catch {}
    const c   = getShipColors(theme === 'dark');
    const rot = orientation === 'vertical' ? 'rotate(90 20 20)' : '';
    return (
        <svg className={`w-full h-full ${className}`} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={rot}>
                <path d="M5 25 L10 20 L70 20 L75 25 L70 30 L10 30 Z" fill={c.fill} stroke={c.stroke} strokeWidth="1"/>
                <rect x="25" y="12" width="20" height="8" fill={c.fill}/>
                <rect x="30" y="7"  width="10" height="5" fill={c.fill}/>
            </g>
        </svg>
    );
};

// Cruiser — 3 casillas
export const Cruiser = ({ className = '', orientation = 'horizontal' }) => {
    let theme = 'dark';
    try { theme = useThemeSafe().theme; } catch {}
    const c   = getShipColors(theme === 'dark');
    const rot = orientation === 'vertical' ? 'rotate(90 60 20)' : '';
    return (
        <svg className={`w-full h-full ${className}`} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={rot}>
                <path d="M5 25 C5 25 10 18 20 18 L100 18 C110 18 115 25 115 25 L105 32 L15 32 Z" fill={c.fill} stroke={c.stroke} strokeWidth="1"/>
                <rect x="40" y="10" width="30" height="8" fill={c.fill}/>
                <circle cx="55" cy="7" r="3" fill={c.fill}/>
            </g>
        </svg>
    );
};

// Battleship — 4 casillas
export const Battleship = ({ className = '', orientation = 'horizontal' }) => {
    let theme = 'dark';
    try { theme = useThemeSafe().theme; } catch {}
    const c   = getShipColors(theme === 'dark');
    const rot = orientation === 'vertical' ? 'rotate(90 80 20)' : '';
    return (
        <svg className={`w-full h-full ${className}`} viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={rot}>
                <path d="M5 28 L20 15 L140 15 L155 28 L145 35 L15 35 Z" fill={c.fill} stroke={c.stroke} strokeWidth="1"/>
                <rect x="45"  y="8" width="15" height="7" fill={c.fill}/>
                <rect x="70"  y="5" width="20" height="10" fill={c.fill}/>
                <rect x="100" y="8" width="15" height="7" fill={c.fill}/>
            </g>
        </svg>
    );
};

// Carrier — 5 casillas
export const Carrier = ({ className = '', orientation = 'horizontal' }) => {
    let theme = 'dark';
    try { theme = useThemeSafe().theme; } catch {}
    const c   = getShipColors(theme === 'dark');
    const rot = orientation === 'vertical' ? 'rotate(90 100 20)' : '';
    return (
        <svg className={`w-full h-full ${className}`} viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={rot}>
                <rect x="5"   y="15" width="190" height="20" rx="2" fill={c.fill} stroke={c.stroke} strokeWidth="1"/>
                <rect x="140" y="5"  width="30"  height="10" fill={c.fill}/>
                <path d="M10 15 L30 5 L170 5 L190 15 Z" fill={c.fill} opacity="0.35"/>
            </g>
        </svg>
    );
};

// Selector
export const Ship = ({ size, className = '', orientation = 'horizontal' }) => {
    switch (size) {
        case 2:  return <Destroyer  className={className} orientation={orientation}/>;
        case 3:  return <Cruiser    className={className} orientation={orientation}/>;
        case 4:  return <Battleship className={className} orientation={orientation}/>;
        case 5:  return <Carrier    className={className} orientation={orientation}/>;
        default: return <Destroyer  className={className} orientation={orientation}/>;
    }
};