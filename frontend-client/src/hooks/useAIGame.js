// src/hooks/useAIGame.js
import { useState, useRef, useCallback } from 'react';
import api from '../api/axiosConfig';
import hitSound  from '../assets/sounds/hitprueba.mp3';
import missSound from '../assets/sounds/miss.mp3';

// ── Audio ─────────────────────────────────────────────────────
const playSound = (src) => {
    try {
        const a = new Audio(src);
        a.volume = 0.55;
        const p = a.play();
        if (p) p.catch(() => {});
    } catch (_) {}
};

// ── Configuración de barcos ───────────────────────────────────
export const SHIP_TYPES = [
    { type: 'CARRIER',    size: 5 },
    { type: 'BATTLESHIP', size: 4 },
    { type: 'CRUISER',    size: 3 },
    { type: 'SUBMARINE',  size: 3 },
    { type: 'DESTROYER',  size: 2 },
];

const SHIP_NAMES_ES = {
    CARRIER:'Portaviones', BATTLESHIP:'Acorazado',
    CRUISER:'Crucero', SUBMARINE:'Submarino', DESTROYER:'Destructor',
};

// ── Helpers de tablero ────────────────────────────────────────
const emptyBoard = () => Array(10).fill(null).map(() => Array(10).fill(null));

const canPlace = (grid, x, y, size, dir) => {
    for (let i = 0; i < size; i++) {
        const nx = x + (dir === 'h' ? i : 0);
        const ny = y + (dir === 'v' ? i : 0);
        if (nx > 9 || ny > 9) return false;
        if (grid[ny][nx]) return false;
    }
    return true;
};

export const generateShips = () => {
    const grid = emptyBoard();
    return SHIP_TYPES.map(({ type, size }) => {
        let placed = false, positions = [];
        while (!placed) {
            const x   = Math.floor(Math.random() * 10);
            const y   = Math.floor(Math.random() * 10);
            const dir = Math.random() < 0.5 ? 'h' : 'v';
            if (canPlace(grid, x, y, size, dir)) {
                for (let i = 0; i < size; i++) {
                    const nx = x + (dir === 'h' ? i : 0);
                    const ny = y + (dir === 'v' ? i : 0);
                    grid[ny][nx] = true;
                    positions.push({ x: nx, y: ny });
                }
                placed = true;
            }
        }
        return { type, size, positions };
    });
};

// ── IA: caza → persecución ────────────────────────────────────
class AIEngine {
    constructor() {
        this.shotSet = new Set();
        this.mode    = 'hunt';
        this.hits    = [];
        this.queue   = [];
    }
    _key(x, y) { return `${x}-${y}`; }
    _addAdjacent(x, y) {
        [[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx, dy]) => {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx <= 9 && ny >= 0 && ny <= 9 && !this.shotSet.has(this._key(nx, ny)))
                this.queue.push({ x: nx, y: ny });
        });
    }
    _huntShot() {
        const cands = [];
        for (let y = 0; y < 10; y++)
            for (let x = y % 2; x < 10; x += 2)
                if (!this.shotSet.has(this._key(x, y))) cands.push({ x, y });
        if (!cands.length)
            for (let y = 0; y < 10; y++)
                for (let x = 0; x < 10; x++)
                    if (!this.shotSet.has(this._key(x, y))) cands.push({ x, y });
        return cands[Math.floor(Math.random() * cands.length)];
    }
    nextShot() {
        if (this.mode === 'target') {
            this.queue = this.queue.filter(c => !this.shotSet.has(this._key(c.x, c.y)));
            if (this.hits.length >= 2) {
                const dx = this.hits[1].x - this.hits[0].x;
                const aligned = this.queue.filter(c =>
                    dx !== 0 ? c.y === this.hits[0].y : c.x === this.hits[0].x
                );
                if (aligned.length > 0) return aligned[0];
            }
            if (this.queue.length > 0) return this.queue[0];
            this.mode = 'hunt'; this.hits = []; this.queue = [];
        }
        return this._huntShot();
    }
    registerResult(x, y, isHit, shipRescued) {
        this.shotSet.add(this._key(x, y));
        if (isHit) {
            this.hits.push({ x, y });
            this.mode = 'target';
            this._addAdjacent(x, y);
        }
        if (shipRescued) { this.mode = 'hunt'; this.hits = []; this.queue = []; }
    }
}

// ── Barcos completamente impactados ──────────────────────────
const findRescued = (ships, board) =>
    ships.filter(s => s.positions.every(p => board[p.y]?.[p.x] === 'hit'));

