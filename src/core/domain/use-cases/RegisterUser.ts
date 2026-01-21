import { IAuthRepository } from "../repositories/IAuthRepository";
import { RegisterDTO } from "../../data/dtos/RegisterDTO";
import { User } from "../entities/User";

export class RegisterUser {
  constructor(private repository: IAuthRepository) {}

  async execute(data: RegisterDTO): Promise<User> {
    if (data.password.length < 8) {
      throw new Error("La contrasena debe tener al menos 8 caracteres");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!passwordRegex.test(data.password)) {
      throw new Error("La contrasena debe contener mayuscula, minuscula, numero y caracter especial");
    }

    return await this.repository.register(data);
  }
}
