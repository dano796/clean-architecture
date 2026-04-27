# Clean Architecture — Guía Completa

> Basado en los principios de **Robert C. Martin (Uncle Bob)**, Clean Architecture es un enfoque de diseño de software que organiza el código en capas con responsabilidades bien definidas, garantizando sistemas mantenibles, testeables y escalables.

---

## 1. El problema que resuelve Clean Architecture

### El código "sucio" y sus consecuencias

Cuando un sistema se construye sin una arquitectura clara, ocurre algo predecible con el tiempo:

- Los desarrolladores dedican más tiempo a **arreglar código roto** que a crear nuevas funcionalidades.
- Un cambio pequeño en una parte del sistema **rompe partes aparentemente no relacionadas**.
- La lógica de negocio queda **mezclada con detalles técnicos**: la base de datos, el framework, la UI.
- Testear se vuelve doloroso porque todo está acoplado.
- Cambiar de tecnología (base de datos, framework, proveedor de email) implica **reescribir media aplicación**.

### Los dos valores del software

Todo sistema de software tiene dos valores fundamentales:

1. **Comportamiento (Behaviour):** El software hace lo que se espera de él. Cumple los requisitos funcionales.
2. **Estructura (Architecture):** El código está organizado de forma que sea fácil de modificar, extender y mantener.

Los desarrolladores suelen enfocarse exclusivamente en el comportamiento, ignorando la estructura. Esto es un error a largo plazo. **Una arquitectura deficiente puede hacer que un sistema que funciona bien hoy sea imposible de mantener mañana.**

---

## 2. ¿Qué es Clean Architecture?

Clean Architecture es una filosofía de diseño de software que busca:

- **Separar las responsabilidades** del sistema en capas bien definidas.
- Garantizar que la **lógica de negocio sea el centro** del sistema, independiente de cualquier tecnología.
- Hacer que el sistema sea **fácilmente testeable** sin necesidad de UI, base de datos ni servidores web.
- Permitir **reemplazar tecnologías** (frameworks, bases de datos, APIs externas) con el mínimo impacto posible.

La idea central se resume en una frase:

> **"El objetivo de la arquitectura es minimizar el costo humano de construir y mantener el sistema."**

---

## 3. La regla de dependencia — El principio fundamental

Este es el concepto más importante y transversal de Clean Architecture y todo lo demás se deriva de él:

> **Las dependencias del código fuente solo pueden apuntar hacia adentro.**

Esto significa:

- Las capas **externas** dependen de las capas **internas**.
- Las capas **internas** no saben nada sobre las capas externas.
- Una capa interior **nunca menciona** el nombre de algo que pertenece a una capa exterior: ninguna clase, función, variable ni estructura de datos.

### ¿Por qué es tan importante?

Porque garantiza que el **núcleo del sistema** (la lógica de negocio) sea completamente **independiente** de los detalles técnicos. Si la base de datos cambia, si el framework cambia, si la UI cambia, **el dominio no se toca**.

---

## 4. Capas de Clean Architecture

Clean Architecture se representa como **círculos concéntricos**, donde cada círculo es una capa. Cuanto más hacia adentro, más cerca estamos de la lógica de negocio. Cuanto más hacia afuera, más cerca estamos de los detalles técnicos.

Las capas típicas son (de adentro hacia afuera):

```
┌─────────────────────────────────────────────────┐
│               INFRAESTRUCTURA                   │  ← Capa más externa
│  ┌───────────────────────────────────────────┐  │
│  │          ADAPTADORES / PRESENTACIÓN       │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │          CASOS DE USO               │  │  │
│  │  │  ┌───────────────────────────────┐  │  │  │
│  │  │  │          DOMINIO              │  │  │  │  ← Capa más interna
│  │  │  └───────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
Las flechas de dependencia apuntan siempre hacia adentro →
```

---

## 5. Capa 1: Dominio — El núcleo del sistema

### ¿Qué es?

