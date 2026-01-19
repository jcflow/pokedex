# User Stories - TDD Development Plan

This document outlines the 11-step development plan for the Pokedex application following Test-Driven Development (TDD) principles.

---

## Step 1 - Database Schema and User Model

As a backend developer, I want to create the User model with secure password storage, so that the application can authenticate users with credentials stored in SQLite.

### Acceptance Criteria

- **Model Creation**
  - User model exists with `username` and `password_digest` fields
  - Username must be unique (database constraint + validation)
  - Username must be present (validation)
  - Password must be at least 8 characters (validation)
  - Model uses `has_secure_password` for bcrypt hashing

- **Database Migration**
  - Migration creates `users` table with correct schema
  - Username column has unique index
  - Migration is reversible

- **Model Tests (TDD)**
  - Model spec validates presence of username
  - Model spec validates uniqueness of username (case-insensitive)
  - Model spec validates minimum password length
  - Model spec tests `authenticate` method with correct password returns user
  - Model spec tests `authenticate` method with wrong password returns false
  - Model spec ensures password_digest is never nil when password is set

- **Seed Data**
  - `db/seeds.rb` creates default admin user (username: `admin`, password: `admin`)
  - Seed is idempotent (can run multiple times without duplicates)

- **Edge Cases**
  - Empty username rejected
  - Empty password rejected
  - Duplicate usernames rejected (case-insensitive: "Admin" = "admin")
  - SQL injection attempts in username are safely escaped

- **Documentation**
  - User model has YARD documentation explaining authentication flow
  - Migration has comments explaining schema choices

---

## Step 2 - Backend Authentication API (Login/Logout with Session Cookies)

As a user, I want to log in with my credentials and receive a secure session cookie, so that I can access protected resources without sending credentials with every request.

### Acceptance Criteria

- **API Endpoints**
  - `POST /api/login` endpoint exists
  - `POST /api/logout` endpoint exists
  - `GET /api/session` endpoint exists (check current session status)

- **Login Endpoint (`POST /api/login`)**
  - Accepts JSON: `{ "username": "admin", "password": "admin" }`
  - Returns 200 OK with user data (excluding password_digest) when credentials valid
  - Returns 401 Unauthorized with error message when credentials invalid
  - Sets HTTP-only cookie with session ID on successful login
  - Session cookie has `secure: true` in production, `httponly: true` always
  - Cookie has `same_site: :lax` for CSRF protection

- **Logout Endpoint (`POST /api/logout`)**
  - Clears session data
  - Returns 200 OK with success message
  - Works even if user not logged in (idempotent)

- **Session Check Endpoint (`GET /api/session`)**
  - Returns 200 OK with current user data if logged in
  - Returns 401 Unauthorized if not logged in
  - Does not expose password_digest in response

- **CORS Configuration**
  - CORS allows requests from `http://localhost:3000` (Next.js dev server)
  - CORS allows credentials (for cookies)
  - CORS allows POST, GET, OPTIONS methods
  - CORS allows Content-Type and Authorization headers

- **Edge Cases**
  - Missing username returns 400 Bad Request
  - Missing password returns 400 Bad Request
  - Malformed JSON returns 400 Bad Request
  - SQL injection in username/password safely handled
  - Non-existent username returns 401 (not 404, to avoid user enumeration)
  - Case-insensitive username matching (Admin = admin)

- **Security**
  - Password never appears in logs or responses
  - Session cookies are HTTP-only (not accessible via JavaScript)
  - CSRF token validation enabled for state-changing requests
  - Rate limiting considered (document in comments, implementation optional)

- **Documentation**
  - SessionsController has YARD documentation
  - API endpoints documented with request/response examples

---

## Step 3 - Backend Pokemon Proxy Service

As a user, I want the backend to fetch Pokemon data from PokeAPI.co and return it in a consistent format, so that the frontend has a reliable API to consume.

### Acceptance Criteria

