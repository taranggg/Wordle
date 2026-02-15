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

**Install and run both server and frontend:**

```bash
pnpm i
pnpm dev
```

- **API** → `http://localhost:5000`
- **App** → `http://localhost:5173`

Before first run: add `server/config/config.env` (see [server/README.md](server/README.md) and `config.env.example`) for MongoDB and env vars.

**Run only one:**

```bash
cd server && pnpm dev   # backend only
cd Wordle2 && pnpm dev  # frontend only
```

Set `VITE_API_URL` in the frontend if your API is not at `http://localhost:5000`.

### Production build

```bash
cd server && pnpm build && pnpm start
cd Wordle2 && pnpm build   # output in dist/
```

## How to play

- Guess the hidden five-letter word in six attempts.
- Green = correct letter and position; yellow = letter in word, wrong position; gray = letter not in word.
- Use hints, view leaderboard and game history when signed in.

---

© Wordle. All rights reserved.
