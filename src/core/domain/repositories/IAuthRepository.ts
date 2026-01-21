import { User } from "../entities/User";
import { LoginCredentials } from "../../data/dtos/LoginDTO";
import { RegisterDTO } from "../../data/dtos/RegisterDto";

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
  register(data: RegisterDTO): Promise<User>; // <--- Nuevo método
  logout(): Promise<void>;
}
