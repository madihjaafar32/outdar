# 🚀 OUTDAR — First Setup Guide

Welcome, Jaafar! You just unzipped the OUTDAR project. Follow these steps to get it running on your machine. **Take it slow — one step at a time.**

---

## ✅ Step 1: Verify the Folder

Open VS Code:
1. **File → Open Folder...**
2. Navigate to: `C:\Users\Poste\Documents\projects\outdar`
3. Click **Select Folder**

You should see this structure in the VS Code sidebar:
```
outdar/
├── backend/
├── frontend/
├── docs/
├── .gitignore
├── README.md
└── SETUP.md  ← you're reading this
```

---

## ✅ Step 2: Open the Terminal in VS Code

Press: `` Ctrl + ` `` (Ctrl + backtick)

You'll see a terminal at the bottom showing:
```
PS C:\Users\Poste\Documents\projects\outdar>
```

---

## ✅ Step 3: Install Backend Dependencies

In the terminal:
```bash
cd backend
npm install
```

⏰ This takes 1-2 minutes. You'll see lots of text scroll by. Wait for it to finish.

When done, you'll see something like:
```
added 234 packages in 45s
```

---

## ✅ Step 4: Configure Backend .env

In the terminal (still in `backend/`):
```bash
copy .env.example .env
```

Now find the file `backend/.env` in VS Code's sidebar and **click to open it**.

You need to fill in TWO values:

### 🔐 4a. MONGODB_URI

Replace the placeholder with YOUR Atlas connection string:
```
MONGODB_URI=mongodb+srv://madihjaafar32:YOUR_NEW_PASSWORD@merncluster.xchvka3.mongodb.net/outdar?retryWrites=true&w=majority
```

⚠️ **IMPORTANT:**
- Use the NEW password you just rotated
- Add `/outdar` after `.net` — this names your database
- Keep the `?retryWrites=true&w=majority` part

### 🔐 4b. JWT_SECRET

Replace `your_super_secret_jwt_key_change_this...` with a strong random string.

**Easy way:** Just type 40+ random characters, like:
```
JWT_SECRET=k8Hp2nQv9Wx3LmZ5rT7yU1iO4eA6sD0fGbCjEhRnMpVxXyZwQ
```

The other values (`CLOUDINARY_*`, `ANTHROPIC_API_KEY`) can stay as placeholders for now — we'll fill them in later slices.

**Save the file** (`Ctrl + S`).

---

## ✅ Step 5: Whitelist Your IP in MongoDB Atlas

This is critical — Atlas blocks all IPs by default for security.

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign in
3. Left sidebar → **Network Access**
4. Click **+ ADD IP ADDRESS**
5. Click **ALLOW ACCESS FROM ANYWHERE** (for development)
6. Click **Confirm**

⚠️ "Allow from anywhere" is fine for development. For production we'd whitelist specific IPs.

---

## ✅ Step 6: Boot the Backend

In the terminal (still in `backend/`):
```bash
npm run dev
```

If everything is right, you'll see:
```
✅ MongoDB Connected: ac-xxxxx-shard-...
📦 Database: outdar

╔════════════════════════════════════════╗
║   🚪  OUTDAR API SERVER STARTED        ║
╠════════════════════════════════════════╣
║   📡 Port:        5000                 ║
║   🌍 Environment: development          ║
║   🔗 URL:         http://localhost:5000 ║
╚════════════════════════════════════════╝
```

🎉 **Backend is running!**

**Test it:** Open `http://localhost:5000/api/health` in your browser.

You should see:
```json
{
  "success": true,
  "message": "🚪 OUTDAR API is running",
  ...
}
```

**Leave this terminal running.** Don't close it.

---

## ✅ Step 7: Install Frontend Dependencies

**Open a NEW terminal in VS Code:**
- Click the **+** icon in the terminal panel
- Or press `Ctrl + Shift + ` ` (Ctrl + Shift + backtick)

In the new terminal:
```bash
cd frontend
npm install
```

⏰ This takes 2-3 minutes.

---

## ✅ Step 8: Configure Frontend .env

In the new terminal (in `frontend/`):
```bash
copy .env.example .env
```

The default values work fine — no editing needed for local dev.

---

## ✅ Step 9: Boot the Frontend

In the terminal (in `frontend/`):
```bash
npm run dev
```

You'll see:
```
  VITE v6.0.7  ready in 543 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Open `http://localhost:5173` in your browser.**

You should see the **OUTDAR Slice 1 splash screen** with three status cards showing:
- 🟢 Frontend: Vite + React (connected)
- 🟢 Backend API: **Connected** (this proves your backend is reachable!)
- 🟢 Database: MongoDB Atlas

🎉🎉🎉 **YOU'RE OFFICIALLY RUNNING OUTDAR!**

---

## ✅ Step 10: Initialize Git

**Open a THIRD terminal** (back in the root `outdar/` folder):

Click **+** for new terminal, then:
```bash
cd ..
```
(if you're inside backend/ or frontend/)

Then:
```bash
git init
git add .
git commit -m "feat: Slice 1 — Project setup with backend + frontend + docs"
```

---

## ✅ Step 11: Push to GitHub

### 11a. Create the Repo

Go to [github.com/new](https://github.com/new):
- **Repository name:** `outdar`
- **Visibility:** Private (or Public, your choice)
- **DO NOT** initialize with README (we already have one)
- Click **Create repository**

### 11b. Connect & Push

GitHub will show you commands. Run THESE in your terminal:

```bash
git remote add origin https://github.com/madihjaafar32/outdar.git
git branch -M main
git push -u origin main
```

You may be prompted to authenticate with GitHub. Follow the prompts.

🎉 Your code is on GitHub!

---

## ✅ Slice 1 Complete!

You now have:
- ✅ Two terminals running (backend + frontend)
- ✅ Browser showing the OUTDAR splash screen
- ✅ MongoDB Atlas connected
- ✅ Code pushed to GitHub
- ✅ Memory documents in `docs/` for future sessions

---

## 🆘 Troubleshooting

### "Backend API: Disconnected"
- Make sure backend terminal still shows "OUTDAR API SERVER STARTED"
- Check `backend/.env` — `MONGODB_URI` correct?
- Did you whitelist your IP in Atlas?
- Visit `http://localhost:5000/api/health` directly — does it work?

### "MongoDB connection failed"
- Connection string format wrong?
- Password contains special chars? Use URL-encoding: `@` becomes `%40`, etc.
- IP whitelisted?
- New password actually saved in Atlas?

### "npm install" fails
- Try: `npm cache clean --force` then `npm install` again
- Make sure you're in the right folder (`backend/` or `frontend/`)

### "code ." command doesn't work
- Open VS Code manually: File → Open Folder
- Or install command from VS Code: `Ctrl+Shift+P` → "Shell Command: Install 'code'"

---

## 🎯 Next Step

When everything works → **start a new chat with the AI, and paste:**

1. The contents of `docs/OUTDAR_CONTEXT.md`
2. The contents of `docs/OUTDAR_PROGRESS.md`
3. Say: *"Slice 1 is done and verified. Let's start Slice 2 — Authentication."*

That's how we resume across sessions without losing context.

---

**Welcome to OUTDAR development, my friend! 🇲🇦💙**
