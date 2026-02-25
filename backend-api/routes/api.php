<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\RankingController;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']); 
Route::post('/login', [AuthController::class, 'login']); 

// Rutas protegidas (Solo usuarios logueados pueden jugar) [cite: 24, 86]
Route::middleware('auth:sanctum')->group(function () {
    // Aquí irán las rutas del GameController
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/games', [GameController::class, 'start']); // Iniciar partida
    Route::post('/games/{id}/shoot', [GameController::class, 'shoot']); // Realizar una tirada
    // Rutas de ranking
    Route::get('/rankings', [RankingController::class, 'index']); // Ranking global
    Route::get('/history', [RankingController::class, 'userHistory']); // Histórico personal del usuario logueado [cite: 49, 85]
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    });
});
