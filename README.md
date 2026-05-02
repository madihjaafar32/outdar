# 🚪 OUTDAR

**Discover. Connect. Explore.**

A social event discovery platform built for Morocco's youth — find local events, RSVP in one tap, chat with attendees, and never miss a moment worth living.

> 🇲🇦 Built in Casablanca, for Casablanca (and beyond).

---

## 🎯 What is OUTDAR?

OUTDAR ("outdoor" + Darija "dar" / "outside the house" + "on the radar") is a MERN-stack web application that helps young Moroccans discover and join local events:

- 🔍 **Discover** — Browse events by category, location, and date
- 👥 **Connect** — RSVP and chat with other attendees in real-time
- 🎉 **Explore** — Build your social life around shared experiences
- 🤖 **AI-Powered** — Personal event recommendations via Claude AI

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- React Router
- Tailwind CSS
- Socket.io Client
- Axios
- react-i18next (i18n-ready: EN, FR, AR)

**Backend**
- Node.js + Express
- MongoDB Atlas + Mongoose
- Socket.io
- JWT authentication
- Cloudinary (image hosting)
- Anthropic Claude API (AI assistant)

**Infrastructure**
- MongoDB Atlas (free tier)
- Vercel (frontend deploy)
- Render (backend deploy)
- Cloudinary (image CDN)

---

## 📁 Project Structure

```
outdar/
├── backend/         # Node.js + Express + MongoDB API
├── frontend/        # React + Vite + Tailwind UI
├── docs/            # Architecture, API, schema docs
└── README.md
```

See `backend/README.md` and `frontend/README.md` for setup instructions.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- Git
- A free [MongoDB Atlas](https://cloud.mongodb.com) account
- (Optional) An Anthropic API key for AI features

### Installation

```bash
# Clone the repo
git clone https://github.com/madihjaafar32/outdar.git
cd outdar

# Backend setup
cd backend
npm install
cp .env.example .env  # Then edit .env with your secrets
npm run dev

# Frontend setup (new terminal)
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`
Frontend runs on `http://localhost:5173`

---

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) — System design overview
- [API Reference](docs/API.md) — All 47 endpoints
- [Database Schema](docs/DATABASE.md) — MongoDB collections
- [Roadmap](docs/ROADMAP.md) — What's built, what's next
- [Project Context](docs/OUTDAR_CONTEXT.md) — Decisions & rationale

---

## 👤 Author

**Jaafar M.** ([@madihjaafar32](https://github.com/madihjaafar32))
MERN stack developer · Casablanca, Morocco
Final-year graduation project · 2026

---

## 📜 License

MIT — Free to learn from, fork, and adapt.

---

## 🌟 Status

🟢 **Phase A:** Architecture — DONE
🟢 **Phase B:** UI/UX Design — DONE
🟡 **Phase C:** Code Scaffold — IN PROGRESS
⚪ **Phase D:** Feature Implementation — UPCOMING
