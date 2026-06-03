# Silvertip Cafe — Web App: Master Project Blueprint
> A complete, phase-by-phase build specification for an LLM to read and execute.
> **Stack:** PERN (PostgreSQL · Express.js · React · Node.js) · **Style:** Glassmorphism · **Methodology:** TDD (Anticipatory) · **Architecture:** Modular & Scalable

---

## Table of Contents

1. [Project Overview & Goals](#1-project-overview--goals)
2. [Menu Content Extracted from PDF](#2-menu-content-extracted-from-pdf)
3. [Full Technology Stack with Justifications](#3-full-technology-stack-with-justifications)
4. [Database Schema](#4-database-schema)
5. [menu.json Structure & Purpose](#5-menujson-structure--purpose)
6. [API Route Structure](#6-api-route-structure)
7. [React Component Tree](#7-react-component-tree)
8. [Full Project Directory Structure](#8-full-project-directory-structure)
9. [TDD Methodology — The Three-Column Rule](#9-tdd-methodology--the-three-column-rule)
10. [Security Checklist (Enforced by Tests)](#10-security-checklist-enforced-by-tests)
11. [Glassmorphism Design Specification](#11-glassmorphism-design-specification)
12. [Phase-by-Phase Build Plan (LLM Execution Order)](#12-phase-by-phase-build-plan-llm-execution-order)
13. [Extensibility Roadmap (Future Features)](#13-extensibility-roadmap-future-features)
14. [Environment Variables Reference](#14-environment-variables-reference)
15. [Dependency List](#15-dependency-list)

---

## 1. Project Overview & Goals

### Restaurant
**Silvertip Cafe** — A cafe offering starters, mains, pizzas, beverages, and more. Branding is dark, premium, and modern (black background, gold/amber accents).

### Immediate Features to Build
- Dynamically categorised digital menu (browsable by category)
- Live search bar with instant filtering
- Veg / Non-Veg filter toggle (FSSAI-standard dot indicators)
- All menu data managed via a single `menu.json` file — editable without touching code

### Design Decision
- **Style:** Minimal Glassmorphism — dark radial-gradient background, frosted glass cards (`backdrop-blur`), white/10 opacity fills, subtle white borders
- **Responsive:** Fully responsive from 360px mobile (QR-code table scan) to 1440px desktop (online browsing)
- **Language & Currency:** English only, prices displayed in ₹ (Indian Rupees)

### Primary Use Case
Digital menu — customers browse and read the menu. No ordering for now, but the architecture is explicitly designed so that a cart, order tracking, and payment system can be added in future phases without restructuring existing code.

### Admin Panel
Full CRUD admin panel (Phase 3): add items, edit prices, toggle availability, mark items as popular. All writes sync both PostgreSQL and `menu.json` atomically.

---

## 2. Menu Content Extracted from PDF

All data below is sourced from the three Silvertip Cafe menu pages. This becomes the seed data for `menu.json`.

> **Pricing note:** Some items have dual prices (e.g., Veg / Chicken variants at different prices). These are stored as `price` and `price_alt` with a `price_label` (e.g., `"VEG / CHICKEN"`). All prices exclude GST as noted on the original menu.

---

### Page 1 — Starters / Mains

#### Soups
| Item | Price |
|------|-------|
| Sweet Corn (Veg / Chicken) | ₹150 / ₹190 |
| Manchow (Veg / Chicken) | ₹150 / ₹190 |
| Hot & Sour (Veg / Chicken) | ₹150 / ₹190 |

#### Veg Starters 🟢
| Item | Price |
|------|-------|
| French Fries | ₹190 |
| Loaded Fries (Cheese) | ₹225 |
| Veg Nuggets | ₹190 |
| Momos - Veg | ₹190 |
| Gobi 65 / Chilli Gobi | ₹200 |
| Gobi Manchurian | ₹225 |
| Chilli Paneer / Paneer 65 | ₹250 |
| Paneer Manchurian | ₹250 |
| Paneer Tikka | ₹275 |
| Mushroom 65 / Chilli | ₹225 |
| Veg Samosa (3 pcs) | ₹50 |

#### Non-Veg Starters 🔴
| Item | Price |
|------|-------|
| Chicken Nuggets | ₹250 |
| Chicken Fingers | ₹250 |
| Chicken Momos | ₹230 |
| Chicken 65 / Chilli | ₹275 |
| Chicken Manchurian | ₹275 |
| Pepper Chicken | ₹275 |
| Chicken Tikka | ₹290 |
| Chicken Popcorn | ₹290 |

#### Omelette & Toast 🟢
| Item | Price |
|------|-------|
| Masala | ₹90 |
| Cheese | ₹125 |
| Bread Toast / Omelette | ₹150 |
| Bun Toast / Omelette | ₹150 |
> With Fries — Add ₹75

#### Burgers 🟢/🔴
| Item | Price |
|------|-------|
| Classic Veg 🟢 | ₹190 |
| Veg Cheese Burger 🟢 | ₹210 |
| Chicken Cheese Burger 🔴 | ₹275 |
| Spicy Chicken 🔴 | ₹250 |
| Crispy Chicken 🔴 | ₹275 |
> With Fries — Add ₹75

#### Sandwiches 🟢/🔴
| Item | Price |
|------|-------|
| Veg Sandwich 🟢 | ₹175 |
| Chilli Cheese 🟢 | ₹200 |
| Roasted Paneer 🟢 | ₹225 |
| Egg Sandwich 🔴 | ₹200 |
| Chicken Cheese 🔴 | ₹250 |
| BBQ Chicken 🔴 | ₹250 |
> With Fries — Add ₹75

---

### Page 2 — Mains

#### Pizzas [8"] 🟢/🔴
| Item | Price |
|------|-------|
| Veg Delight 🟢 | ₹250 |
| Peppy Paneer 🟢 | ₹275 |
| Sweet Corn 🟢 | ₹250 |
| Margherita 🟢 | ₹250 |
| Cheese Burst 🟢 | ₹290 |
| Hawaiian Veg 🟢 | ₹275 |
| Spicy Chicken 🔴 | ₹290 |
| BBQ Chicken 🔴 | ₹290 |
| Pepper Chicken 🔴 | ₹290 |
| Tandoori Chicken 🔴 | ₹310 |
| Hawaiian Chicken 🔴 | ₹310 |
| Chicken Supreme 🔴 | ₹310 |
> Extra Cheese / Toppings — Add ₹25

#### Fried Rice / Noodles 🟢/🔴
| Item | Price |
|------|-------|
| Veg 🟢 | ₹190 |
| Egg 🔴 | ₹225 |
| Chicken 🔴 | ₹260 |
| Paneer 🟢 | ₹260 |
| Mushroom 🟢 | ₹225 |

#### Pasta 🟢/🔴
| Item | Price |
|------|-------|
| Penne Arabiata Veg 🟢 | ₹225 |
| Penne Arabiata Paneer 🟢 | ₹250 |
| Penne Arabiata Chicken 🔴 | ₹250 |
| Creamy Alfredo Veg 🟢 | ₹250 |
| Creamy Alfredo Paneer 🟢 | ₹290 |
| Creamy Alfredo Chicken 🔴 | ₹290 |

#### Rice & Curries 🟢/🔴
| Item | Price |
|------|-------|
| Basmati Rice 🟢 | ₹80 |
| Ghee / Jeera Rice 🟢 | ₹100 |
| Millets 🟢 | ₹125 |
| Dal 🟢 | ₹150 |
| Mushroom Curry 🟢 | ₹175 |
| Paneer Tikka 🟢 | ₹200 |
| Aloo Gobi Masala 🟢 | ₹175 |
| Green Peas Masala 🟢 | ₹175 |
| Egg Masala 🔴 | ₹200 |
| Pepper Chicken Masala 🔴 | ₹225 |
| Chettinad Chicken Curry 🔴 | ₹225 |
| Chicken Tikka Masala 🔴 | ₹250 |

---

### Page 3 — Beverages

#### Coffee ☕
| Item | Price |
|------|-------|
| Filter Coffee | ₹80 |
| Chocolate Coffee | ₹95 |
| White Choco Latte | ₹120 |
| Hot Chocolate | ₹120 |
| Cappuccino / Latte | ₹100 |
| Cold Coffee | ₹150 |
| Vanilla Frappe | ₹150 |
| Hazelnut Frappe | ₹150 |
| Chocolate Frappe | ₹150 |
| Americano / Espresso | ₹60 |

#### Tea with Milk ☕
| Item | Price |
|------|-------|
| Cutting Chai | ₹25 |
| Silvertip (Special) | ₹35 |
| Ginger / Masala | ₹45 |
| Chocolate | ₹60 |

#### Infusion Teas 🍵
| Item | Price |
|------|-------|
| Black Tea | ₹30 |
| Lemon / Lemon Mint | ₹50 |
| Green Tea | ₹80 |
| Lemon Grass | ₹80 |
| Lemon Verbena | ₹80 |
| Peach & Apricot | ₹80 |
| Black Current | ₹80 |
| Chamomile | ₹80 |
| Moroccan Mint | ₹80 |
| Lavish Blue | ₹80 |
| Hibiscus | ₹80 |
| Peach Ice Tea | ₹150 |
| Lemon Ice Tea | ₹150 |

#### Mojitos 🍹
| Item | Price |
|------|-------|
| Peach / Spicy Guava | ₹150 |
| Blue Berry / Mint Blast | ₹150 |

#### Shakes 🥤
| Item | Price |
|------|-------|
| Chocolate | ₹150 |
| Oreo / Kit Kat | ₹150 |
| Vanilla / Blueberry | ₹150 |
| Strawberry / Mango | ₹150 |
| Black Currant | ₹150 |

#### Fresh Juice 🍋
| Item | Price |
|------|-------|
| Lemon / Mint Cooler | ₹60 |
| Lemon Soda | ₹90 |
| Seasonal Fruits | ₹150 |

#### Ice Creams 🍦
| Item | Price |
|------|-------|
| Single Scoop | ₹60 |
| Double Scoop | ₹100 |
| Toppings | ₹30 |

---

## 3. Full Technology Stack with Justifications

### Database — PostgreSQL 16
**Why:** Relational integrity enforces category → item relationships. The `pg_trgm` extension provides native full-text fuzzy search without a separate search engine like Elasticsearch. JSONB columns allow future storage of item variants (sizes, toppings) without a schema migration. Easily hosted for free on Supabase or Neon.

### Data File — `menu.json`
**Why:** Serves as the single, human-editable source of truth for all menu data. Non-technical staff can update a price in a text editor (or even Notepad) without touching the database or any code. A seed script reads this file and populates the database. When the admin panel writes changes, it updates both the database and this file simultaneously.

### Backend Runtime — Node.js 20 LTS
**Why:** Same JavaScript language as the frontend eliminates the cognitive overhead of switching languages. Non-blocking I/O is ideal for a menu API that may serve dozens of concurrent mobile users scanning QR codes during peak dining hours. Massive ecosystem. Long-term support version ensures stability.

### Backend Framework — Express.js 4
**Why:** Minimal and explicit. The middleware chain (`helmet → cors → rateLimit → validate → controller`) is visible and easy to reason about from a security perspective. No magic. No ORM hiding queries. Lightweight and well-understood for a cafe-scale application.

### Database Client — `pg` (node-postgres)
**Why:** Direct, transparent SQL with parameterised query support. No ORM abstraction hides N+1 query problems. Parameterised queries (`$1, $2, ...` placeholders) prevent SQL injection by the library's design — it is structurally impossible to inject via concatenation.

### Frontend Framework — React 18 + Vite
**Why:** Component reuse across category tabs, search results, and admin panel avoids duplicated markup. Vite provides instant Hot Module Replacement during development. React 18's concurrent features allow the search filter to update the UI without blocking or janking, which is critical for a live-search experience.

### Styling — Tailwind CSS v3
**Why:** Glassmorphism effects (`backdrop-blur-md`, `bg-white/8`, `border-white/15`) are single utility classes in Tailwind — no custom CSS file needed. Responsive breakpoints (`sm:`, `md:`, `lg:`) handle the mobile-to-desktop range explicitly. The `purge` step in production removes all unused classes, resulting in a CSS bundle under 10kb.

### State Management — Zustand
**Why:** Extremely lightweight (~1kb). No Redux boilerplate or Provider nesting. Stores `activeCategory`, `searchQuery`, `vegFilter`, and the future `cartItems` in a single flat store. Adding the cart in a future phase is a single new key in the existing store — zero refactoring required.

### HTTP Client — Axios
**Why:** Request interceptors allow global headers (e.g., JWT `Authorization` header for admin routes) to be set once. A cancel token aborts in-flight search requests when the user types another character — preventing stale results from appearing out of order.

### Backend Testing — Jest + Supertest
**Why:** Supertest mounts the Express app in-process (no network port required), making tests fast and CI-friendly. Jest provides `jest.mock()` for mocking the `pg` pool in unit tests. Tests can run without a real database in CI, while integration tests use a separate test database.

### Frontend Testing — Vitest + React Testing Library
**Why:** Vitest is Vite-native — zero configuration, same transform pipeline as the app. React Testing Library (RTL) tests user behaviour ("type 'paneer' in search box → only paneer items appear") not implementation details, making tests resilient to refactoring.

### Security Middleware — `helmet` + `express-rate-limit` + `express-validator`
- **`helmet`:** Sets 11 HTTP security response headers automatically (CSP, X-Content-Type-Options, X-Frame-Options, etc.) with a single `app.use(helmet())` call.
- **`express-rate-limit`:** Separate limiters for the search endpoint (30 req/min) and the admin login endpoint (5 attempts/15 min), both keyed by IP address.
- **`express-validator`:** Validates and sanitises all incoming data before it touches a controller. Catches missing fields, incorrect types, oversized inputs, and XSS patterns at the middleware layer.

### Admin Authentication (Phase 3) — JWT + bcrypt
**Why JWT:** Stateless — no session store or Redis required. Tokens are signed with a secret and expire automatically. The same middleware can be reused for future user-facing authentication.
**Why bcrypt:** Industry standard for password hashing. Cost factor 12 makes brute-force attacks computationally expensive (each hash takes ~250ms), while remaining fast enough for the occasional legitimate admin login.

### Deployment
- **Backend:** Railway or Render — both offer free-tier PostgreSQL and Node.js hosting. Railway provides automatic deploys from GitHub.
- **Frontend:** Vercel — automatic Vite builds from GitHub with zero configuration. Free tier is more than sufficient for a cafe menu.
- **Environment variables** keep all secrets (DB connection strings, JWT secret) out of the codebase.

---

## 4. Database Schema

### Table: `categories`
```sql
CREATE TABLE categories (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  slug          VARCHAR(100) NOT NULL UNIQUE,  -- e.g., 'veg-starters'
  display_order INTEGER NOT NULL DEFAULT 0,    -- controls tab order in UI
  page_group    VARCHAR(50),                   -- 'starters', 'mains', 'beverages'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Table: `menu_items`
```sql
CREATE TABLE menu_items (
  id             SERIAL PRIMARY KEY,
  category_id    INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name           VARCHAR(200) NOT NULL,
  price          NUMERIC(8, 2) NOT NULL,
  price_alt      NUMERIC(8, 2),               -- for dual-priced items (e.g., veg/chicken)
  price_label    VARCHAR(40),                 -- e.g., 'VEG / CHICKEN'
  is_veg         BOOLEAN NOT NULL DEFAULT TRUE,
  is_available   BOOLEAN NOT NULL DEFAULT TRUE,
  is_popular     BOOLEAN NOT NULL DEFAULT FALSE,
  note           TEXT,                        -- e.g., 'With Fries - Add 75'
  search_vector  TSVECTOR GENERATED ALWAYS AS (
                   to_tsvector('english', name)
                 ) STORED,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_search      ON menu_items USING GIN(search_vector);
CREATE INDEX idx_menu_items_name_trgm   ON menu_items USING GIN(name gin_trgm_ops);
CREATE INDEX idx_menu_items_available   ON menu_items(is_available) WHERE is_available = TRUE;
```

### Table: `admins` (Phase 3)
```sql
CREATE TABLE admins (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Extensions Required
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- for fuzzy text search
```

### Relationship
```
categories (1) ──────< menu_items (many)
  id                    category_id (FK)
```

---

## 5. menu.json Structure & Purpose

### Purpose
`menu.json` is the **single source of truth** for all menu content. It lives at the project root. When the admin panel saves a change via the UI, the backend:
1. Writes to PostgreSQL
2. Writes the updated data to `menu.json` using an atomic temp-file swap (write to `menu.json.tmp` → rename to `menu.json`) to prevent corruption

Non-technical staff can also directly edit this file to update prices and re-run the seed script.

### Structure
```json
{
  "restaurant": {
    "name": "Silvertip Cafe",
    "tagline": "Select",
    "currency": "INR",
    "currency_symbol": "₹",
    "gst_note": "All prices exclusive of GST"
  },
  "categories": [
    {
      "name": "Soups",
      "slug": "soups",
      "page_group": "starters",
      "display_order": 1,
      "items": [
        {
          "name": "Sweet Corn",
          "price": 150,
          "price_alt": 190,
          "price_label": "VEG / CHICKEN",
          "is_veg": true,
          "is_available": true,
          "is_popular": false,
          "note": null
        }
      ]
    },
    {
      "name": "Veg Starters",
      "slug": "veg-starters",
      "page_group": "starters",
      "display_order": 2,
      "items": [
        {
          "name": "French Fries",
          "price": 190,
          "price_alt": null,
          "price_label": null,
          "is_veg": true,
          "is_available": true,
          "is_popular": true,
          "note": null
        }
      ]
    }
  ]
}
```

> The full `menu.json` with all 12 categories and 70+ items is generated in **Phase 0** of the build.

---

## 6. API Route Structure

All routes prefixed with `/api/v1/`. Versioning allows future breaking changes without disrupting existing clients.

### Public Routes (no authentication required)

| Method | Endpoint | Rate Limit | Description |
|--------|----------|------------|-------------|
| `GET` | `/api/v1/health` | None | Health check. Returns DB status. Used by deployment monitors. |
| `GET` | `/api/v1/categories` | None | All categories with item count. Response cached for 5 minutes. |
| `GET` | `/api/v1/menu` | None | All available items grouped by category. Supports `?veg=true` filter. |
| `GET` | `/api/v1/menu/:categorySlug` | None | Items in a single category by slug. Returns 404 for unknown slugs. |
| `GET` | `/api/v1/search?q=` | 30 req/min/IP | Full-text search. Min 2 chars, max 100 chars. Input sanitised. |

### Admin Routes (JWT required)

| Method | Endpoint | Rate Limit | Description |
|--------|----------|------------|-------------|
| `POST` | `/api/v1/admin/auth/login` | 5 req/15min/IP | Email + password login. Returns signed JWT on success. |
| `GET` | `/api/v1/admin/menu` | None | All items including unavailable ones (for admin view). |
| `POST` | `/api/v1/admin/menu` | None | Create new menu item. Validates all fields. Syncs menu.json. |
| `PUT` | `/api/v1/admin/menu/:id` | None | Update item (name, price, availability, popular flag). Syncs menu.json. |
| `DELETE` | `/api/v1/admin/menu/:id` | None | Soft delete only — sets `is_available = false`. Never hard deletes. |
| `PUT` | `/api/v1/admin/categories` | None | Reorder or rename categories. Syncs menu.json. |

### Request / Response Conventions
- All responses: `Content-Type: application/json`
- Success: `{ "status": "success", "data": {...} }`
- Error: `{ "status": "error", "message": "...", "code": "VALIDATION_ERROR" }`
- Validation failure: HTTP 400 with array of field errors
- Unauthorised: HTTP 401
- Not found: HTTP 404
- Rate limited: HTTP 429 with `Retry-After` header

---

## 7. React Component Tree

```
App.jsx                               // Zustand store provider, Axios base URL config
├── Layout/
│   ├── Navbar.jsx                    // Logo, restaurant name, mobile search icon toggle
│   └── Footer.jsx                    // Opening hours, address, GST note
│
├── pages/MenuPage.jsx                // Main public page — all data fetching lives here
│   ├── SearchBar.jsx                 // Debounced input (300ms) → /api/v1/search
│   ├── SearchResults.jsx             // Renders only when searchQuery.length >= 2
│   ├── CategoryTabs.jsx              // Horizontally scrollable tabs (scroll-snap on mobile)
│   ├── VegToggle.jsx                 // Green/Red dot filter toggle switch
│   └── MenuSection.jsx               // Renders one section per active/filtered category
│       └── MenuItemCard.jsx          // Glass card: name, price, veg dot, popular badge
│           └── VegBadge.jsx          // FSSAI-standard green/red dot indicator
│
├── pages/AdminPage.jsx               // Protected route — redirects to login if no JWT
│   ├── AdminLogin.jsx                // Email + password form → POST /admin/auth/login
│   ├── AdminMenuTable.jsx            // Sortable table of all items with inline actions
│   ├── AddItemModal.jsx              // Form: name, price, category, veg toggle, note
│   └── EditItemModal.jsx             // Same form, pre-filled with existing item data
│
├── components/ui/
│   ├── GlassCard.jsx                 // Reusable: backdrop-blur, bg-white/8, border-white/15
│   ├── LoadingSpinner.jsx            // Amber spinner for API loading states
│   ├── ErrorBanner.jsx               // Dismissable error display for API failures
│   └── PriceBadge.jsx                // ₹ formatter — handles dual prices (₹150 / ₹190)
│
└── store/useMenuStore.js             // Zustand: activeCategory, searchQuery, vegFilter, cartItems (future)
```

### Key Custom Hooks (`client/src/hooks/`)
- `useDebounce(value, delay)` — delays search API call until user stops typing
- `useMenuData()` — fetches and caches all categories + menu items
- `useSearch(query)` — calls search API, cancels previous request on new keystroke

---

## 8. Full Project Directory Structure

```
silvertip-cafe/
│
├── server/                           # Express.js backend
│   ├── config/
│   │   └── db.js                     # pg Pool, reads DATABASE_URL from .env
│   │   └── config.js                 # Validates all required env vars at startup
│   │
│   ├── controllers/
│   │   ├── menuController.js         # getAll, getByCategory, search
│   │   └── adminController.js        # login, createItem, updateItem, deleteItem
│   │
│   ├── middleware/
│   │   ├── auth.js                   # JWT verify middleware — attaches req.admin
│   │   ├── validate.js               # express-validator rule sets per route
│   │   └── rateLimiter.js            # Separate limiters: searchLimiter, loginLimiter
│   │
│   ├── routes/
│   │   ├── menuRoutes.js             # Public menu routes
│   │   └── adminRoutes.js            # Protected admin routes
│   │
│   ├── utils/
│   │   └── syncMenuJson.js           # Atomic menu.json write utility (temp-file swap)
│   │
│   ├── tests/
│   │   ├── menu.test.js              # Supertest: routes, filtering, edge cases, security
│   │   └── admin.test.js             # Supertest: auth, CRUD, unauthorised access tests
│   │
│   ├── app.js                        # Express app setup, middleware chain (no port bind)
│   ├── server.js                     # Port binding only — keeps app.js testable
│   └── seed.js                       # Reads menu.json → inserts into PostgreSQL
│
├── client/                           # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                   # GlassCard, LoadingSpinner, ErrorBanner, PriceBadge
│   │   │   ├── menu/                 # SearchBar, CategoryTabs, VegToggle, MenuSection, MenuItemCard
│   │   │   └── admin/                # AdminLogin, AdminMenuTable, AddItemModal, EditItemModal
│   │   ├── pages/
│   │   │   ├── MenuPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── store/
│   │   │   └── useMenuStore.js       # Zustand store
│   │   ├── hooks/
│   │   │   ├── useDebounce.js
│   │   │   ├── useMenuData.js
│   │   │   └── useSearch.js
│   │   ├── utils/
│   │   │   ├── formatPrice.js        # ₹ formatting, dual-price display
│   │   │   └── sanitiseInput.js      # Client-side input cleanup before API calls
│   │   ├── tests/
│   │   │   ├── SearchBar.test.jsx
│   │   │   ├── MenuItemCard.test.jsx
│   │   │   ├── VegToggle.test.jsx
│   │   │   └── CategoryTabs.test.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js            # Custom glassmorphism tokens
│   ├── vite.config.js                # Dev proxy: /api → localhost:5000
│   └── index.html
│
├── menu.json                         # ← THE single source of truth for all menu data
├── .env.example                      # Template for environment variables (never commit .env)
├── .gitignore                        # node_modules, .env, dist, coverage
├── docker-compose.yml                # PostgreSQL 16 container for local development
├── package.json                      # Root scripts: dev, test, seed, build
└── README.md
```

---

## 9. TDD Methodology — The Three-Column Rule

For every feature, the LLM must execute in this strict order. **Never skip to code first.**

---

### Column 1 — Vulnerability & Edge Case Analysis

Before any code is written, identify what a "vibe coder" would get wrong:

**Backend (API)**
- SQL injection via `?q=` search parameter (string concatenation instead of parameterised query)
- XSS stored in menu item names entered through admin panel
- Missing database index on `category_id` — full table scan on every page load
- No rate limit on search endpoint — trivially abusable
- JWT secret hardcoded in source (not from `.env`)
- Hard delete of menu items that may appear in future order history
- No input length validation — arbitrarily long search queries
- CORS wildcard (`*`) left in production config

**Frontend (React)**
- React state not resetting when switching category tabs — stale items from previous category shown
- Uncaught promise rejection when API request times out — white screen of death
- Search API called on every single keystroke without debounce — floods backend
- Axios cancel token not used in `useEffect` cleanup — memory leak + race condition

---

### Column 2 — Test Cases (Written First, Must Fail Initially)

```javascript
// server/tests/menu.test.js — write BEFORE menuController.js

describe('GET /api/v1/search', () => {
  test('SQL injection attempt returns 400', async () => {
    const res = await request(app).get("/api/v1/search?q='; DROP TABLE menu_items; --");
    expect(res.status).toBe(400);
  });

  test('Query shorter than 2 chars returns 400', async () => {
    const res = await request(app).get('/api/v1/search?q=a');
    expect(res.status).toBe(400);
  });

  test('Missing q param returns 400', async () => {
    const res = await request(app).get('/api/v1/search');
    expect(res.status).toBe(400);
  });

  test('Valid query returns array of items', async () => {
    const res = await request(app).get('/api/v1/search?q=paneer');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('31st request per minute returns 429', async () => {
    // Fire 31 requests in sequence
    for (let i = 0; i < 30; i++) await request(app).get('/api/v1/search?q=test');
    const res = await request(app).get('/api/v1/search?q=test');
    expect(res.status).toBe(429);
  });
});

describe('Admin routes — unauthorised access', () => {
  test('POST /admin/menu without JWT returns 401', async () => {
    const res = await request(app).post('/api/v1/admin/menu').send({ name: 'Test' });
    expect(res.status).toBe(401);
  });

  test('POST /admin/auth/login with wrong password returns 401', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ email: 'admin@silvertip.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  test('6th login attempt in 15 min returns 429', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/v1/admin/auth/login').send({ email: 'x', password: 'x' });
    }
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ email: 'x', password: 'x' });
    expect(res.status).toBe(429);
  });
});

describe('GET /api/v1/menu/:categorySlug', () => {
  test('Unknown slug returns 404', async () => {
    const res = await request(app).get('/api/v1/menu/nonexistent-category');
    expect(res.status).toBe(404);
  });

  test('Valid slug returns items array', async () => {
    const res = await request(app).get('/api/v1/menu/veg-starters');
    expect(res.status).toBe(200);
    expect(res.body.data.items).toBeDefined();
  });
});
```

```javascript
// client/src/tests/SearchBar.test.jsx — write BEFORE SearchBar.jsx

test('Does not call API when query is less than 2 characters', async () => {
  const mockSearch = jest.fn();
  render(<SearchBar onSearch={mockSearch} />);
  await userEvent.type(screen.getByRole('searchbox'), 'a');
  expect(mockSearch).not.toHaveBeenCalled();
});

test('Calls API after debounce delay with valid query', async () => {
  const mockSearch = jest.fn();
  render(<SearchBar onSearch={mockSearch} />);
  await userEvent.type(screen.getByRole('searchbox'), 'paneer');
  await waitFor(() => expect(mockSearch).toHaveBeenCalledWith('paneer'), { timeout: 500 });
});

test('VegToggle filters out non-veg items from displayed list', () => {
  const items = [
    { id: 1, name: 'Paneer Tikka', is_veg: true, price: 275 },
    { id: 2, name: 'Chicken Tikka', is_veg: false, price: 290 },
  ];
  render(<MenuSection items={items} vegOnly={true} />);
  expect(screen.getByText('Paneer Tikka')).toBeInTheDocument();
  expect(screen.queryByText('Chicken Tikka')).not.toBeInTheDocument();
});

test('Dual price displays correctly as ₹150 / ₹190', () => {
  render(<PriceBadge price={150} priceAlt={190} priceLabel="VEG / CHICKEN" />);
  expect(screen.getByText(/₹150 \/ ₹190/)).toBeInTheDocument();
});
```

---

### Column 3 — Code That Passes the Tests

Only after all tests are written and confirmed to **fail** (red), write the application code. Code must:
- Be heavily commented for complex logic
- Use parameterised queries exclusively (never string concatenation with user input)
- Validate all inputs at the middleware layer before reaching the controller
- Handle all error cases with appropriate HTTP status codes
- Be modular — one responsibility per file

---

## 10. Security Checklist (Enforced by Tests)

Every item below has a corresponding failing test written in Phase 1 or Phase 3 before the implementing code is written.

| # | Vulnerability | Countermeasure | Test |
|---|---------------|----------------|------|
| 1 | SQL injection via search `?q=` | Parameterised `pg` queries — `$1, $2` placeholders, never string concat | `search?q='; DROP TABLE` → 400 |
| 2 | XSS in admin-entered menu names | `validator.escape()` on all string inputs before DB write and JSON write | `POST /admin/menu` with `<script>alert(1)</script>` → sanitised |
| 3 | Brute-force admin login | Rate limit: 5 attempts / 15 min / IP. `bcrypt` cost factor 12 | 6th attempt → 429 |
| 4 | Search endpoint abuse | Rate limit: 30 requests / min / IP | 31st request → 429 |
| 5 | Missing auth on admin routes | JWT middleware on every `/admin/*` route | `POST /admin/menu` without token → 401 |
| 6 | JWT secret in source code | App refuses to start if `JWT_SECRET` is missing from `.env` or under 32 chars | Startup test with missing env var |
| 7 | menu.json write corruption | Atomic write: write to `menu.json.tmp` → `fs.rename()` — never partial write | Simulated write interruption test |
| 8 | Hard delete data loss | Soft delete only (`is_available = false`). No `DELETE` SQL ever runs on `menu_items` | `DELETE /admin/menu/:id` → item still in DB |
| 9 | Overly permissive CORS | CORS whitelist from `ALLOWED_ORIGINS` env variable. Never `*` in production | CORS header test with disallowed origin |
| 10 | Missing HTTP security headers | `helmet()` at top of middleware chain | Response headers include `X-Content-Type-Options`, `X-Frame-Options`, `CSP` |
| 11 | React memory leak on unmount | Axios `CancelToken` in `useEffect` cleanup function | Jest timer test: cancel called on unmount |
| 12 | Stale category state on tab switch | Zustand store reset for `searchQuery` when `activeCategory` changes | RTL: click different tab → previous search cleared |

---

## 11. Glassmorphism Design Specification

### Colour Palette
| Role | Value | Usage |
|------|-------|-------|
| Background base | `#0a0a0a` | Page background |
| Amber glow | `#F59E0B` (opacity 15%) | Top-right radial gradient — warm hero effect |
| Purple glow | `#6D28D9` (opacity 10%) | Bottom-left radial gradient — depth |
| Card fill | `rgba(255,255,255,0.08)` | All glass cards |
| Card fill (hover) | `rgba(255,255,255,0.12)` | Card hover state |
| Card border | `rgba(255,255,255,0.15)` | Glass card border |
| Price amber | `#F59E0B` | All price displays |
| Text primary | `rgba(255,255,255,0.9)` | Item names, headings |
| Text secondary | `rgba(255,255,255,0.5)` | Category labels, notes |
| Veg green | `#22C55E` | Veg indicator dot |
| Non-veg red | `#EF4444` | Non-veg indicator dot |

### Tailwind Configuration (`tailwind.config.js`)
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        glass: {
          card: 'rgba(255, 255, 255, 0.08)',
          'card-hover': 'rgba(255, 255, 255, 0.12)',
          border: 'rgba(255, 255, 255, 0.15)',
        },
        amber: { brand: '#F59E0B' },
      },
      backdropBlur: { glass: '12px' },
      backgroundImage: {
        'radial-hero':
          'radial-gradient(ellipse at 80% 0%, rgba(245,158,11,0.15) 0%, transparent 60%), ' +
          'radial-gradient(ellipse at 20% 100%, rgba(109,40,217,0.10) 0%, transparent 60%)',
      },
    },
  },
};
```

### Glass Card Component (Tailwind classes)
```jsx
// components/ui/GlassCard.jsx
const GlassCard = ({ children, className = '' }) => (
  <div
    className={`
      backdrop-blur-[12px]
      bg-white/[0.08]
      border border-white/[0.15]
      rounded-2xl
      hover:bg-white/[0.12]
      transition-colors duration-200
      ${className}
    `}
  >
    {children}
  </div>
);
```

### Typography
- **Font:** Inter (Google Fonts) — weights 400, 500, 700
- **Item names:** `text-white/90 font-medium text-base`
- **Prices:** `text-amber-400 font-semibold`
- **Category headings:** `text-white font-bold text-lg tracking-wide uppercase`
- **Notes (e.g., "With Fries - Add ₹75"):** `text-white/50 text-xs`

### Veg / Non-Veg Indicators
FSSAI-standard symbols — recognisable to every Indian customer:
- 🟢 Veg: filled green circle inside a green square border
- 🔴 Non-veg: filled red circle inside a red square border

```jsx
const VegBadge = ({ isVeg }) => (
  <div
    className={`w-4 h-4 border-2 flex items-center justify-center flex-shrink-0
      ${isVeg ? 'border-green-500' : 'border-red-500'}`}
  >
    <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
  </div>
);
```

### Category Tabs (Mobile-first)
- Horizontally scrollable with `overflow-x: auto; scrollbar-width: none`
- `scroll-snap-type: x mandatory` on container, `scroll-snap-align: start` on each tab
- Active tab: amber underline (`border-b-2 border-amber-400`) + white text
- Inactive tab: `text-white/50`, hover `text-white/80`

### Search Bar
- Sticky at top on mobile (`position: sticky; top: 0; z-index: 40`)
- Glass treatment: same `backdrop-blur` + `bg-white/8` as cards
- Amber focus ring: `focus:ring-2 focus:ring-amber-400/50`
- Results dropdown: glass panel with `border-white/15`, smooth `opacity` + `translateY` entrance animation

---

## 12. Phase-by-Phase Build Plan (LLM Execution Order)

### Phase 0 — Project Scaffolding & menu.json Creation
**Goal:** Empty working repository with all dependencies installed and all 70+ menu items in `menu.json`.

**Tasks:**
1. Create root directory structure as defined in Section 8
2. `cd server && npm init -y` — initialise backend
3. Install backend dependencies: `express helmet cors express-rate-limit express-validator pg bcrypt jsonwebtoken node-cache`
4. Install backend dev dependencies: `jest supertest nodemon`
5. `cd client && npm create vite@latest . -- --template react` — initialise frontend
6. Install frontend dependencies: `axios zustand`
7. Install frontend dev dependencies: `vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom`
8. Install and configure Tailwind CSS v3
9. Create `docker-compose.yml` for PostgreSQL 16 local container
10. Write `.env.example` (see Section 14)
11. Write complete `menu.json` with all 12 categories and 70+ items from Section 2
12. Write `server/seed.js` — reads `menu.json`, creates tables if not exist, inserts all data
13. Run `node seed.js` — confirm all items inserted correctly
14. Write root `package.json` scripts: `dev`, `test`, `seed`, `build`

**Done when:** `node seed.js` completes with no errors and a `SELECT COUNT(*) FROM menu_items` returns the correct item count.

---

### Phase 1 — Backend API: Categorised Menu & Search (TDD)
**Goal:** A fully tested, production-ready Express API serving menu data and search.

**Step 1.1 — Vulnerability Analysis**
Read Section 9, Column 1. Understand every attack vector before writing a line of code.

**Step 1.2 — Write All Tests (They Must Fail)**
Create `server/tests/menu.test.js` with all test cases from Section 9, Column 2. Run `npm test` — confirm all tests fail (red). This confirms tests are real and not accidentally passing.

**Step 1.3 — Write Application Code**
Implement in this order:
1. `config/db.js` — pg Pool with connection string from `.env`
2. `config/config.js` — validates `DATABASE_URL`, `JWT_SECRET` (≥32 chars), `PORT` at startup; throws if missing
3. `middleware/rateLimiter.js` — `searchLimiter` (30/min) and `loginLimiter` (5/15min)
4. `middleware/validate.js` — validation rules for search (`q`: string, min 2, max 100, trim)
5. `controllers/menuController.js`:
   - `getAllMenu()` — `SELECT` all available items joined with categories
   - `getByCategory(slug)` — validates slug exists, returns 404 if not
   - `searchMenu(q)` — uses `to_tsquery` with `pg_trgm` fallback for short queries
6. `routes/menuRoutes.js` — wire routes to middleware + controller
7. `app.js` — `helmet()` → `cors()` → `json()` → routes
8. `server.js` — `app.listen(PORT)`

**Step 1.4 — Confirm Green**
Run `npm test`. All tests must pass. Do not proceed to Phase 2 until 100% green.

---

### Phase 2 — Frontend: Glassmorphism Menu UI (TDD)
**Goal:** A fully responsive, visually premium menu UI wired to the Phase 1 API.

**Step 2.1 — Write All Frontend Tests (They Must Fail)**
Create all test files in `client/src/tests/` from Section 9, Column 2. Run `npm test` — confirm all fail.

**Step 2.2 — Set Up Tailwind & Design Tokens**
Configure `tailwind.config.js` as specified in Section 11. Set up the background gradient in `index.html` or `App.jsx`.

**Step 2.3 — Build Components (Bottom-Up)**
Build in this order (each one unlocks the next):
1. `VegBadge.jsx` — FSSAI indicator
2. `PriceBadge.jsx` — ₹ formatter with dual-price support
3. `GlassCard.jsx` — reusable glass container
4. `LoadingSpinner.jsx` + `ErrorBanner.jsx`
5. `MenuItemCard.jsx` — composes VegBadge + PriceBadge inside GlassCard
6. `MenuSection.jsx` — grid of MenuItemCards for one category
7. `VegToggle.jsx` — toggle switch, writes to Zustand store
8. `CategoryTabs.jsx` — horizontal scroll tabs, writes `activeCategory` to store
9. `SearchBar.jsx` — debounced input using `useDebounce` hook, cancels on unmount
10. `SearchResults.jsx` — renders when `searchQuery.length >= 2`
11. `MenuPage.jsx` — fetches data with `useMenuData`, composes all above components
12. `Navbar.jsx` + `Footer.jsx`
13. `App.jsx` — routing, Zustand provider, Axios config

**Step 2.4 — Responsive Breakpoints**
Test at: 360px (small Android), 390px (iPhone 14), 768px (tablet), 1280px (laptop), 1440px (desktop).

**Step 2.5 — Confirm Green**
Run `npm test`. All frontend tests must pass before Phase 3.

---

### Phase 3 — Admin Panel: Full CRUD (TDD)
**Goal:** A secure admin interface for managing menu items, protected by JWT authentication.

**Step 3.1 — Write Admin Tests (They Must Fail)**
Create `server/tests/admin.test.js` covering: unauthorised access (401), login brute-force (429), XSS in fields, successful CRUD, soft delete behaviour, menu.json sync.

**Step 3.2 — Backend Admin Implementation**
1. `middleware/auth.js` — JWT `Authorization: Bearer <token>` verification
2. `controllers/adminController.js`:
   - `login()` — bcrypt compare, sign JWT (24h expiry), return token
   - `createItem()` — validate, sanitise with `validator.escape()`, INSERT, sync menu.json
   - `updateItem()` — validate id param, UPDATE fields, sync menu.json
   - `deleteItem()` — soft delete only (`UPDATE is_available = false`), sync menu.json
3. `utils/syncMenuJson.js` — reads all items from DB, writes to `menu.json.tmp`, renames to `menu.json`
4. `routes/adminRoutes.js` — wire with `auth` middleware

**Step 3.3 — Frontend Admin Implementation**
1. `AdminLogin.jsx` — form, calls `POST /admin/auth/login`, stores JWT in memory (not localStorage — XSS risk)
2. `AdminMenuTable.jsx` — table with edit/delete/toggle-availability buttons
3. `AddItemModal.jsx` — controlled form, all fields validated client-side before submission
4. `EditItemModal.jsx` — pre-filled with existing item data
5. `AdminPage.jsx` — checks JWT in memory, redirects to login if absent

**Step 3.4 — Confirm Green**
All backend and frontend tests green.

---

### Phase 4 — Polish, Performance & Deployment
**Goal:** Production-ready application deployed and accessible via URL for QR code.

**Tasks:**
1. Add `node-cache` to cache `GET /api/v1/menu` responses for 5 minutes
2. Add skeleton loading states (`animate-pulse` Tailwind classes) while data fetches
3. Add `<meta>` tags for mobile: `viewport`, `theme-color: #0a0a0a`, `apple-mobile-web-app-capable`
4. Add a `/api/v1/health` endpoint returning DB connection status
5. Write `README.md` with setup instructions, env var reference, and seed instructions
6. Configure production CORS using `ALLOWED_ORIGINS` environment variable
7. Deploy backend to Railway (set all env vars in dashboard)
8. Deploy frontend to Vercel (set `VITE_API_BASE_URL` to Railway backend URL)
9. Generate QR code pointing to the Vercel frontend URL for table placement
10. Run all tests against the production endpoints

---

## 13. Extensibility Roadmap (Future Features)

The architecture is deliberately designed so none of these additions require restructuring Phase 1–3 code.

### Cart (Next logical addition)
- **What's already there:** `cartItems` key is already defined (empty) in the Zustand store
- **What to add:** `CartDrawer.jsx` component, `CartItemCard.jsx`, `useCartStore()` actions
- **Backend:** New `POST /api/v1/cart/validate` endpoint to verify item availability before checkout

### Online Ordering
- **What's already there:** Modular route structure, JWT auth pattern
- **What to add:** `orders` table in PostgreSQL, `ordersController.js`, `OrdersPage.jsx`
- **No changes to:** menu API, categories, search, admin panel

### Payment Integration (Razorpay — recommended for India)
- **What's already there:** Express middleware chain accepts new routes
- **What to add:** `POST /api/v1/payments/create-order`, `POST /api/v1/payments/verify` using Razorpay Node SDK
- **Frontend:** Razorpay checkout widget (loads from CDN)

### User Accounts & Order History
- **What's already there:** JWT auth middleware pattern from admin panel
- **What to add:** `users` table, `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, user-specific order history routes
- **Admin panel** already has the CRUD pattern — reusable for order management

### Table Management / QR Per Table
- **What's already there:** Nothing to change
- **What to add:** `?table=3` query param read by frontend, passed as metadata with order

---

## 14. Environment Variables Reference

### `server/.env` (never commit — use `.env.example` as template)
```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/silvertip_cafe

# Authentication
JWT_SECRET=your-minimum-32-character-secret-key-here
JWT_EXPIRES_IN=24h

# Server
PORT=5000
NODE_ENV=development

# Security
ALLOWED_ORIGINS=http://localhost:5173,https://silvertip.vercel.app
```

### `client/.env` (safe to commit if no secrets)
```bash
VITE_API_BASE_URL=http://localhost:5000
```

### Validation Rules (enforced in `config/config.js`)
- `DATABASE_URL` — must be present, must start with `postgresql://`
- `JWT_SECRET` — must be present, must be ≥ 32 characters
- `PORT` — must be a valid port number, defaults to 5000
- App throws a descriptive error at startup if any required variable is missing

---

## 15. Dependency List

### Server (`server/package.json`)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "validator": "^13.11.0",
    "node-cache": "^5.1.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.2"
  }
}
```

### Client (`client/package.json`)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "vite": "^5.0.8",
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "vitest": "^1.1.0",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.2",
    "@testing-library/jest-dom": "^6.1.6",
    "jsdom": "^23.0.1"
  }
}
```

---

*Document generated from Silvertip Cafe menu PDF (3 pages) + design and feature requirements session.*
*All prices exclude GST as per original menu. Architecture designed for future cart, ordering, and payment extension.*