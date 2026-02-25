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
        Schema::create('ships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->string('type'); // Ejemplo: 'CARRIER' [cite: 40]
            $table->json('coordinates'); // Guardaremos un array: [[0,1], [0,2], [0,3]...]
            $table->json('hits_received')->nullable(); // Para saber qué parte del barco ha sido "rescatada"
            $table->boolean('is_sunk')->default(false); // Cuando el barco está totalmente rescatado [cite: 37]
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ships');
    }
};
