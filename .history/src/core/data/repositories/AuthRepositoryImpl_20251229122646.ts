import { satoruApi } from "../../../lib/axios";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { User } from "../../domain/entities/User";
import { AuthResponseDTO, LoginCredentials } from "../../data/dtos/LoginDTO";

export class AuthRepositoryImpl implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<User> {
    // 1. Petición al Backend (POST /api/v1/auth/login)
    const { data } = await satoruApi.post<AuthResponseDTO>(
      "/auth/login",
      credentials
    );

    // 2. Guardar el Token (Vital para que el usuario siga logueado)
    if (typeof window !== "undefined") {
      localStorage.setItem("satoru_token", data.access_token);
      localStorage.setItem("satoru_user", JSON.stringify(data.user)); // Guardamos info básica
    }

    // 3. Mapear: Convertimos la respuesta "rara" del backend a nuestra entidad limpia User
    return {
      id: data.user._id,
      email: data.user.email,
      firstName: data.user.first_name,
      lastName: data.user.last_name,
      role: data.user.role as "admin" | "investor",
      isActive: data.user.is_active,
      createdAt: new Date(),
    };
  }

  async logout(): Promise<void> {
    try {
      await satoruApi.post("/auth/logout");
    } catch (error) {
      console.warn("Error al cerrar sesión en servidor", error);
    } finally {
      // Siempre limpiamos el local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("satoru_token");
        localStorage.removeItem("satoru_user");
      }
    }
  }
}
