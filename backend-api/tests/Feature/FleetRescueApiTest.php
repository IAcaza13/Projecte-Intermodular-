<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Game;
use App\Models\Ship;
use App\Models\Move;

/**
 * ═══════════════════════════════════════════════════════════════
 *  Fleet Rescue — Tests completos del API Backend
 * ═══════════════════════════════════════════════════════════════
 *
 *  Endpoints cubiertos:
 *    POST /api/register
 *    POST /api/login
 *    POST /api/logout
 *    GET  /api/user
 *    POST /api/change-password
 *    POST /api/games
 *    POST /api/games/{id}/shoot
 *    GET  /api/rankings
 *    GET  /api/history
 *
 *  Ejecutar:
 *    php artisan test --filter FleetRescueApiTest
 *
 *  Requisito: phpunit.xml debe tener DB_CONNECTION=sqlite, DB_DATABASE=:memory:
 * ═══════════════════════════════════════════════════════════════
 */
class FleetRescueApiTest extends TestCase
{
    use RefreshDatabase;

    // ──────────────────────────────────────────────────────────
    //  Helpers compartidos
    // ──────────────────────────────────────────────────────────

    /**
     * Crea un usuario en BD y devuelve [user, token, headers].
     */
    private function crearUsuario(array $overrides = []): array
    {
        $user = User::factory()->create(array_merge([
            'username' => 'capitan_' . uniqid(),
            'email'    => 'test_' . uniqid() . '@flota.com',
            'password' => bcrypt('password123'),
        ], $overrides));

        $token   = $user->createToken('test')->plainTextToken;
        $headers = ['Authorization' => "Bearer {$token}"];

        return [$user, $token, $headers];
    }

    /**
     * Crea una partida con 5 barcos en posiciones fijas y conocidas:
     *
     *   DESTROYER   (2):  (0,0)(1,0)
     *   CRUISER     (3):  (0,1)(1,1)(2,1)
     *   SUBMARINE   (3):  (0,2)(1,2)(2,2)
     *   BATTLESHIP  (4):  (0,3)(1,3)(2,3)(3,3)
     *   CARRIER     (5):  (0,4)(1,4)(2,4)(3,4)(4,4)
     *
     *   Agua segura: cualquier coordenada con y >= 5
     */
    private function crearPartida(User $user): Game
    {
        $game = Game::create([
            'user_id'    => $user->id,
            'attempts'   => 0,
            'hits'       => 0,
            'total_time' => 0,
            'status'     => 'active',
        ]);

        $barcos = [
            ['type' => 'DESTROYER',  'coords' => [[0,0],[1,0]]],
            ['type' => 'CRUISER',    'coords' => [[0,1],[1,1],[2,1]]],
            ['type' => 'SUBMARINE',  'coords' => [[0,2],[1,2],[2,2]]],
            ['type' => 'BATTLESHIP', 'coords' => [[0,3],[1,3],[2,3],[3,3]]],
            ['type' => 'CARRIER',    'coords' => [[0,4],[1,4],[2,4],[3,4],[4,4]]],
        ];

        foreach ($barcos as $b) {
            Ship::create([
                'game_id'       => $game->id,
                'type'          => $b['type'],
                'coordinates'   => json_encode(array_map(fn($c) => ['x' => $c[0], 'y' => $c[1]], $b['coords'])),
                'hits_received' => json_encode([]),
            ]);
        }

        return $game;
    }

    /**
     * Dispara a todas las coordenadas de todos los barcos.
     * Devuelve la última respuesta (game_won: true).
     */
    private function hundirTodo(Game $game, array $headers): \Illuminate\Testing\TestResponse
    {
        $response = null;
        foreach (Ship::where('game_id', $game->id)->get() as $ship) {
            foreach (json_decode($ship->coordinates, true) as $c) {
                $response = $this->postJson("/api/games/{$game->id}/shoot", $c, $headers);
            }
        }
        return $response;
    }


    // ══════════════════════════════════════════════════════════
    //  POST /api/register
    // ══════════════════════════════════════════════════════════

