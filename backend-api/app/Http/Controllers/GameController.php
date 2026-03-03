<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\Ship;
use App\Models\Move;
use App\Services\BoardService;

class GameController extends Controller
{
    // Iniciar partida
    public function start(Request $request, BoardService $boardService) {
        $game = Game::create([
            'user_id' => $request->user()->id,
            'status'  => 'active'
        ]);

        $ships = $boardService->generateBoard();
        foreach ($ships as $s) {
            Ship::create([
                'game_id'       => $game->id,
                'type'          => $s['type'],
                'coordinates'   => json_encode($s['coordinates']),
                'hits_received' => json_encode([])
            ]);
        }

        return response()->json([
            'game_id' => $game->id,
            'message' => '¡Partida lista!'
        ]);
    }

    // Realizar una tirada
    public function shoot(Request $request, $id) {
        $game = Game::findOrFail($id);
        $x    = $request->x;
        $y    = $request->y;

        // Buscar si hay un barco en esa posición
        $allShips = Ship::where('game_id', $id)->get();
        $hitShip  = null;

        foreach ($allShips as $ship) {
            $coords = json_decode($ship->coordinates, true);
            foreach ($coords as $coord) {
                if ($coord['x'] == $x && $coord['y'] == $y) {
                    $hitShip = $ship;
                    break 2;
                }
            }
        }

        $isHit = !is_null($hitShip);

        Move::create([
            'game_id' => $id,
            'x'       => $x,
            'y'       => $y,
            'is_hit'  => $isHit
        ]);

        $game->increment('attempts');
        if ($isHit) $game->increment('hits');

        // ── Detectar si el barco quedó hundido completo ──────────
        $shipSunk        = false;
        $sunkShipData    = null;

        if ($isHit) {
            // Acumular hits recibidos en este barco
            $hitsReceived   = json_decode($hitShip->hits_received, true) ?? [];
            $hitsReceived[] = ['x' => $x, 'y' => $y];
            $hitShip->hits_received = json_encode($hitsReceived);
            $hitShip->save();

            $shipCoords = json_decode($hitShip->coordinates, true);

            // Si todos los coords del barco han sido impactados → hundido
            if (count($hitsReceived) >= count($shipCoords)) {
                $shipSunk = true;
                $sunkShipData = [
                    'type'        => $hitShip->type,
                    'size'        => count($shipCoords),
                    'coordinates' => $shipCoords,   // [{x,y}, ...]
                ];

                // Comprobar si la partida está ganada (todos los barcos hundidos)
                $totalShips = Ship::where('game_id', $id)->count();
                $allMoves   = Move::where('game_id', $id)->where('is_hit', true)->pluck('x', 'y');

                $allSunk = true;
                foreach ($allShips as $s) {
                    $sc   = json_decode($s->coordinates, true);
                    $hits = json_decode($s->hits_received, true) ?? [];
                    if (count($hits) < count($sc)) { $allSunk = false; break; }
                }

                if ($allSunk) {
                    $game->status = 'won';
                    $game->save();
                }
            }
        }

        return response()->json([
            'hit'          => $isHit,
            'ship_found'   => $isHit ? $hitShip->type : null,
            'ship_sunk'    => $shipSunk,
            'sunk_ship'    => $sunkShipData,   // null o { type, size, coordinates }
            'game_won'     => ($game->status === 'won'),
            'attempts'     => $game->attempts,
        ]);
    }
}
