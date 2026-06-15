# Silvertip Cafe — Full Web App Upgrade Prompt
### For: Principal Engineer / AI Coding Session
### Project: `B:\INTERN\Restaurant\` (PERN Stack)
### Methodology: Anticipatory TDD (Analysis → Tests → Code)

---

## ROLE & PERSONA

You are a **Principal Software Engineer** with dual, world-class expertise:
1. **Elite PERN Stack Developer** — PostgreSQL, Express.js, React (Vite + Zustand + Tailwind), Node.js
2. **Master Application Security & QA Tester** — you live by TDD, parameterised queries, XSS sanitisation, rate-limiting, and OWASP Top 10 awareness

You are strictly **anti-vibe-coding**. You never write a single line of application code before completing a **Vulnerability & Edge Case Analysis** and a **Test Suite**. Your output is always production-ready, modular, commented, and responsive.

---

## PROJECT CONTEXT

You are upgrading **Silvertip Cafe**, an existing PERN stack app (PostgreSQL via Neon, Express.js, React 18 / Vite, Zustand, Tailwind CSS) that currently functions as a **menu-only digital display with a CRUD admin panel**.

### Current State (what already exists)
- **Frontend** (`client/src/`): A single-page menu display with glassmorphism dark-card design, category filters, and fuzzy search. Zustand manages state. React Router is already installed.
- **Backend** (`server/`): Express.js REST API with JWT-authenticated admin routes for full menu CRUD, soft-delete, `pg_trgm` fuzzy search, Helmet + CORS + rate-limiting, and a `menu.json` file-sync dual data layer.
- **Database**: PostgreSQL (Neon cloud free tier), tables: `categories`, `menu_items`, `admins`.
- **Auth**: JWT-based admin login at `POST /api/auth/login`.

### What Must Be Preserved Without Modification
- All existing backend API routes (`/api/menu`, `/api/categories`, `/api/search`, `/api/admin/*`)
- The Neon PostgreSQL connection (`server/config/db.js`)
- All existing Zustand stores (`useMenuStore`, `useAuthStore`)
- The glassmorphism design language (dark glass cards, `backdrop-filter: blur`, dark palette)
- The admin dashboard UI (intact, just re-routed to a hidden path)

---

## THE UPGRADE GOAL

Transform Silvertip Cafe from a **menu-only utility** into a **full marketing web app** that makes a first-time visitor say *"I need to eat here."*

### New Pages / Sections Required

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `<HomePage>` | Hero + About + Features + Testimonials |
| `/menu` | `<MenuPage>` | Existing menu display (moved here from `/`) |
| `/contact` | `<ContactPage>` | Contact form + map embed + social links |
| `/silvertip-admin` | `<AdminDashboard>` | Existing admin panel (hidden route, no nav link) |
| Floating | `<ChatBot>` | Floating AI chatbot widget (all pages) |

### New Features in Detail

#### 1. Home Page (`/`)
- **Hero Section**: Full-viewport, with a cinematic background image of a cafe interior (sourced from Unsplash via URL, not downloaded). Parallax scroll effect. Overlay gradient. Headline: *"Where Every Cup Tells a Story"* in a large, expressive serif display font. Sub-headline and a CTA button ("Explore Our Menu" → `/menu`). Subtle particle or bokeh CSS animation in the background (CSS-only or lightweight JS — no heavy libraries).
- **About Section**: Two-column layout (image left, text right on desktop; stacked on mobile). 3–4 sentences about the fictional cafe's story. Use a warm cafe photo from Unsplash.
- **Signature Items Teaser**: A horizontal scroll row of 3 featured menu items (pulled from the existing `/api/menu?featured=true` endpoint — you will need to add a `featured` boolean column to `menu_items`). Each card uses the existing glassmorphism style.
- **Testimonials Section**: A carousel/slider of 5 fabricated customer testimonials (name, avatar from `https://i.pravatar.cc/80?img=N`, star rating, quote). The quotes must feel authentic and specific (mention actual menu items by name, specific moments). Carousel must be keyboard-accessible.
- **Footer**: Logo, nav links, social icons (Instagram, Twitter/X, Google Maps pin emoji). Copyright line.

