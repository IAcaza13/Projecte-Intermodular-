import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// Barco de 1 casilla (pequeño)
export const SmallShip = ({ className = "", orientation = "horizontal" }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    return (
        <svg 
            className={`w-full h-full ${className}`}
            viewBox="0 0 40 40" 
            fill="none" 
            xmlns="http://w3.org/2000/svg"
        >
            {/* Casco del barco */}
            <rect 
                x="5" y="15" 
                width="30" height="20" 
                rx="4" 
                fill={isDark ? "#4B5563" : "#6B7280"} 
                stroke={isDark ? "#9CA3AF" : "#4B5563"} 
                strokeWidth="2"
            />
            {/* Cubierta */}
            <rect 
                x="10" y="10" 
                width="20" height="10" 
                fill={isDark ? "#374151" : "#9CA3AF"} 
            />
            {/* Chimenea */}
            <circle 
                cx="20" cy="8" 
                r="4" 
                fill={isDark ? "#EF4444" : "#DC2626"} 
            />
        </svg>
    );
};

// Barco de 2 casillas (mediano)
export const MediumShip = ({ className = "", orientation = "horizontal" }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const rotation = orientation === "vertical" ? "rotate(90)" : "";
    
    return (
        <svg 
            className={`w-full h-full ${className}`}
            viewBox="0 0 80 40" 
            fill="none" 
            xmlns="http://w3.org/2000/svg"
            transform={rotation}
        >
            {/* Casco del barco (más largo) */}
            <rect 
                x="5" y="15" 
                width="70" height="20" 
                rx="4" 
                fill={isDark ? "#4B5563" : "#6B7280"} 
                stroke={isDark ? "#9CA3AF" : "#4B5563"} 
                strokeWidth="2"
            />
            {/* Cubierta con dos secciones */}
            <rect 
                x="15" y="10" 
                width="20" height="10" 
                fill={isDark ? "#374151" : "#9CA3AF"} 
            />
            <rect 
                x="45" y="10" 
                width="20" height="10" 
                fill={isDark ? "#374151" : "#9CA3AF"} 
            />
            {/* Dos chimeneas */}
            <circle 
                cx="25" cy="8" 
                r="4" 
                fill={isDark ? "#EF4444" : "#DC2626"} 
            />
            <circle 
                cx="55" cy="8" 
                r="4" 
                fill={isDark ? "#F59E0B" : "#D97706"} 
            />
        </svg>
    );
};

// Barco de 3 casillas (grande)
export const LargeShip = ({ className = "", orientation = "horizontal" }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const rotation = orientation === "vertical" ? "rotate(90)" : "";
    
    return (
        <svg 
            className={`w-full h-full ${className}`}
            viewBox="0 0 120 40" 
            fill="none" 
            xmlns="http://w3.org/2000/svg"
            transform={rotation}
        >
            {/* Casco del barco */}
            <rect 
                x="5" y="15" 
                width="110" height="20" 
                rx="4" 
                fill={isDark ? "#4B5563" : "#6B7280"} 
                stroke={isDark ? "#9CA3AF" : "#4B5563"} 
                strokeWidth="2"
            />
            {/* Cubierta con tres secciones */}
            <rect 
                x="15" y="10" 
                width="20" height="10" 
                fill={isDark ? "#374151" : "#9CA3AF"} 
            />
            <rect 
                x="45" y="10" 
                width="20" height="10" 
                fill={isDark ? "#374151" : "#9CA3AF"} 
            />
            <rect 
                x="75" y="10" 
                width="20" height="10" 
                fill={isDark ? "#374151" : "#9CA3AF"} 
            />
            {/* Tres chimeneas */}
            <circle 
                cx="25" cy="8" 
                r="4" 
                fill={isDark ? "#EF4444" : "#DC2626"} 
            />
            <circle 
                cx="55" cy="8" 
                r="4" 
                fill={isDark ? "#F59E0B" : "#D97706"} 
            />
            <circle 
                cx="85" cy="8" 
                r="4" 
                fill={isDark ? "#10B981" : "#059669"} 
            />
            {/* Mástil con bandera */}
            <line 
                x1="95" y1="8" 
                x2="95" y2="25" 
                stroke={isDark ? "#D1D5DB" : "#6B7280"} 
                strokeWidth="2"
            />
            <path 
                d="M95 8 L105 12 L95 16" 
                fill={isDark ? "#EF4444" : "#DC2626"} 
            />
        </svg>
    );
};

// Componente para mostrar un barco según su tamaño
export const Ship = ({ size, className = "", orientation = "horizontal" }) => {
    switch(size) {
        case 1:
            return <SmallShip className={className} orientation={orientation} />;
        case 2:
            return <MediumShip className={className} orientation={orientation} />;
        case 3:
            return <LargeShip className={className} orientation={orientation} />;
        default:
            return <SmallShip className={className} orientation={orientation} />;
    }
};
