<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use Illuminate\Support\Facades\DB;

class RankingController extends Controller
{
    /**
     * Ranking global: UN registro por usuario (su mejor partida ganada)
     * Ordenado por: 1º menos intentos, 2º menos tiempo
     */
    public function index()
    {
        // Subconsulta: para cada usuario, obtener el mínimo de intentos en partidas ganadas
        // Luego desempatar por menor tiempo
        $rankings = DB::table('games as g')
            ->join('users as u', 'g.user_id', '=', 'u.id')
            ->select(
                'u.id as user_id',
                'u.username',
                'g.attempts',
                'g.hits',
                'g.total_time',
                'g.created_at',
                'g.updated_at'
            )
            ->where('g.status', 'won')
            // Solo la mejor partida por usuario:
            // primero filtramos que no exista una partida del mismo usuario
            // con menos intentos, o mismos intentos y menos tiempo
            ->whereNotExists(function ($query) {
                $query->from('games as g2')
                    ->whereColumn('g2.user_id', 'g.user_id')
                    ->where('g2.status', 'won')
                    ->where(function ($q) {
                        $q->where('g2.attempts', '<', DB::raw('g.attempts'))
                          ->orWhere(function ($q2) {
                              $q2->where('g2.attempts', '=', DB::raw('g.attempts'))
                                 ->where('g2.total_time', '<', DB::raw('g.total_time'));
                          });
                    });
            })
            ->orderBy('g.attempts', 'asc')
            ->orderBy('g.total_time', 'asc')
            ->get();

        return response()->json($rankings);
    }

    /**
     * Historial personal del usuario logueado
     * Devuelve todas sus partidas con attempts, hits, total_time y status
     */
    public function userHistory(Request $request)
    {
        $history = Game::where('user_id', $request->user()->id)
            ->select('id', 'status', 'attempts', 'hits', 'total_time', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($game) {
                // Calcular % de aciertos de esta partida
                $accuracy = ($game->attempts > 0)
                    ? round(($game->hits / $game->attempts) * 100)
                    : 0;

                return [
                    'id'         => $game->id,
                    'status'     => $game->status,       // 'won' | 'active'
                    'won'        => $game->status === 'won',
                    'attempts'   => $game->attempts,
                    'hits'       => $game->hits,
                    'accuracy'   => $accuracy,           // % aciertos esta partida
                    'total_time' => $game->total_time,   // segundos (null si no ganó)
                    'created_at' => $game->created_at,
                ];
            });

        return response()->json($history);
    }
}
