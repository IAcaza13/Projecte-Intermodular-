<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\Ship;
use App\Models\Move;
use App\Services\BoardService;

class GameController extends Controller
{
    // Iniciar partida [cite: 27]
    public function start(Request $request, BoardService $boardService) {
        $game = Game::create([
            'user_id' => $request->user()->id,
            'status' => 'active'
        ]);

        $ships = $boardService->generateBoard();
        foreach ($ships as $s) {
            Ship::create([
                'game_id' => $game->id,
                'type' => $s['type'],
                'coordinates' => json_encode($s['coordinates']),
                'hits_received' => json_encode([])
            ]);
        }

        return response()->json(['game_id' => $game->id, 'message' => '¡Partida lista!']);
    }

    // Realizar una tirada [cite: 23, 28]
    public function shoot(Request $request, $id) {
        $game = Game::findOrFail($id);
        $x = $request->x;
        $y = $request->y;

        // Verificar si hay un barco en esa posición [cite: 23]
        $hitShip = Ship::where('game_id', $id)
            ->where('coordinates', 'like', "%\"x\":$x,\"y\":$y%")
            ->first();

        $isHit = !is_null($hitShip);
        
        Move::create([
            'game_id' => $id,
            'x' => $x, 'y' => $y,
            'is_hit' => $isHit
        ]);

        $game->increment('attempts'); 
        if ($isHit) $game->increment('hits');

        return response()->json([
            'hit' => $isHit,
            'ship_found' => $isHit ? $hitShip->type : null,
            'attempts' => $game->attempts
        ]); 
    }
}
