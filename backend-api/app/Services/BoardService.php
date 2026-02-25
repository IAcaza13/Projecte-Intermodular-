<?php
namespace App\Services;

class BoardService {
    // Definición de los barcos según el documento [cite: 40, 41, 42, 43, 44]
    private $shipTypes = [
        ['name' => 'CARRIER', 'size' => 5],
        ['name' => 'BATTLESHIP', 'size' => 4],
        ['name' => 'CRUISER', 'size' => 3],
        ['name' => 'SUBMARINE', 'size' => 3],
        ['name' => 'DESTROYER', 'size' => 2],
    ];

    public function generateBoard() {
        $board = array_fill(0, 10, array_fill(0, 10, null)); // Tablero 10x10
        $placedShips = [];

        foreach ($this->shipTypes as $ship) {
            $placed = false;
            while (!$placed) {
                $x = rand(0, 9);
                $y = rand(0, 9);
                $direction = rand(0, 1); // 0: Horizontal, 1: Vertical

                if ($this->canPlace($board, $x, $y, $ship['size'], $direction)) {
                    $coords = $this->placeShip($board, $x, $y, $ship['size'], $direction);
                    $placedShips[] = [
                        'type' => $ship['name'],
                        'coordinates' => $coords
                    ];
                    $placed = true;
                }
            }
        }
        return $placedShips;
    }

    private function canPlace(&$board, $x, $y, $size, $dir) {
        for ($i = 0; $i < $size; $i++) {
            $nx = $x + ($dir == 0 ? $i : 0);
            $ny = $y + ($dir == 1 ? $i : 0);
            if ($nx > 9 || $ny > 9 || $board[$ny][$nx] !== null) return false;
        }
        return true;
    }

    private function placeShip(&$board, $x, $y, $size, $dir) {
        $coords = [];
        for ($i = 0; $i < $size; $i++) {
            $nx = $x + ($dir == 0 ? $i : 0);
            $ny = $y + ($dir == 1 ? $i : 0);
            $board[$ny][$nx] = true;
            $coords[] = ['x' => $nx, 'y' => $ny];
        }
        return $coords;
    }
}