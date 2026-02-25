<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // REGISTRO: Formulario y validaciones 
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400); 
        }

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Usuario registrado con éxito'], 201);
    }

    // LOGIN: Petición al server y mostrar errores 
    public function login(Request $request) {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::password_verify($request->password, $user->password)) {
            return response()->json(['error' => 'Credenciales incorrectas'], 401); 
        }

        // Creamos un token de Sanctum para React
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada con éxito']);
    }
}