- **Service Object**
  - `PokemonService` class exists in `app/services/pokemon_service.rb`
  - Service fetches data from `https://pokeapi.co/api/v2/pokemon` (list endpoint)
  - Service fetches data from `https://pokeapi.co/api/v2/pokemon/{id}` (detail endpoint)
  - Service handles pagination (limit and offset params)
  - Service caches responses in Rails.cache for 1 hour
  - Service has proper error handling for network failures

- **API Endpoints**
  - `GET /api/pokemons` endpoint exists (requires authentication)
  - `GET /api/pokemons/:id` endpoint exists (requires authentication)

- **List Endpoint (`GET /api/pokemons`)**
  - Returns paginated list of Pokemon
  - Accepts query params: `page` (default: 1), `limit` (default: 20)
  - Returns JSON with structure: `{ "pokemons": [...], "total": 1302, "page": 1, "total_pages": 66 }`
  - Each pokemon has: `id`, `name`, `number`, `sprite` (image URL)
  - Returns 401 if not authenticated
  - Returns 503 if PokeAPI is down
  - Caches results for 1 hour

- **Detail Endpoint (`GET /api/pokemons/:id`)**
  - Returns detailed Pokemon data for given ID
  - Response includes: `id`, `name`, `number`, `sprites`, `abilities`, `moves`, `forms`, `types`, `stats`
  - Returns 404 if Pokemon ID doesn't exist
  - Returns 401 if not authenticated
  - Returns 503 if PokeAPI is down
  - Caches results for 1 hour

- **Search & Sort (Optional for Step 3, Required Later)**
  - Document plan for search implementation in comments
  - Document plan for sort implementation in comments

- **Edge Cases**
  - Invalid page number (< 1) returns first page
  - Page number beyond total pages returns empty array
  - Invalid Pokemon ID returns 404
  - Network timeout returns 503 with error message
  - PokeAPI returns 500 → proxy returns 503
  - Malformed PokeAPI response handled gracefully

- **Caching**
  - Cache key includes endpoint and params
  - Cache expires after 1 hour
  - Cache miss fetches from PokeAPI
  - Cache hit returns cached data (no PokeAPI call)

- **Documentation**
  - PokemonService has YARD documentation with examples
  - PokemonsController has YARD documentation
  - README explains why data is not stored in database

---

## Step 4 - Frontend Authentication Setup and Login Page (SSR)

As a user, I want to access a login page where I can enter my credentials, so that I can authenticate and access the main Pokedex application.

### Acceptance Criteria

- **Route Structure**
  - `/login` route exists and renders LoginPage
  - LoginPage is a Server Component (default in App Router)
  - Route redirects to `/` if user already authenticated (checked server-side)

- **Login Form UI**
  - Form displays username input field
  - Form displays password input field (type="password")
  - Form displays "Login" submit button
  - Form uses TailwindCSS styling matching Figma design (mobile-first)
  - Form is centered on page with appropriate spacing

- **Form Behavior**
  - Form submits via POST to `/api/login` on backend
  - On successful login (200), redirect to `/` (home page)
  - On failed login (401), display error message "Invalid username or password"
  - On network error, display "Unable to connect. Please try again."
  - Loading state shows during submission (button disabled, loading indicator)
  - Error messages are cleared when user starts typing again

- **Client-Side Validation**
  - Username required (show error if empty)
  - Password required (show error if empty)
  - Validation errors displayed near respective fields

- **Accessibility (ARIA)**
  - Username input has `aria-label="Username"` or associated `<label>`
  - Password input has `aria-label="Password"` or associated `<label>`
  - Submit button has descriptive text (not just an icon)
  - Error messages have `role="alert"` and `aria-live="polite"`
  - Form has proper focus management (auto-focus username on mount)
  - Keyboard navigation works (Tab through fields, Enter to submit)

- **Session Management**
  - Session cookie from backend is automatically stored by browser
  - Cookie persists across page refreshes
  - No session data stored in localStorage (security requirement)

- **Edge Cases**
  - Empty username shows validation error
  - Empty password shows validation error
  - Backend returns 500 → show generic error message
  - Network timeout → show connection error
  - Already logged in → redirect to home without rendering form

