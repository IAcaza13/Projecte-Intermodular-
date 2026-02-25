# Fleet Rescue - Pràctica Intermodular (M06, M07, M09)

Proyecto de rescate de barcos desarrollado con **Laravel 11 (API)** y **React (Vite)**.

## 🚀 Requisitos previos
- **PHP** >= 8.2
- **Node.js** >= 18.0
- **Composer**
- **MySQL** o MariaDB

## 🛠️ Instalación del Backend (Laravel)
1. Entra en la carpeta del servidor: `cd backend-api`
2. Instala dependencias: `composer install`
3. Configura el entorno: `cp .env.example .env`
4. Genera la clave: `php artisan key:generate`
5. Configura tu DB en el `.env` y ejecuta las migraciones:
   ```bash
   php artisan migrate
   
Inicia el servidor: php artisan serve (Se ejecutará en http://localhost:8000)

💻 Instalación del Frontend (React)
Entra en la carpeta del cliente: cd frontend-client

Instala dependencias: npm install

Inicia el modo desarrollo: npm run dev (Se ejecutará en http://localhost:5173)

📄 Características Implementadas
DWES: API REST, Generación aleatoria de barcos (no solapados), Persistencia en DB.

DWEC: Hooks personalizados (useGame), Context API para Auth y Temas, Consumo de API con Axios.

DIW: Diseño responsive (Tailwind), Modo Oscuro/Claro, Animaciones CSS y Gráficos (Chart.js).