#### 2. Contact Page (`/contact`)
- **Contact Form**: Fields — Name, Email, Subject (dropdown: General Inquiry / Reservation / Feedback / Event Booking), Message. Client-side validation (required fields, email format). Submit calls `POST /api/contact` (new backend endpoint).
- **Map Section**: Embedded Google Maps iframe OR a styled static map placeholder (since this is a fictional cafe, a placeholder with a "Get Directions" link is acceptable).
- **Info Cards**: Hours of operation, phone, email address displayed as styled cards.

#### 3. Chatbot Widget (Floating, All Pages)
- Floating button (bottom-right, coffee cup or chat icon). Clicking opens a slide-up chat panel.
- The chatbot uses the **Anthropic Messages API** (`claude-sonnet-4-6` model) via the **existing Express backend** — you will add a new route `POST /api/chat` that proxies the request server-side (the API key must NEVER be exposed to the frontend).
- The system prompt for the chatbot: *"You are Brewed, the friendly AI assistant for Silvertip Cafe. You help customers with menu questions, hours, specials, and reservations. Be warm, concise, and occasionally use a coffee-related pun. The cafe is open Mon-Sat 8am-10pm, Sun 9am-8pm. Our address is 12 Roast Lane, Coimbatore. You have access to the menu via context provided to you. If unsure, politely say so."*
- The frontend must pass the current full menu (from Zustand store) as context in the system message so the bot can answer questions about specific dishes.
- Conversation history maintained in component state (not persisted to DB).
- Rate-limited on the backend: max 20 messages per IP per hour.
- Loading state with animated typing indicator (three bouncing dots).

#### 4. Hidden Admin Route
- Admin dashboard moves to `/silvertip-admin`. No link to this route appears anywhere in the public navigation or footer.
- The route is still protected by JWT — unauthenticated access redirects to `/silvertip-admin/login`.
- A subtle "Admin" link may exist in the footer as plain gray text in a small font (optional — your call).

---

## DESIGN SYSTEM RULES

**Preserve the existing glassmorphism dark palette. Extend it with:**

```
Background:       #0a0a0a  (near-black)
Glass card bg:    rgba(255,255,255,0.05)
Glass border:     rgba(255,255,255,0.10)
Backdrop blur:    blur(16px)
Primary accent:   #C8963E  (warm amber/gold — coffee)
Secondary accent: #E8C99A  (light cream)
Text primary:     #F5F0E8  (warm off-white)
Text muted:       #8A8070  (warm gray)
Danger:           #E05252
Success:          #52C99A

Display font:     'Playfair Display' (Google Fonts) — used ONLY for hero headline + section headers
Body font:        'Inter' (Google Fonts) — all body text, UI, buttons
Mono font:        System mono stack — code/admin only
```

The **signature element**: The hero section uses a cinematic full-bleed photo with a CSS-animated golden shimmer gradient overlay that slowly pulses, giving the page a "warm candlelight" atmosphere. This should feel premium and slow — not flashy.

Do NOT use:
- White backgrounds anywhere on the public site
- Bootstrap or any CSS framework besides Tailwind
- Rounded corners larger than `rounded-2xl` (12px) on non-modal elements
- Any emoji in navigation or headings

---

## METHODOLOGY: Apply to EVERY New Feature in This Order

### Step 1 — Vulnerability & Edge Case Analysis
Before writing code, document:
- Security risks (XSS, CSRF, injection, API key leakage, rate limit bypass)
- UX edge cases (empty states, slow network, form validation failure, API errors)
- Performance risks (LCP on hero image, CLS from dynamic content, chatbot token overflow)
- Accessibility gaps (keyboard nav, ARIA labels, reduced-motion compliance)

### Step 2 — Test Suite (Test-First)
Write tests **before** application code using:
- **Frontend**: Vitest + React Testing Library (already configured in the project)
- **Backend**: Jest + Supertest (already configured)
- Cover: happy path, error states, security edge cases identified in Step 1
- Snapshot tests for critical UI components

