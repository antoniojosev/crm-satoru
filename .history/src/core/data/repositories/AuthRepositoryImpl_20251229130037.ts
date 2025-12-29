import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { User } from "../../domain/entities/User";
import { LoginCredentials } from "../dtos/LoginDTO";
import { RegisterDTO } from "../dtos/RegisterDTO";
import { satoruApi } from "../../../lib/axios";

export class AuthRepositoryImpl implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<User> {
    const { data } = await satoruApi.post<User>("/auth/login", credentials);
    return data;
  }

  // Implementación del registro
  async register(registerData: RegisterDTO): Promise<User> {
    // Enviamos el DTO directo al backend
    const { data } = await satoruApi.post<User>("/auth/register", registerData);
    return data;
  }

  async logout(): Promise<void> {
    // Si tu backend tiene endpoint de logout, llámalo aquí. Si no, solo borra local.
    // await satoruApi.post("/auth/logout");
    if (typeof window !== "undefined") {
      localStorage.removeItem("satoru_token");
    }
  }
}
