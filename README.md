# Pokédex (React/Rails Monorepo)

<!-- Badges -->
<!-- Infra & Tools -->
[![pnpm](https://img.shields.io/badge/pnpm-8.x-orange?logo=pnpm&style=flat-square)](https://pnpm.io/)
[![Monorepo](https://img.shields.io/badge/Architecture-Monorepo-black?style=flat-square&logo=turborepo)](https://en.wikipedia.org/wiki/Monorepo)

<!-- Client (Next.js) -->
[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&style=flat-square)](https://react.dev/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&style=flat-square)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&style=flat-square)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&style=flat-square)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-bear?logo=react&style=flat-square)](https://github.com/pmndrs/zustand)
[![TanStack Query](https://img.shields.io/badge/Data-TanStack_Query-FF4154?logo=react-query&style=flat-square)](https://tanstack.com/query/latest)
[![Jest](https://img.shields.io/badge/Test-Jest-C21325?logo=jest&style=flat-square)](https://jestjs.io/)

<!-- Server (Rails) -->
[![Ruby 3.2](https://img.shields.io/badge/Ruby-3.2-CC342D?logo=ruby&style=flat-square)](https://www.ruby-lang.org/)
[![Rails 8](https://img.shields.io/badge/Rails-8.1-CC0000?logo=ruby-on-rails&style=flat-square)](https://rubyonrails.org/)
[![SQLite3](https://img.shields.io/badge/Database-SQLite3-003B57?logo=sqlite&style=flat-square)](https://www.sqlite.org/)
[![Solid Cache](https://img.shields.io/badge/Cache-Solid_Cache-black?style=flat-square)](https://github.com/rails/solid_cache)
[![RSpec](https://img.shields.io/badge/Test-RSpec-b03e2e?style=flat-square)](https://rspec.info/)
[![RuboCop](https://img.shields.io/badge/Lint-RuboCop-white?logo=rubocop&style=flat-square)](https://rubocop.org/)

> **"A full-stack, Clean Architecture implementation of a Pokédex, featuring Next.js SSR, a Ruby on Rails API with caching strategies, and a focus on accessibility and performance."**

## Project Overview

This project is a high-fidelity prototype designed to demonstrate a **production-ready full-stack architecture**. It solves real-world engineering challenges: rate-limited external APIs, secure session management without JWTs, and Server-Side Rendering (SSR) for optimal performance.

The goal is to provide a reference implementation of a Clean Architecture, where the Frontend is a visual consumer of a standardized, stable Backend API.

### System Architecture Diagram

```mermaid
graph TD
    User[User / Browser] -->|HTTPS:3000| FE[Next.js App Router (SSR/Client)]
    FE -->|API Requests (Axios)| BE[Rails 8 API (Proxy)]
    
    subgraph "Backend Layer :3001"
        BE -->|Auth/Session| DB[(SQLite: User Data)]
        BE -->|Cache Hit?| Redis[Solid Cache]
        BE -->|Cache Miss| Adapter[PokeAPI Service]
    end
    
    Adapter -->|External Request| ExtAPI[PokeAPI.co]
    ExtAPI -->|JSON Data| Adapter
    Adapter -->|Normalized Data| BE
```

---

## Project Structure

This monorepo is organized to enforce a clear separation of concerns, with specific attention to **Service Objects** in the backend and **State Separation** in the frontend.

### `client/` (Next.js 16)
```text
client/
├── app/                  # Next.js App Router (Server Components)
│   ├── layouts/          # Auth/Dashboard layouts
│   ├── login/            # Login page (Route Group)
│   └── page.tsx          # Main Dashboard
├── components/           # Reusable UI (Card, Inputs)
├── lib/                  # Utilities
│   ├── api.ts            # Client-side API layer
│   └── actions.ts        # Server Actions
├── store/
│   ├── useUIStore.ts     # Zustand (Client UI State)
│   └── providers.tsx     # TanStack Query Provider (Server State)
└── __tests__/            # Jest Unit & Component Tests
```

### `server/` (Rails 8 API)
```text
server/
├── app/
│   ├── controllers/      # API Endpoints
│   │   └── api/          # Versioned API Controllers
│   ├── models/           # ActiveRecord Models (User)
│   └── services/         # Business Logic
│       └── pokemon_service.rb  # Adapter Pattern for PokeAPI
├── spec/                 # RSpec Test Suite
│   ├── features/         # Capybara E2E Tests
│   ├── requests/         # API Integration Tests
│   └── services/         # Unit Tests for Services
└── config/routes.rb      # API Routes Definition
```

---

## Features & Technical Highlights

### 🔐 Enterprise-Grade Security
*   **HttpOnly Cookies**: I rejected `localStorage` for session management. Tokens are stored in **Secure, HttpOnly, SameSite** cookies to strictly prevent XSS attacks.
*   **CSRF Protection**: Rails API enforces origin checks to prevent cross-site request forgery.

### ⚡ Performance & Scalability
*   **Server-Side Rendering (SSR)**: Leveraging **Next.js 16 App Router**, pages are pre-rendered on the server for instant First Contentful Paint (FCP) and superior SEO.
*   **Smart Caching Proxy**: The Ruby on Rails backend implements a **Cache-Aside pattern** using **Solid Cache**. It alleviates pressure on the generic PokeAPI (handling rate limits) and delivers sub-50ms response times for cached items.
*   **Server-Side Pagination**: Efficiently handles large datasets by fetching only what is needed, reducing payload size and memory usage on the client.

### ♿ Accessibility & UX
*   **A11y First**: Built with semantic HTML (`<main>`, `<article>`) and full keyboard interactions (Tab/Enter/Space), verified by `jest-axe`.
*   **Responsive Design**: A **Mobile-First** approach using Tailwind CSS 4 ensures a native-app-like experience on phones while scaling beautifully to desktops.
*   **Instant Feedback**: **Optimistic UI** patterns and generic skeleton loaders provide a perceived latency of near zero during data fetching.

### 🛠️ Developer Experience (DX)
*   **Type Safety**: End-to-end **TypeScript** on the client and strictly typed Service Objects on the server reduce runtime errors.
*   **Clean Architecture**: Strict separation of Client State (Zustand) vs Server State (TanStack Query) prevents "Spaghetti Code" and makes the codebase highly testable.

### Screenshots

| Secure Login | Dashboard Grid | Detailed View |
|:---:|:---:|:---:|
| <img src="docs/assets/login.png" width="300" /> | <img src="docs/assets/index.gif" width="300" /> | <img src="docs/assets/detail.gif" width="300" /> |
| *Session-based HttpOnly Cookies* | *Server-side Pagination & Searching* | *SSR Data Fetching & Dynamic Routing* |

---

## Tech Stack & Tooling

### Frontend
*   **Framework**: [Next.js 16.1](https://nextjs.org/) (App Router, SSR)
*   **Core**: React 19, TypeScript 5.9
*   **State Management**: 
    *   *Server State*: TanStack Query (v5)
    *   *Client State*: Zustand (v5)
*   **Styling**: Tailwind CSS 4.1
*   **Quality**: Jest, React Testing Library, Axe-Core (Accessibility)

### Backend
*   **Framework**: [Ruby on Rails 8.1](https://rubyonrails.org/) (API-only)
*   **Language**: Ruby 3.2+
*   **Database**: SQLite3 (Standard for Rails 8)
*   **Caching**: Solid Cache
*   **External Data**: HTTParty (for external API consumption)

### Infrastructure & Operations
*   **Monorepo Manager**: `pnpm` Workspaces
*   **App Server**: Puma
*   **Linting**: ESLint (Next.js), RuboCop (Rails Omakase)

---

## Getting Started

### Prerequisites
*   Node.js 20+
*   Ruby 3.2+
*   pnpm (`npm install -g pnpm`)

### Quick Start

1.  **Install Dependencies** (Root)
    ```bash
    pnpm install
    ```

2.  **Setup Backend Database**
    ```bash
    cd server
    bin/rails db:setup
    cd ..
    ```

3.  **Run Development Environment**
    ```bash
    pnpm dev
    ```
    *   **Frontend**: [http://localhost:3000](http://localhost:3000)
    *   **Backend**: [http://localhost:3001](http://localhost:3001)

---

## Development Workflow

I followed a TDD workflow to ensure code quality and stability.

### Scripts & Commands

| Command | context | Description |
|:--- |:--- |:--- |
| `pnpm dev` | Root | Hot-reload dev servers for both Client & Server |
| `pnpm dev:client` | Client | Run frontend dev server only |
| `pnpm dev:server` | Server | Run backend dev server only |
| `pnpm build` | Root | Production build for both applications |
| `pnpm test` | Root | Run full test suite (Jest + RSpec) |
| `pnpm test:watch` | Client | Run Jest in watch mode |
| `pnpm lint` | Root | Run full linting suite |
| `pnpm lint:client` | Client | Run ESLint |
| `pnpm lint:server` | Server | Run RuboCop |

### AI-Assisted Development
This project maintains a transparent log of all AI interactions. I treat AI as a pair programmer.
*   📝 **[View AI Commands Log](docs/ai-commands-log.md)**

---

## Testing Strategy

I employ a "Quality Gate" strategy using the Testing Pyramid.

### 1. Unit Tests (The Base)
*   **Goal**: Verify individual components and business logic in isolation.
*   **Tools**:
    *   *Frontend*: **Jest** for utility functions and hooks.
    *   *Backend*: **RSpec** Model specs (`spec/models`) and Service specs (`spec/services`).

### 2. Integration Tests
*   **Goal**: meaningful interaction between units.
*   **Tools**:
    *   *Frontend*: **React Testing Library** to test component interactions (e.g., clicking a button triggers a handler).
    *   *Backend*: **RSpec Request Specs** (`spec/requests`) to verify API endpoints return correct JSON structures and status codes.

### 3. E2E/System Tests (The Apex)
*   **Goal**: Simulate a real user journey across the full stack.
*   **Tools**: **Capybara** + **Selenium/Chromedriver**.
*   **Coverage**: Login flows, Browsing, Searching, and Logout.

### 4. Test Coverage Reports
I aim for **>80% Code Coverage** as a quality gate.
*   **Backend**: Uses `SimpleCov` to generate coverage reports for Models, Controllers, and Services.
    *   Report path: `server/coverage/index.html`
*   **Frontend**: Uses `Jest --coverage` to track component and utility coverage.
    *   Report path: `client/coverage/lcov-report/index.html`

---

## Architectural Decisions

### Frontend Architecture

#### SSR vs CSR Strategy (Why Next.js?)
I chose **Next.js App Router (SSR)** over a standard SPA (Vite) to gain:
1.  **SEO**: Pokémon detail pages are pre-rendered on the server, making them indexable.
2.  **Performance**: Reduces the "Waterfalls" of data fetching. The server fetches data from the API *before* sending HTML to the client (LCP improvement).

#### State Management (Split Approach)
I explicitly separated state types:
*   **Zustand**: For *ephemeral UI state* (is the modal open? what is the current text filter?). It's lightweight and avoids Context API re-render issues.
*   **React Query**: For *server state*. It handles "stale-while-revalidate", deduping requests, and global caching, which manual `useEffect` fetching often messes up.

#### Accessibility (A11y)
Accessibility as a functional requirement, not a "nice-to-have."
*   **ARIA**: Interactive elements have roles (`button`, `link`).
*   **Semantic HTML**: Header, Main, Article tags.
*   **Testing**: `jest-axe` automatically fails tests if A11y violations are found.

### Backend Architecture

#### Caching Strategy (The "PokeAPI Proxy")
**Challenge**: PokeAPI has strict rate limits and can be slow.
**Solution**: The Rails backend implements a **Caching Proxy Pattern**.
1.  Backend checks `Solid Cache` (Redis/SQLite flavor).
2.  If miss, it calls PokeAPI.
3.  Response is **normalized** (stripping thousands of unused fields).
4.  Normalized structure is cached for 1 hour.
5.  Client receives a tiny, optimized JSON payload.

#### Auth Implementation (HttpOnly Cookies)
I rejected `localStorage` for JWT storage due to XSS vulnerabilities. Instead, I use **authenticated sessions via HttpOnly Cookies**.
*   **HttpOnly**: JavaScript cannot read the cookie (prevents XSS theft).
*   **Secure**: Sent only over HTTPS (in prod).
*   **SameSite**: Lax/Strict to prevent CSRF.

---

## Challenges & Trade-offs

### 1. Handling API Rate Limits
Burst traffic could overwhelm the external PokeAPI. By introducing the caching layer in Rails, I absorb the load. Even if 1000 users request "Pikachu" simultaneously, only *one* request hits PokeAPI; 999 are served from cache.

### 2. Hydration Mishaps
Using React 19/Next 16, I faced hydration errors when random data (like IDs) was generated on the client. I solved this by ensuring all ID generation happens deterministically or on the server.

### 3. Monorepo Tooling vs Complexity
Managing a monorepo without heavy tools (Nx/Turbo) means **I** rely on `pnpm workspaces` and `concurrently`. While simpler, it requires manual script orchestration to ensure the DX remains smooth.

### 4. Type Synchronization
The lack of a shared schema (like GraphQL or tRPC) means **I** have to manually ensure TypeScript interfaces match Rails API responses. This trade-off was accepted to keep the backend architecture standard REST/JSON:API.

---

## Project Documentation

*   [**Requirements**](docs/requirements.md)
*   [**User Stories**](docs/user-stories.md)
*   [**AI Commands Log**](docs/ai-commands-log.md)

## Generative AI Tools Exercise

*   [**AI Generation Prompt Exersise**](docs/ai-generation-prompt.md)

## Future Improvements

*   [ ] **CI/CD Pipeline**: Setup GitHub Actions for automated linting and testing on every PR.
*   [ ] **Automated Type Generation**: Use a tool to generate TypeScript interfaces directly from Rails definitions to solve the sync issue.
*   [ ] **Dockerize**: Create a `docker-compose.yml` to spin up Next.js, Rails, and Redis in one command.
*   [ ] **Postgres Migration**: Move from SQLite to PostgreSQL for better production concurrency.
*   [ ] **Internationalization (i18n)**: Implement support for multiple languages.

## License & Author

**Author**: Juan Chavez Cornejo

**License**: MIT
