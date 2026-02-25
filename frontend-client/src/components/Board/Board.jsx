import React from 'react';

export const Board = ({ board, onCellClick }) => {
    return (
        <div className="grid grid-cols-10 gap-1 w-full max-w-md mx-auto bg-blue-200 p-1 rounded shadow-lg dark:bg-slate-800">
            {board.map((row, y) => 
                row.map((cell, x) => (
                    <div 
                        key={`${x}-${y}`}
                        onClick={() => !cell && onCellClick(x, y)}
                        className={`
                            aspect-square flex items-center justify-center cursor-pointer border
                            transition-all duration-300 hover:scale-105
                            ${!cell ? 'bg-blue-400 dark:bg-blue-900' : ''}
                            ${cell === 'hit' ? 'bg-green-500 animate-pulse' : ''}
                            ${cell === 'miss' ? 'bg-gray-300 dark:bg-gray-600' : ''}
                        `}
                    >
                        {cell === 'hit' && <span className="text-white text-xs">🚢</span>}
                        {cell === 'miss' && <span className="text-white text-xs">💧</span>}
                    </div>
                ))
            )}
        </div>
    );
};