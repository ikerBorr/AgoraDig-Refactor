# AgoraDig Refactor

> Enterprise-grade architectural transformation of [AgoraDig](https://github.com/CPV05/AgoraDig), implementing **TypeScript**, **Hexagonal Architecture**, and **Domain-Driven Design** principles for enhanced scalability and maintainability.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Project Status](#-project-status)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Testing Strategy](#-testing-strategy)
- [Documentation](#-documentation)
- [License](#-license)

---

## 🎯 Overview

AgoraDig Refactor represents a comprehensive modernization effort, transforming a monolithic JavaScript application into a robust, modular system built on industry-standard architectural patterns.

### Key Objectives

- **Separation of Concerns** — Clear layered architecture with distinct domain, application, and infrastructure boundaries
- **Framework Independence** — Domain logic completely decoupled from external dependencies
- **Enhanced Testability** — Comprehensive testing capabilities through dependency injection and isolated components
- **Scalability & Maintainability** — Structured foundation for sustainable growth and feature expansion
- **Developer Experience** — Improved tooling, documentation, and onboarding processes

---

## 📊 Project Status

| Component | Status | Description |
|-----------|--------|-------------|
| **Backend API** | 🟡 In Progress | TypeScript migration with DDD architecture implementation |
| **Frontend** | ⚪ Planned | Decoupled Next.js application |
| **Infrastructure** | 🟡 Partial | Containerized dependencies with ongoing service migration |
| **Documentation** | 🟡 In Progress | Markdown and OpenAPI/Swagger specifications |
| **Testing** | 🟡 In Progress | Unit and integration tests using Vitest |

**Legend:** 🟢 Complete | 🟡 In Progress | ⚪ Planned | 🔴 Blocked

---

## 🏗️ Architecture

### Hexagonal Architecture (Ports & Adapters)

The application follows clean architecture principles with clear separation between layers:

#### Domain Layer
Pure business logic with zero external dependencies:
- **Entities** — Core business objects (`AuthUser`)
- **Value Objects** — Immutable domain primitives (`Email`, `Username`, `Password`, `Uuid`)
- **Domain Exceptions** — Business rule violations (`InvalidEmailFormatError`, `PasswordTooShortError`)

#### Application Layer
Orchestrates use cases and defines contracts:
- **Use Cases** — Business workflows (`LoginAuthUserCase`)
- **Ports** — Interface definitions for infrastructure
- **DTOs** — Data transfer objects for inter-layer communication
- **Application Exceptions** — Use case specific errors

#### Infrastructure Layer
Concrete implementations and external integrations:
- **Repositories** — Data persistence implementations
- **Adapters** — External service integrations
- **Framework Setup** — Express configuration and permissionHandler
- **Testing Doubles** — In-memory implementations (`InMemoryAuthUserRepository`)

---

## 🔧 Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js / Bun** | 20.x+ | Runtime environment |
| **TypeScript** | 5.x | Type-safe development |
| **Express** | 4.x | HTTP server framework |
| **PostgreSQL** | 15.x | Primary database |
| **Redis** | 7.x | Caching and rate limiting |
| **Vitest** | Latest | Testing framework |
| **Docker** | Latest | Containerization |

### Frontend (Planned)

| Technology | Purpose |
|------------|---------|
| **Next.js** | React framework |
| **TypeScript** | Type safety |

### Development Tools

- **ESLint** — Code quality and style enforcement
- **Prettier** — Code formatting
- **Faker** — Test data generation
- **Docker Compose** — Multi-container orchestration

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x+ or Bun 1.x+
- Docker and Docker Compose
- PostgreSQL 15.x (or use Docker)
- Redis 7.x (or use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ikerBorr/AgoraDig-Refactor
   cd AgoraDig-Refactor
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start infrastructure services**
   ```bash
   bun run docker:dev
   ```

The API will be available at `http://localhost:3000`

> The API documentation is available at http://localhost:3000/api/docs.

---

## 📦 Available Scripts

### Development

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with hot reload |
| `bun run generate:routes` | Generate API route definitions from modules |

### Code Quality

| Command | Description |
|---------|-------------|
| `bun run lint` | Run ESLint for code analysis |
| `bun run lint:fix` | Auto-fix ESLint issues |
| `bun run format` | Format code with Prettier |
| `bun run format:check` | Verify code formatting (CI-friendly) |
| `bun run typecheck` | Validate TypeScript types |

### Testing

| Command | Description |
|---------|-------------|
| `bun run test` | Run all tests (CI mode) |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:coverage` | Generate coverage reports |

### Build & Deployment

| Command | Description |
|---------|-------------|
| `bun run clean` | Remove build artifacts |
| `bun run prebuild` | Run full pre-build validation pipeline |
| `bun run build` | Compile TypeScript to JavaScript |
| `bun run start:node` | Start production server (Node.js) |
| `bun run start:bun` | Start production server (Bun) |

### Docker Operations

| Command | Description |
|---------|-------------|
| `bun run docker:build` | Build Docker images |
| `bun run docker:dev` | Start development environment |
| `bun run docker:restart` | Restart containers |
| `bun run docker:clean` | Remove containers and volumes |
| `bun run docker:rebuild` | Full rebuild (no cache) |

---

## 🧪 Testing Strategy

### Framework & Tools

- **Vitest** — Fast, modern testing framework
- **Faker** — Realistic test data generation
- **Mother Objects** — Reusable test data builders
- **Mock Repositories** — Isolated infrastructure testing

---

## 📚 Documentation

### API Documentation

- **Interactive Docs:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs) (Swagger UI)
- **Markdown Reference:** [`/docs/endpoints.md`](./docs/endpoints.md)
- **OpenAPI Spec:** [`/docs/openapi.yaml`](./docs/openapi.yaml)

### Additional Resources

- **Environment Setup:** [`.env.example`](.env.example)
- **Docker Configuration:** [`docker-compose.yml`](docker-compose.yml)
- **Architecture Guide:** [`/docs/architecture.md`](./docs/architecture.md) (not yet)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

**Original Project:** [AgoraDig](https://github.com/CPV05/AgoraDig) by **CPV05**

**Refactor Lead:** Modernization and architectural transformation implementing Domain-Driven Design and Clean Architecture principles.

---