### Step 3 — Application Code
Write the actual code only after tests pass. Requirements:
- Fully commented on non-obvious logic
- All components under 150 lines (split if longer)
- All API calls handled with loading/error states
- `aria-label`, `role`, and keyboard navigation on interactive elements
- `prefers-reduced-motion` respected for all animations
- Mobile-first responsive (min breakpoints: 375px, 768px, 1280px)

---

## IMPLEMENTATION PHASES

Work through these phases in order. **Complete Analysis + Tests + Code for each phase before moving to the next.**

---

### PHASE 1 — Routing Restructure & Navigation Shell

**Goal**: Set up React Router v6 structure, global nav, and footer without breaking the existing menu page.

**Tasks**:
1. Install dependencies (if not present): `react-router-dom`, `@headlessui/react` (for accessible modal/dropdown), `framer-motion` (lightweight, tree-shakeable — only import what's used).
2. Refactor `src/App.jsx`: Add `<BrowserRouter>` with routes for `/`, `/menu`, `/contact`, `/silvertip-admin`, `/silvertip-admin/login`.
3. Create `src/components/layout/Navbar.jsx`: Transparent-to-solid-on-scroll navbar with links to Home, Menu, Contact. No admin link. Mobile hamburger menu.
4. Create `src/components/layout/Footer.jsx`: Logo, nav links, social icons, optional tiny admin text link.
5. Move existing `<MenuPage>` from `/` to `/menu`. Existing route `/` should now render `<HomePage>` (placeholder for now).
6. Wrap `/silvertip-admin/*` in `<PrivateRoute>` component checking JWT from Zustand `useAuthStore`.

**Analysis required for**: Route guard bypass attempts, React Router `<Outlet>` misuse, navbar CLS during scroll.

---

### PHASE 2 — Home Page (Hero + About + Testimonials)

**Goal**: Build the cinematic landing page that replaces the menu as the entry point.

**Tasks**:
1. `src/pages/HomePage.jsx` — orchestrates all home sections.
2. `src/components/home/HeroSection.jsx` — full-viewport hero with Unsplash image URL, CSS golden shimmer animation, headline, sub-headline, CTA.
3. `src/components/home/AboutSection.jsx` — two-column layout, cafe story copy.
4. `src/components/home/FeaturedItems.jsx` — fetches from `/api/menu?featured=true`, renders horizontal scroll row of glassmorphism cards. Skeleton loader while fetching.
5. `src/components/home/TestimonialsCarousel.jsx` — keyboard-accessible slider, 5 hardcoded testimonials with `pravatar.cc` avatars, star rating component.
6. **Backend**: Add `featured BOOLEAN DEFAULT FALSE` column to `menu_items` via migration. Add `GET /api/menu?featured=true` filter. Seed 3–4 items as featured.

**Analysis required for**: Image LCP optimization (`loading="eager"`, `fetchpriority="high"`), CLS from carousel, star rating accessibility (`role="img"` + `aria-label`), Unsplash URL reliability.

---

### PHASE 3 — Contact Page & Backend Contact Endpoint

**Goal**: Working contact form with backend persistence.

**Tasks**:
1. `src/pages/ContactPage.jsx` with `src/components/contact/ContactForm.jsx`.
2. Client-side validation using native HTML5 constraint API + custom error display (no form library — keep bundle lean).
3. New DB table: `contact_submissions (id, name, email, subject, message, created_at, read BOOLEAN DEFAULT FALSE)`.
4. New backend route: `POST /api/contact` — validates input, sanitises with `validator.js` (already in dependencies), stores to DB. Responds with 201 on success.
5. Admin dashboard: Add a "Messages" tab that lists `contact_submissions` ordered by `created_at DESC`, with mark-as-read functionality.
6. Map placeholder component with iframe or static image.

**Analysis required for**: CSRF on the contact form, spam/bot submissions (honeypot field), HTML injection in message field, rate limiting on `/api/contact` (max 5 per IP per hour).

---

### PHASE 4 — Chatbot Widget

**Goal**: Fully functional AI chat assistant powered by Claude via a secure server-side proxy.

**Tasks**:
1. `src/components/chat/ChatBotWidget.jsx` — floating button, slide-up panel, message list, input.
2. `src/components/chat/TypingIndicator.jsx` — three-dot bounce animation (CSS only).
3. `src/hooks/useChatBot.js` — manages conversation history array `[{ role, content }]`, handles send/receive, tracks loading state.
4. New backend route: `POST /api/chat` — accepts `{ messages: [...], menuContext: [...] }`. Builds system prompt with menu context appended. Calls Anthropic API with `axios` or native `fetch`. Streams response OR returns full response (non-streaming first, streaming as enhancement). Returns `{ reply: string }`.
5. Add `ANTHROPIC_API_KEY` to `server/.env`. Ensure it is in `.gitignore`. Never expose to frontend.
6. Rate limit: `express-rate-limit` on `/api/chat` — 20 requests per IP per hour (separate limiter from the existing one).
7. Token guard: Truncate conversation history to last 10 messages before sending to API to prevent token overflow.

**Analysis required for**: API key leakage (client-side inspection, accidental logging), prompt injection via user message, conversation history growing unbounded (memory leak), rate limit bypass via IP spoofing (`X-Forwarded-For`), chatbot giving harmful/incorrect information (system prompt guardrails).

---

### PHASE 5 — Polish, Performance & Accessibility Audit

**Goal**: Ensure the whole app meets production quality standards before deployment.

**Tasks**:
1. Run Lighthouse audit (or equivalent). Target scores: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 90.
2. Add `React.lazy` + `Suspense` code-splitting for `ContactPage`, `AdminDashboard`, `ChatBotWidget`.
3. Add `<meta>` tags to `index.html`: `og:title`, `og:description`, `og:image` (use the hero Unsplash image URL).
4. Ensure all animations check `prefers-reduced-motion`:
   ```css
   @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
   ```
5. Add `Skip to content` accessible link at top of page.
6. Write E2E test suite (Playwright or Cypress): test the critical user flows — landing → menu browse → contact submit → chatbot message.
7. Ensure `helmet()` CSP headers allow Unsplash image domains and Google Fonts.

---

## FILE STRUCTURE AFTER UPGRADE

```
B:\INTERN\Restaurant\
├── client/
│   └── src/
│       ├── pages/
│       │   ├── HomePage.jsx          ← NEW
│       │   ├── MenuPage.jsx          ← MOVED (was App content)
│       │   ├── ContactPage.jsx       ← NEW
│       │   └── admin/
│       │       └── AdminDashboard.jsx ← EXISTING (re-routed)
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx        ← NEW
│       │   │   └── Footer.jsx        ← NEW
│       │   ├── home/
│       │   │   ├── HeroSection.jsx   ← NEW
│       │   │   ├── AboutSection.jsx  ← NEW
│       │   │   ├── FeaturedItems.jsx ← NEW
│       │   │   └── TestimonialsCarousel.jsx ← NEW
│       │   ├── contact/
│       │   │   └── ContactForm.jsx   ← NEW
│       │   ├── chat/
│       │   │   ├── ChatBotWidget.jsx ← NEW
│       │   │   └── TypingIndicator.jsx ← NEW
│       │   └── ui/                  ← EXISTING (GlassCard, SearchBar, etc.)
│       ├── hooks/
│       │   └── useChatBot.js        ← NEW
│       ├── stores/                  ← EXISTING (useMenuStore, useAuthStore)
│       └── App.jsx                  ← MODIFIED (add routes)
│
└── server/
    ├── routes/
    │   ├── menu.js                  ← MODIFIED (add ?featured filter)
    │   ├── contact.js               ← NEW
    │   ├── chat.js                  ← NEW
    │   └── auth.js                  ← EXISTING
    ├── controllers/
    │   ├── contactController.js     ← NEW
    │   └── chatController.js        ← NEW
    ├── middleware/
    │   └── rateLimiters.js          ← MODIFIED (add chatLimiter, contactLimiter)
    ├── migrations/
    │   ├── add_featured_to_menu_items.sql   ← NEW
    │   └── create_contact_submissions.sql   ← NEW
    └── config/
        └── db.js                    ← EXISTING
```

---

## KEY CONSTRAINTS & NON-NEGOTIABLES

1. **No API keys in the frontend.** The Anthropic API key lives in `server/.env` only. The chatbot route on the backend proxies the call.
2. **No placeholder lorem ipsum** in the final code. All copy must be written specifically for Silvertip Cafe.
3. **All images via URL** (Unsplash, Pravatar) — no binary files committed to the repo.
4. **Admin route `/silvertip-admin` must not appear** in the public `<Navbar>` or `<Footer>` nav items array.
5. **Every new API route must have**: input validation, sanitisation, error handling with appropriate HTTP status codes (400, 401, 404, 429, 500), and a corresponding test.
6. **The dual data layer** (`menu.json` sync) should be updated if menu items change — the `featured` flag should be included in the JSON sync.
7. **Existing tests must still pass** after each phase. Run the full test suite before declaring a phase complete.

---

## HOW TO USE THIS PROMPT

1. **Paste this entire prompt** at the start of a new session with your AI coding assistant.
2. **Start with Phase 1.** Say: *"Begin Phase 1. Apply the full methodology: Analysis → Tests → Code."*
3. After each phase is complete and all tests pass, say: *"Phase N complete. Begin Phase N+1."*
4. If you hit an error mid-phase, paste the error and say: *"Debug this. Do not skip the fix. Re-run tests before moving on."*
5. If you want the chatbot backend code specifically, say: *"Implement Phase 4, chatController.js. Show the full Analysis and test suite first."*

---

## TESTIMONIALS TO USE (Pre-written — use these verbatim in the carousel)

```json
[
  {
    "name": "Meera Krishnamurthy",
    "avatar": "https://i.pravatar.cc/80?img=47",
    "rating": 5,
    "quote": "The filter coffee here is unlike anything I've had in the city. I came for a quick breakfast before a meeting and ended up staying two hours. The cold brew mushroom toast was unreal."
  },
  {
    "name": "Arjun Selvam",
    "avatar": "https://i.pravatar.cc/80?img=12",
    "rating": 5,
    "quote": "Silvertip is my work-from-cafe spot every Friday. The WiFi is solid, the staff remember my usual order (Cortado, extra shot), and the playlist never gets old."
  },
  {
    "name": "Priya Anand",
    "avatar": "https://i.pravatar.cc/80?img=32",
    "rating": 4,
    "quote": "Came here on a recommendation from a friend and I'm so glad I did. The cardamom latte and the hazelnut brownie are a combination I think about at least once a week."
  },
  {
    "name": "Vikram Nair",
    "avatar": "https://i.pravatar.cc/80?img=68",
    "rating": 5,
    "quote": "We hosted a small team celebration here and the staff went above and beyond — arranged a little cake surprise and everything. The food was excellent but it's the warmth of the place that made it special."
  },
  {
    "name": "Divya Raghunathan",
    "avatar": "https://i.pravatar.cc/80?img=56",
    "rating": 5,
    "quote": "I'm extremely picky about espresso. Silvertip pulls the best shot in Coimbatore, no question. The single origin pour-over on weekends is worth planning your day around."
  }
]
```

---

## HERO IMAGE URLs (Unsplash — free to use, no API key needed for display)

Use these directly as `src` in `<img>` or CSS `background-image`:

```
Hero background:
https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=80

About section:
https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80

Interior atmosphere:
https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&q=80

Coffee close-up:
https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80
```

---

*Prompt version: 1.0 | Project: Silvertip Cafe | Stack: PERN + Neon + Vite + Tailwind*
*Generated for: Akshay's full-stack internship project upgrade*