# 🧠 OUTDAR Project Context

> **📋 INSTRUCTIONS FOR JAAFAR:**
> At the start of any new AI session, paste this entire file along with `OUTDAR_PROGRESS.md` to give the AI full context. This is your project's memory.

---

## 👤 About the Builder

- **Name:** Jaafar M.
- **Location:** Casablanca, Morocco
- **GitHub:** [@madihjaafar32](https://github.com/madihjaafar32)
- **Email:** madihjaafar6@gmail.com
- **Project:** OUTDAR (final-year graduation project)
- **Stack:** MERN (MongoDB, Express, React, Node)
- **Editor:** VS Code on Windows
- **Node version:** v24.13.0

---

## 🎯 What is OUTDAR?

**OUTDAR** = "outdoor" + Darija "had dar" (outside the house) + "on the radar"

A social event discovery platform for Moroccan youth (18-35), starting with Casablanca and Rabat, scaling to North Africa later.

**Tagline:** *Discover. Connect. Explore.*

**Core Use Cases:**
- 🔍 Discover local events (filter by category, date, location)
- 👥 RSVP and chat with attendees in real-time
- 🎤 Hosts create events; users discover them
- 🤖 AI assistant gives personalized event recommendations
- ⭐ Reviews and ratings after events end

---

## 🏗️ Strategic Decisions (LOCKED)

### Scope (MVP = graduation project)
- ✅ Local event discovery only (no travel/trips in MVP)
- ✅ NO real payments in MVP (free events only)
- ✅ NO ID upload (CNDP/Loi 09-08 risk in Morocco)
  - Instead: admin-granted "Verified Host" badge
- ❌ Friends/social graph → Phase 2
- ❌ Group travel → Phase 3
- ❌ Translations → i18n-ready architecture, but not actually translated yet
- ❌ Ads in MVP, but layouts future-proofed for native sponsored content

### Tech Choices
- ✅ Vite (NOT CRA)
- ✅ Leaflet + OpenStreetMap (NOT Google Maps — free)
- ✅ Mobile-first design with bottom tab bar
- ✅ Dark mode from day one
- ✅ Vertical slice build approach
- ✅ MongoDB Atlas (cloud, free tier)
- ✅ JWT auth (HS256, 7-day expiry, no refresh tokens for MVP)
- ✅ react-i18next for translation infrastructure

### Deployment ($0/month)
- MongoDB Atlas (512MB free)
- Render (backend free tier — sleeps after 15min idle)
- Vercel (frontend free tier)
- Cloudinary (25GB free image hosting)
- Anthropic ($5 free credits, no card)

---

## 🎨 Design System (LOCKED)

### Colors
```
--outdar-red:    #E63946  (primary, brand action)
--outdar-navy:   #0B1220  (dark text, dark mode bg)
--outdar-sky:    #1D9BD6  (secondary, info)
--outdar-green:  #7CB342  (success, sports category)
--outdar-yellow: #FFD93D  (highlights, art category)
--outdar-orange: #F4A261  (warm accent)

Semantic: success/warning/danger/info
10-step neutrals with dark mode invert
```

### Typography
- **Display:** Poppins (700-800 for headings)
- **Body:** Inter (400-600)
- **Mono:** JetBrains Mono (technical text, labels)

### Spacing & Radius
- 4px grid base (Tailwind defaults)
- Border radius: 4/6/8/12/16/20/24/999px

---

## 📦 Architecture

### Database (8 Mongoose Collections)
1. **Users** — name, email, role (user/host/admin), city, verified
2. **Events** — title, host, category, date, location (geo 2dsphere), capacity, price
3. **Attendances** — userId, eventId, status (going/interested/waitlist)
4. **Messages** — eventId, userId, text, createdAt (TTL 7-day auto-delete)
5. **Reviews** — eventId, userId, rating, text
6. **Categories** — name, icon, slug, color
7. **Reports** — polymorphic (target can be event/user/message)
8. **AISessions** — userId, embedded last 20 messages

Geospatial 2dsphere index on Events.location.
Soft deletes everywhere (`isDeleted` flag).
Denormalized counters for speed.

### Backend Structure (MVC + Services)
```
backend/src/
├── config/         # database.js, cloudinary.js
├── models/         # 8 Mongoose schemas
├── controllers/    # business logic for endpoints
├── routes/         # Express route definitions
├── middleware/     # auth, error handler, validators
├── services/       # email, AI (Claude), image upload
├── sockets/        # Socket.io handlers
├── utils/          # helpers, constants
├── validators/     # Joi schemas
└── seeders/        # sample data scripts
```

### Frontend Structure (Vite + React)
```
frontend/src/
├── assets/         # illustrations
├── components/
│   ├── common/     # Button, Input, Modal, etc.
│   ├── layout/     # Navbar, Footer, Sidebar, BottomTabs
│   ├── events/     # EventCard, RSVPCard, Map
│   ├── chat/       # MessageBubble, ChatInput
│   ├── profile/    # ProfileHeader, Stats
│   ├── ai/         # AIChat, AIEventCard
│   └── admin/      # AdminTable, AdminSidebar
├── pages/          # 22 page components
├── context/        # AuthContext, ThemeContext
├── hooks/          # custom React hooks
├── services/       # Axios API client + endpoints
├── utils/          # helpers, constants
├── styles/         # global CSS
└── locales/        # i18n: en/fr/ar
```

### API (47 RESTful Endpoints across 9 Resources)
- **Auth (6)** — register, login, logout, me, change-password, refresh
- **Users (6)** — list, get, update, delete, follow, unfollow
- **Events (8)** — list, get, create, update, delete, /nearby (geospatial), /trending, /search
- **Attendance (5)** — RSVP, cancel, list-by-event, list-by-user, status
- **Messages (3)** — list-by-event, send, delete
- **Reviews (5)** — list, create, update, delete, list-by-user
- **Categories (2)** — list, get
- **AI (4)** — start-session, send-message, list-sessions, delete-session
- **Reports (2)** — create, list (admin)
- **Admin (8)** — stats, verify-host, ban-user, etc.

### Socket.io (3 Features)
1. **Event Chat** — real-time messages in event rooms
2. **Notifications** — RSVP, message, review notifications
3. **Live Event Updates** — capacity changes, host edits

Rooms: `user:<id>` (auto-join on connect), `chat:<eventId>` (join on event open)

### Auth Flow
- bcrypt 10 rounds for password hashing
- JWT with HS256, 7-day expiry
- localStorage key: `outdar_token`
- 3 middleware: `requireAuth`, `requireRole(role)`, `requireOwner`
- 3 React route wrappers: `ProtectedRoute`, `RoleRoute`, `PublicOnlyRoute`

### AI Chatbot (Claude API)
- 4 jobs: Discovery, Host Helper, Social Tips, Platform Guide
- 2 entry points: floating widget + dedicated /ai page
- Tool functions for real DB queries (find_events, get_event_details, etc.)
- Streaming responses with rich event card rendering
- Rate limit: 20 msgs/day/user
- Model: Claude Haiku for cost control
- Total demo cost estimate: $0.50-2

---

## 🎨 Brand Assets

Located in `/frontend/public/logos/`:
- `outdar-full-light.png` — full logo (light mode), 1000x1000
- `outdar-full-dark.png` — full logo (dark mode), 1001x1000
- `outdar-mark-light.png` — icon only, 250x251
- `outdar-mark-dark.png` — icon only, 251x251
- `favicon-light.png`, `favicon-dark.png`, `og-image.png`

Located in `/frontend/src/assets/`:
- `casablanca-skyline.png` — Hassan II Mosque + Casa skyline (About hero)
- `outdar-journey.png` — Door → path → mountains → sunrise with red mascot (About story)

---

## 🛣️ Build Plan: Vertical Slices

```
✅ Slice 1: Project Setup (folders, configs, "hello world")
⏳ Slice 2: Authentication (User model + register/login + JWT + AuthContext)
⏳ Slice 3: Events (CRUD + browse page renders real data)
⏳ Slice 4: RSVP (Attendance model + going/interested logic)
⏳ Slice 5: Reviews (after events end)
⏳ Slice 6: Real-time chat (Socket.io)
⏳ Slice 7: AI chatbot integration
⏳ Slice 8: Admin pages
⏳ Slice 9: Polish + Deploy
```

---

## 📋 Working Style Preferences

- **Step-by-step**, not big code drops
- **Explain WHY**, not just HOW
- **Catch errors early** — test after each change
- **Vertical slices** — each slice is shippable on its own
- **Commit often** to git after each working feature
- **Push to GitHub** after each slice completes

---

## 🔐 Secrets / Env Vars

Stored in `.env` files (NEVER committed). Templates in `.env.example`.

**Backend needs:**
- `MONGODB_URI` (Atlas connection string)
- `JWT_SECRET` (32+ char random)
- `CLOUDINARY_*` (cloud_name, api_key, api_secret) — added later
- `ANTHROPIC_API_KEY` — added later

**Frontend needs:**
- `VITE_API_URL` (default: http://localhost:5000/api)
- `VITE_SOCKET_URL` (default: http://localhost:5000)

---

## 📚 Reference Documents Already Built

In Phase B, we built 7 interactive HTML showcases (saved in Jaafar's local files):
1. `outdar-design-system.html` — colors, fonts, tokens
2. `outdar-brand-magic.html` — animations, magic moments
3. `outdar-component-library.html` — 30+ components
4. `outdar-layout-system.html` — navbars, sidebars, footers
5. `outdar-public-pages.html` — landing, login, register, about, 404
6. `outdar-app-pages.html` — 8 logged-in pages
7. `outdar-admin-pages.html` — 7 admin pages

These define the visual target for the React implementation.

---

## ⚠️ Things to Remember

- Jaafar is a **patient learner** who appreciates explanation
- He **trusts the AI's design judgment** but pushes back when something feels off
- Sessions can be **interrupted** — always check `OUTDAR_PROGRESS.md` for what's done
- He prefers **visual demos over text walls**
- Everything must serve **graduation defense** as the primary goal
- $0 budget — every paid service must have a free tier

---

*Last updated at start of Slice 1. Update this doc when major architectural decisions change.*
