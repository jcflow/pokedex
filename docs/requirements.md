# React - Technical Interview Exercise

## Project Overview
Create a product that fits the expectations described below.
* **Repository:** You must make a public GitHub repository to upload the exercise.
* **Submission:** Share the link in the answer field.
* **Methodology:** Development should be driven by an informal user story that you will create and include in your presentation.

---

## Frontend Requirements

### Tech Stack
* **Framework:** React
* **State/UI:** Feel free to use any library for local state management and UI.
* **Considerations:** Keep in mind SEO and responsiveness.

### Features

#### 1. Login Screen
* **Credentials:** Username/Password form.
* **Validation:**
    * Validate credentials against the backend (Hardcoded rule: `username: admin`, `password: admin`).
    * Anything different should be considered incorrect.
    * Show all validation that makes sense.
* **Session Management:**
    * Persist login state using your preference (Local DB, Local Storage, Cookies).
* **Route Protection:**
    * **Logged In:** Redirect to Main Page if trying to access Login.
    * **Logged Out:** Redirect to Login Page if trying to access Main Page.

#### 2. Main Page
* **Content:** Search bar and a list of Pokémon.
* **Data Source:** Use the backend API described in the Backend section.
* **Pagination:** API response is paginated; create a solution to handle this.
* **Sorting:** Users must be able to sort results by **Name** and **Number**.
* **Card UI:** Each Pokémon item must show:
    * Photo
    * Name
    * Number

#### 3. Detail View
* **Interaction:** Clicking a Pokémon redirects to a detailed page.
* **Content:** Detailed information including:
    * Abilities
    * Moves
    * Forms

#### 4. Design
* **Reference:** [Figma Design Link](https://www.figma.com/design/uMAeOKKaXf6yW1lIU72qJr/Pokédex--Community-?node-id=0-1&p=f)
* **Responsiveness:** The design is mobile-first, but must be adapted for bigger screens.

---

## Backend Requirements

### Tech Stack
* **Language/Framework:** Any technology you are comfortable with (e.g., Ruby on Rails, Node.js/Express, Python/Flask/FastAPI, PHP/Laravel).
* **Database:** In-memory data, SQLite, or any lightweight DB of your choice. Full production-ready DB is not required.
* **Source of Truth:** Rely on `https://pokeapi.co/` to obtain Pokémon information.

### Endpoints
Implement a lightweight backend providing the following three endpoints:
1.  **Login:** Handle credential authorization (`admin`/`admin`).
2.  **`/pokemons`:** Provide all Pokémon (paginated as in the PokeAPI).
3.  **`/pokemons/{id}`:** Provide detailed information for a specific Pokémon.
* *Optional:* Add any other endpoints considered necessary.

### GenAI & Tooling
* **Usage:** You are encouraged to use GenAI tools (Cursor, Claude Code, etc.) to help write or optimize code.
* **Documentation:** If used, you **must** share the prompts used and any modifications made to the AI-generated code.

---

## Presentation and Code Review

### Presentation (Live)
* **Format:** Google Meets or Zoom (Screen share GitHub repo or IDE).
* **Content:**
    * Explain the User Story.
    * Explain Design Choices and Technical Architecture.
    * Demonstrate application functionality.

### Evaluation Criteria
The panel will conduct a code review based on:

1.  **Clean Architecture:** Adherence to principles (separation of concerns, component independence).
2.  **Application Testing:** Sufficient test coverage (TDD is preferable).
3.  **Code Quality:** Organized, readable, adhering to best practices.
4.  **Functionality:** Performs as expected with no errors/bugs.
    * *Desired:* No warnings in the browser console.
5.  **Presentation:** Clear, concise demonstration of backend/frontend best practices.
6.  **GenAI Proficiency:** Demonstration of fluency with GenAI tools, prompt engineering, and critical thinking when evaluating AI-generated code.
