import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// Estilo común para todos los barcos: Bicolor y reacciona al tema
const getShipColors = (isDark) => ({
    fill: isDark ? "#FFFFFF" : "#000000", // Blanco en dark, Negro en light
    stroke: isDark ? "#9CA3AF" : "#4B5563"
});

// Destroyer - 2 Casillas (Inspirado en la silueta de la imagen)
export const Destroyer = ({ className = "", orientation = "horizontal" }) => {
    const { theme } = useTheme();
    const colors = getShipColors(theme === 'dark');
    const rotation = orientation === "vertical" ? "rotate(90 20 20)" : "";

    return (
        <svg className={`w-full h-full ${className}`} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={rotation}>
                <path d="M5 25 L10 20 L70 20 L75 25 L70 30 L10 30 Z" fill={colors.fill} />
                <rect x="25" y="12" width="20" height="8" fill={colors.fill} />
                <rect x="30" y="7" width="10" height="5" fill={colors.fill} />
            </g>
        </svg>
    );
};

// Submarine/Cruiser - 3 Casillas
export const Cruiser = ({ className = "", orientation = "horizontal" }) => {
    const { theme } = useTheme();
    const colors = getShipColors(theme === 'dark');
    const rotation = orientation === "vertical" ? "rotate(90 60 20)" : "";

    return (
        <svg className={`w-full h-full ${className}`} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={rotation}>
                <path d="M5 25 C 5 25, 10 18, 20 18 L100 18 C 110 18, 115 25, 115 25 L105 32 L15 32 Z" fill={colors.fill} />
                <rect x="40" y="10" width="30" height="8" fill={colors.fill} />
                <circle cx="55" cy="7" r="3" fill={colors.fill} />
            </g>
        </svg>
    );
};

// Battleship - 4 Casillas
export const Battleship = ({ className = "", orientation = "horizontal" }) => {
    const { theme } = useTheme();
    const colors = getShipColors(theme === 'dark');
    const rotation = orientation === "vertical" ? "rotate(90 80 20)" : "";

    return (
        <svg className={`w-full h-full ${className}`} viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={rotation}>
                <path d="M5 28 L20 15 L140 15 L155 28 L145 35 L15 35 Z" fill={colors.fill} />
                <rect x="45" y="8" width="15" height="7" fill={colors.fill} />
                <rect x="70" y="5" width="20" height="10" fill={colors.fill} />
                <rect x="100" y="8" width="15" height="7" fill={colors.fill} />
            </g>
        </svg>
    );
};

// Carrier - 5 Casillas
export const Carrier = ({ className = "", orientation = "horizontal" }) => {
    const { theme } = useTheme();
    const colors = getShipColors(theme === 'dark');
    const rotation = orientation === "vertical" ? "rotate(90 100 20)" : "";

    return (
        <svg className={`w-full h-full ${className}`} viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={rotation}>
                <rect x="5" y="15" width="190" height="20" rx="2" fill={colors.fill} />
                <rect x="140" y="5" width="30" height="10" fill={colors.fill} />
                <path d="M10 15 L30 5 L170 5 L190 15 Z" fill={colors.fill} opacity="0.3" /> 
            </g>
        </svg>
    );
};

// Selector principal actualizado
export const Ship = ({ size, className = "", orientation = "horizontal" }) => {
    switch(size) {
        case 2: return <Destroyer className={className} orientation={orientation} />;
        case 3: return <Cruiser className={className} orientation={orientation} />;
        case 4: return <Battleship className={className} orientation={orientation} />;
        case 5: return <Carrier className={className} orientation={orientation} />;
        default: return <Destroyer className={className} orientation={orientation} />;
    }
};