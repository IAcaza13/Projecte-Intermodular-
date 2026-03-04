// src/hooks/useGame.js
import { useState, useRef, useCallback } from 'react';
import api from '../api/axiosConfig';

// ── Importar sonidos con Vite (resuelve la ruta correctamente) ──
// Los archivos están en src/assets/sounds/
import hitSound  from '../assets/sounds/hitprueba.mp3';
import missSound from '../assets/sounds/miss.mp3';
import winSound  from '../assets/sounds/winning.mp3';
import rescate from '../assets/sounds/rescatebarco.mp3';

// ── Audio helper robusto ────────────────────────────────────────
const playSound = (src) => {
    try {
        const audio = new Audio(src);
        audio.volume = 0.6;
        const p = audio.play();
        if (p !== undefined) p.catch(() => {}); // evita crash por autoplay policy
    } catch (_) {}
};

// ── Hook ────────────────────────────────────────────────────────
export const useGame = (gameId) => {
    const [board, setBoard]       = useState(() =>
        Array(10).fill(null).map(() => Array(10).fill(null))
    );
    const [message, setMessage]   = useState('');
    const [gameWon, setGameWon]   = useState(false);
    const [sunkShips, setSunkShips] = useState([]);
    //  sunkShips: [{ type, size, positions:[{x,y}] }]

    // Ref para leer el board actual dentro del callback sin stale closure
    const boardRef = useRef(board);
    boardRef.current = board;

    const shoot = useCallback(async (x, y) => {
        if (!gameId) return;
        if (boardRef.current[y]?.[x]) return; // celda ya disparada

        try {
            const { data } = await api.post(`/games/${gameId}/shoot`, { x, y });

            // ── Actualizar tablero ──────────────────────────
            const newBoard = boardRef.current.map(row => [...row]);
            newBoard[y][x] = data.hit ? 'hit' : 'miss';
            setBoard(newBoard);

            // ── Sonidos ─────────────────────────────────────
            playSound(data.hit ? hitSound : missSound);

            // ── Barco hundido completo ──────────────────────
            if (data.ship_sunk && data.sunk_ship) {
                const { type, size, coordinates } = data.sunk_ship;
                setSunkShips(prev => [
                    ...prev,
                    { type, size, positions: coordinates },
                ]);
                setMessage(`🚢 ¡${type} RESCATADO!`);
                playSound(rescate);
            } else if (data.hit) {
                setMessage(`💥 ¡Impacto en ${data.ship_found}!`);
            } else {
                setMessage('💧 Agua... sigue intentando.');
            }

            // ── Victoria ────────────────────────────────────
            if (data.game_won) {
                setGameWon(true);
                setMessage('🏆 ¡MISIÓN CUMPLIDA! Todos los barcos rescatados.');
                playSound(winSound);
            }

        } catch (err) {
            console.error('Error al disparar:', err);
            setMessage('⚠️ Error de conexión.');
        }
    }, [gameId]);

    const resetGame = useCallback(() => {
        setBoard(Array(10).fill(null).map(() => Array(10).fill(null)));
        setMessage('');
        setGameWon(false);
        setSunkShips([]);
    }, []);

    return { board, shoot, message, gameWon, sunkShips, resetGame };
};