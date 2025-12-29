import { User } from "../entities/User";
import { LoginCredentials } from "../../data/dtos/LoginDTO";

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
  logout(): Promise<void>;
}
