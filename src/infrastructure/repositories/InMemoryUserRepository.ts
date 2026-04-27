import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";

// ADAPTER de infraestructura: implementa el port definido en el dominio.
// El dominio no sabe que esta clase existe. Solo conoce la interfaz UserRepository.
// Mañana esto podría ser PostgresUserRepository, MongoUserRepository, etc.
// Nada del dominio ni los casos de uso cambiaría.
export class InMemoryUserRepository implements UserRepository {
  private readonly users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email.value === email) ?? null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }
}
