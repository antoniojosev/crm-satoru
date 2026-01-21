import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "satoru_admin_token",
  REFRESH_TOKEN: "satoru_admin_refresh_token",
  USER_DATA: "satoru_admin_user",
} as const;

// API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const satoruApi = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Inject token automatically
satoruApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors and token refresh
satoruApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

          if (refreshToken) {
            const response = await axios.post(`${API_URL}/auth/refresh`, {
              refreshToken,
            });

            const data = response.data.data || response.data;
            const { accessToken, refreshToken: newRefreshToken } = data;

            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            return satoruApi(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear storage and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API request handler
 * Handles wrapped responses: { success: true, data: T }
 */
export async function apiRequest<T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
  config?: object
): Promise<T> {
  try {
    const response = await satoruApi[method](url, data, config);

    // Handle wrapped response format from backend
    if (
      response.data &&
      typeof response.data === "object" &&
      "success" in response.data &&
      "data" in response.data
    ) {
      return response.data.data as T;
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

export default satoruApi;
