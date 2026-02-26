import { useState } from 'react';
import api from '../api/axiosConfig';

export const useGame = (gameId) => {
    const [board, setBoard] = useState(Array(10).fill(null).map(() => Array(10).fill(null)));
    const [message, setMessage] = useState('');

    const shoot = async (x, y) => {
        try {
            const { data } = await api.post(`/games/${gameId}/shoot`, { x, y });
            
            // Actualizar tablero localmente
            const newBoard = [...board];
            newBoard[y][x] = data.hit ? 'hit' : 'miss';
            setBoard(newBoard);

            // Reproducir sonido 
            const audio = new Audio(`/assets/sounds/${data.hit ? 'hitprueba.mp3' : 'miss.mp3'}`);
            audio.play();

            if (data.hit) setMessage(`¡Rescatado un trozo de ${data.ship_found}!`);
        } catch (error) {
            console.error("Error al disparar", error);
        }
    };

    return { board, shoot, message };
};