import axios from 'axios';

/**
 * Instancia Global de Axios
 * Configurada para interactuar con la API del Backend corporativo.
 */
const api = axios.create({
  // URL base dinámica que apunta al servidor Express
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  // Permitir el envío de cookies entre dominios para la gestión de sesiones
  withCredentials: true,
  // Cabeceras estándar para solicitudes JSON
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Solicitudes (Opcional)
 * Se puede utilizar para añadir cabeceras dinámicas o logging de depuración.
 */
api.interceptors.request.use(
  (config) => {
    // Ejemplo: Log de solicitudes en modo desarrollo
    if (import.meta.env.DEV) {
      console.log(`[API] Solicitando: ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Respuestas
 * Centraliza la lógica de manejo de errores comunes (ej. expiración de sesión).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo global de errores 401 (Sesión expirada o no autorizada)
    if (error.response && error.response.status === 401) {
      // Opcional: Redireccionar al login si no estamos ya en la página de login
      if (!window.location.pathname.includes('/login')) {
        console.warn('Sesión no válida o expirada. Redirigiendo...');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
