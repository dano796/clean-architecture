import * as readline from "readline";

// Infraestructura
import { InMemoryUserRepository } from "./infrastructure/repositories/InMemoryUserRepository";

// Casos de uso
import { RegisterUser } from "./application/use-cases/RegisterUser";
import { GetUsers } from "./application/use-cases/GetUsers";

// Adaptadores
import { RegisterUserController } from "./adapters/controllers/RegisterUserController";
import { GetUsersController } from "./adapters/controllers/GetUsersController";
import { RegisterUserPresenter } from "./adapters/presenters/RegisterUserPresenter";
import { GetUsersPresenter } from "./adapters/presenters/GetUsersPresenter";

// =============================================================
// WIRING: el único lugar donde todas las capas se conocen.
// El dominio y los casos de uso nunca importan infraestructura.
// =============================================================

const userRepository = new InMemoryUserRepository();

const registerUser = new RegisterUser(userRepository);
const getUsers = new GetUsers(userRepository);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const registerUserController = new RegisterUserController(
  registerUser,
  new RegisterUserPresenter(),
  rl,
);

const getUsersController = new GetUsersController(
  getUsers,
  new GetUsersPresenter(),
);

// =============================================================
// CLI (capa más externa — podría ser reemplazada por Express)
// =============================================================

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function menu(): Promise<void> {
  console.log("\n==============================");
  console.log("   Sistema de Registro v1.0   ");
  console.log("==============================");
  console.log("  1. Registrar usuario");
  console.log("  2. Ver usuarios registrados");
  console.log("  3. Salir");
  console.log("------------------------------");

  const option = await ask("Opción: ");

  switch (option.trim()) {
    case "1":
      await registerUserController.handle();
      break;
    case "2":
      await getUsersController.handle();
      break;
    case "3":
      console.log("\nHasta luego!\n");
      rl.close();
      return;
    default:
      console.log("\nOpción no válida, intenta de nuevo.");
  }

  await menu();
}

menu().catch((err) => {
  console.error("Error inesperado:", err);
  rl.close();
  process.exit(1);
});
