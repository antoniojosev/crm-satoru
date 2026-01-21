import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { User } from "../../domain/entities/User";
import { LoginCredentials } from "../dtos/LoginDTO";
import { RegisterDTO } from "../dtos/RegisterDTO";
import { apiRequest } from "../../../lib/axios";

export class AuthRepositoryImpl implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<User> {
    return await apiRequest<User>("post", "/auth/login", credentials);
  }

  async register(registerData: RegisterDTO): Promise<User> {
    return await apiRequest<User>("post", "/auth/register", registerData);
  }

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("satoru_token");
    }
  }
}
