# Wordle API Server (TypeScript)

Backend is built with **TypeScript**, Express, and Mongoose. Source lives in `src/`.

## MongoDB setup (start fresh)

Use **MongoDB Atlas** (free cloud database) so you don't need to install or run MongoDB locally.

### 1. Create a free cluster

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up (or log in).
2. Create a new organization and project if asked.
3. Click **Build a Database** → choose **M0 FREE** → pick a region near you → **Create**.
4. Wait for the cluster to finish creating.

### 2. Create a database user

1. In the Atlas UI, go to **Database Access** (left sidebar) → **Add New Database User**.
2. Choose **Password** authentication.
3. Set a username (e.g. `wordleuser`) and a strong password (save it).
4. Under **Database User Privileges**, leave **Read and write to any database**.
5. Click **Add User**.

### 3. Allow access from your network

1. Go to **Network Access** (left sidebar) → **Add IP Address**.
2. For local development: click **Allow Access from Anywhere** (adds `0.0.0.0/0`). For production you would restrict this.
3. Confirm.

### 4. Get the connection string

1. Go back to **Database** (left sidebar) and click **Connect** on your cluster.
2. Choose **Connect your application**.
3. Copy the connection string. It looks like:
   ```
   mongodb+srv://wordleuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with the database user password you set (no angle brackets). If the password has special characters, URL-encode them (e.g. `@` → `%40`).
5. Add the database name after `.net/` and before `?` so the URL ends with:
   ```
   .mongodb.net/wordle?retryWrites=true&w=majority
   ```
   So the full string is like:
   ```
   mongodb+srv://wordleuser:YourPassword123@cluster0.xxxxx.mongodb.net/wordle?retryWrites=true&w=majority
   ```

### 5. Add it to the server

1. Open `server/config/config.env` (create it from `config.env.example` if needed).
2. Set `MONGO_URL` to your full connection string:
   ```
   MONGO_URL=mongodb+srv://wordleuser:YourPassword123@cluster0.xxxxx.mongodb.net/wordle?retryWrites=true&w=majority
   ```
3. Keep your existing `PORT`, `JWT_SECRET`, `FRONTEND_ORIGIN`, and admin vars.
4. Save the file.

### 6. Start the server

From the `server` folder:

```bash
npm install
npm run dev
```

You should see:

- `Connected to MongoDB: ...`
- `Server running on port 5000`

The app will create the `wordle` database and an admin user on first run.

---

## Optional: local MongoDB with Docker

If you prefer to run MongoDB on your machine:

```bash
docker run -d -p 27017:27017 --name wordle-mongo mongo:latest
```

Then in `config.env` use:

```
MONGO_URL=mongodb://localhost:27017/wordle
```

---

## Environment variables

| Variable             | Required | Description                                                                          |
| -------------------- | -------- | ------------------------------------------------------------------------------------ |
| MONGO_URL            | Yes      | MongoDB connection string (Atlas or local).                                          |
| PORT                 | No       | Server port (default 5000).                                                          |
| JWT_SECRET           | Yes      | Secret for signing tokens (min 32 chars).                                            |
| FRONTEND_ORIGIN      | No       | Allowed CORS origin (default localhost:5173).                                        |
| ADMIN_USERNAME       | No       | Seed admin username (default admin).                                                 |
| ADMIN_EMAIL          | No       | Seed admin email (default admin@wordle.local).                                       |
| ADMIN_PASSWORD       | No       | Seed admin password (default Admin@123).                                             |
| GOOGLE_CLIENT_ID     | No       | Google OAuth client ID (for “Sign in with Google”).                                  |
| GOOGLE_CLIENT_SECRET | No       | Google OAuth client secret.                                                          |
| GOOGLE_CALLBACK_URL  | No       | Override callback URL (default: \`http://localhost:PORT/api/auth/google/callback\`). |

To enable **Sign in with Google**: create OAuth 2.0 credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials), add an authorized redirect URI (e.g. `http://localhost:5000/api/auth/google/callback`), and set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `config.env`.
