<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\RankingController;

// ── Rutas públicas ────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ── Rutas protegidas ──────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', fn(Request $r) => $r->user());

    // Cambiar contraseña
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Partidas
    Route::post('/games',              [GameController::class, 'start']);
    Route::post('/games/{id}/shoot',   [GameController::class, 'shoot']);

    // Ranking e historial
    Route::get('/rankings', [RankingController::class, 'index']);
    Route::get('/history',  [RankingController::class, 'userHistory']);
});
