import { IAuthRepository } from "../repositories/IAuthRepository";
import { RegisterDTO } from "../../data/dtos/RegisterDTO";
import { User } from "../entities/User";

export class RegisterUser {
  constructor(private repository: IAuthRepository) {}

  async execute(data: RegisterDTO): Promise<User> {
    // Aquí podés agregar validaciones extra si querés (ej: password muy corta)
    if (data.password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    return await this.repository.register(data);
  }
}
