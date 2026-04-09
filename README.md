# ⚔ SYSTEM: Arise — Full Stack Setup Guide
*A Solo Leveling–inspired habit tracker RPG*

---

## 📁 Folder Structure

```
system-arise/
│
├── backend/                    ← The SERVER (handles data & login)
│   ├── server.js               ← Main server file (run this to start)
│   ├── database.js             ← Database setup (SQLite)
│   ├── routes/
│   │   ├── auth.js             ← Login & signup logic
│   │   └── data.js             ← Save & load game data
│   ├── middleware/
│   │   └── auth.js             ← Token verification
│   ├── package.json            ← List of required packages
│   ├── .env.example            ← Template for your settings
│   └── system_arise.db         ← SQLite database (auto-created)
│
├── frontend/
│   └── index.html              ← The APP (open this in your browser)
│
└── README.md                   ← This file
```

---

## 🚀 How to Run — Step by Step

### Step 1: Install Node.js
1. Go to **https://nodejs.org**
2. Download the **LTS version** (green button)
3. Install it (just click Next → Next → Finish)
4. To verify: open Terminal/Command Prompt and type `node --version`
   - You should see something like `v20.x.x`

---

### Step 2: Set Up the Backend

**Open a Terminal / Command Prompt:**

> On Windows: Press `Windows + R`, type `cmd`, press Enter  
> On Mac: Press `Cmd + Space`, type `Terminal`, press Enter

Then run these commands one by one:

```bash
# 1. Go into the backend folder
cd path/to/system-arise/backend

# 2. Install all required packages (only needed once)
npm install

# 3. Create your settings file
copy .env.example .env        # Windows
cp .env.example .env          # Mac/Linux
```

**4. Edit the `.env` file** (open with Notepad or any text editor):
```
PORT=3000
JWT_SECRET=write_any_long_random_text_here_like_abc123xyz456
JWT_EXPIRES_IN=7d
DB_PATH=./system_arise.db
FRONTEND_URL=http://127.0.0.1:5500
```

> ⚠️ Change `JWT_SECRET` to something random — this keeps your users' data secure!

**5. Start the backend server:**
```bash
node server.js
```

You should see:
```
  [SYSTEM ONLINE] Server running at http://localhost:3000
  [API READY]     http://localhost:3000/api/health
```

✅ **Leave this terminal window open while using the app.**

---

### Step 3: Open the Frontend

**Option A — VS Code Live Server (Recommended):**
1. Download VS Code: **https://code.visualstudio.com**
2. Install the **Live Server** extension (search in Extensions tab)
3. Open the `frontend/` folder in VS Code
4. Right-click `index.html` → **"Open with Live Server"**
5. It opens at `http://127.0.0.1:5500`

**Option B — Just double-click:**
1. Open `frontend/index.html` directly in your browser
2. If you do this, edit `.env` and set: `FRONTEND_URL=null`

---

### Step 4: Use the App

1. Go to `http://127.0.0.1:5500` (or wherever it opened)
2. Click **ARISE** tab to create an account with your email
3. Log in and start adding quests!

---

## 🔐 How the Login System Works

| Feature | How it works |
|---|---|
| **Passwords** | Encrypted with bcrypt (industry standard — never stored as plain text) |
| **Login sessions** | JWT tokens (expire after 7 days by default) |
| **Database** | SQLite file stored at `backend/system_arise.db` |
| **Auto-login** | Your session is remembered until the token expires |
| **Auto-save** | Game state saves automatically 1.5 seconds after any change |

---

## 🛠 Troubleshooting

**"Cannot connect to server" / blank screen:**
- Make sure the backend is running (`node server.js` in the backend folder)
- Check that the PORT in `.env` matches the `API_BASE` in `frontend/index.html`

**"CORS error" in browser console:**
- Add your frontend URL to the `FRONTEND_URL` in `.env`
- Restart the server after changing `.env`

**Forgot to install packages:**
```bash
cd backend
npm install
```

**Want to reset ALL data:**
- Stop the server
- Delete `backend/system_arise.db`
- Start the server again (it recreates the database)

---

## 📊 API Endpoints (for reference)

| Method | URL | What it does |
|---|---|---|
| POST | `/api/auth/signup` | Create new account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Check current session |
| GET | `/api/data` | Load your game state |
| POST | `/api/data` | Save your game state |
| GET | `/api/health` | Check if server is running |

---

## 📦 Packages Used

| Package | Purpose |
|---|---|
| `express` | Web server framework |
| `better-sqlite3` | Fast SQLite database |
| `bcryptjs` | Password encryption |
| `jsonwebtoken` | Secure login tokens |
| `cors` | Allow frontend to talk to backend |
| `dotenv` | Load settings from `.env` file |

---

*Arise, Hunter. The System awaits.*
