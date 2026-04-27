import { UserRepository } from "../../domain/repositories/UserRepository";

export interface GetUsersOutput {
  users: Array<{
    id: string;
    name: string;
    email: string;
    age: number;
  }>;
}

export class GetUsers {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<GetUsersOutput> {
    const users = await this.userRepository.findAll();
    return {
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email.value,
        age: u.age,
      })),
    };
  }
}
