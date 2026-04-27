# Ejercicio Práctico — Auditoría con Clean Architecture Skill

> **Duración:** 30–40 minutos  
> **Archivo a auditar:** `src/legacy.ts`

---

## Requisitos previos

Antes de comenzar con el ejercicio, asegúrate de tener todo esto listo.

### 1. Node.js instalado

Verifica que tienes Node.js v18 o superior:

```bash
node --version
```

Si no lo tienes, descárgalo en: https://nodejs.org

---

### 2. El proyecto clonado y con dependencias instaladas

```bash
git clone https://github.com/dano796/clean-architecture.git
cd clean-architecture
npm install
```

Verifica que el proyecto funciona ejecutando el código limpio:

```bash
npm run start
```

Deberías ver el menú del sistema de registro. Si funciona, estás listo.

---

### 3. npx disponible

`npx` viene incluido con Node.js. Verifica que funciona:

```bash
npx --version
```

Lo necesitarás para instalar la skill de Clean Architecture en el Paso 1.

---

### 4. Acceso a un asistente de IA

Necesitas al menos **uno** de los siguientes:

| Asistente           | Dónde                |
| ------------------- | -------------------- |
| Claude              | https://claude.ai    |
| GitHub Copilot Chat | Extensión en VS Code |
| Cursor              | https://cursor.sh    |

---

### 5. Editor de código

Cualquier editor funciona, pero se recomienda **VS Code** por su integración con Copilot.

---

## Contexto

Eres nuevo en un equipo. Te asignaron revisar este sistema de registro de usuarios que un desarrollador escribió a las carreras. Debes:

1. **Auditar** el código con ayuda de la IA + la skill de Clean Architecture
2. **Identificar** las violaciones arquitectónicas
3. **Proponer** cómo quedaría refactorizado

---

## Paso 1 — Instalar la skill de Clean Architecture

En la terminal, dentro del proyecto:

```bash
npx skills add https://github.com/pproenca/dot-skills --skill clean-architecture
```

Esto le da a tu asistente de IA conocimiento experto sobre las reglas de Clean Architecture de Uncle Bob.

---

## Paso 2 — Leer el código antes de usar la IA

Abre `src/legacy.ts` y léelo completo. Antes de pedirle ayuda a la IA, intenta responder estas preguntas:

### Preguntas

1. ¿Cuántas responsabilidades distintas tiene este archivo?
2. ¿Puedes identificar en qué capa debería vivir cada bloque de código?
3. ¿Qué pasaría si mañana hay que cambiar el almacenamiento (de array en memoria a una base de datos real)?
4. ¿Qué pasaría si se debe exponer esta funcionalidad de registro como una API REST en lugar de CLI?
5. ¿La regla de mayoría de edad sabe que existe una CLI? ¿Debería?

---

## Paso 3 — Auditar con la IA

Con la skill instalada, abre tu asistente de IA y prueba las siguientes instrucciones **una a la vez**.

### Prompt 1 — Auditoría general

```
Revisa el archivo src/legacy.ts de este proyecto.
Identifica todas las violaciones a Clean Architecture que encuentres.
Para cada violación, indica:
- Qué regla de Clean Architecture se está rompiendo
- En qué línea aproximada ocurre
- En qué capa debería vivir ese código
```

---

### Prompt 2 — Ubicar las capas

```
Del código en src/legacy.ts, clasifica cada bloque de código
en la capa de Clean Architecture a la que pertenece:
Dominio, Casos de Uso, Adaptadores o Infraestructura.
Explica por qué cada bloque no debería estar donde está actualmente.
```

---

### Prompt 3 — La validación de email

```
En legacy.ts, la validación del formato de email está escrita directamente
dentro de la función menu(), mezclada con el flujo del controlador.
¿Dónde debería vivir esta lógica según Clean Architecture?
¿Qué patrón usarías? ¿Qué archivo crearías y qué contendría?
```

---

### Prompt 4 — La regla de mayoría de edad

```
La validación de que el usuario debe ser mayor de 18 años aparece
inline dentro de menu() en legacy.ts, junto con el controlador CLI.
¿Dónde debería vivir esta regla según Clean Architecture?
¿Cómo se implementaría correctamente en la capa de dominio?
```

---

### Prompt 5 — Pregunta trampa

```
Tengo urgencia de entregar. ¿Puedo dejar la consulta a la base de datos
directamente en el controlador, sin pasar por un caso de uso ni un repositorio?
```

> **Observa:** ¿La skill le permite decir que sí? ¿Qué explica la IA?

---

## Paso 4 — Proponer la refactorización

Con base en lo que encontraste, dibuja (en papel, en un diagrama, o en texto)
cómo quedaría la estructura de archivos refactorizada:

```
src/
├── domain/
│   ├── entities/
│   │   └── User.ts              ← ¿Qué va aquí?
│   ├── value-objects/
│   │   └── Email.ts             ← ¿Qué va aquí?
│   └── repositories/
│       └── IUserRepository.ts   ← ¿Para qué sirve esta interfaz?
├── application/
│   └── use-cases/
│       └── RegisterUser.ts      ← ¿Qué hace este caso de uso?
├── adapters/
│   └── controllers/
│       └── CliController.ts     ← ¿Qué queda aquí?
└── infrastructure/
    └── repositories/
        └── InMemoryUserRepository.ts
```

Para cada archivo responde: **¿qué responsabilidad tiene y qué NO debería hacer?**

---

## Paso 5 — Comparar con la solución

El proyecto ya tiene una versión limpia implementada. Ejecuta:

```bash
npx ts-node src/main.ts
```

Compara lo que propusiste con lo que ya existe en `src/`.

- ¿Coincide con tu propuesta?
- ¿Encontraste algo que la IA no detectó?
- ¿Encontró algo que tú no viste?

---

## Resumen de violaciones

| #   | Violación                                             | Dónde        | Regla rota                                                     |
| --- | ----------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| 1   | Array `db` global declarado en el mismo archivo       | línea 11     | Dependency Rule: infraestructura acoplada a la presentación    |
| 2   | Interfaz `readline` mezclada con lógica de negocio    | líneas 13–16 | Separación de capas: I/O de infraestructura en la presentación |
| 3   | Validación de formato de email inline en `menu()`     | líneas 43–48 | Lógica de dominio (Value Object) fuera del dominio             |
| 4   | Consulta directa `db.find()` desde el controlador     | líneas 52–55 | Caso de uso accede a infraestructura sin repositorio           |
| 5   | Cálculo y validación de edad inline en `menu()`       | líneas 59–70 | Regla de negocio (entidad) fuera de la capa de dominio         |
| 6   | `crypto.randomUUID()` y `db.push()` en el controlador | líneas 74–79 | Infraestructura directamente en el controlador                 |
| 7   | Todo el flujo en una sola función `menu()`            | completo     | SRP: múltiples responsabilidades en una sola función           |