La capa de Dominio es **el corazón de la aplicación**. Aquí vive la lógica de negocio pura: las reglas, los conceptos y los modelos que definen cómo funciona el negocio, **completamente independiente de cualquier tecnología**.

Si cambias la base de datos, el framework o la UI, **el dominio no cambia**.

### ¿Qué contiene?

**Entidades:**

- Objetos del dominio con identidad propia que persisten en el tiempo.
- Encapsulan datos del negocio y las reglas más fundamentales (invariantes).
- Ejemplo: `User`, `Order`, `Product`, `Invoice`.

```typescript
// Dominio puro — sin imports de frameworks ni librerías externas
export class User {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
  ) {
    if (!email.includes("@")) {
      throw new Error("Email inválido"); // Regla de negocio
    }
    if (!name || name.trim().length === 0) {
      throw new Error("El nombre no puede estar vacío");
    }
  }
}
```

**Value Objects:**

- Objetos sin identidad propia, definidos únicamente por su valor.
- Son inmutables.
- Ejemplo: `Money`, `Address`, `Email`, `PhoneNumber`.

**Agregados (Aggregates):**

- Conjunto de entidades y value objects tratados como una unidad.
- Tienen una entidad raíz (Aggregate Root) que controla el acceso al resto.

**Servicios de Dominio:**

- Lógica de negocio que no pertenece naturalmente a ninguna entidad.
- Ejemplo: `PricingService`, `ShippingCalculator`.

**Interfaces / Contratos (Ports):**

- Definen qué necesita el dominio para funcionar, sin especificar cómo.
- Ejemplo: `UserRepository`, `EmailSender`, `PaymentGateway`.
- Las implementaciones reales viven en la capa de infraestructura.

```typescript
// Contrato definido en el dominio
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
```

**Eventos de Dominio:**

- Representan algo significativo que ocurrió en el negocio.
- Permiten comunicar distintas partes del sistema sin acoplamiento directo.
- Ejemplo: `UserRegistered`, `OrderPlaced`, `PaymentProcessed`.

**Excepciones de Dominio:**

- Errores propios del negocio con semántica clara.
- Ejemplo: `UserNotFoundException`, `InsufficientFundsException`.

### Regla de oro del Dominio

> El dominio **no importa nada** de las capas externas. Ningún framework, ninguna librería de base de datos, ningún ORM. Cero dependencias externas.

---

## 6. Capa 2: Casos de Uso (Use Cases / Application Layer)

### ¿Qué es?

Los Casos de Uso representan **las acciones específicas que puede realizar el sistema**. Orquestan el flujo de datos entre el dominio y las capas externas para cumplir con un objetivo de negocio concreto.

También llamados **Interactors** o **Application Services**.

### Responsabilidades

- Implementar la lógica de negocio específica de la aplicación.
- Coordinar entidades y servicios de dominio.
- Llamar a las interfaces (contratos) definidas en el dominio.
- Controlar el flujo de una operación: validar entrada, ejecutar lógica, persistir, notificar.

### ¿Qué contiene?

Cada caso de uso suele ser una clase con un único método de ejecución:

```typescript
// Caso de uso: Registrar un nuevo usuario
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository, // Contrato, no implementación
    private readonly emailSender: EmailSender, // Contrato, no implementación
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    // 1. Validar que el email no esté en uso
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new EmailAlreadyInUseException(input.email);
    }

    // 2. Crear la entidad del dominio
    const user = new User(generateId(), input.email, input.name);

    // 3. Persistir
    await this.userRepository.save(user);

    // 4. Notificar
    await this.emailSender.sendWelcomeEmail(user.email);

    return { userId: user.id };
  }
}
```

### Lo que NO hacen los Casos de Uso

- No conocen la base de datos específica (MySQL, MongoDB, etc.).
- No conocen el framework web (Express, NestJS, Django, etc.).
- No saben cómo se envía el email (SendGrid, SES, etc.).
- No contienen lógica de presentación.

