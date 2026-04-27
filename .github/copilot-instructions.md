# Clean Architecture Best Practices

Comprehensive guide to Clean Architecture principles for designing maintainable, testable software systems. Based on Robert C. Martin's "Clean Architecture: A Craftsman's Guide to Software Structure and Design." Contains 42 rules across 8 categories, prioritized by architectural impact.

Apply these rules when designing new systems, reviewing code structure, defining layer boundaries, or refactoring coupled code toward cleaner architecture.

---

## Rule Categories by Priority

| Priority | Category             | Impact      | Prefix     |
| -------- | -------------------- | ----------- | ---------- |
| 1        | Dependency Direction | CRITICAL    | `dep-`     |
| 2        | Entity Design        | CRITICAL    | `entity-`  |
| 3        | Use Case Isolation   | HIGH        | `usecase-` |
| 4        | Component Cohesion   | HIGH        | `comp-`    |
| 5        | Boundary Definition  | MEDIUM-HIGH | `bound-`   |
| 6        | Interface Adapters   | MEDIUM      | `adapt-`   |
| 7        | Framework Isolation  | MEDIUM      | `frame-`   |
| 8        | Testing Architecture | LOW-MEDIUM  | `test-`    |

---

## 1. Dependency Direction (CRITICAL)

- **dep-inward-only**: Source dependencies must point inward only. Outer layers depend on inner layers, never the reverse. The domain and use cases must not import anything from adapters, frameworks, or infrastructure.
- **dep-interface-ownership**: Interfaces belong to their clients (inner layers), not to the implementers (outer layers). The use case defines the interface; the adapter implements it.
- **dep-no-framework-imports**: Inner layers (domain, use cases) must not import framework-specific packages (Express, NestJS, TypeORM, etc.).
- **dep-data-crossing-boundaries**: Use simple data structures (plain objects, DTOs) when passing data across layer boundaries. Never pass entities or framework objects across boundaries.
- **dep-acyclic-dependencies**: There must be no cyclic dependencies between components. If A depends on B, B must not depend on A.
- **dep-stable-abstractions**: Depend on stable abstractions (interfaces), not volatile concretions (concrete classes). The more stable a component, the more abstract it should be.

---

## 2. Entity Design (CRITICAL)

- **entity-pure-business-rules**: Entities contain only enterprise business rules. They must not know about databases, UI, external services, or any infrastructure concern.
- **entity-no-persistence-awareness**: Entities must not know how they are persisted. No ORM decorators, no repository logic, no SQL inside entities.
- **entity-encapsulate-invariants**: Business rules and invariants must be enforced inside the entity itself, not in controllers or services. If a user must be over 18, that check lives in the `User` entity.
- **entity-value-objects**: Use value objects for domain concepts that have rules (Email, Money, Age). Value objects are immutable and self-validating.
- **entity-rich-not-anemic**: Build rich domain models with behavior, not anemic data structures that are just bags of getters and setters.

---

## 3. Use Case Isolation (HIGH)

- **usecase-single-responsibility**: Each use case has one reason to change. `RegisterUser`, `LoginUser`, and `UpdateProfile` are separate use cases.
- **usecase-input-output-ports**: Define explicit input ports (what the use case receives) and output ports (what it returns or calls). Never return framework responses from a use case.
- **usecase-orchestrates-not-implements**: Use cases orchestrate entities and call repositories. They do not implement business rules themselves — that belongs to the domain.
- **usecase-no-presentation-logic**: Use cases must not contain presentation logic: no HTML, no HTTP status codes, no UI formatting.
- **usecase-explicit-dependencies**: All dependencies of a use case (repositories, services) must be declared explicitly in the constructor and injected from outside.
- **usecase-transaction-boundary**: The use case defines the transaction boundary. A unit of work begins and ends within a single use case execution.

---

## 4. Component Cohesion (HIGH)

- **comp-screaming-architecture**: The folder structure must reflect the domain, not the framework. Looking at the project should tell you it's a "user registration system", not a "NestJS application".
- **comp-common-closure**: Group classes that change together for the same reason. If two files always change together, they belong in the same component.
- **comp-common-reuse**: Don't force clients to depend on code they don't use. Split components when only part of them is needed.
- **comp-reuse-release-equivalence**: Components should be released as cohesive units. Everything in a component should make sense being versioned and released together.
- **comp-stable-dependencies**: Depend in the direction of stability. Unstable components (frequently changed) must depend on stable ones (rarely changed).

---

## 5. Boundary Definition (MEDIUM-HIGH)

- **bound-humble-object**: At architectural boundaries (UI, DB, external services), use humble objects that contain almost no logic, making them easy to test around.
- **bound-partial-boundaries**: When a full architectural boundary is premature, implement a partial boundary (e.g., just the interface) to keep options open.
- **bound-boundary-cost-awareness**: Every architectural boundary has a cost (complexity, boilerplate). Weigh that cost against the cost of ignoring the boundary.
- **bound-main-component**: The `main` function or entry point is a plugin to the application — it wires everything together but the app doesn't depend on it.
- **bound-defer-decisions**: Architecture must allow deferring decisions about frameworks, databases, and external services as long as possible.
- **bound-service-internal-architecture**: Microservices and services must have their own internal clean architecture. A service boundary does not replace layer boundaries.

---

## 6. Interface Adapters (MEDIUM)

- **adapt-controller-thin**: Controllers must be thin. They receive input, call a use case, and return output. No business logic lives in a controller.
- **adapt-presenter-formats**: Presenters are responsible for formatting data for the view. The use case returns raw data; the presenter transforms it.
- **adapt-gateway-abstraction**: Gateways (adapters to external systems) must hide all details of the external system behind an interface the use case defines.
- **adapt-mapper-translation**: Use mapper objects to translate data between layer formats (e.g., DB row → domain entity, entity → DTO).
- **adapt-anti-corruption-layer**: When integrating with external or legacy systems, build an anti-corruption layer so their model doesn't leak into your domain.

---

## 7. Framework Isolation (MEDIUM)

- **frame-domain-purity**: The domain layer must have zero framework dependencies. It should compile and run with only the standard library.
- **frame-orm-in-infrastructure**: ORM configuration, queries, and mappings stay in the infrastructure layer. Entities must be POJO/POTS (plain objects).
- **frame-web-in-infrastructure**: HTTP routing, middleware, and web framework configuration stay in the infrastructure/interface layer.
- **frame-di-container-edge**: Dependency injection containers are wired at the edge of the application (main/bootstrap), never imported in domain or use cases.
- **frame-logging-abstraction**: Logging must be abstracted behind a domain interface. The use case calls `this.logger.info(...)` against an interface, not a concrete logger.

---

## 8. Testing Architecture (LOW-MEDIUM)

- **test-tests-are-architecture**: Tests are first-class citizens of the architecture. A design that is hard to test is a design that violates Clean Architecture.
- **test-testable-design**: Design every layer so it can be tested in isolation with simple mocks. If you need a real database to test a use case, the architecture is wrong.
- **test-layer-isolation**: Test each layer independently. Unit test entities and use cases with no framework. Integration test adapters against real infrastructure.
- **test-boundary-verification**: Use architectural fitness functions or linting rules to automatically verify that dependency boundaries are not violated over time.