- **Testing (Jest + RTL)**
  - Test component renders form inputs
  - Test validation errors appear for empty fields
  - Test successful login triggers redirect
  - Test failed login shows error message
  - Test loading state during submission
  - Test accessibility (screen reader compatibility)

- **TypeScript**
  - All components strictly typed
  - API response types defined in types/ folder
  - No `any` types used

---

## Step 5 - Frontend Main Dashboard Structure (SSR with Static Pokemon List)

As a user, I want to see a list of Pokemon on the main dashboard when I'm logged in, so that I can browse available Pokemon.

### Acceptance Criteria

- **Route Structure**
  - `/` route exists and renders HomePage
  - HomePage is a Server Component (SSR for SEO)
  - Route redirects to `/login` if user not authenticated (middleware)
  - Authentication check happens server-side (read session cookie)

- **Page Layout**
  - Header with app title "Pokédex" and logout button
  - Main content area displays Pokemon grid
  - Footer (optional, can be added in Step 8)

- **Pokemon Grid**
  - Grid layout responsive: 1 column mobile, 2 columns tablet, 3-4 columns desktop
  - Each Pokemon card shows:
    - Pokemon sprite image
    - Pokemon name (capitalized)
    - Pokemon number (e.g., "#001")
  - Grid uses TailwindCSS for styling
  - Cards have hover effect (scale or shadow)

- **Data Fetching**
  - Server Component fetches Pokemon from `GET /api/pokemons` on server
  - Initial page loads with page=1, limit=20
  - Data fetched during SSR (before HTML sent to client)
  - If API call fails, show error message

- **Logout Functionality**
  - Logout button in header
  - Clicking logout calls `POST /api/logout`
  - After logout, redirect to `/login`
  - Logout button has proper ARIA label

- **Accessibility (ARIA)**
  - Header has `role="banner"`
  - Main content has `role="main"`
  - Pokemon grid has `role="list"` or semantic `<ul>`
  - Each card has `role="listitem"` or is a `<li>`
  - Images have descriptive `alt` text: "Sprite of {name}"
  - Logout button has `aria-label="Logout"`
  - Skip to content link for keyboard users

- **Edge Cases**
  - API returns empty array → show "No Pokemon found"
  - API returns 401 → redirect to /login
  - API returns 503 → show "Service unavailable" message
  - Network timeout → show connection error
  - Invalid session → redirect to /login

- **TypeScript**
  - Pokemon type defined with all required fields
  - API response type defined
  - Server Component types properly defined

- **Testing**
  - Component tests for PokemonCard (if extracted)
  - Test logout functionality
  - Test error states
  - Test accessibility with jest-axe or similar

- **No Pagination Yet**
  - For this step, only show first 20 Pokemon
  - Pagination will be added in Step 6
  - Document this limitation in comments

---

## Step 6 - Frontend Pagination and Search Functionality

As a user, I want to navigate through pages of Pokemon and search by name, so that I can find specific Pokemon easily.

### Acceptance Criteria

- **Pagination UI**
  - Numbered page buttons display below Pokemon grid
  - Show current page, previous 2 pages, next 2 pages, first and last
  - "Previous" and "Next" buttons exist
  - "Previous" disabled on page 1
  - "Next" disabled on last page
  - Current page button has different style (highlighted)
  - Clicking page number navigates to that page

- **Pagination Behavior**
  - URL includes page query param: `/?page=2`
  - Changing page updates URL (enables browser back/forward)
  - Page data fetched server-side (SSR)
  - Smooth navigation without full page reload (use Next.js Link)
  - Invalid page numbers (< 1 or > total_pages) handled gracefully

- **Search UI**
  - Search input field in header or above grid
  - Search input has placeholder "Search Pokemon..."
  - Search input has clear button (X) when text entered
  - Search is case-insensitive

- **Search Behavior (Client-Side for Now)**
  - Client-side filtering of current page results by name
  - Filtered results display immediately as user types
  - No results → show "No Pokemon match your search"
  - Clearing search shows all Pokemon again
  - Search state persists during pagination (optional)

- **Backend Enhancement (Optional for Step 6)**
  - Backend `GET /api/pokemons?search=pika` filters results
  - If not implemented, document plan in comments for future

