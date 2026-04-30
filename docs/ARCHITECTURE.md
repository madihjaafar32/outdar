# 🏗️ OUTDAR Architecture

## Overview

OUTDAR is a **MERN-stack** social event discovery platform with real-time features and AI assistance.

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  - Vite dev/build · Tailwind · React Router             │
│  - Socket.io-client · Axios · react-i18next             │
│  - Leaflet maps · localStorage for token                │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS + WebSocket
                       │
┌──────────────────────▼──────────────────────────────────┐
│                     Backend (Node)                       │
│  - Express REST API (47 endpoints)                       │
│  - Socket.io (chat + notifications)                      │
│  - JWT auth · Joi validation · Helmet/CORS               │
└──────┬─────────────────┬──────────────────┬─────────────┘
       │                 │                  │
       ▼                 ▼                  ▼
┌──────────────┐  ┌─────────────┐  ┌──────────────────┐
│  MongoDB     │  │  Cloudinary │  │  Anthropic       │
│  Atlas       │  │  (images)   │  │  Claude API      │
│  (8 colls)   │  │             │  │  (AI assistant)  │
└──────────────┘  └─────────────┘  └──────────────────┘
```

---

## Backend Layered Architecture

```
HTTP Request
    ↓
Routes (define paths)
    ↓
Middleware (auth, validation)
    ↓
Controllers (orchestrate)
    ↓
Services (business logic)
    ↓
Models (Mongoose ODM)
    ↓
MongoDB Atlas
```

**Why this structure?** Separation of concerns. Routes are thin, controllers orchestrate, services contain reusable business logic, models handle data.

---

## Authentication Flow

```
1. User submits register/login
2. Backend validates input (Joi)
3. Backend hashes password (bcrypt 10 rounds)
4. Backend creates User in DB
5. Backend signs JWT (HS256, 7-day expiry)
6. Backend returns { user, token }
7. Frontend stores token in localStorage as `outdar_token`
8. Frontend sets up Axios interceptor that injects token in all requests
9. Backend `requireAuth` middleware verifies token on protected routes
```

### Roles
- **user** — default role, can RSVP and chat
- **host** — can create events (granted by admin verification)
- **admin** — full platform access

### Middleware
- `requireAuth` — token must be valid
- `requireRole('host')` — user must have specified role
- `requireOwner('Event')` — user must own the resource

---

## Real-Time (Socket.io)

```
On connect:
   - Authenticate via JWT in handshake
   - Auto-join room `user:<userId>` for personal notifications

User opens an event chat:
   - Emit `join_chat` with eventId
   - Server adds them to `chat:<eventId>` room

User sends message:
   - Emit `send_message` with text
   - Server validates + saves to DB
   - Server broadcasts `message_received` to all in `chat:<eventId>`

Server triggers notification:
   - Emit `notification_received` to specific `user:<userId>`
```

### Events
- `join_chat`, `leave_chat`
- `send_message`, `message_received`
- `typing_start`, `typing_stop`
- `notification_received`
- `event_updated` (for live capacity changes)

---

## AI Chatbot (Claude API)

### Architecture
```
User types message in /ai page
    ↓
Frontend POST /api/ai/message
    ↓
Backend rate-limit check (20/day/user)
    ↓
Load AISession from DB (last 20 messages)
    ↓
Call Anthropic API with:
   - System prompt (OUTDAR personality + guardrails)
   - Conversation history
   - Tool definitions (find_events, get_event_details, etc.)
    ↓
If Claude calls a tool:
   - Backend executes the tool against MongoDB
   - Returns result to Claude
   - Claude continues with full context
    ↓
Stream response back to frontend
    ↓
Frontend renders response + event cards
```

### Tools Available to Claude
1. `find_events(filters)` — query events by category, date, city, etc.
2. `get_event_details(eventId)` — full event info
3. `get_user_rsvps(userId)` — what events user is going to
4. `get_trending_events(city)` — top events this week
5. `get_categories()` — list all categories

### Guardrails
- Cannot make RSVPs on user's behalf
- Cannot delete data
- Cannot send messages on user's behalf
- Always discloses it's an AI

---

## Database Design

8 collections — see `DATABASE.md` for full schemas.

**Indexes for performance:**
- `Users.email` (unique)
- `Events.location` (2dsphere for geospatial)
- `Events.date` (for sorting)
- `Events.category, Events.city` (compound for filtering)
- `Attendances.userId, Attendances.eventId` (compound unique)
- `Messages.eventId, Messages.createdAt` (compound for chat history)
- `Messages.createdAt` (TTL: 7-day auto-delete)

**Soft deletes:** `isDeleted: Boolean` on most collections instead of hard delete.

**Denormalized counters** for speed:
- `Event.attendeeCount` instead of counting Attendances
- `User.eventsHostedCount`, `User.eventsAttendedCount`
- `Event.averageRating`, `Event.reviewCount`

---

## Deployment

```
┌────────────────────┐
│   GitHub (code)    │
└─────────┬──────────┘
          │ on push to main
          ▼
┌────────────────────┐    ┌────────────────────┐
│  Vercel (frontend) │    │  Render (backend)  │
│  - Static build    │    │  - Node.js server  │
│  - CDN-served      │    │  - Sleeps after    │
│  - Free tier       │    │    15min idle      │
│                    │    │  - Free tier       │
└────────────────────┘    └─────────┬──────────┘
                                    │
                                    ▼
                          ┌────────────────────┐
                          │  MongoDB Atlas     │
                          │  (free 512MB)      │
                          └────────────────────┘
```

**Cold-start mitigation for Render free tier:**
- Use [cron-job.org](https://cron-job.org) to ping `/api/health` every 14 minutes
- Keeps server warm for demos/defense

**For Defense Day:**
- Have a screen recording as backup if network fails

---

## Why These Choices?

| Choice | Why | Alternative considered |
|--------|-----|----------------------|
| MongoDB | Flexible schema for events with varied fields | PostgreSQL (less flexible) |
| Mongoose | Schema validation + middleware | Native MongoDB driver |
| JWT (no refresh) | MVP simplicity | JWT + refresh tokens |
| Socket.io | Real-time chat | Server-Sent Events (SSE) |
| Vite | Fast dev server, modern | Create React App (deprecated) |
| Tailwind | Fast styling, design tokens | styled-components |
| react-i18next | Standard, good docs | next-i18next, lingui |
| Leaflet + OSM | Free, no API key needed | Google Maps (paid) |
| Cloudinary free | 25GB free tier | Self-hosted (more work) |
| Render free | $0/month | Heroku (no longer free) |
| Vercel | Best React DX | Netlify |
| Claude Haiku | Cheap, fast, capable | GPT-4o (more expensive) |

---

## Security Highlights

- ✅ Helmet middleware (security headers)
- ✅ CORS configured (only frontend can call)
- ✅ Rate limiting (login, register, AI)
- ✅ Password hashing (bcrypt 10 rounds)
- ✅ JWT secret from environment
- ✅ Joi input validation on all endpoints
- ✅ Mongoose schema validation
- ✅ HTTPS enforced in production (Render/Vercel default)
- ✅ Secrets in `.env` (never committed)
- ✅ NoSQL injection prevented by Mongoose
- ✅ XSS prevented by React's auto-escaping
