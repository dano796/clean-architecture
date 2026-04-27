import * as readline from "readline";
import * as crypto from "crypto";

// =============================================================
// CÓDIGO ESPAGUETI
// Todo mezclado: base de datos, lógica de negocio, CLI y formateo.
// Este es el antes de aplicar Clean Architecture.
// ==============================================================

// 1. "Base de datos" global acoplada al mismo archivo
const db: Array<{ id: string; name: string; email: string; birthdate: Date }> =
  [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function menu(): Promise<void> {
  console.log("\n==============================");
  console.log("   Sistema de Registro v1.0   ");
  console.log("         (VERSIÓN SUCIA)      ");
  console.log("==============================");
  console.log("  1. Registrar usuario");
  console.log("  2. Ver usuarios registrados");
  console.log("  3. Salir");
  console.log("------------------------------");

  const option = await ask("Opción: ");

  switch (option.trim()) {
    case "1": {
      // 2. Controlador acoplado con la presentación
      console.log("\n--- Registrar usuario ---");
      const name = await ask("Nombre completo: ");
      const rawEmail = await ask("Email: ");
      const rawBirthdate = await ask("Fecha de nacimiento (YYYY-MM-DD): ");

      // 3. Lógica de dominio mezclada en el controlador
      const email = rawEmail.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        console.log(
          `\nError: El email "${rawEmail}" no tiene un formato válido.`,
        );
        break;
      }

      // 4. Lógica de casos de uso (verificar existencia) mezclada en el controlador
      const existingUser = db.find((u) => u.email === email);
      if (existingUser) {
        console.log("\nError: Ya existe un usuario con ese email.");
        break;
      }

      // 5. Más lógica de negocio (validar edad) mezclada en el controlador
      const birthdateDate = new Date(rawBirthdate);
      const today = new Date();
      const years = today.getFullYear() - birthdateDate.getFullYear();
      const notYetBirthday =
        today.getMonth() < birthdateDate.getMonth() ||
        (today.getMonth() === birthdateDate.getMonth() &&
          today.getDate() < birthdateDate.getDate());
      const age = notYetBirthday ? years - 1 : years;

      if (age < 18) {
        console.log(
          `\nError: El usuario debe ser mayor de 18 años (edad actual: ${age})`,
        );
        break;
      }

      // 6. Manipulación directa de la base de datos (infraestructura)
      const id = crypto.randomUUID();
      db.push({
        id,
        name: name.trim(),
        email,
        birthdate: birthdateDate,
      });

      console.log(`\nUsuario registrado con éxito! ID: ${id}`);
      break;
    }

    case "2":
      console.log("\n--- Lista de usuarios ---");
      if (db.length === 0) {
        console.log("No hay usuarios registrados todavía.");
      } else {
        // 7. Formateo y acceso a datos mezclados
        db.forEach((u) => {
          console.log(`- ${u.name} (${u.email})`);
        });
      }
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
