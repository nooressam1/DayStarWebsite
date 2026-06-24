# DayStar

Ecommerce project. Foundation only so far — a runnable base with working
authentication. Product/cart/checkout features get built on top of this.

## Stack

| Layer    | Tech                                            | Folder      | Port |
| -------- | ----------------------------------------------- | ----------- | ---- |
| Frontend | Next.js (App Router, TypeScript, Tailwind)      | `Frontend/` | 3000 |
| Backend  | NestJS (TypeScript, REST API)                   | `Backend/`  | 3001 |
| Data     | Supabase (Postgres + Auth + Storage)            | hosted      | —    |

### How it fits together

1. The frontend handles sign-up / login directly with **Supabase Auth** using the
   **publishable** key. Supabase manages the session and issues a JWT.
2. The frontend calls the backend over REST with `Authorization: Bearer <JWT>`.
3. The backend verifies that JWT against Supabase's JWKS (`auth.getClaims`), then uses
   the **secret** key for privileged database access. The secret key never reaches the
   browser.

## Setup

### 1. Create a Supabase project

At [supabase.com](https://supabase.com), create a project. From
**Project Settings → API**, copy:

- Project URL → `https://<ref>.supabase.co`
- **Publishable** key (`sb_publishable_…`)
- **Secret** key (`sb_secret_…`) — create one if there isn't one

### 2. Configure environment variables

```
Backend/.env          # copy from Backend/.env.example, fill in values
Frontend/.env.local   # copy from Frontend/.env.example, fill in values
```

Both files are pre-created with placeholders — replace the placeholder values with the
ones from step 1.

### 3. Install dependencies (already done once)

```powershell
npm install --prefix Backend
npm install --prefix Frontend
```

## Run (two terminals)

```powershell
# Terminal 1 — backend on http://localhost:3001
npm run start:dev --prefix Backend

# Terminal 2 — frontend on http://localhost:3000
npm run dev --prefix Frontend
```

## Verify it works

1. `GET http://localhost:3001/health` → `{ "status": "ok", ... }`
2. Open http://localhost:3000 → **Sign up**, then **Log in**.
3. Go to **Dashboard** → it calls the backend `/me` with your token and renders your
   user claims. That confirms login → JWT → backend verification works end to end.

## Endpoints

| Method | Path      | Auth        | Description                          |
| ------ | --------- | ----------- | ------------------------------------ |
| GET    | `/health` | public      | Liveness check                       |
| GET    | `/me`     | Bearer JWT  | Returns the authenticated user claims|

## Next steps (not built yet)

- Product / category / cart / order tables + Row Level Security policies
- Stripe checkout
- Image uploads via Supabase Storage
- Shared TypeScript types between frontend and backend
- Deployment (Vercel for frontend + a Node host for the backend)
