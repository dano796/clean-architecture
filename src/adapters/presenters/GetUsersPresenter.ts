import { GetUsersOutput } from "../../application/use-cases/GetUsers";

export class GetUsersPresenter {
  format(output: GetUsersOutput): string {
    if (output.users.length === 0) {
      return "\nNo hay usuarios registrados todavía.";
    }

    const rows = output.users.map(
      (u, i) =>
        `  ${String(i + 1).padStart(2)}. ${u.name.padEnd(20)} ${u.email.padEnd(30)} ${u.age} años`,
    );

    return `\nUsuarios registrados (${output.users.length}):\n${rows.join("\n")}`;
  }
}
