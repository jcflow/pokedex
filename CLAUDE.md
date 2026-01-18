# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack Pokedex application built as a technical interview exercise. The project consists of:
- **Frontend**: React application with login, Pokemon listing (paginated and sortable), and detail views
- **Backend**: Lightweight API server that proxies/caches data from PokeAPI (https://pokeapi.co/)

See [docs/requirements.md](docs/requirements.md) for complete project requirements.

## Authentication & Authorization

- Hardcoded credentials: `username: admin`, `password: admin`
- Session persistence required (localStorage, cookies, or similar)
- Route protection:
  - Logged in users redirected from `/login` to main page
  - Logged out users redirected from main page to `/login`

## Frontend Architecture

### Key Requirements
- **Framework**: React
- **Data Fetching**: Against the custom backend API (not directly to PokeAPI)
- **SEO**: Must consider search engine optimization
- **Responsive Design**: Mobile-first design (see Figma), adapted for larger screens

### Main Features
1. **Login Screen**: Username/password validation with appropriate error messaging
2. **Main Page**:
   - Search bar for filtering Pokemon
   - Paginated list of Pokemon cards (photo, name, number)
   - Sortable by Name and Number
3. **Detail View**: Shows abilities, moves, and forms for a specific Pokemon

### Design Reference
Figma design: https://www.figma.com/design/uMAeOKKaXf6yW1lIU72qJr/Pokédex--Community-?node-id=0-1&p=f

## Backend Architecture

### API Endpoints
The backend must implement:
1. `POST /login` (or similar) - Validate `admin`/`admin` credentials
2. `GET /pokemons` - Return paginated Pokemon list (proxied from PokeAPI)
3. `GET /pokemons/{id}` - Return detailed Pokemon information

### Data Source
- Primary data source: https://pokeapi.co/
- Backend should proxy/cache PokeAPI responses
- Database: In-memory, SQLite, or lightweight DB (not production-grade required)

## Testing Requirements

The project evaluation heavily weights testing:
- **Application Testing**: Sufficient test coverage required
- **TDD**: Test-Driven Development is preferable
- Goal: No errors or warnings in browser console

## Code Quality Expectations

This is an interview exercise evaluated on:
1. **Clean Architecture**: Separation of concerns, component independence
2. **Code Organization**: Readable, follows best practices
3. **Functionality**: Works as expected without bugs
4. **GenAI Usage**: Must document prompts used and modifications to AI-generated code

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
