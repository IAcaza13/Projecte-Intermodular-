<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Move extends Model
{
    protected $fillable = [
        'game_id',
        'x',
        'y',
        'is_hit'
    ];

    protected $casts = [
        'is_hit' => 'boolean'
    ];
    
    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
