# Wordle Project — Improvements & Fixes

A prioritized list of bugs to fix and features to add. Updated as work is completed.

---

## Bug fixes

### Critical

- [x] **Auth controller missing imports** — In `server/controllers/auth.js`, add `require("bcrypt")` and `require("jsonwebtoken")`. Signin/signup will throw at runtime without these.

### High

- [x] **Login/Register not calling API** — Login page only `console.log`s credentials; Register only `console.log`s form data. Wire both to `POST /api/auth/signin` and `POST /api/auth/signup`, handle success/error, and store the JWT (e.g. in localStorage or cookie).

- [x] **Register field mismatch** — Frontend sends `name`; backend User model expects `firstName` (and `lastName`). Either send `firstName`/`lastName` from the form (e.g. map `name` → `firstName`) or update the API to accept `name`.

- [x] **Play Again reloads full page** — "Play Again" uses `window.location.reload()`. Prefer resetting game state in React (new target word, clear guesses, set gameOver false) so the app doesn’t reload.

### Medium

- [ ] **History `colors` always empty** — Recent games are pushed with `colors: []`. HistorySection expects an array of `"green"` / `"yellow"` / `"gray"`. Compute this from the last (or all) guess status when appending to `recentGames`.

- [ ] **On-screen keyboard not wired on mobile** — `handleKeyInput` in `Home.jsx` is passed to mobile view but has an empty body and isn’t connected to GameBoard. Ensure virtual key presses update the same game state as the physical keyboard (e.g. via KeyboardContext or a callback into GameBoard).

- [ ] **Answer visible in devtools** — Remove `console.log(targetWord)` from `GameBoard.jsx` so the answer isn’t exposed in the console.

### Low

- [ ] **Register reducer vs API** — Reducer has `name`; API expects `firstName`. Align naming and validation (e.g. `validateForm` and submit payload) so signup works end-to-end.

---

## New features

### High priority

- [x] **Auth flow end-to-end** — After fixing the auth controller and wiring Login/Register: store token, add an AuthContext (or similar) that holds user + logout, and send `Authorization: Bearer <token>` on API requests. Redirect to `/` after login/register.

- [x] **Protected routes** — If the app should require login: redirect unauthenticated users from `/` to `/login`, or show a “Guest” vs “Signed in” state and gate certain actions (e.g. saving history) by login.

- [x] **User in UI** — Use the logged-in user (from token or `/api/auth/me`) to show username/avatar in the navbar and in the menu instead of the hardcoded "Tarang".

- [x] **Guest mode** — Allow playing without login/signup; limit guest to 8 games then require login/signup; guest history not stored on server.

- [x] **Guest option on login page** — "Continue as Guest" button on login page that navigates to home so users can play without signing in.

### Medium priority

- [ ] **Persist games on server** — When a game ends and the user is logged in, call e.g. `POST /api/games` with word, attempts, status, score, userId. Add `GET /api/games/history` and use it for the History section (replace or sync with localStorage) so history works across devices.

- [ ] **Word of the Day (shared daily word)** — Backend endpoint that returns a single “today’s word” (e.g. from Word model or deterministic from date). Frontend “Daily challenge” mode uses that word; optionally limit to one game per day and allow sharing result (e.g. “Wordle 3/6”).

- [ ] **Leaderboard** — Persist scores; add `GET /api/leaderboard` (daily or all-time). Re-enable the Leaderboard tab in `MenuModal` and connect it to this API.

### Lower priority

- [ ] **Share result** — “Share” button in GameEndModal that copies a line like “Wordle 3/6 🟩🟩…” to clipboard for social sharing.

- [ ] **Server-side word list** — Serve the answer from the backend (e.g. `GET /api/words/random` or daily) so the word isn’t in the client bundle and is harder to cheat.

- [ ] **Profile / settings** — Optional profile page: avatar, display name, change password, or link to stats.

- [ ] **Loading and error states** — Loading spinner or disabled button on Login/Register and on “Submit guess” while the dictionary API is called; clear error messages for invalid word or network failure.

- [ ] **Haptic feedback** — Optional short vibration on mobile on submit or win/loss.

---

## Summary

| Category                 | Total | Done | Remaining |
| ------------------------ | ----- | ---- | --------- |
| Critical fixes           | 1     | 1    | 0         |
| High fixes               | 3     | 3    | 0         |
| Medium fixes             | 3     | 0    | 3         |
| Low fixes                | 1     | 0    | 1         |
| High-priority features   | 5     | 5    | 0         |
| Medium-priority features | 3     | 0    | 3         |
| Lower-priority features  | 6     | 0    | 6         |

**Next suggested:** Fix medium-priority bugs (History colors, on-screen keyboard on mobile, remove `console.log(targetWord)`), then add server game persistence and leaderboard.
