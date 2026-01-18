# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack Pokedex application built as a technical interview exercise using a monorepo structure.

**Architecture:**
- **Monorepo**: pnpm workspaces managing `./client` and `./server`
- **Frontend** (`./client`): React 19, Next.js 14+ (App Router) with TypeScript, TailwindCSS, SSR for SEO
- **Backend** (`./server`): Ruby on Rails 7.x (API-only mode) with SQLite

See [docs/requirements.md](docs/requirements.md) for complete project requirements.
See [docs/ai-commands-log.md](docs/ai-commands-log.md) for AI interaction history.

## Development Commands

### Initial Setup
```bash
# Install dependencies for both client and server
pnpm install

# Setup Rails database
cd server && bin/rails db:setup && cd ..
```

### Development
```bash
# Run both client and server with hot reload
pnpm dev

# Run client only
pnpm dev:client

# Run server only
pnpm dev:server
```

### Testing
```bash
# Run all tests
pnpm test

# Run frontend tests
pnpm test:client

# Run backend tests (RSpec)
pnpm test:server

# Run backend linting (RuboCop)
cd server && bundle exec rubocop

# Run frontend linting (ESLint)
cd client && pnpm lint
```

### Build
```bash
# Build frontend for production
pnpm build:client
```

## Authentication & Authorization

- **Credentials**: Hardcoded `username: admin`, `password: admin` (stored in SQLite)
- **Session**: HTTP-only cookies (secure, prevents XSS)
- **Route Protection**:
  - Logged in users redirected from `/login` to main page
  - Logged out users redirected from main page to `/login`

## Frontend Architecture (`./client`)

### Tech Stack
- **Framework**: React 19 + Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS
- **State Management**:
  - **UI State**: Zustand (modals, filters, UI toggles)
  - **Server State**: TanStack Query (data fetching, caching, pagination)
- **Testing**: Jest + React Testing Library
- **Data Fetching**: Only against backend API (never directly to PokeAPI)

### Rendering Strategy
- **SSR (Server Side Rendering)**: Main Pokemon list page and Detail pages for SEO
- **Client Components**: Interactive elements (search, filters, modals)

### Main Features
1. **Login Screen** (`/login`): Username/password validation with error messaging
2. **Main Page** (`/`):
   - Search bar for filtering Pokemon
   - **Numbered pagination** (no infinite scroll)
   - Sortable by Name and Number
   - Pokemon cards showing: photo, name, number
3. **Detail View** (`/pokemon/[id]`): Abilities, moves, forms

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Semantic HTML structure

### Design Reference
Figma (mobile-first, adapt for desktop): https://www.figma.com/design/uMAeOKKaXf6yW1lIU72qJr/Pokédex--Community-?node-id=0-1&p=f

## Backend Architecture (`./server`)

### Tech Stack
- **Framework**: Ruby on Rails 7.x (API-only mode)
- **Database**: SQLite (for user credentials only)
- **Testing**: RSpec (unit tests) + Selenium (integration tests)
- **Linting**: RuboCop (strict enforcement)
- **Documentation**: YARD for all classes/methods

### API Endpoints
1. `POST /api/login` - Validate credentials, set HTTP-only cookie session
2. `POST /api/logout` - Clear session
3. `GET /api/pokemons` - Paginated Pokemon list (query params: `page`, `search`, `sort`)
4. `GET /api/pokemons/:id` - Detailed Pokemon information

### Data Flow
- **Pokemon Data**: Fetch from https://pokeapi.co/ (DO NOT store in DB)
- **Caching**: Optional in-memory cache (Rails.cache) for PokeAPI responses
- **User Credentials**: Store in SQLite (User model with bcrypt)

### Session Management
- HTTP-only cookies via Rails session store
- CSRF protection enabled
- CORS configured for Next.js frontend

## Testing Requirements

**Critical**: The project evaluation heavily weights testing.

### Backend Testing
- **RSpec**: Unit tests for models, controllers, services
- **Selenium**: Integration/E2E tests for critical flows
- **Coverage**: Aim for >80% code coverage
- Run: `cd server && bundle exec rspec`

### Frontend Testing
- **Jest + RTL**: Component tests, hook tests
- **Coverage**: Test user interactions, error states, loading states
- Run: `cd client && pnpm test`

### Quality Goals
- **TDD**: Write tests before implementation (preferable)
- **No console errors/warnings** in browser
- **All tests passing** before commits

## Code Quality Standards

### Documentation Requirements
- **Ruby**: YARD comments on all classes, modules, public methods
- **TypeScript**: JSDoc comments on all functions, complex types
- **Inline Comments**: Explain "why" for complex logic (not "what")

### Linting & Formatting
- **Backend**: RuboCop (strict), run with `cd server && bundle exec rubocop`
- **Frontend**: ESLint + Prettier (configured in Next.js)

### Code Review Criteria
This interview exercise is evaluated on:
1. **Clean Architecture**: Separation of concerns, component independence
2. **Code Organization**: Readable, follows best practices
3. **Testing**: Comprehensive coverage, TDD approach
4. **Functionality**: Works as expected without bugs
5. **Accessibility**: ARIA labels, keyboard navigation
6. **GenAI Usage**: Document prompts in `docs/ai-commands-log.md`

## Development Workflow

When implementing features:
1. Start with informal user stories (required for presentation)
2. Consider clean architecture principles from the start
3. Write tests alongside or before implementation (TDD preferred)
4. Document any GenAI tool usage (prompts and modifications)

## Presentation Preparation

The code review will require explaining:
- User story approach
- Design choices and technical architecture
- Live demonstration of functionality
- Backend and frontend best practices applied
- GenAI tool proficiency and critical evaluation of generated code