### Diferencia entre lógica de dominio y lógica de aplicación

| Lógica de Dominio                               | Lógica de Aplicación (Caso de Uso)                 |
| ----------------------------------------------- | -------------------------------------------------- |
| Reglas que existen independientemente de la app | Reglas específicas de esta aplicación              |
| "Un pedido necesita al menos un producto"       | "Al registrar usuario, enviar email de bienvenida" |
| Vive en entidades y servicios de dominio        | Vive en los Use Cases                              |
| No cambia si se añaden nuevas funcionalidades   | Puede cambiar con nuevos requisitos funcionales    |

---

## 7. Capa 3: Adaptadores / Interface Adapters

### ¿Qué es?

Los Adaptadores son **traductores** entre el mundo exterior y el mundo interior (dominio + casos de uso). Convierten los datos del formato que usa el exterior al formato que necesitan los casos de uso, y viceversa.

### ¿Qué contiene?

**Controladores (Controllers):**

- Reciben las peticiones del exterior (HTTP, CLI, mensajería).
- Extraen los datos de la petición.
- Llaman al caso de uso correspondiente.
- Devuelven la respuesta en el formato adecuado.

```typescript
// Controlador HTTP — adaptador de entrada
export class UserController {
  constructor(private readonly registerUser: RegisterUserUseCase) {}

  async register(req: Request, res: Response): Promise<void> {
    const { email, name } = req.body;

    const result = await this.registerUser.execute({ email, name });

    res.status(201).json({ userId: result.userId });
  }
}
```

**Presenters:**

- Transforman la salida de los casos de uso al formato adecuado para la presentación.
- Pueden formatear fechas, traducir textos, construir DTOs de respuesta.

**Repositorios (implementaciones):**

- Implementan los contratos definidos en el dominio.
- Contienen el acceso real a la base de datos.

```typescript
// Implementación del contrato UserRepository para PostgreSQL
export class PostgresUserRepository implements UserRepository {
  constructor(private readonly db: DatabaseConnection) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (!row) return null;
    return new User(row.id, row.email, row.name); // Mapea a entidad de dominio
  }

  async save(user: User): Promise<void> {
    await this.db.query(
      "INSERT INTO users (id, email, name) VALUES ($1, $2, $3)",
      [user.id, user.email, user.name],
    );
  }
}
```

### El flujo de datos en los Adaptadores

Los adaptadores actúan en ambas direcciones:

```
Petición HTTP → Controller → [transforma datos] → Use Case → Dominio
Dominio → Use Case → [transforma datos] → Presenter → Respuesta HTTP
```

Los datos que cruzan los límites entre capas deben ser **estructuras simples** (DTOs, objetos planos), nunca entidades de dominio ni objetos del framework.

---

## 8. Capa 4: Infraestructura — Los detalles técnicos

### ¿Qué es?

La capa de Infraestructura contiene todos los **detalles técnicos concretos**: frameworks, bases de datos, librerías de terceros, servicios externos. Es la capa más externa y la que **más cambia con el tiempo**.

### ¿Qué contiene?

- **Frameworks web:** Express, NestJS, Django, Spring, Laravel.
- **ORMs y acceso a datos:** TypeORM, Prisma, Hibernate, SQLAlchemy.
- **Bases de datos:** MySQL, PostgreSQL, MongoDB, Redis.
- **Servicios externos:** SendGrid (email), Stripe (pagos), AWS S3 (archivos).
- **Sistemas de mensajería:** RabbitMQ, Kafka, SQS.
- **Configuración e inyección de dependencias.**

### Principio clave

> Toda la infraestructura es un **detalle de implementación**. El sistema no debería estar acoplado a ninguno de estos componentes de forma que su reemplazo implique cambios en el dominio o los casos de uso.

Ejemplo: si se decide cambiar de PostgreSQL a MongoDB, **solo se modifica la implementación del repositorio** en la capa de infraestructura. El dominio y los casos de uso permanecen intactos.

---

