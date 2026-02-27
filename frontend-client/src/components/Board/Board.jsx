import React from 'react';
import { Ship } from '../ships/ShipSVG';

export const Board = ({ board, onCellClick, ships = [] }) => {
    const [animationClass, setAnimationClass] = React.useState(null);
    const [animatingCell, setAnimatingCell] = React.useState(null); 
    const handleClick = (x, y) => {
        if (!board[y][x]) {
           setAnimatingCell({ x, y });
            setTimeout(() => setAnimatingCell(null), 500);
            onCellClick(x, y);
        }
    };

      // Determinar si una celda tiene un barco (para mostrarlo cuando esté hundido)
    const hasShip = (x, y) => {
        return ships.some(ship => 
            ship.positions.some(pos => pos.x === x && pos.y === y)
        );
    };

     // Obtener el tamaño del barco en una posición
    const getShipSizeAt = (x, y) => {
        const ship = ships.find(s => 
            s.positions.some(pos => pos.x === x && pos.y === y)
        );
        return ship?.size || 0;
    };

      // Obtener orientación del barco
    const getShipOrientation = (x, y) => {
        const ship = ships.find(s => 
            s.positions.some(pos => pos.x === x && pos.y === y)
        );
        if (!ship || ship.positions.length === 1) return "horizontal";
        
        // Determinar si es vertical (misma x, y diferente)
        const first = ship.positions[0];
        const second = ship.positions[1];
        return first.x === second.x ? "vertical" : "horizontal";
    };
 return (
        <div className="relative">
            {/* Cuadrícula del tablero */}
            <div className="grid grid-cols-10 gap-1 w-full max-w-md mx-auto bg-blue-200 p-1 rounded-lg shadow-xl dark:bg-slate-800 border-2 border-blue-400 dark:border-blue-600">
                {/* Números de coordenadas (opcional) */}
                <div className="absolute -left-6 top-0 flex flex-col h-full justify-around text-xs font-bold text-gray-600 dark:text-gray-400">
                    {Array(10).fill().map((_, i) => (
                        <span key={i}>{i}</span>
                    ))}
                </div>
                
                {board.map((row, y) => 
                    row.map((cell, x) => {
                        const isAnimating = animatingCell?.x === x && animatingCell?.y === y;
                        const shipSize = getShipSizeAt(x, y);
                        const orientation = getShipOrientation(x, y);
                        
                        return (
                            <div 
                                key={`${x}-${y}`}
                                onClick={() => handleClick(x, y)}
                                className={`
                                    aspect-square flex items-center justify-center cursor-pointer
                                    border-2 transition-all duration-300 relative
                                    ${!cell ? 'bg-blue-400 dark:bg-blue-900 hover:bg-blue-500 dark:hover:bg-blue-800' : ''}
                                    ${cell === 'hit' ? 'bg-green-500' : ''}
                                    ${cell === 'miss' ? 'bg-gray-300 dark:bg-gray-600' : ''}
                                    ${isAnimating ? 'animate-ping scale-110 z-10' : ''}
                                    ${!cell && 'hover:scale-105 hover:shadow-lg'}
                                    rounded-sm
                                `}
                                style={{
                                    borderColor: !cell ? 'rgba(59, 130, 246, 0.5)' : 'transparent'
                                }}
                            >
                                {/* Mostrar barco si está hundido o si es modo debug */}
                                {cell === 'hit' && shipSize > 0 && (
                                    <div className="absolute inset-0 animate-bounce-once">
                                        <Ship 
                                            size={shipSize} 
                                            orientation={orientation}
                                            className="p-1"
                                        />
                                    </div>
                                )}
                                
                                {/* Iconos simples para hit/miss */}
                                {cell === 'hit' && !shipSize && (
                                    <span className="text-white text-xs animate-pulse">⚓</span>
                                )}
                                {cell === 'miss' && (
                                    <span className="text-white text-xs animate-ripple">💧</span>
                                )}
                                
                                {/* Coordenadas pequeñas (opcional) */}
                                <span className="absolute top-0 left-0 text-[8px] opacity-50 text-white">
                                    {x},{y}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Leyenda mejorada */}
            <div className="mt-4 flex justify-center gap-6 text-sm bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded animate-pulse"></div>
                    <span>Rescatado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <span>Agua</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 dark:bg-blue-900 rounded"></div>
                    <span>Sin explorar</span>
                </div>
            </div>
        </div>
    );
};
