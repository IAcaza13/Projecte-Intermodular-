
1. ⚓ Fleet Rescue - Backend & FrontendBienvenido a Fleet Rescue, un juego de estrategia naval desarrollado con Laravel (API) y React (Vite). Sigue estos pasos para desplegar tu flota en local y empezar a jugar.🛠️ Requisitos PreviosAntes de empezar, asegúrate de tener instalado:PHP (>= 8.1) y ComposerNode.js (LTS) y npmMySQL o un servidor de base de datos compatible (XAMPP, Laragon, etc.)🚀 Instalación Paso a Paso1. Clonar el repositorioBashgit clone https://github.com/tu-usuario/fleet-rescue.git
cd fleet-rescue

2. Configuración del Backend (Laravel)Entra en la carpeta del backend (ajusta el nombre si es distinto, ej: backend-api):Bashcd backend-api
composer install
Configurar entorno: Copia el archivo de ejemplo y genera la clave.Bashcp .env.example .env
php artisan key:generate
Base de datos: Abre tu .env y configura el nombre de la base de datos, usuario y contraseña. Luego, ejecuta las migraciones:Bashphp artisan migrate --seed
Levantar servidor:Bashphp artisan serve
El backend estará corriendo en http://localhost:80003. Configuración del Frontend (React)Abre una nueva terminal en la raíz del proyecto y entra en la carpeta del frontend:Bashcd fleet-rescue-frontend
npm install
Variables de entorno: Crea un archivo .env en la raíz del frontend y añade la URL de tu API:Fragmento de códigoVITE_API_URL=http://localhost:8000/api
Levantar cliente:Bashnpm run dev
El juego estará disponible en http://localhost:5173🎮 Cómo jugarRegistro/Login: Crea una cuenta de capitán para guardar tu progreso.Dashboard: Desde aquí puedes ver tu estado actual y acceder a las distintas secciones.Mi Flota (Perfil): Revisa tu historial de batallas reales extraídas de la base de datos.Jugar: ¡Zarpa y rescata a la flota!🛠️ Stack TecnológicoTecnologíaUsoLaravel 11API REST, Autenticación Sanctum y Gestión de DB.React 18Interfaz de usuario y lógica del juego.Tailwind CSSEstilizado moderno y modo oscuro.AxiosComunicación fluida con el backend.Lucide ReactIconografía naval y de interfaz.🛡️ Solución de ProblemasError de CORS: Asegúrate de que el archivo config/cors.php en Laravel permita peticiones desde el puerto de React (5173).Error 401 Unauthorized: Verifica que el token de usuario se esté guardando correctamente en el localStorage.Database no encontrada: Crea manualmente la base de datos en tu gestor (phpMyAdmin/MySQL) antes de lanzar el comando migrate.Desarrollado con ❤️ para amantes de la estrategia naval.¿Tienes dudas? ¡Abre un Issue o contacta con el Almirante a cargo!