    /** @test */
    public function register_con_datos_validos_crea_usuario_y_devuelve_201(): void
    {
        $response = $this->postJson('/api/register', [
            'username' => 'capitan_marino',
            'email'    => 'capitan@flota.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['message' => 'Usuario registrado con éxito']);

        $this->assertDatabaseHas('users', [
            'username' => 'capitan_marino',
            'email'    => 'capitan@flota.com',
        ]);
    }

    /** @test */
    public function register_guarda_password_como_hash_nunca_en_claro(): void
    {
        $this->postJson('/api/register', [
            'username' => 'capitan_hash',
            'email'    => 'hash@flota.com',
            'password' => 'secret123',
        ]);

        $user = User::where('email', 'hash@flota.com')->first();

        $this->assertNotNull($user);
        $this->assertNotEquals('secret123', $user->password);
        $this->assertTrue(Hash::check('secret123', $user->password));
    }

    /** @test */
    public function register_falla_con_email_duplicado(): void
    {
        User::factory()->create(['email' => 'duplicado@flota.com']);

        $this->postJson('/api/register', [
            'username' => 'otro_capitan',
            'email'    => 'duplicado@flota.com',
            'password' => 'secret123',
        ])->assertStatus(400)
          ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function register_falla_con_username_duplicado(): void
    {
        User::factory()->create(['username' => 'capitan_unico']);

        $this->postJson('/api/register', [
            'username' => 'capitan_unico',
            'email'    => 'nuevo@flota.com',
            'password' => 'secret123',
        ])->assertStatus(400)
          ->assertJsonValidationErrors(['username']);
    }

    /** @test */
    public function register_falla_si_password_tiene_menos_de_6_caracteres(): void
    {
        $this->postJson('/api/register', [
            'username' => 'capitan_corto',
            'email'    => 'corto@flota.com',
            'password' => '123',
        ])->assertStatus(400)
          ->assertJsonValidationErrors(['password']);
    }

    /** @test */
    public function register_falla_con_body_vacio(): void
    {
        $this->postJson('/api/register', [])
             ->assertStatus(400)
             ->assertJsonValidationErrors(['username', 'email', 'password']);
    }

    /** @test */
    public function register_falla_con_email_con_formato_invalido(): void
    {
        $this->postJson('/api/register', [
            'username' => 'capitan_email',
            'email'    => 'esto-no-es-un-email',
            'password' => 'secret123',
        ])->assertStatus(400)
          ->assertJsonValidationErrors(['email']);
    }


    // ══════════════════════════════════════════════════════════
    //  POST /api/login
    // ══════════════════════════════════════════════════════════

    /** @test */
    public function login_con_credenciales_correctas_devuelve_token(): void
    {
        User::factory()->create([
            'email'    => 'login@flota.com',
            'password' => bcrypt('secret123'),
        ]);

        $this->postJson('/api/login', [
            'email'    => 'login@flota.com',
            'password' => 'secret123',
        ])->assertStatus(200)
          ->assertJsonStructure(['access_token', 'token_type', 'user' => ['id', 'username', 'email']])
          ->assertJson(['token_type' => 'Bearer']);
    }

    /** @test */
    public function login_no_expone_password_en_la_respuesta(): void
    {
        User::factory()->create([
            'email'    => 'nopwd@flota.com',
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'nopwd@flota.com',
            'password' => 'secret123',
        ])->assertStatus(200);

        $this->assertArrayNotHasKey('password', $response->json('user'));
    }

    /** @test */
    public function login_falla_con_email_inexistente(): void
    {
        $this->postJson('/api/login', [
            'email'    => 'noexiste@flota.com',
            'password' => 'secret123',
        ])->assertStatus(401)
          ->assertJson(['error' => 'Credenciales incorrectas']);
    }

    /** @test */
    public function login_falla_con_password_incorrecta(): void
    {
        User::factory()->create([
            'email'    => 'correcto@flota.com',
            'password' => bcrypt('secret123'),
        ]);

        $this->postJson('/api/login', [
            'email'    => 'correcto@flota.com',
            'password' => 'password_INCORRECTA',
        ])->assertStatus(401)
          ->assertJson(['error' => 'Credenciales incorrectas']);
    }

    /** @test */
    public function login_mismo_mensaje_de_error_para_email_y_password_incorrectos(): void
    {
        // No debe revelar si el email existe o no
        User::factory()->create([
            'email'    => 'existe@flota.com',
            'password' => bcrypt('secret123'),
        ]);

        $r1 = $this->postJson('/api/login', ['email' => 'noexiste@flota.com', 'password' => 'cualquiera']);
        $r2 = $this->postJson('/api/login', ['email' => 'existe@flota.com',   'password' => 'incorrecta']);

        $this->assertEquals($r1->json('error'), $r2->json('error'));
    }


    // ══════════════════════════════════════════════════════════
    //  POST /api/logout
    // ══════════════════════════════════════════════════════════

    /** @test */
    public function logout_con_token_valido_cierra_sesion_y_borra_el_token(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        $this->postJson('/api/logout', [], $headers)
             ->assertStatus(200)
             ->assertJson(['message' => 'Sesión cerrada con éxito']);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    /** @test */
    public function logout_sin_token_devuelve_401(): void
    {
        $this->postJson('/api/logout')->assertStatus(401);
    }

    /** @test */
    public function logout_con_token_invalido_devuelve_401(): void
    {
        $this->postJson('/api/logout', [], [
            'Authorization' => 'Bearer token_inventado_xyz',
        ])->assertStatus(401);
    }

    /** @test */
    public function doble_logout_con_el_mismo_token_falla_en_el_segundo(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        $this->postJson('/api/logout', [], $headers)->assertStatus(200);
        $this->postJson('/api/logout', [], $headers)->assertStatus(401);
    }


    // ══════════════════════════════════════════════════════════
    //  GET /api/user
    // ══════════════════════════════════════════════════════════

    /** @test */
    public function get_user_devuelve_datos_del_usuario_autenticado(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        $this->getJson('/api/user', $headers)
             ->assertStatus(200)
             ->assertJson([
                 'id'       => $user->id,
                 'username' => $user->username,
                 'email'    => $user->email,
             ]);
    }

    /** @test */
    public function get_user_no_expone_password_en_la_respuesta(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        $response = $this->getJson('/api/user', $headers)->assertStatus(200);

        $this->assertArrayNotHasKey('password', $response->json());
    }

    /** @test */
    public function get_user_sin_token_devuelve_401(): void
    {
        $this->getJson('/api/user')->assertStatus(401);
    }


    // ══════════════════════════════════════════════════════════
    //  POST /api/change-password
    // ══════════════════════════════════════════════════════════

    /** @test */
    public function change_password_con_datos_correctos_actualiza_la_password(): void
    {
        [$user, $token, $headers] = $this->crearUsuario(['password' => bcrypt('password_vieja')]);

        $this->postJson('/api/change-password', [
            'current_password'          => 'password_vieja',
            'new_password'              => 'password_nueva123',
            'new_password_confirmation' => 'password_nueva123',
        ], $headers)->assertStatus(200)
                    ->assertJson(['message' => 'Contraseña actualizada correctamente']);

        $user->refresh();
        $this->assertTrue(Hash::check('password_nueva123', $user->password));
    }

    /** @test */
    public function change_password_revoca_tokens_de_otros_dispositivos(): void
    {
        [$user, $token, $headers] = $this->crearUsuario(['password' => bcrypt('password_vieja')]);

        $otroToken = $user->createToken('otro_dispositivo')->plainTextToken;

        $this->postJson('/api/change-password', [
            'current_password'          => 'password_vieja',
            'new_password'              => 'password_nueva123',
            'new_password_confirmation' => 'password_nueva123',
        ], $headers)->assertStatus(200);

        // El otro token ya no debe funcionar
        $this->getJson('/api/user', ['Authorization' => "Bearer {$otroToken}"])->assertStatus(401);

        // El token actual sigue activo
        $this->getJson('/api/user', $headers)->assertStatus(200);
    }

    /** @test */
    public function change_password_falla_si_password_actual_es_incorrecta(): void
    {
        [$user, $token, $headers] = $this->crearUsuario(['password' => bcrypt('password_real')]);

        $this->postJson('/api/change-password', [
            'current_password'          => 'password_INCORRECTA',
            'new_password'              => 'password_nueva123',
            'new_password_confirmation' => 'password_nueva123',
        ], $headers)->assertStatus(401)
                    ->assertJson(['error' => 'La contraseña actual es incorrecta']);

        // La contraseña no debe haber cambiado
        $user->refresh();
        $this->assertTrue(Hash::check('password_real', $user->password));
    }

    /** @test */
    public function change_password_falla_si_confirmacion_no_coincide(): void
    {
        [$user, $token, $headers] = $this->crearUsuario(['password' => bcrypt('password_vieja')]);

        $this->postJson('/api/change-password', [
            'current_password'          => 'password_vieja',
            'new_password'              => 'password_nueva123',
            'new_password_confirmation' => 'password_DISTINTA999',
        ], $headers)->assertStatus(422)
                    ->assertJsonValidationErrors(['new_password']);
    }

    /** @test */
    public function change_password_falla_si_nueva_password_tiene_menos_de_6_caracteres(): void
    {
        [$user, $token, $headers] = $this->crearUsuario(['password' => bcrypt('password_vieja')]);

        $this->postJson('/api/change-password', [
            'current_password'          => 'password_vieja',
            'new_password'              => '123',
            'new_password_confirmation' => '123',
        ], $headers)->assertStatus(422)
                    ->assertJsonValidationErrors(['new_password']);
    }

    /** @test */
    public function change_password_sin_token_devuelve_401(): void
    {
        $this->postJson('/api/change-password', [
            'current_password'          => 'cualquiera',
            'new_password'              => 'nuevaclave123',
            'new_password_confirmation' => 'nuevaclave123',
        ])->assertStatus(401);
    }


    // ══════════════════════════════════════════════════════════
    //  POST /api/games
    // ══════════════════════════════════════════════════════════

    /** @test */
    public function start_crea_partida_y_devuelve_game_id(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        $this->postJson('/api/games', [], $headers)
             ->assertStatus(200)
             ->assertJsonStructure(['game_id', 'message'])
             ->assertJson(['message' => '¡Partida lista!']);
    }

    /** @test */
    public function start_guarda_la_partida_en_bd_con_status_active(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        $gameId = $this->postJson('/api/games', [], $headers)->json('game_id');

        $this->assertDatabaseHas('games', [
            'id'      => $gameId,
            'user_id' => $user->id,
            'status'  => 'active',
        ]);
    }

    /** @test */
    public function start_genera_exactamente_5_barcos_con_los_tipos_correctos(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        $gameId = $this->postJson('/api/games', [], $headers)->json('game_id');

        $types = Ship::where('game_id', $gameId)->pluck('type')->sort()->values()->toArray();

        $this->assertCount(5, $types);
        $this->assertEquals(
            ['BATTLESHIP', 'CARRIER', 'CRUISER', 'DESTROYER', 'SUBMARINE'],
            $types
        );
    }

    /** @test */
    public function start_genera_exactamente_17_celdas_sin_solapamientos(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        $gameId = $this->postJson('/api/games', [], $headers)->json('game_id');

        $todasCoords = [];
        foreach (Ship::where('game_id', $gameId)->get() as $ship) {
            foreach (json_decode($ship->coordinates, true) as $c) {
                $key = "{$c['x']}-{$c['y']}";
                $this->assertNotContains($key, $todasCoords, "Coordenada solapada: {$key}");
                $todasCoords[] = $key;
            }
        }

        $this->assertCount(17, $todasCoords); // 5+4+3+3+2
    }

    /** @test */
    public function start_todas_las_coordenadas_estan_dentro_del_tablero_10x10(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        $gameId = $this->postJson('/api/games', [], $headers)->json('game_id');

        foreach (Ship::where('game_id', $gameId)->get() as $ship) {
            foreach (json_decode($ship->coordinates, true) as $c) {
                $this->assertGreaterThanOrEqual(0, $c['x']);
                $this->assertLessThanOrEqual(9, $c['x']);
                $this->assertGreaterThanOrEqual(0, $c['y']);
                $this->assertLessThanOrEqual(9, $c['y']);
            }
        }
    }

    /** @test */
    public function start_cada_peticion_genera_una_partida_distinta(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        $id1 = $this->postJson('/api/games', [], $headers)->json('game_id');
        $id2 = $this->postJson('/api/games', [], $headers)->json('game_id');

        $this->assertNotEquals($id1, $id2);
    }

    /** @test */
    public function start_sin_token_devuelve_401(): void
    {
        $this->postJson('/api/games')->assertStatus(401);
    }


    // ══════════════════════════════════════════════════════════
    //  POST /api/games/{id}/shoot
    // ══════════════════════════════════════════════════════════

    /** @test */
    public function shoot_al_agua_devuelve_hit_false_y_miss_data(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();
        $game = $this->crearPartida($user);

        // y:9 está libre (barcos solo en filas 0-4)
        $this->postJson("/api/games/{$game->id}/shoot", ['x' => 9, 'y' => 9], $headers)
             ->assertStatus(200)
             ->assertJson([
                 'hit'        => false,
                 'ship_found' => null,
                 'ship_sunk'  => false,
                 'sunk_ship'  => null,
                 'game_won'   => false,
             ]);
    }

    /** @test */
    public function shoot_al_agua_incrementa_attempts_pero_no_hits(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();
        $game = $this->crearPartida($user);

        $this->postJson("/api/games/{$game->id}/shoot", ['x' => 9, 'y' => 9], $headers);

        $this->assertDatabaseHas('games', ['id' => $game->id, 'attempts' => 1, 'hits' => 0]);
    }

    /** @test */
    public function shoot_al_agua_registra_movimiento_en_moves(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();
        $game = $this->crearPartida($user);

        $this->postJson("/api/games/{$game->id}/shoot", ['x' => 9, 'y' => 9], $headers);

        $this->assertDatabaseHas('moves', [
            'game_id' => $game->id,
            'x'       => 9,
            'y'       => 9,
            'is_hit'  => false,
        ]);
    }

    /** @test */
    public function shoot_impacto_devuelve_hit_true_y_nombre_del_barco(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();
        $game = $this->crearPartida($user);

        // DESTROYER está en (0,0)
        $this->postJson("/api/games/{$game->id}/shoot", ['x' => 0, 'y' => 0], $headers)
             ->assertStatus(200)
             ->assertJson([
                 'hit'        => true,
                 'ship_found' => 'DESTROYER',
                 'ship_sunk'  => false,
             ]);
    }

    /** @test */
    public function shoot_impacto_incrementa_attempts_y_hits(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();
        $game = $this->crearPartida($user);

        $this->postJson("/api/games/{$game->id}/shoot", ['x' => 0, 'y' => 0], $headers);

        $this->assertDatabaseHas('games', ['id' => $game->id, 'attempts' => 1, 'hits' => 1]);
    }

    /** @test */
    public function shoot_hundir_barco_devuelve_ship_sunk_true_con_datos_del_barco(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();
        $game = $this->crearPartida($user);

        // DESTROYER: (0,0) y (1,0)
        $this->postJson("/api/games/{$game->id}/shoot", ['x' => 0, 'y' => 0], $headers);

        $this->postJson("/api/games/{$game->id}/shoot", ['x' => 1, 'y' => 0], $headers)
             ->assertStatus(200)
             ->assertJson(['hit' => true, 'ship_sunk' => true, 'game_won' => false])
             ->assertJsonStructure(['sunk_ship' => ['type', 'size', 'coordinates']])
             ->assertJson(['sunk_ship' => ['type' => 'DESTROYER', 'size' => 2]]);
    }

    /** @test */
    public function shoot_hundir_todos_los_barcos_devuelve_game_won_true(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();
        $game = $this->crearPartida($user);

        $this->hundirTodo($game, $headers)
             ->assertStatus(200)
             ->assertJson(['game_won' => true]);
    }

    /** @test */
    public function shoot_victoria_guarda_status_won_y_total_time_en_bd(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();
        $game = $this->crearPartida($user);

        $this->hundirTodo($game, $headers);

        $this->assertDatabaseHas('games', ['id' => $game->id, 'status' => 'won']);

        $game->refresh();
        $this->assertNotNull($game->total_time);
        $this->assertGreaterThanOrEqual(0, $game->total_time);
    }

    /** @test */
    public function shoot_devuelve_el_numero_de_attempts_actualizado_en_cada_disparo(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();
        $game = $this->crearPartida($user);

        $r1 = $this->postJson("/api/games/{$game->id}/shoot", ['x' => 9, 'y' => 9], $headers);
        $r2 = $this->postJson("/api/games/{$game->id}/shoot", ['x' => 8, 'y' => 9], $headers);
        $r3 = $this->postJson("/api/games/{$game->id}/shoot", ['x' => 7, 'y' => 9], $headers);

        $this->assertEquals(1, $r1->json('attempts'));
        $this->assertEquals(2, $r2->json('attempts'));
        $this->assertEquals(3, $r3->json('attempts'));
    }

    /** @test */
    public function shoot_con_game_id_inexistente_devuelve_404(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        $this->postJson('/api/games/99999/shoot', ['x' => 0, 'y' => 0], $headers)
             ->assertStatus(404);
    }

    /** @test */
    public function shoot_sin_token_devuelve_401(): void
    {
        [$user] = $this->crearUsuario();
        $game   = $this->crearPartida($user);

        $this->postJson("/api/games/{$game->id}/shoot", ['x' => 0, 'y' => 0])
             ->assertStatus(401);
    }


    // ══════════════════════════════════════════════════════════
    //  GET /api/rankings
    // ══════════════════════════════════════════════════════════

    /** @test */
    public function rankings_devuelve_array_vacio_si_no_hay_partidas_ganadas(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        Game::create(['user_id' => $user->id, 'attempts' => 10, 'hits' => 5, 'total_time' => 0, 'status' => 'active']);

        $this->getJson('/api/rankings', $headers)
             ->assertStatus(200)
             ->assertJson([]);
    }

    /** @test */
    public function rankings_devuelve_estructura_correcta_por_entrada(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        Game::create(['user_id' => $user->id, 'attempts' => 38, 'hits' => 17, 'total_time' => 124, 'status' => 'won']);

        $this->getJson('/api/rankings', $headers)
             ->assertStatus(200)
             ->assertJsonCount(1)
             ->assertJsonStructure(['*' => ['user_id', 'username', 'attempts', 'hits', 'total_time']]);
    }

    /** @test */
    public function rankings_ordena_por_menos_intentos_primero(): void
    {
        [$user1, , $headers] = $this->crearUsuario();
        [$user2]             = $this->crearUsuario();

        Game::create(['user_id' => $user2->id, 'attempts' => 20, 'hits' => 17, 'total_time' => 90,  'status' => 'won']);
        Game::create(['user_id' => $user1->id, 'attempts' => 38, 'hits' => 17, 'total_time' => 124, 'status' => 'won']);

        $data = $this->getJson('/api/rankings', $headers)->assertJsonCount(2)->json();

        $this->assertEquals($user2->id, $data[0]['user_id']);
        $this->assertEquals($user1->id, $data[1]['user_id']);
    }

    /** @test */
    public function rankings_desempata_por_menor_tiempo_si_intentos_son_iguales(): void
    {
        [$user1, , $headers] = $this->crearUsuario();
        [$user2]             = $this->crearUsuario();

        Game::create(['user_id' => $user1->id, 'attempts' => 25, 'hits' => 17, 'total_time' => 300, 'status' => 'won']);
        Game::create(['user_id' => $user2->id, 'attempts' => 25, 'hits' => 17, 'total_time' => 90,  'status' => 'won']);

        $data = $this->getJson('/api/rankings', $headers)->json();

        $this->assertEquals($user2->id, $data[0]['user_id']);
        $this->assertEquals($user1->id, $data[1]['user_id']);
    }

    /** @test */
    public function rankings_muestra_solo_la_mejor_partida_de_cada_usuario(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        Game::create(['user_id' => $user->id, 'attempts' => 50, 'hits' => 17, 'total_time' => 200, 'status' => 'won']);
        Game::create(['user_id' => $user->id, 'attempts' => 30, 'hits' => 17, 'total_time' => 150, 'status' => 'won']); // mejor
        Game::create(['user_id' => $user->id, 'attempts' => 40, 'hits' => 17, 'total_time' => 100, 'status' => 'won']);

        $response = $this->getJson('/api/rankings', $headers);

        $response->assertJsonCount(1);
        $this->assertEquals(30, $response->json('0.attempts'));
    }

    /** @test */
    public function rankings_no_incluye_partidas_con_status_active(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        Game::create(['user_id' => $user->id, 'attempts' => 5,  'hits' => 2,  'total_time' => 0,   'status' => 'active']);
        Game::create(['user_id' => $user->id, 'attempts' => 35, 'hits' => 17, 'total_time' => 120, 'status' => 'won']);

        $data = $this->getJson('/api/rankings', $headers)->assertJsonCount(1)->json();

        $this->assertEquals(35, $data[0]['attempts']);
    }

    /** @test */
    public function rankings_cada_usuario_aparece_una_sola_vez(): void
    {
        [$user1, , $headers] = $this->crearUsuario();
        [$user2]             = $this->crearUsuario();

        Game::create(['user_id' => $user1->id, 'attempts' => 30, 'hits' => 17, 'total_time' => 100, 'status' => 'won']);
        Game::create(['user_id' => $user1->id, 'attempts' => 25, 'hits' => 17, 'total_time' => 120, 'status' => 'won']);
        Game::create(['user_id' => $user2->id, 'attempts' => 20, 'hits' => 17, 'total_time' => 90,  'status' => 'won']);

        $userIds = collect($this->getJson('/api/rankings', $headers)->json())->pluck('user_id');

        $this->assertEquals($userIds->count(), $userIds->unique()->count());
    }

    /** @test */
    public function rankings_sin_token_devuelve_401(): void
    {
        $this->getJson('/api/rankings')->assertStatus(401);
    }


    // ══════════════════════════════════════════════════════════
    //  GET /api/history
    // ══════════════════════════════════════════════════════════

    /** @test */
    public function history_devuelve_array_vacio_si_usuario_no_tiene_partidas(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        $this->getJson('/api/history', $headers)
             ->assertStatus(200)
             ->assertJson([]);
    }

    /** @test */
    public function history_devuelve_la_estructura_correcta(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        Game::create(['user_id' => $user->id, 'attempts' => 10, 'hits' => 4, 'total_time' => 90, 'status' => 'won']);

        $this->getJson('/api/history', $headers)
             ->assertStatus(200)
             ->assertJsonStructure(['*' => ['id', 'status', 'won', 'attempts', 'hits', 'accuracy', 'total_time', 'created_at']]);
    }

    /** @test */
    public function history_calcula_accuracy_correctamente(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        // 4 hits / 10 attempts = 40%
        Game::create(['user_id' => $user->id, 'attempts' => 10, 'hits' => 4, 'total_time' => 90, 'status' => 'won']);

        $this->assertEquals(40, $this->getJson('/api/history', $headers)->json('0.accuracy'));
    }

    /** @test */
    public function history_devuelve_accuracy_0_si_no_hay_attempts(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        Game::create(['user_id' => $user->id, 'attempts' => 0, 'hits' => 0, 'total_time' => 0, 'status' => 'active']);

        $this->assertEquals(0, $this->getJson('/api/history', $headers)->json('0.accuracy'));
    }

    /** @test */
    public function history_convierte_total_time_null_a_cero(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        Game::create(['user_id' => $user->id, 'attempts' => 5, 'hits' => 2, 'total_time' => null, 'status' => 'active']);

        $this->assertEquals(0, $this->getJson('/api/history', $headers)->json('0.total_time'));
    }

    /** @test */
    public function history_won_es_true_solo_para_partidas_ganadas(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        Game::create(['user_id' => $user->id, 'attempts' => 30, 'hits' => 17, 'total_time' => 100, 'status' => 'won']);
        Game::create(['user_id' => $user->id, 'attempts' => 5,  'hits' => 2,  'total_time' => 0,   'status' => 'active']);

        $items   = collect($this->getJson('/api/history', $headers)->json());
        $ganadas = $items->where('status', 'won');
        $activas = $items->where('status', 'active');

        $this->assertTrue($ganadas->every(fn($g) => $g['won'] === true));
        $this->assertTrue($activas->every(fn($g) => $g['won'] === false));
    }

    /** @test */
    public function history_ordena_partidas_por_fecha_descendente(): void
    {
        [$user, $token, $headers] = $this->crearUsuario();

        $antigua = Game::create(['user_id' => $user->id, 'attempts' => 20, 'hits' => 10, 'total_time' => 80,  'status' => 'won']);
        $reciente = Game::create(['user_id' => $user->id, 'attempts' => 30, 'hits' => 15, 'total_time' => 120, 'status' => 'won']);

        $antigua->update(['created_at'  => now()->subDays(5)]);
        $reciente->update(['created_at' => now()]);

        $data = $this->getJson('/api/history', $headers)->json();

        $this->assertEquals($reciente->id, $data[0]['id']);
        $this->assertEquals($antigua->id,  $data[1]['id']);
    }

    /** @test */
    public function history_solo_devuelve_partidas_del_usuario_autenticado(): void
    {
        [$user1, , $headers1] = $this->crearUsuario();
        [$user2, , $headers2] = $this->crearUsuario();

        Game::create(['user_id' => $user1->id, 'attempts' => 30, 'hits' => 17, 'total_time' => 100, 'status' => 'won']);
        Game::create(['user_id' => $user1->id, 'attempts' => 25, 'hits' => 17, 'total_time' => 80,  'status' => 'won']);
        Game::create(['user_id' => $user2->id, 'attempts' => 20, 'hits' => 17, 'total_time' => 60,  'status' => 'won']);

        $this->getJson('/api/history', $headers1)->assertJsonCount(2);
        $this->getJson('/api/history', $headers2)->assertJsonCount(1);
    }

    /** @test */
    public function history_sin_token_devuelve_401(): void
    {
        $this->getJson('/api/history')->assertStatus(401);
    }
}