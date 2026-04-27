import { User } from "../../domain/entities/User";
import { Email } from "../../domain/value-objects/Email";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { DomainError } from "../../domain/errors/DomainError";

export interface RegisterUserInput {
  name: string;
  email: string;
  birthdate: string; // formato: YYYY-MM-DD
}

export interface RegisterUserOutput {
  success: boolean;
  userId?: string;
  error?: string;
}

// CASO DE USO: orquesta entidades y el repositorio.
// No implementa reglas de negocio, eso le corresponde a la entidad.
export class RegisterUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    try {
      const email = new Email(input.email);

      const existing = await this.userRepository.findByEmail(email.value);
      if (existing) {
        return { success: false, error: "Ya existe un usuario con ese email" };
      }

      const id = crypto.randomUUID();
      const user = new User(id, input.name, email, new Date(input.birthdate));

      await this.userRepository.save(user);

      return { success: true, userId: user.id };
    } catch (error) {
      if (error instanceof DomainError) {
        return { success: false, error: error.message };
      }
      throw error;
    }
  }
}
