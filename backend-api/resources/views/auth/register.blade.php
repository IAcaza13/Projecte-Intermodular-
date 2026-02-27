@extends('layouts.auth')

@section('title', 'Fleet Rescue - Registro')

@section('content')
    <h2 class="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">
        Únete a la flota
    </h2>
    <p class="text-center text-gray-600 dark:text-gray-400 mb-8">
        Crea tu cuenta y comienza el rescate
    </p>
    
    <form method="POST" action="{{ route('register') }}" class="space-y-5">
        @csrf
        
        <!-- Username -->
        <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de usuario
            </label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                </div>
                <input id="username" type="text" name="username" value="{{ old('username') }}" required autofocus
                       class="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              transition-all duration-200"
                       placeholder="capitan_awesome">
            </div>
            @error('username')
                <p class="mt-2 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
            @enderror
        </div>
        
        <!-- Email -->
        <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
            </label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                </div>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required
                       class="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              transition-all duration-200"
                       placeholder="capitan@flota.com">
            </div>
            @error('email')
                <p class="mt-2 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
            @enderror
        </div>
        
        <!-- Password -->
        <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
            </label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                </div>
                <input id="password" type="password" name="password" required
                       class="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              transition-all duration-200"
                       placeholder="••••••••">
            </div>
            @error('password')
                <p class="mt-2 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
            @enderror
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Mínimo 6 caracteres
            </p>
        </div>
        
        <!-- Password Confirmation -->
        <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar contraseña
            </label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                </div>
                <input id="password_confirmation" type="password" name="password_confirmation" required
                       class="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              transition-all duration-200"
                       placeholder="••••••••">
            </div>
        </div>
        
        <!-- Términos y condiciones -->
        <div class="flex items-start">
            <div class="flex items-center h-5">
                <input type="checkbox" name="terms" required
                       class="rounded border-gray-300 dark:border-gray-600 
                              text-blue-600 shadow-sm 
                              focus:ring-blue-500 dark:focus:ring-blue-400
                              dark:bg-gray-700">
            </div>
            <div class="ml-3 text-sm">
                <label class="text-gray-600 dark:text-gray-400">
                    Acepto los 
                    <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">términos del servicio</a>
                    y la 
                    <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">política de privacidad</a>
                </label>
            </div>
        </div>
        
        <!-- Submit Button -->
        <button type="submit" 
                class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                       text-white font-bold py-3 px-4 rounded-lg
                       transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       dark:focus:ring-offset-gray-800
                       flex items-center justify-center gap-2 group">
            <svg class="w-5 h-5 group-hover:rotate-12 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            Crear cuenta
        </button>
        
        <!-- Login Link -->
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes cuenta?
            <a href="{{ route('login') }}" class="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Inicia sesión
            </a>
        </p>
    </form>
@endsection

@section('help')
    ¿Ya eres parte de la flota? 
    <a href="{{ route('login') }}" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
        Inicia sesión
    </a>
@endsection