- **Sort Functionality**
  - Dropdown or buttons for "Sort by: Name" and "Sort by: Number"
  - Default sort: by Number (ascending)
  - Clicking "Name" sorts alphabetically A-Z
  - Clicking "Number" sorts numerically 1-1302
  - Sort state persists during pagination

- **Accessibility (ARIA)**
  - Search input has `aria-label="Search Pokemon"`
  - Pagination controls have `role="navigation"` and `aria-label="Pokemon pagination"`
  - Current page has `aria-current="page"`
  - Disabled buttons have `aria-disabled="true"`
  - Page number buttons have descriptive labels: `aria-label="Go to page 2"`
  - Search results count announced: "Showing X Pokemon"

- **Edge Cases**
  - Search with no matches shows empty state
  - Page beyond total returns to last valid page
  - Negative page number defaults to page 1
  - Non-numeric page param defaults to page 1
  - Rapid pagination clicks handled (debounce or loading state)

- **State Management**
  - Use Zustand for UI state (search term, sort preference)
  - Server state (Pokemon data) managed by TanStack Query
  - TanStack Query caches API responses
  - Pagination uses URL params (not local state) for shareable URLs

- **TypeScript**
  - Pagination props strictly typed
  - Search handlers typed
  - Sort options typed as enum or union type

- **Testing**
  - Test pagination component renders correctly
  - Test page navigation updates URL
  - Test search filters results
  - Test sort changes order
  - Test accessibility attributes present

---

## Step 7 - Frontend Pokemon Detail View (SSR)

As a user, I want to click on a Pokemon card to view detailed information including abilities, moves, and forms, so that I can learn more about that Pokemon.

### Acceptance Criteria

- **Route Structure**
  - `/pokemon/[id]` dynamic route exists
  - Route renders PokemonDetailPage (Server Component for SSR)
  - Route redirects to `/login` if not authenticated
  - Invalid Pokemon ID shows 404 page

- **Page Layout**
  - Back button/link to return to main dashboard
  - Pokemon name as page heading (h1)
  - Pokemon sprite/image (larger than card)
  - Pokemon number displayed

- **Detailed Information Display**
  - **Abilities Section**
    - List of abilities with names
    - Each ability shows if it's hidden
  - **Moves Section**
    - List of moves (first 10-20, or paginated)
    - Move names displayed
  - **Forms Section**
    - List of alternate forms (if any)
  - **Types Section**
    - Pokemon types (e.g., Fire, Water) as badges
  - **Stats Section**
    - HP, Attack, Defense, Sp. Attack, Sp. Defense, Speed
    - Display as progress bars or numeric values

- **Data Fetching**
  - Server Component fetches from `GET /api/pokemons/:id`
  - Data fetched during SSR (SEO optimized)
  - If API call fails (404, 503), show error message
  - Loading state while data loads (skeleton or spinner)

- **Responsive Design**
  - Mobile: single column layout
  - Tablet/Desktop: two column layout (image + details)
  - TailwindCSS responsive classes used
  - Matches Figma design (mobile-first)

- **Accessibility (ARIA)**
  - Back button has `aria-label="Back to Pokemon list"`
  - Abilities list has `role="list"` or semantic `<ul>`
  - Moves list has `role="list"` or semantic `<ul>`
  - Images have descriptive `alt` text
  - Headings use proper hierarchy (h1, h2, h3)
  - Keyboard navigation works (Tab through interactive elements)

- **Edge Cases**
  - Pokemon ID not found (404) → show "Pokemon not found" message
  - API returns 503 → show "Service unavailable"
  - Network timeout → show connection error
  - Invalid ID format (non-numeric) → show error or redirect
  - Pokemon with no moves/abilities → show "No moves/abilities available"

- **SEO Optimization**
  - Page title: "{Pokemon Name} - Pokédex"
  - Meta description: "View detailed information about {Pokemon Name}..."
  - Open Graph tags for social sharing
  - Structured data (JSON-LD) for Pokemon (optional)

