# OUTDAR Backend

Node.js + Express + MongoDB + Socket.io API for OUTDAR.

## 📁 Structure

```
backend/
├── src/
│   ├── config/        # DB, Cloudinary configs
│   ├── models/        # 8 Mongoose schemas
│   ├── controllers/   # Logic for endpoints
│   ├── routes/        # Express route definitions
│   ├── middleware/    # Auth, validation, errors
│   ├── services/      # Email, AI, image upload
│   ├── sockets/       # Real-time chat handlers
│   ├── utils/         # Helpers, constants
│   ├── validators/    # Joi input validation
│   └── seeders/       # Sample data scripts
├── .env.example       # Env vars template
├── server.js          # Entry point
└── package.json
```

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
# Windows
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

Then open `.env` and fill in:
- `MONGODB_URI` — Your MongoDB Atlas connection string
- `JWT_SECRET` — Any random 32+ character string
- `CLOUDINARY_*` — Sign up free at [cloudinary.com](https://cloudinary.com) (later)
- `ANTHROPIC_API_KEY` — Get from [console.anthropic.com](https://console.anthropic.com) (later)

### 3. Run dev server
```bash
npm run dev
```

Server starts on `http://localhost:5000`

You should see:
```
╔════════════════════════════════════════╗
║   🚪  OUTDAR API SERVER STARTED        ║
╠════════════════════════════════════════╣
║   📡 Port:        5000                 ║
║   🌍 Environment: development          ║
║   🔗 URL:         http://localhost:5000 ║
╚════════════════════════════════════════╝
```

## 🧪 Test the API

Open in browser:
- `http://localhost:5000` — Welcome message
- `http://localhost:5000/api/health` — Health check

## 📜 Scripts

- `npm run dev` — Start with auto-reload (nodemon)
- `npm start` — Production mode
- `npm run seed` — Populate database with sample data (Slice 2+)

## 🔐 Security Notes

- ✅ `.env` is git-ignored, never commit it
- ✅ Use strong JWT secrets (32+ characters)
- ✅ Rotate secrets if accidentally exposed
- ✅ Use environment variables for ALL secrets
