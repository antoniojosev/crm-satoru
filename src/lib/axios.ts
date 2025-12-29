import axios from "axios";

// URL base tomada de tus capturas de Swagger
const BASE_URL = "/api/v1";

export const satoruApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Inyecta el token automáticamente si existe
satoruApi.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("satoru_token")
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Manejo de errores (ej. token vencido)
satoruApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Aquí podrías limpiar el localStorage si el token expiró
      if (typeof window !== "undefined") {
        // localStorage.removeItem('satoru_token');
      }
    }
    return Promise.reject(error);
  }
);
