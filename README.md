# AgoraDig Refactor

> A complete architectural transformation of [**AgoraDig**](https://github.com/CPV05/AgoraDig) by **CPV05**, migrating to **TypeScript** with **Hexagonal Architecture** and **Domain-Driven Design** principles.

---

## 📊 Project Status

| Area | Status | Description |
|------|--------|-------------|
| **Backend (API)** | 🟡 In Progress | Refactoring legacy `server.js` into modular TypeScript with DDD architecture |
| **Frontend** | ⚪ Planned | Separate Next.js application (coming soon) |
| **Infrastructure** | 🟡 Partial | External dependencies dockerized, some services pending |
| **Documentation** | 🟡 In Progress | Endpoints documented in Markdown and OpenAPI (Swagger) |
| **Testing** | 🟡 In Progress | Unit tests with Vitest framework |

---

## 🎯 Project Philosophy

This refactor demonstrates a **strong technical and architectural evolution**, transforming a monolithic JavaScript application into a **clean, modular, and scalable system**.

### Core Objectives

- **Separation of Concerns** — Clear distinction between domain, application, and infrastructure layers
- **Technological Independence** — Domain layer completely decoupled from frameworks and libraries
- **Testability** — Isolated testing for each use case and component
- **Maintainability & Scalability** — Structured growth without architectural degradation
- **Observability & Documentation** — Enhanced integration and contributor onboarding

> **In essence:** Expressive, modular, and domain-oriented code

---

## 🏗️ Architecture

### Hexagonal Architecture

The backend follows **Hexagonal Architecture** (Ports & Adapters) inspired by **Domain-Driven Design**.

#### **Domain Layer**
Pure business logic expressed through:
- **Entities** — `AuthUser`, etc.
- **Value Objects** — `Email`, `Username`, `Password`, `Uuid`, etc.
- **Domain Exceptions** — `InvalidEmailFormatError`, `PasswordTooShortError`, etc.

#### **Application Layer**
Implements **use cases** (e.g., `LoginCase`) that orchestrate:
- Entities and domain services
- Repository interfaces
- DTOs and application-level errors

#### **Infrastructure Layer**
Real implementations of ports:
- Database repositories
- External APIs and adapters
- Currently includes `InMemoryAuthUserRepository` for fast testing

---

## 🔧 Technology Stack

### Backend
- **Runtime:** Node.js / Bun
- **Language:** TypeScript
- **Framework:** Express
- **Persistence:** PostgreSQL (migrating from MongoDB)
- **Cache:** Redis
- **Testing:** Vitest, Faker, Mother Objects
- **Infrastructure:** Docker, Docker Compose

### Frontend *(Planned)*
- **Framework:** Next.js

### Documentation
- **Formats:** Markdown, OpenAPI (Swagger)

---

## 🧪 Testing Strategy

- **Framework:** Vitest
- **Pattern:** Mother Objects + Mocked Repositories
- **Coverage:** Use cases and Value Objects
- **Mocks:** Simulated infrastructure dependencies

---

## 📦 Available Scripts

All commands use **Bun** as the runtime for optimal performance and developer experience.

### Development & Routing

#### `bun run generate:routes`
Generates API route definitions by scanning application modules and producing a routing map.

#### `bun run dev`
Starts the development server with hot reloading:
1. Generates routes
2. Runs the app in watch mode

### Code Quality

#### `bun run lint`
Runs ESLint to check for code style and syntax issues.

#### `bun run lint:fix`
Automatically fixes common ESLint issues.

#### `bun run format`
Formats all source and test files using Prettier.

#### `bun run format:check`
Validates formatting without modifying files (ideal for CI/CD).

### Type Checking & Testing

#### `bun run typecheck`
Validates TypeScript types across the entire project without generating output files.

#### `bun run test`
Runs all tests once (headless mode, recommended for CI/CD).

#### `bun run test:watch`
Runs tests in watch mode, re-running on file changes.

#### `bun run test:coverage`
Executes tests and generates coverage reports.

### Build & Deployment

#### `bun run clean`
Deletes the `dist` folder for a clean build environment.

#### `bun run prebuild`
Complete pre-build validation pipeline:
1. Cleans previous build
2. Regenerates routes
3. Runs linter
4. Executes tests

#### `bun run build`
Compiles TypeScript to JavaScript in the `dist` directory.

#### `bun run start:node`
Runs the compiled app using Node.js with source maps enabled.

#### `bun run start:bun`
Runs the compiled app using Bun for better performance.

### Docker & Environment

#### `bun run docker:build`
Builds all Docker images from `docker-compose.yml`.

#### `bun run docker:restart`
Restarts running containers without rebuilding.

#### `bun run docker:dev`
Starts the development environment (database, Redis, etc.) and streams logs.

#### `bun run docker:clean`
Stops and removes all containers and volumes.

#### `bun run docker:rebuild`
Full environment rebuild:
1. Stops and removes containers
2. Rebuilds images (no cache)
3. Starts services in detached mode

> Use after updating dependencies or Docker configurations

---

## 📚 Documentation

### API Documentation
- **Markdown:** `/docs/endpoints.md` — Developer-friendly reference
- **OpenAPI:** [**http://localhost:3000/api/docs**](http://localhost:3000/api/docs)— Swagger-compatible specification

### Configuration
- **Environment:** `.env.example` — All required environment variables documented
- **Docker:** Ready-to-run compose configuration
- **Scripts:** Automated testing and deployment workflows

---

## 🗺️ Roadmap

- [ ] Complete TypeScript migration
- [ ] Implement Redis rate limiter for login attempts
- [ ] Build independent Next.js frontend
- [ ] Complete Dockerization of all external services
- [ ] Achieve 80%+ test coverage
- [ ] Deploy staging environment

---

## Credits

This project is based on the original [**AgoraDig**](https://github.com/CPV05/AgoraDig) by **CPV05**.

This version modernizes and modularizes the codebase using **Domain-Driven Design** and **Clean Architecture** principles.
