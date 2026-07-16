# DayStar Frontend

This is the frontend client application for the DayStar Ecommerce project. It is built using Next.js (App Router), TypeScript, and Tailwind CSS.

## Tech Stack
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS, PostCSS
* **Authentication:** Supabase Auth (Sign-up, Login, and Session management)
* **API Integration:** Connects to the DayStar Backend API (`http://localhost:3002`)

---

## Setup & Configuration

### 1. Environment Variables
Create a `.env.local` file at the root of the project:
```bash
cp .env.example .env.local
```
Open `.env.local` and configure:
* `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
* `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Your Supabase Publishable Key.
* `NEXT_PUBLIC_API_URL`: The URL of the NestJS backend (typically `http://localhost:3002`).

---

## Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## Core Authentication Flow
1. The frontend authenticates directly with **Supabase Auth** using the publishable key.
2. The user session JWT is stored and handled by Supabase.
3. Every REST request to the Backend API includes the JWT in the `Authorization: Bearer <JWT>` header to perform secure, verified requests.
