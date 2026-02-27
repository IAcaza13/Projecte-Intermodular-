<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>@yield('title', 'Fleet Rescue - Autenticación')</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
    
    <!-- Styles -->
    @vite(['resources/css/app.css'])
    
    <style>
        /* Animaciones personalizadas */
        @keyframes wave {
            0%, 100% { transform: translateX(0) translateY(0); }
            25% { transform: translateX(-5px) translateY(-2px); }
            75% { transform: translateX(5px) translateY(2px); }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes ping-slow {
            75%, 100% {
                transform: scale(1.5);
                opacity: 0;
            }
        }
        
        .animate-wave {
            animation: wave 8s ease-in-out infinite;
        }
        
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        
        .animate-ping-slow {
            animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .bg-grid-pattern {
            background-image: 
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
            background-size: 40px 40px;
        }
        
        .compass-hover {
            transition: all 0.3s ease;
        }
        
        .compass-hover:hover {
            transform: rotate(5deg) scale(1.05);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
    </style>
</head>
<body class="bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] antialiased">
    <!-- Fondo de olas animadas -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <!-- Capa de olas -->
        <svg class="absolute bottom-0 left-0 w-full h-64 opacity-20 dark:opacity-30" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path d="M0,100 Q150,50 300,100 T600,100 T900,100 T1200,100" 
                  stroke="none" fill="url(#wave-gradient)" 
                  class="animate-wave"/>
            <defs>
                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0.3" />
                    <stop offset="50%" style="stop-color:#2563EB;stop-opacity:0.2" />
                    <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:0.3" />
                </linearGradient>
            </defs>
        </svg>
        
        <!-- Puntos de coordenadas (estilo radar) -->
        <div class="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-30"></div>
    </div>
    
    <!-- Contenido principal -->
    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <!-- Logo y título -->
        <div class="mb-8 text-center animate-float">
            <div class="inline-block p-4 bg-blue-600 rounded-full shadow-xl mb-4 compass-hover">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
            </div>
            <h1 class="font-black text-4xl tracking-tighter uppercase italic text-blue-700 dark:text-blue-400">
                Fleet <span class="text-slate-800 dark:text-white">Rescue</span>
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">¡Rescata la flota perdida!</p>
        </div>
        
        <!-- Card de autenticación -->
        <div class="w-full max-w-md">
            <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-200 dark:border-blue-800 overflow-hidden">
                <!-- Barra superior decorativa -->
                <div class="h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
                
                <!-- Contenido -->
                <div class="p-8">
                    @yield('content')
                </div>
                
                <!-- Footer con onda decorativa -->
                <div class="relative h-16 overflow-hidden">
                    <svg class="absolute bottom-0 w-full h-16 text-blue-50 dark:text-gray-900" preserveAspectRatio="none" viewBox="0 0 1200 120">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                              opacity=".25" fill="currentColor"></path>
                        <path d="M0,0V15.81C13,21.25,27.93,25.67,44.24,28.45c69.76,11.55,139.44-5.81,208.43-17.41C327.18,0,400.39,0,473.93,16.47,543.64,32.13,612.22,51.56,682.1,63.72c73.06,12.59,148.69,7.7,219.78-10.53C951.2,43,1013.76,22,1070.51,7.66c16.09-4.1,32.58-7.71,49.47-10.53L1200,0Z" 
                              opacity=".5" fill="currentColor"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
                              fill="currentColor"></path>
                    </svg>
                </div>
            </div>
            
            <!-- Enlaces de ayuda -->
            <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                @hasSection('help')
                    @yield('help')
                @else
                    ¿Problemas para acceder? 
                    <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">Contacta al almirante</a>
                @endif
            </div>
        </div>
        
        <!-- Efecto de radar (decorativo) -->
        <div class="fixed bottom-4 right-4 w-24 h-24 opacity-20 pointer-events-none">
            <div class="absolute inset-0 border-2 border-blue-500 rounded-full animate-ping-slow"></div>
            <div class="absolute inset-2 border-2 border-blue-400 rounded-full animate-ping-slow" style="animation-delay: 0.5s"></div>
            <div class="absolute inset-4 border-2 border-blue-300 rounded-full animate-ping-slow" style="animation-delay: 1s"></div>
        </div>
    </div>
</body>
</html>