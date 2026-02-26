import { useEffect, useState, Link } from 'react';
import { Board } from '../components/Board/Board';
import { useGame } from '../hooks/useGame';
import api from '../api/axiosConfig';


const GamePage = () => {
    const [gameId, setGameId] = useState(null);
    const { board, shoot, message } = useGame(gameId);

    const startNewGame = async () => {
        const { data } = await api.post('/games');
        setGameId(data.game_id);
    };

    return (
        <div className="p-4 flex flex-col items-center gap-6">
            
            {!gameId ? (
                <button 
                    onClick={startNewGame}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Iniciar Partida
                </button>
            ) : (
                <>
                    <p className="text-lg font-semibold h-8">{message}</p>
                    <Board board={board} onCellClick={shoot} />
                    <div className="mt-4 flex gap-4 text-sm">
                        <span>🟩 Acierto</span>
                        <span>⬜ Agua</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default GamePage;