- **TypeScript**
  - PokemonDetail type with all fields
  - API response type
  - Component props typed

- **Testing**
  - Test component renders all sections
  - Test back button navigation
  - Test error states (404, 503)
  - Test accessibility

- **Card Click Integration**
  - Update PokemonCard component to be clickable
  - Card wraps in Next.js Link to `/pokemon/[id]`
  - Clicking card navigates to detail page
  - Link has proper ARIA label: "View details for {name}"

---

---

## Step 8 - UI Polish

As a user, I want the application to look professional and match the Figma design, so that I have a visually consistent and polished experience.

### Acceptance Criteria

- **Visual Design Polish**
  - All pages match Figma design (colors, typography, spacing)
  - Consistent color scheme throughout app
  - Proper font families and sizes
  - Consistent spacing using TailwindCSS spacing scale
  - Rounded corners, shadows, borders match design
  - Hover states on all interactive elements
  - Focus states visible for keyboard navigation

- **Responsive Design**
  - Mobile (< 640px): single column layouts, larger touch targets
  - Tablet (640px - 1024px): two column layouts where appropriate
  - Desktop (> 1024px): multi-column layouts, max-width constraint
  - Images scale appropriately
  - Text is readable at all breakpoints
  - No horizontal scrolling at any breakpoint

- **Loading States**
  - Skeleton loaders for Pokemon cards while loading
  - Spinner or progress indicator during login
  - Loading state for page transitions
  - Disabled buttons during async operations

- **Error States**
  - User-friendly error messages (not technical jargon)
  - Error messages have icons or visual indicators
  - Dismissible error alerts where appropriate
  - 404 page has helpful message and link back to home
  - Network error page suggests retry action

- **Performance**
  - Lighthouse score > 90 for Performance
  - Lighthouse score > 90 for Best Practices
  - Lighthouse score > 90 for SEO
  - Images optimized (use Next.js Image component)
  - Lazy loading for below-fold content

- **Browser Testing**
  - Works in Chrome, Firefox, Safari, Edge (latest versions)
  - No console errors or warnings
  - Graceful degradation for older browsers (optional)

- **Animations (Optional)**
  - Smooth transitions for page changes
  - Hover animations on cards
  - Loading animations
  - Respect `prefers-reduced-motion` for users who prefer less motion

- **Final Touches**
  - Favicon added
  - Page titles descriptive and unique per page
  - Footer with credits (optional)

### Technical Notes & TDD Focus

**TDD Workflow:**
1. Polish styles to match Figma
2. Add loading and error states
3. Create reusable UI components (LoadingSpinner, ErrorMessage, SkeletonCard)
4. Optimize images with Next.js Image component
5. Run Lighthouse audit for Performance/SEO/Best Practices
6. Fix performance issues
7. Test in multiple browsers
8. Verify no console errors or warnings

**Key Tools:**
- Lighthouse for performance/SEO audit
- Chrome DevTools for responsive testing
- Browser console for error checking

**Key Files to Update:**
- `client/tailwind.config.ts` (finalize theme)
- `client/app/globals.css` (global styles)
- All component files (add loading/error states)
- `client/public/favicon.ico`
- `client/app/layout.tsx` (metadata)

---

## Step 9 - Accessibility Audit

As a user with disabilities, I want the application to be fully accessible, so that I can use it effectively regardless of my abilities.

### Acceptance Criteria

- **WCAG 2.1 AA Compliance**
  - **Color Contrast**: All text meets 4.5:1 ratio (3:1 for large text)
  - **Keyboard Navigation**:
    - All interactive elements accessible via Tab key
    - Logical tab order
    - Focus indicators visible
    - Skip to main content link
    - No keyboard traps
  - **Screen Reader Support**:
    - All images have descriptive alt text
    - Form inputs have associated labels
    - Error messages announced via aria-live
    - Headings in logical order (h1, h2, h3)
    - Landmarks (banner, main, navigation, contentinfo)
  - **ARIA Attributes**:
    - role attributes where semantic HTML insufficient
    - aria-label for icon-only buttons
    - aria-current for active navigation
    - aria-disabled for disabled elements
    - aria-expanded for collapsible sections (if any)
  - **Focus Management**:
    - Focus moves to appropriate element after actions (e.g., error after failed login)
    - Modal dialogs trap focus (if any modals)
    - Focus returns to trigger element after closing modals