## 9. La Inversión de Dependencias

### El problema

Un Caso de Uso necesita guardar datos en la base de datos. Intuitivamente, parecería que el Caso de Uso debe depender de la base de datos. Pero eso violaría la regla de dependencia (las capas internas no deben depender de las externas).

### La solución: Dependency Inversion Principle (DIP)

La inversión de dependencias resuelve esto de forma elegante:

1. El **dominio define una interfaz** (contrato) que expresa lo que necesita: `UserRepository`.
2. El **caso de uso depende de esa interfaz**, no de ninguna implementación concreta.
3. La **infraestructura implementa esa interfaz**: `PostgresUserRepository implements UserRepository`.
4. En el momento de ejecutar la aplicación, se **inyecta** la implementación concreta al caso de uso.

```
Dominio define:      UserRepository (interfaz)
Caso de Uso usa:     UserRepository (interfaz)  ← depende de la abstracción
Infraestructura:     PostgresUserRepository     ← implementa la abstracción
```

Esto hace que el **código fuente del caso de uso apunte hacia el dominio**, aunque en tiempo de ejecución el flujo de control vaya hacia la infraestructura. De esta forma se respeta la regla de dependencia.

### Inyección de Dependencias

La inyección de dependencias es el mecanismo que hace posible la inversión de dependencias en la práctica. Se suele configurar en la capa de infraestructura:

```typescript
// Composición de dependencias (normalmente en el punto de entrada de la app)
const userRepository = new PostgresUserRepository(databaseConnection);
const emailSender = new SendGridEmailSender(apiKey);
const registerUser = new RegisterUserUseCase(userRepository, emailSender);
const userController = new UserController(registerUser);
```

---

## 10. Flujo completo de una petición

Para consolidar todo, veamos el recorrido completo de una petición HTTP de registro de usuario:

```
1. [INFRAESTRUCTURA] El servidor HTTP recibe la petición POST /users

2. [ADAPTADOR - Controller] UserController.register()
   - Extrae email y name del body
   - Crea el DTO de entrada: { email, name }
   - Llama a RegisterUserUseCase.execute()

3. [CASO DE USO] RegisterUserUseCase.execute()
   - Verifica que el email no exista (llama a UserRepository)
   - Crea la entidad User (dominio)
   - Guarda el usuario (llama a UserRepository)
   - Envía email de bienvenida (llama a EmailSender)
   - Retorna el resultado

4. [DOMINIO] User constructor
   - Valida que el email tenga formato válido
   - Valida que el nombre no esté vacío
   - Lanza excepciones si algo falla

5. [INFRAESTRUCTURA] PostgresUserRepository.save()
   - Ejecuta el INSERT en la base de datos

6. [INFRAESTRUCTURA] SendGridEmailSender.sendWelcomeEmail()
   - Llama a la API de SendGrid

7. [ADAPTADOR - Controller] Recibe el resultado
   - Construye la respuesta HTTP: 201 Created
   - La devuelve al cliente
```

---

## 11. Características de un sistema con Clean Architecture

Un sistema correctamente implementado con Clean Architecture es:

**Independiente de frameworks:**
El sistema no depende de la existencia de ningún framework. Los frameworks se usan como herramientas, no como el núcleo del sistema. Puedes reemplazar Express por Fastify, o NestJS por Hapi, sin tocar el dominio.

**Testeable:**
Las reglas de negocio se pueden probar sin UI, sin base de datos, sin servidores. Basta con crear implementaciones falsas (mocks) de los contratos definidos en el dominio.

```typescript
// Test del caso de uso con repositorio en memoria (sin base de datos real)
const userRepository = new InMemoryUserRepository();
const emailSender = new FakeEmailSender();
const registerUser = new RegisterUserUseCase(userRepository, emailSender);

const result = await registerUser.execute({
  email: "test@test.com",
  name: "Test",
});
expect(result.userId).toBeDefined();
```

