import { User } from "../entities/User";

// PORT: el dominio define el contrato, no la implementación.
// La infraestructura (base de datos, in-memory, etc.) lo implementa.
export interface UserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