- **Automated Accessibility Testing**
  - jest-axe tests pass for all components
  - Lighthouse Accessibility score > 90
  - No critical or serious WAVE violations

- **Manual Accessibility Testing**
  - Keyboard-only navigation verified for all flows
  - Screen reader tested (VoiceOver on Mac or NVDA on Windows)
  - Focus indicators visible throughout app

### Technical Notes & TDD Focus

**TDD Workflow:**
1. Install accessibility testing tools (jest-axe, @axe-core/react)
2. Write accessibility tests in all component test files
3. Run automated accessibility audit with jest-axe
4. Test keyboard navigation manually
5. Test screen reader compatibility manually
6. Fix accessibility violations
7. Run Lighthouse Accessibility audit
8. Verify all scores > 90

**Key Tools:**
- jest-axe for automated accessibility testing
- Lighthouse for accessibility scoring
- WAVE browser extension for accessibility check
- Chrome DevTools Accessibility tree
- Keyboard-only navigation testing
- VoiceOver/NVDA for screen reader testing

**Key Files to Update:**
- All component test files (add axe tests)
- Components with ARIA violations (fix issues)
- `client/app/layout.tsx` (skip link, landmarks)

---

## Step 10 - Backend Search and Sort Implementation

As a user, I want to search Pokemon by name server-side and have sorted results, so that I can efficiently find Pokemon across all pages.

### Acceptance Criteria

- **Search Endpoint Enhancement**
  - `GET /api/pokemons?search=pika` filters Pokemon by name
  - Search is case-insensitive
  - Search matches partial names (e.g., "pika" matches "Pikachu")
  - Search works across all Pokemon (not just current page)
  - Search with pagination: `GET /api/pokemons?search=char&page=1`

- **Sort Endpoint Enhancement**
  - `GET /api/pokemons?sort=name` sorts by name alphabetically (A-Z)
  - `GET /api/pokemons?sort=number` sorts by number (default, 1-1302)
  - Invalid sort param defaults to number
  - Sort works with search and pagination

- **Combined Query**
  - All params work together: `GET /api/pokemons?search=char&sort=name&page=2`
  - Pagination counts are correct after filtering
  - Results are deterministic (same query = same results)

- **PokemonService Updates**
  - `fetch_list` method accepts search and sort params
  - Service filters PokeAPI results based on search term
  - Service sorts results based on sort param
  - Service caches results with cache key including all params
  - Service handles edge cases (empty search, invalid sort)

- **Performance**
  - Search and sort results cached separately
  - Cache invalidation strategy documented
  - Search is fast (< 500ms for any query)

- **Edge Cases**
  - Empty search param returns all Pokemon
  - Search with no matches returns empty array
  - Sort with invalid value defaults to 'number'
  - Search + sort + pagination edge cases handled
  - Special characters in search term escaped properly

- **API Response**
  - Response includes `total` count after filtering
  - Response includes `total_pages` after filtering
  - Response includes applied `search` and `sort` params

- **Testing**
  - RSpec request specs for search scenarios
  - RSpec request specs for sort scenarios
  - RSpec specs for combined search + sort + pagination
  - Service specs for filtering and sorting logic
  - Test caching with different param combinations

- **Documentation**
  - API endpoints documented with examples
  - PokemonService YARD docs updated
  - README explains search and sort features

---

## Step 11 - End-to-End Testing and Final Integration

As a stakeholder, I want comprehensive end-to-end tests to ensure the entire application works correctly from login to browsing Pokemon, so that I can confidently present the project in the code review.

### Acceptance Criteria

- **E2E Test Suite (Selenium + Capybara)**
  - Test suite covers critical user flows
  - Tests run headless for CI/CD
  - Tests can run with visible browser for debugging

