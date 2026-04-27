import { DomainError } from "../errors/DomainError";

export class Email {
  readonly value: string;

  constructor(raw: string) {
    const trimmed = raw.trim().toLowerCase();
    if (!Email.isValid(trimmed)) {
      throw new DomainError(`El email "${raw}" no tiene un formato válido`);
    }
    this.value = trimmed;
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  toString(): string {
    return this.value;
  }
}
