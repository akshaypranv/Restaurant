# Phase 0 – Scaffolding Summary

## Project Root (`b:\INTERN\Restaurant`)
- **`.gitignore`** – Standard ignore patterns for Node, Vite, and OS files.
- **`package.json`** – Workspace root script that runs both client and server concurrently via `npm run dev`.
- **`.env` & `.env.example`** – Environment variables for DB connection, JWT secret, and server port.
- **`docker‑compose.yml`** – Spins up a PostgreSQL 16 container for local development.
- **`menu.json`** – Single source of truth for all menu categories and items (12 categories, ~70 items). Used by seed script and can be edited manually.
- **`gemini.md`** – Blueprint containing design specs, database schema, API contract, and glass‑morphism UI guidelines.
- **`README.md`** – High‑level project description and setup instructions.

## Server (`b:\INTERN\Restaurant\server`)
- **`package.json`** – Express backend dependencies (`express`, `pg`, `helmet`, `cors`, `express‑rate‑limit`, `express‑validator`).
- **`app.js`** – Configures middleware, routes, error handling, and exports the Express app for testing.
- **`server.js`** – Entry point that loads environment variables and starts the HTTP server.
- **`seed.js`** – Reads `menu.json` and populates PostgreSQL tables (`categories`, `menu_items`, `admins`). Creates extensions (`pg_trgm`) and indexes for full‑text search.
- **`config/db.js`** – Initializes a `pg.Pool` using `DATABASE_URL`.
- **`config/config.js`** – Validates required environment variables at startup.
- **`controllers/`** – Contains `menuController.js` (public routes: health, categories, menu, search) and `adminController.js` (CRUD, auth).
- **`routes/`** – `menuRoutes.js` (public) and `adminRoutes.js` (protected with JWT middleware).
- **`middleware/`** – `auth.js` (JWT verification), `validate.js` (request validation rules), `rateLimiter.js` (rate limits for search and login).
- **`utils/syncMenuJson.js`** – Atomic helper that writes updates to `menu.json` (writes temporary file then renames).
- **`tests/`** – Jest + Supertest test suites for public and admin endpoints.

## Client (`b:\INTERN\Restaurant\client`)
- **`package.json`** – Vite + React dependencies, Tailwind CSS, Zustand state‑management, Axios HTTP client.
- **`vite.config.js`** – Configures proxy to forward `/api` calls to the backend during development.
- **`tailwind.config.js`** – Enables JIT mode and extends the palette with gold/amber accents for the glass‑morphism theme.
- **`src/`**
  - **`index.css`** – Global Tailwind imports and custom utility classes for glass effects (`backdrop-blur`, translucent backgrounds).
  - **`App.jsx`** – Root component that sets up Zustand store provider, global Axios defaults, and routing.
  - **`components/ui/GlassCard.jsx`** – Reusable card component implementing the glass‑morphism visual style.
  - **`components/menu/`** – `SearchBar.jsx`, `CategoryTabs.jsx`, `VegToggle.jsx`, `MenuSection.jsx`, `MenuItemCard.jsx` (all styled with Tailwind and glass cards).
  - **`pages/MenuPage.jsx`** – Pulls menu data, handles search, veg filter, and renders sections.
  - **`pages/AdminPage.jsx`** – Placeholder protected admin UI for future CRUD features.
  - **`store/useMenuStore.js`** – Zustand store managing `activeCategory`, `searchQuery`, `vegFilter`, and future cart state.

## Why These Files/Folders Exist
- **Separation of concerns**: Server handles data persistence, validation, and security; client focuses on UI/UX and state.
- **Scalability**: Modular folder structure (controllers, routes, middleware) makes adding new features (e.g., cart, ordering) straightforward.
- **Single source of truth** (`menu.json`): Enables non‑technical staff to edit the menu without touching code; seed script keeps DB in sync.
- **Performance**: `pg_trgm` index and generated `TSVECTOR` enable fast full‑text search for the live search bar.
- **Security**: Helmet, CORS, rate limiting, and input validation protect against common web attacks.
- **Design consistency**: Tailwind utilities and `GlassCard` component centralize the glass‑morphism aesthetic, ensuring a premium look across all pages.
- **Testing ready**: Jest/Supertest suites ensure API reliability; component tests can be added later with Vitest.

## Next Steps (Phase 1)
- Implement the UI for category navigation and menu grid using the created components.
- Connect the client to the API endpoints for fetching categories, menu data, and live search.
- Add unit and integration tests for the new UI components.

---
*Generated on 2026‑06‑03.*