- **Critical User Flows Tested**
  - **Flow 1: Login Success**
    - Visit /login
    - Enter valid credentials
    - Click login button
    - Verify redirect to /
    - Verify Pokemon list visible
  - **Flow 2: Login Failure**
    - Visit /login
    - Enter invalid credentials
    - Click login button
    - Verify error message displayed
    - Verify remains on /login
  - **Flow 3: Browse Pokemon**
    - Login
    - Verify Pokemon cards render
    - Verify images load
    - Verify pagination controls visible
  - **Flow 4: Search Pokemon**
    - Login
    - Enter search term
    - Verify filtered results
    - Clear search
    - Verify all results return
  - **Flow 5: Pagination**
    - Login
    - Click page 2
    - Verify URL updates to /?page=2
    - Verify different Pokemon displayed
    - Click previous
    - Verify back on page 1
  - **Flow 6: View Pokemon Detail**
    - Login
    - Click Pokemon card
    - Verify detail page loads
    - Verify abilities, moves, types visible
    - Click back button
    - Verify return to main page
  - **Flow 7: Logout**
    - Login
    - Click logout button
    - Verify redirect to /login
    - Attempt to access /
    - Verify redirect to /login

- **E2E Test Organization**
  - Tests in `server/spec/features/` directory
  - Each flow in separate spec file
  - Shared setup (login helper, factories) in support files
  - Tests use FactoryBot for user creation
  - Tests use VCR or WebMock for PokeAPI responses

- **Accessibility Testing in E2E**
  - Test keyboard navigation (Tab, Enter, Esc)
  - Test screen reader landmark navigation (optional)
  - Verify focus indicators visible

- **Error Scenario Testing**
  - Test backend unavailable (503 error)
  - Test network timeout
  - Test invalid Pokemon ID (404)
  - Test session expiration

- **Performance Testing (Optional)**
  - Verify page load times < 3 seconds
  - Verify no memory leaks during navigation
  - Verify images load within reasonable time

- **Cross-Browser Testing (Manual)**
  - Test in Chrome
  - Test in Firefox
  - Test in Safari (if on macOS)
  - Document any browser-specific issues

- **Final Integration Checklist**
  - ✅ All RSpec unit tests pass
  - ✅ All RSpec request tests pass
  - ✅ All E2E tests pass
  - ✅ All Jest frontend tests pass
  - ✅ RuboCop has no violations
  - ✅ ESLint has no violations
  - ✅ No console errors in browser
  - ✅ No console warnings in browser
  - ✅ Lighthouse scores all > 90
  - ✅ Application works with pnpm dev
  - ✅ README has clear setup instructions
  - ✅ All credentials documented (admin/admin)
  - ✅ AI commands log is complete

- **Documentation Complete**
  - README.md explains setup and running
  - API endpoints documented
  - Environment variables documented (if any)
  - Known issues documented (if any)
  - Future improvements documented
---

## Summary

This 11-step development plan provides a comprehensive, TDD-driven roadmap for building the Pokedex application. Each step includes:
- Clear user stories
- Granular acceptance criteria covering happy paths, edge cases, and accessibility
- Technical notes on TDD workflow

**Development Flow:**
1. ✅ Step 1: Database & User Model (Backend Foundation)
2. ✅ Step 2: Authentication API (Backend Auth)
3. ✅ Step 3: Pokemon Proxy Service (Backend Data)
4. ✅ Step 4: Login Page (Frontend Auth)
5. ✅ Step 5: Main Dashboard (Frontend Display)
6. ✅ Step 6: Pagination & Search (Frontend Features)
7. ✅ Step 7: Detail View (Frontend Detail)
8. Step 8: UI Polish (Frontend Visual Quality)
9. Step 9: Accessibility Audit (Frontend Accessibility)
10. Step 10: Backend Search/Sort (Backend Enhancement)
11. Step 11: E2E Testing (Integration Quality)

**Key Principles:**
- Test-Driven Development (Red → Green → Refactor)
- Accessibility First (WCAG 2.1 AA compliance)
- Clean Architecture (Separation of concerns)
- Comprehensive Documentation (YARD, JSDoc, AI log)
