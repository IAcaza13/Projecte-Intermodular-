<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ship extends Model
{
    protected $fillable = [
        'game_id',
        'type',
        'coordinates',
        'hits_received',
        'is_sunk'
    ];

    // Casts automáticos para manejar JSON como Arrays de PHP
    protected $casts = [
        'coordinates' => 'array',
        'hits_received' => 'array',
        'is_sunk' => 'boolean'
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
