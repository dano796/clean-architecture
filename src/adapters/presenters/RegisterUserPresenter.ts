import { RegisterUserOutput } from "../../application/use-cases/RegisterUser";

// El presenter transforma la salida del caso de uso al formato que necesita la vista.
// En este caso es CLI, pero podría ser JSON para una API REST sin cambiar el caso de uso.
export class RegisterUserPresenter {
  format(output: RegisterUserOutput): string {
    if (output.success) {
      return `\nUsuario registrado con éxito\n  ID: ${output.userId}`;
    }
    return `\nNo se pudo registrar: ${output.error}`;
  }
}
