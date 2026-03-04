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
    public function start(Request $request, BoardService $boardService)
    {
        $game = Game::create([
            'user_id'    => $request->user()->id,
            'total_time' => 0,
            'status'     => 'active',
        ]);

        $ships = $boardService->generateBoard();
        foreach ($ships as $s) {
            Ship::create([
                'game_id'       => $game->id,
                'type'          => $s['type'],
                'coordinates'   => json_encode($s['coordinates']),
                'hits_received' => json_encode([]),
            ]);
        }

        return response()->json([
            'game_id' => $game->id,
            'message' => '¡Partida lista!',
        ]);
    }

    // Realizar una tirada
    public function shoot(Request $request, $id)
    {
        $game = Game::findOrFail($id);
        $x    = (int) $request->x;
        $y    = (int) $request->y;

        // Buscar barco en esa posición
        $allShips = Ship::where('game_id', $id)->get();
        $hitShip  = null;

        foreach ($allShips as $ship) {
            $coords = json_decode($ship->coordinates, true) ?? [];
            foreach ($coords as $coord) {
                if ((int)$coord['x'] === $x && (int)$coord['y'] === $y) {
                    $hitShip = $ship;
                    break 2;
                }
            }
        }

        $isHit = $hitShip !== null;

        Move::create([
            'game_id' => $id,
            'x'       => $x,
            'y'       => $y,
            'is_hit'  => $isHit,
        ]);

        $game->increment('attempts');
        if ($isHit) {
            $game->increment('hits');
        }

        // ── Detectar barco hundido ───────────────────────────
        $shipSunk     = false;
        $sunkShipData = null;

        if ($isHit) {
            $hitsReceived   = json_decode($hitShip->hits_received, true) ?? [];
            $hitsReceived[] = ['x' => $x, 'y' => $y];
            $hitShip->hits_received = json_encode($hitsReceived);
            $hitShip->save();

            $shipCoords = json_decode($hitShip->coordinates, true);

            if (count($hitsReceived) >= count($shipCoords)) {
                $shipSunk     = true;
                $sunkShipData = [
                    'type'        => $hitShip->type,
                    'size'        => count($shipCoords),
                    'coordinates' => $shipCoords,
                ];
            }
        }

        // ── Detectar victoria ────────────────────────────────
        $gameWon = false;
        if ($shipSunk) {
            $allShips = Ship::where('game_id', $id)->get();
            $allSunk  = true;
            foreach ($allShips as $s) {
                $sc   = json_decode($s->coordinates, true);
                $hits = json_decode($s->hits_received, true) ?? [];
                if (count($hits) < count($sc)) {
                    $allSunk = false;
                    break;
                }
            }

            if ($allSunk) {
                // Calcular segundos transcurridos desde created_at hasta ahora
                $secondsElapsed = $game->created_at->diffInSeconds(now());

                $game->status     = 'won';
                $game->total_time = $secondsElapsed;
                $game->save();
                $gameWon = true;
            }
        }

        return response()->json([
            'hit'        => $isHit,
            'ship_found' => $isHit ? $hitShip->type : null,
            'ship_sunk'  => $shipSunk,
            'sunk_ship'  => $sunkShipData,
            'game_won'   => $gameWon,
            'attempts'   => $game->fresh()->attempts,
        ]);
    }
}