// ── Hook principal ────────────────────────────────────────────
export const useAIGame = () => {
    const [phase, setPhase] = useState('setup'); // setup | playing | won | lost

    // Tablero del jugador (la IA dispara aquí)
    const [playerShips,   setPlayerShips]   = useState([]);
    const [playerBoard,   setPlayerBoard]   = useState(emptyBoard);
    const [playerRescued, setPlayerRescued] = useState([]);

    // Tablero de la IA (el jugador dispara aquí)
    const [aiShips]                         = useState(() => generateShips());
    const [aiBoard,       setAiBoard]       = useState(emptyBoard);
    const [aiRescued,     setAiRescued]     = useState([]);

    const [message,     setMessage]     = useState('');
    const [aiThinking,  setAiThinking]  = useState(false);
    const [lastAiShot,  setLastAiShot]  = useState(null);

    // Refs para leer estado actualizado dentro de setTimeout
    const playerBoardRef   = useRef(emptyBoard());
    const playerShipsRef   = useRef([]);
    const playerRescuedRef = useRef([]);
    const aiRef            = useRef(new AIEngine());

    // ── Turno de la IA ────────────────────────────────────────
    // Usamos ref para que siempre lea el estado más reciente
    const doAiTurn = useRef(null);
    doAiTurn.current = () => {
        const shot = aiRef.current.nextShot();
        if (!shot) { setAiThinking(false); return; }

        const board    = playerBoardRef.current;
        const ships    = playerShipsRef.current;
        const newBoard = board.map(r => [...r]);

        const hitShip = ships.find(s => s.positions.some(p => p.x === shot.x && p.y === shot.y));
        const isHit   = !!hitShip;

        newBoard[shot.y][shot.x] = isHit ? 'hit' : 'miss';
        playerBoardRef.current   = newBoard;
        setPlayerBoard([...newBoard]);
        setLastAiShot({ ...shot });
        playSound(isHit ? hitSound : missSound);

        let rescued = false;
        let newPlayerRescued = playerRescuedRef.current;

        if (isHit) {
            const nowRescued = findRescued(ships, newBoard);
            if (nowRescued.length > newPlayerRescued.length) {
                newPlayerRescued = nowRescued;
                playerRescuedRef.current = nowRescued;
                setPlayerRescued([...nowRescued]);
                rescued = true;
                setMessage(`🚢 ¡La IA localizó tu ${SHIP_NAMES_ES[hitShip.type]}!`);
            } else {
                setMessage(`⚠️ ¡La IA detectó tu ${SHIP_NAMES_ES[hitShip.type]}!`);
            }
        } else {
            setMessage('La IA falló. ¡Tu turno!');
        }

        aiRef.current.registerResult(shot.x, shot.y, isHit, rescued);

        // ¿Perdió el jugador? La IA localizó todos sus barcos
        if (newPlayerRescued.length === ships.length && ships.length > 0) {
            setPhase('lost');
            setMessage('💀 La IA ha localizado toda tu flota. ¡Derrota!');
            setAiThinking(false);
            return;
        }

        // ── IA también repite turno si acierta ────────────────
        if (isHit) {
            setTimeout(() => doAiTurn.current?.(), 900);
            // aiThinking se mantiene true
        } else {
            setAiThinking(false);
        }
    };

    // ── Disparo del jugador ───────────────────────────────────
    const playerShoot = useCallback((x, y) => {
        if (phase !== 'playing' || aiThinking) return;

        const newBoard = aiBoard.map(r => [...r]);
        if (newBoard[y][x]) return; // ya disparado

        const hitShip = aiShips.find(s => s.positions.some(p => p.x === x && p.y === y));
        const isHit   = !!hitShip;
        newBoard[y][x] = isHit ? 'hit' : 'miss';
        setAiBoard(newBoard);
        playSound(isHit ? hitSound : missSound);

        let newRescued  = aiRescued;
        let shipRescued = false;

        if (isHit) {
            const nowRescued = findRescued(aiShips, newBoard);
            if (nowRescued.length > newRescued.length) {
                newRescued  = nowRescued;
                shipRescued = true;
                setAiRescued(nowRescued);
                setMessage(`🚢 ¡${SHIP_NAMES_ES[hitShip.type]} rescatado! Repite turno.`);
            } else {
                setMessage(`💥 ¡Impacto en ${SHIP_NAMES_ES[hitShip.type]}! Repite turno.`);
            }

            // ¿Ganó el jugador?
            if (newRescued.length === aiShips.length) {
                setPhase('won');
                setMessage('🏆 ¡Misión cumplida! Has rescatado toda la flota.');
                return;
            }

            // ✅ JUGADOR ACIERTA → REPITE TURNO — no pasa a la IA
            return;
        }

        // Fallo → turno de la IA
        setMessage('💧 Agua... Turno de la máquina.');
        setAiThinking(true);
        setTimeout(() => doAiTurn.current?.(), 1000);

    }, [phase, aiThinking, aiBoard, aiShips, aiRescued]);

    // ── Iniciar partida ───────────────────────────────────────
    const startGame = useCallback((ships) => {
        const emptyB = emptyBoard();
        playerBoardRef.current   = emptyB;
        playerShipsRef.current   = ships;
        playerRescuedRef.current = [];

        setPlayerShips(ships);
        setPlayerBoard(emptyB);
        setAiBoard(emptyBoard());
        setAiRescued([]);
        setPlayerRescued([]);
        setLastAiShot(null);
        setAiThinking(false);
        setMessage('¡Misión iniciada! Tú empiezas. Acierta y repites turno. 🎯');
        setPhase('playing');
        aiRef.current = new AIEngine();
    }, []);

    const resetGame = useCallback(() => {
        setPhase('setup');
        setMessage('');
        setAiThinking(false);
        setLastAiShot(null);
    }, []);

    return {
        phase,
        aiBoard, aiShips, aiRescued,        // rescatados por el jugador (con positions)
        playerBoard, playerShips, playerRescued, // localizados por la IA (con positions)
        playerShoot, startGame, resetGame,
        message, aiThinking, lastAiShot,
    };
};