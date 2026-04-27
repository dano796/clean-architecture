import * as readline from "readline";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { RegisterUserPresenter } from "../presenters/RegisterUserPresenter";

// El controller es delgado: recoge input, llama al caso de uso, entrega al presenter.
// No tiene lógica de negocio ni de formateo.
export class RegisterUserController {
  constructor(
    private readonly useCase: RegisterUser,
    private readonly presenter: RegisterUserPresenter,
    private readonly rl: readline.Interface,
  ) {}

  async handle(): Promise<void> {
    console.log("\n--- Registrar usuario ---");
    const name = await this.ask("Nombre completo: ");
    const email = await this.ask("Email: ");
    const birthdate = await this.ask("Fecha de nacimiento (YYYY-MM-DD): ");

    const output = await this.useCase.execute({ name, email, birthdate });
    console.log(this.presenter.format(output));
  }

  private ask(question: string): Promise<string> {
    return new Promise((resolve) => this.rl.question(question, resolve));
  }
}
