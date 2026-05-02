# Taller Clean Architecture

Material del taller de **Clean Architecture** dictado para el curso de **Arquitectura de Software**.

Reúne documentación teórica, diapositivas y diagramas utilizados en la presentación. Incluye un proyecto funcional y un ejercicio práctico de auditoría con ayuda de la skill de [Clean Architecture](/agents/skills/clean-architecture/SKILL.md).

---

## Estructura del repositorio

```
clean-architecture/
├── docs/                                  ← Material teórico y práctico
│   ├── CLEAN_ARCHITECTURE.md              ← Guía de la arquitectura
│   ├── EJERCICIO_PRACTICO.md              ← Enunciado del ejercicio
│   └── Slides_Taller_Clean_Architecture.pdf
│
├── images/                                ← Diagramas de capas
│   ├── diagrama_capas.png
│   ├── diagrama_capas_detalle.png
│   └── diagrama_explicado.png
│
├── agents/skills/clean-architecture/      ← Skill usada en el ejercicio práctico
│
└── src/                                   ← Proyecto de demostración en TypeScript
    ├── legacy.ts                          ← Vesión original del código
    ├── main.ts                            ← Versión aplicando Clean Architecture
    │
    ├── domain/                            ← Capa de Dominio
    │   ├── entities/User.ts
    │   ├── value-objects/Email.ts
    │   ├── repositories/UserRepository.ts ← Interfaz (puerto/contrato)
    │   └── errors/DomainError.ts
    │
    ├── application/                       ← Casos de Uso
    │   └── use-cases/
    │       ├── RegisterUser.ts
    │       └── GetUsers.ts
    │
    ├── adapters/                          ← Adaptadores (entrada/salida)
    │   ├── controllers/
    │   │   ├── RegisterUserController.ts
    │   │   └── GetUsersController.ts
    │   └── presenters/
    │       ├── RegisterUserPresenter.ts
    │       └── GetUsersPresenter.ts
    │
    └── infrastructure/                    ← Infraestructura
        └── repositories/
            └── InMemoryUserRepository.ts  ← Implementación concreta de la interfaz (contrato)
```

---

## Requisitos

- **Git**
- **Node.js** v18 o superior
- **Acceso a un asistente de código**

---

## Instalación

```bash
git clone https://github.com/dano796/clean-architecture.git
cd clean-architecture
npm install
```

---

## Cómo ejecutar

El mismo sistema de registro está implementado dos veces: una versión escrita con malas prácticas y otra que sigue los principios de Clean Architecture. La interfaz que ve el usuario es idéntica; lo que cambia es la organización interna del código.

### Versión limpia

```bash
npm run start
```

### Versión original (con malas prácticas)

```bash
npm run start:legacy
```

---

## Material del taller

### Documentación teórica

- [docs/CLEAN_ARCHITECTURE.md](docs/CLEAN_ARCHITECTURE.md) — Guía completa: regla de dependencia, capas, inversión de dependencias, errores comunes y criterios para decidir cuándo aplicarla.
- [docs/Slides_Taller_Clean_Architecture.pdf](docs/Slides_Taller_Clean_Architecture.pdf) — Diapositivas utilizadas en la presentación del taller.

### Diagramas

- [images/diagrama_capas.png](images/diagrama_capas.png) — Las cuatro capas de la arquitectura.
- [images/diagrama_capas_detalle.png](images/diagrama_capas_detalle.png) — Detalle del contenido en cada capa.
- [images/diagrama_explicado.png](images/diagrama_explicado.png) — Diagrama anotado con los elementos en cada capa y sus interacciones.

### Ejercicio práctico

- [docs/EJERCICIO_PRACTICO.md](docs/EJERCICIO_PRACTICO.md) — Enunciado del ejercicio (30–40 min): auditar [src/legacy.ts](src/legacy.ts) con apoyo de la skill de Clean Architecture y proponer su refactorización.

---

## Capas de Clean Architecture en el proyecto

| Capa            | Carpeta               | Contiene                                              | Depende de             |
| --------------- | --------------------- | ----------------------------------------------------- | ---------------------- |
| Dominio         | `src/domain/`         | `User`, `Email`, `UserRepository` (interfaz), errores | Nada                   |
| Casos de Uso    | `src/application/`    | `RegisterUser`, `GetUsers`                            | Solo del dominio       |
| Adaptadores     | `src/adapters/`       | Controladores CLI y presenters                        | Casos de uso + dominio |
| Infraestructura | `src/infrastructure/` | `InMemoryUserRepository` (impl. del puerto)           | Implementa contratos   |

El único lugar donde todas las capas se conocen entre sí es [src/main.ts](src/main.ts), que actúa como punto de ensamblaje (wiring) de las dependencias.
