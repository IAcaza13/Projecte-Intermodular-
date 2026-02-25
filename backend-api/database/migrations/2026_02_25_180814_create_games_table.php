<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->integer('attempts')->default(0); // Número de intentos [cite: 49]
        $table->integer('hits')->default(0);     // Para saber cuándo termina (total 17 huecos)
        $table->integer('total_time')->default(0); // Tiempo consumido total [cite: 49]
        $table->enum('status', ['active', 'won', 'lost'])->default('active');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
