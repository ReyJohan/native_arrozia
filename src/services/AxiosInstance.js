import axios from 'axios';

// Crear una instancia de Axios con configuración base
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Reemplaza con la URL base de tu API
  timeout: 10000, // Tiempo de espera de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    // Aquí puedes añadir el token de autenticación si es necesario
    const token = localStorage.getItem('token'); // Reemplaza con la forma en que manejas tu token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de errores
    if (error.response && error.response.status === 401) {
      // Redireccionar al login si el token ha expirado
      console.error('No autorizado, redirigiendo al login...');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
