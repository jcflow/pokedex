# Pokédex Monorepo

A full-stack Pokédex application built with strict code quality and TDD principles.

## Tech Stack

- **Backend**: Ruby on Rails 8 (API-only)
- **Frontend**: Next.js 15 (App Router, SSR)
- **Package Manager**: pnpm (Workspaces)
- **Database**: SQLite
- **External API**: PokeAPI.co

## Prerequisites

- Ruby 3.2+
- Node.js 20+
- pnpm

## Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Backend Setup**
   ```bash
   cd server
   bundle install
   bin/rails db:migrate
   bin/rails db:seed
   ```

## Running the Application

Run both backend and frontend concurrently from the root:
```bash
pnpm dev
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

## Testing

### Backend (RSpec)
```bash
cd server
bundle exec rspec
```

### Frontend (Jest)
```bash
cd client
pnpm test
```

### End-to-End (Capybara)
```bash
cd server
# Ensure Next.js is running on port 3000 with API_BASE_URL=http://localhost:8080
bundle exec rspec spec/features/
```
*Note: E2E tests require a compatible Chromedriver environment.*

## Credentials
- **Username**: admin
- **Password**: admin

## Project Structure
- `client/`: Next.js frontend application
- `server/`: Rails API backend
- `docs/`: Project documentation and logs
