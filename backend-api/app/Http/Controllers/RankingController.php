<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use Illuminate\Support\Facades\DB;

class RankingController extends Controller
{
    public function index() {
        // Obtenemos los mejores jugadores basados en menos intentos y menor tiempo
        $rankings = DB::table('games')
            ->join('users', 'games.user_id', '=', 'users.id')
            ->select('users.username', 'games.attempts', 'games.total_time', 'games.updated_at')
            ->where('games.status', '=', 'won') // Solo contamos partidas ganadas 
            ->orderBy('games.attempts', 'asc')
            ->orderBy('games.total_time', 'asc')
            ->limit(10)
            ->get();

        return response()->json($rankings);
    }

    public function userHistory(Request $request) {
        // Histórico personal del usuario logueado [cite: 49, 85]
        $history = Game::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($history);
    }
}
