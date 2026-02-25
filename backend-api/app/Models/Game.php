<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $fillable = [
        'user_id',
        'attempts',
        'hits',
        'total_time',
        'status',
    ];

    public function ships()
    {
        return $this->hasMany(Ship::class);
    }

    public function moves()
    {
        return $this->hasMany(Move::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
