// src/hooks/useGame.js
import { useState, useRef, useCallback } from 'react';
import api from '../api/axiosConfig';

// ── Audio helper robusto ──────────────────────────────────────
// Los archivos deben estar en /public/assets/  (Vite los sirve desde raíz)
// Si usas create-react-app ponlos en /public/assets/
const HIT_SOUND  = '/assets/hitprueba.mp3';
const MISS_SOUND = '/assets/miss.mp3';

const playSound = (src) => {
    try {
        const audio = new Audio(src);
        audio.volume = 0.6;
        // .play() devuelve Promise — siempre capturar el rechazo
        const promise = audio.play();
        if (promise !== undefined) {
            promise.catch(() => {
                // El navegador bloqueó el autoplay (normal si no hubo interacción previa)
                // No hacemos nada: el juego sigue funcionando sin sonido
            });
        }
    } catch (_) {}
};

// ── Hook ──────────────────────────────────────────────────────
export const useGame = (gameId) => {
    // Tablero 10×10 de nulls
    const [board, setBoard] = useState(
        () => Array(10).fill(null).map(() => Array(10).fill(null))
    );
    const [message, setMessage]   = useState('');
    const [gameWon, setGameWon]   = useState(false);

    // Lista de barcos hundidos: [{ type, size, positions:[{x,y}] }]
    const [sunkShips, setSunkShips] = useState([]);

    // Ref para acceder al board actual dentro del callback sin stale closure
    const boardRef = useRef(board);
    boardRef.current = board;

    const shoot = useCallback(async (x, y) => {
        if (!gameId) return;
        if (boardRef.current[y][x]) return; // celda ya disparada

        try {
            const { data } = await api.post(`/games/${gameId}/shoot`, { x, y });

            // ── Actualizar tablero ────────────────────────────
            const newBoard = boardRef.current.map(row => [...row]);
            newBoard[y][x] = data.hit ? 'hit' : 'miss';
            setBoard(newBoard);

            // ── Sonidos ───────────────────────────────────────
            if (data.hit) {
                playSound(HIT_SOUND);
            } else {
                playSound(MISS_SOUND);
            }

            // ── Mensajes ──────────────────────────────────────
            if (data.game_won) {
                setGameWon(true);
                setMessage('🏆 ¡MISIÓN CUMPLIDA! Todos los barcos rescatados.');
                return;
            }

            if (data.ship_sunk && data.sunk_ship) {
                const { type, size, coordinates } = data.sunk_ship;
                // Agregar a la lista de hundidos con formato que espera Board
                setSunkShips(prev => [
                    ...prev,
                    {
                        type,
                        size,
                        positions: coordinates,  // [{x,y}, ...]
                    }
                ]);
                setMessage(`🚢 ¡${type} RESCATADO COMPLETAMENTE!`);
            } else if (data.hit) {
                setMessage(`💥 ¡Impacto en ${data.ship_found}!`);
            } else {
                setMessage('💧 Agua... sigue intentando.');
            }

        } catch (error) {
            console.error('Error al disparar:', error);
            setMessage('⚠️ Error de conexión.');
        }
    }, [gameId]);

    // Reset al cambiar de partida
    const resetGame = useCallback(() => {
        const empty = Array(10).fill(null).map(() => Array(10).fill(null));
        setBoard(empty);
        setMessage('');
        setGameWon(false);
        setSunkShips([]);
    }, []);

    return { board, shoot, message, gameWon, sunkShips, resetGame };
};