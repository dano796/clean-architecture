import { Email } from "../value-objects/Email";
import { DomainError } from "../errors/DomainError";

// REGLA DE NEGOCIO: solo mayores de 18 pueden registrarse.
// Esta regla vive aquí, en la entidad, no en el controlador ni en la base de datos.
export class User {
  readonly id: string;
  readonly name: string;
  readonly email: Email;
  readonly birthdate: Date;

  constructor(id: string, name: string, email: Email, birthdate: Date) {
    this.validateAge(birthdate);
    this.id = id;
    this.name = name.trim();
    this.email = email;
    this.birthdate = birthdate;
  }

  get age(): number {
    const today = new Date();
    const years = today.getFullYear() - this.birthdate.getFullYear();
    const notYetBirthday =
      today.getMonth() < this.birthdate.getMonth() ||
      (today.getMonth() === this.birthdate.getMonth() &&
        today.getDate() < this.birthdate.getDate());
    return notYetBirthday ? years - 1 : years;
  }

  private validateAge(birthdate: Date): void {
    const today = new Date();
    const years = today.getFullYear() - birthdate.getFullYear();
    const notYetBirthday =
      today.getMonth() < birthdate.getMonth() ||
      (today.getMonth() === birthdate.getMonth() &&
        today.getDate() < birthdate.getDate());
    const age = notYetBirthday ? years - 1 : years;

    if (age < 18) {
      throw new DomainError(
        `El usuario debe ser mayor de 18 años (edad actual: ${age})`,
      );
    }
  }
}
