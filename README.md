# Wordle Game

A full-stack Wordle-style word puzzle game with a **TypeScript** backend and **TypeScript** React frontend.

## Stack

- **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose)
- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Framer Motion

## Project structure

```
Wordle/
├── server/                 # Backend (TypeScript)
│   ├── src/
│   │   ├── config/         # env, db
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── utils/
│   │   └── index.ts
│   ├── config/             # config.env
│   └── package.json
├── Wordle2/                # Frontend (TypeScript)
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## Getting started

### 1. Backend

See [server/README.md](server/README.md) for MongoDB setup and env vars.

```bash
cd server
npm install
# Add config/config.env (see config.env.example)
npm run dev
```

API runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd Wordle2
npm install
npm run dev
```

App runs at `http://localhost:5173`. Set `VITE_API_URL` to your API URL if different from `http://localhost:5000`.

### 3. Production build

**Server:**

```bash
cd server
npm run build
npm start
```

**Client:**

```bash
cd Wordle2
npm run build
# Serve the dist/ folder (e.g. with a static host or your backend)
```

## How to play

- Guess the hidden five-letter word in six attempts.
- Green = correct letter and position; yellow = letter in word, wrong position; gray = letter not in word.
- Use hints, view leaderboard and game history when signed in.

---

© Wordle. All rights reserved.