**Independiente de la UI:**
La interfaz de usuario puede cambiarse sin afectar la lógica de negocio. El mismo sistema puede tener una API REST y una interfaz de línea de comandos simultáneamente.

**Independiente de la base de datos:**
Puedes cambiar de Oracle a MongoDB, de SQL a NoSQL, sin que el dominio ni los casos de uso se vean afectados.

**Independiente de agentes externos:**
Las reglas de negocio no saben nada de los servicios externos (APIs de terceros, sistemas de mensajería, etc.).

---

## 12. Estructuración del proyecto (scaffolding)

Una estructura de carpetas típica que refleja Clean Architecture es:

```
src/
├── domain/                        ← Capa de Dominio
│   ├── entities/
│   │   ├── User.ts
│   │   └── Order.ts
│   ├── value-objects/
│   │   ├── Email.ts
│   │   └── Money.ts
│   ├── repositories/              ← Interfaces (contratos)
│   │   ├── UserRepository.ts
│   │   └── OrderRepository.ts
│   ├── services/
│   │   └── PricingService.ts
│   └── events/
│       └── UserRegistered.ts
│
├── application/                   ← Casos de Uso
│   ├── use-cases/
│   │   ├── RegisterUser.ts
│   │   ├── PlaceOrder.ts
│   │   └── GetUserProfile.ts
│   └── dtos/
│       ├── RegisterUserInput.ts
│       └── RegisterUserOutput.ts
│
├── infrastructure/                ← Capa de Infraestructura
│   ├── database/
│   │   ├── PostgresUserRepository.ts
│   │   └── PostgresOrderRepository.ts
│   ├── email/
│   │   └── SendGridEmailSender.ts
│   ├── payment/
│   │   └── StripePaymentGateway.ts
│   └── config/
│       └── dependency-injection.ts
│
└── presentation/                  ← Adaptadores / Controladores
    ├── http/
    │   ├── controllers/
    │   │   └── UserController.ts
    │   └── routes/
    │       └── userRoutes.ts
    └── cli/
        └── RegisterUserCommand.ts
```

---

## 13. Relación con otros principios y patrones

### Principios SOLID

Clean Architecture se apoya fuertemente en los principios SOLID:

- **S — Single Responsibility:** Cada capa tiene una única responsabilidad.
- **O — Open/Closed:** Las capas internas están abiertas a extensión sin necesidad de modificar su código.
- **L — Liskov Substitution:** Las implementaciones de los contratos son intercambiables.
- **I — Interface Segregation:** Los contratos son específicos y cohesionados.
- **D — Dependency Inversion:** Las capas internas dependen de abstracciones, no de implementaciones concretas.

### Domain-Driven Design (DDD)

Clean Architecture y DDD se complementan muy bien. DDD aporta los patrones tácticos (entidades, agregados, value objects, repositorios, eventos de dominio) que se ubican naturalmente en la capa de Dominio de Clean Architecture.

### CQRS (Command Query Responsibility Segregation)

CQRS se combina frecuentemente con Clean Architecture para separar los casos de uso de escritura (Comandos) de los de lectura (Queries), optimizando cada uno de forma independiente.

### Hexagonal Architecture (Puertos y Adaptadores)

La arquitectura hexagonal de Alistair Cockburn y Clean Architecture son conceptualmente muy similares. Ambas promueven la separación del núcleo de la aplicación del mundo exterior a través de interfaces. Clean Architecture es una generalización y formalización de estos mismos principios.

### Repository Pattern

El patrón Repository es el mecanismo principal para implementar la Inversión de Dependencias en el acceso a datos dentro de Clean Architecture.

---

## 14. Errores comunes al implementar Clean Architecture

**Falsa separación:**
Crear carpetas con los nombres correctos pero mantener dependencias cruzadas hacia las capas externas. Las carpetas no hacen la arquitectura; las dependencias sí.

**Sobre-ingeniería prematura:**
Aplicar todas las capas y patrones desde el día uno en proyectos pequeños o prototipos. Clean Architecture tiene un costo inicial y tiene sentido cuando el proyecto tiene una vida útil media o larga.

