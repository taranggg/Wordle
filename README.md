# Wordle Game

A full-stack Wordle-style word puzzle game.

## Stack

- **Backend:** Python, FastAPI, MongoDB (Motor)
- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Framer Motion

## Project structure

```
Wordle/
├── server/                 # Backend (Python/FastAPI)
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   └── main.py
│   ├── .env
│   └── requirements.txt
├── Wordle2/                # Frontend (React/TypeScript)
│   ├── src/
│   └── package.json
└── README.md
```

## Getting started

### 1. Backend (Server)

Navigate to the `server` directory and install dependencies:

```bash
cd server
pip install -r requirements.txt
```

Create a `.env` file (copy from `.env.example`) and add your MongoDB URI and Google Client ID.

Start the server:

```bash
uvicorn app.main:app --reload --port 8000
```

- **API Documentation:** `http://localhost:8000/docs`

### 2. Frontend (Client)

Navigate to the `Wordle2` directory:

```bash
cd Wordle2
pnpm install
pnpm dev
```

- **App:** `http://localhost:5173`

## Configuration

Make sure your `Wordle2/.env` or `Wordle2/src/api/client.ts` points to `http://localhost:8000`.

## Features

-   **Google Authentication:** Secure login with Google.
-   **Wordle Gameplay:** Guess 5-letter words.
-   **Leaderboard:** Track top players.
-   **History:** View past games.