**El dominio depende del framework:**
La entidad más común de este error es que las entidades de dominio hereden de clases del ORM (como una entidad de TypeORM o Django Model). Esto acopla el dominio a la infraestructura.

**Abstraer sin necesidad:**
Crear interfaces para todo sin que haya otra implementación posible ni necesidad de testear con mocks. La abstracción debe tener un propósito claro.

**Pasar entidades de dominio entre capas:**
Los datos que cruzan los límites entre capas deben ser DTOs simples, no entidades de dominio. Pasar entidades de dominio a la capa de presentación expone detalles internos del negocio.

---

## 15. ¿Cuándo Usar Clean Architecture?

### Úsala cuando:

- El proyecto tiene una **vida útil media o larga**.
- Se esperan **cambios frecuentes en los requisitos** de negocio o en las tecnologías.
- El equipo es suficientemente grande y necesita **trabajar en paralelo** en distintas capas.
- Se requiere **alta cobertura de tests** automatizados.
- El dominio es complejo y tiene reglas de negocio ricas.

### Considera otras alternativas cuando:

- Estás construyendo un **Producto Mínimo Viable (MVP)** con incertidumbre alta sobre el rumbo del producto.
- El proyecto es **pequeño, simple o de corta duración** (como una app para un evento).
- El equipo es pequeño y el overhead estructural ralentizaría demasiado el desarrollo inicial.

---

## 16. Resumen Visual

```
┌────────────────────────────────────────────────────────────────────┐
│                        INFRAESTRUCTURA                             │
│  (Frameworks, BD, ORM, APIs externas, Email, Mensajería, Config)   │
│                                                                    │
│   ┌────────────────────────────────────────────────────────────┐   │
│   │              ADAPTADORES / PRESENTACIÓN                    │   │
│   │   (Controllers, Presenters, Implementaciones Repository)   │   │
│   │                                                            │   │
│   │   ┌────────────────────────────────────────────────────┐   │   │
│   │   │               CASOS DE USO                         │   │   │
│   │   │   (Interactors, Application Services, Use Cases)   │   │   │
│   │   │                                                    │   │   │
│   │   │   ┌────────────────────────────────────────────┐   │   │   │
│   │   │   │               DOMINIO                      │   │   │   │
│   │   │   │  (Entidades, Value Objects, Interfaces,    │   │   │   │
│   │   │   │   Servicios, Eventos, Excepciones)         │   │   │   │
│   │   │   └────────────────────────────────────────────┘   │   │   │
│   │   └────────────────────────────────────────────────────┘   │   │
│   └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘

                   ←←←←←←  Dependencias  ←←←←←←
                   (siempre apuntan hacia el centro)
```

| Capa            | ¿Qué contiene?                             | ¿Qué conoce?          | ¿Qué NO conoce?             |
| --------------- | ------------------------------------------ | --------------------- | --------------------------- |
| Dominio         | Entidades, contratos, servicios de negocio | Solo a sí misma       | Todo lo externo             |
| Casos de Uso    | Orquestación del flujo de negocio          | Dominio               | Infraestructura, UI         |
| Adaptadores     | Controllers, Presenters, impl. de repos    | Casos de Uso, Dominio | Detalles técnicos concretos |
| Infraestructura | Frameworks, BD, servicios externos         | Todo                  | —                           |

---

## Conclusión

Clean Architecture no es una receta rígida ni un conjunto de carpetas que hay que crear. Es una **brújula**: te recuerda que el valor real de tu software está en la lógica de negocio, no en el framework que uses ni en la base de datos que elijas.

Su principio fundamental — **las dependencias siempre apuntan hacia el dominio** — garantiza que el núcleo del sistema permanezca estable y protegido frente a los inevitables cambios tecnológicos, haciendo que el software sea más duradero, más testeable y más fácil de mantener con el paso del tiempo.
