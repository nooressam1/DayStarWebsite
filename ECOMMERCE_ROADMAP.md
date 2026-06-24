# DayStar Ecommerce — Full Roadmap (Beginner Walkthrough + Implementation Spec)

## Context

DayStar has a working **auth + scaffolding** foundation but **zero ecommerce**:

- **Backend** (NestJS 11): `SupabaseService.admin` is a privileged Postgres client for DB reads/writes (`Backend/src/supabase/supabase.service.ts`); `SupabaseAuthGuard` + `@CurrentUser()` protect routes (`Backend/src/auth/supabase-auth.guard.ts`); modules follow a clean pattern (`Backend/src/me/me.controller.ts`). Only `/health` and `/me` exist.
- **Frontend** (Next.js 16, App Router): `apiFetch()` attaches the Supabase token to backend calls (`Frontend/src/lib/api.ts`). Pages: home, login, signup, dashboard.

Target: production store for **physical products**, schema via **raw Supabase SQL migrations** (no ORM). Each phase below has a plain-language **What / Why** for newcomers, then the concrete **files, code, and steps**. Phases 0–4 get you a real payable store; 5–10 take it to production. Each phase is independently shippable.

> **Mental model:** Your app is two programs. The **Frontend** is what the user sees in the browser. The **Backend** is the brain that talks to the database and Stripe. The **database** (Supabase/PostgreSQL) is the filing cabinet. The frontend never touches money or the database directly — it always asks the backend.

## Core principles (the rules that prevent classic ecommerce bugs)

1. **Money as integer cents.** Store `price_cents INTEGER` (+ `currency`). Computers are bad at decimals (`0.1 + 0.2 != 0.3`), so we store `1999` to mean $19.99 and only format with a `$` for display.
2. **Never trust client prices.** The browser can be tampered with, so the client only ever sends `{productId, quantity}`. The backend looks up the real price in the DB and computes the total itself.
3. **Decrement stock on payment success (the webhook), not at add-to-cart**, using a transactional Postgres function so two buyers can't both grab the last unit.
4. **Snapshot name + price into `order_items`** at purchase time, so editing a product later doesn't rewrite past receipts.
5. **The API is the security boundary.** `supabase.admin` ignores row-level rules, so we still turn on RLS as a safety net and route all writes through the backend.
6. **Idempotency.** Stripe sometimes sends the same "payment succeeded" message twice — we make sure acting on it twice can't double-charge stock.

---

# Phase 0 — Prerequisites ("get the two halves talking")

**What you're building:** the plumbing so the frontend and backend reliably reach each other, plus the tool that lets you change the database.

**Why it matters:** A "port" is a numbered door on your computer. Your frontend is told the backend is at port **3002**, but the backend starts on **3001** — so every request currently knocks on the wrong door and fails. Beginners lose hours to exactly this.

**Steps:**
1. **Reconcile ports** (standardize on **3001**): set `NEXT_PUBLIC_API_URL=http://localhost:3001` in `Frontend/.env.local` (and `.env.example`); confirm `Backend/.env` has `PORT=3001` and `Backend/src/main.ts` reads it.
2. **Install the Supabase CLI** — a command-line tool to change your database from your project folder.
3. Run `npx supabase login` (paste your access token), `npx supabase init` (creates `Backend/supabase/`), `npx supabase link --project-ref <ref>`.
4. **Learn the migration loop** you'll use forever after: `npx supabase migration new <name>` → write SQL in the new file under `Backend/supabase/migrations/` → `npx supabase db push` to apply it. A *migration* is just a `.sql` file describing one change, kept in version control so your DB is repeatable instead of hand-clicked.
- **Done when:** a no-op migration pushes cleanly and both dev servers reach each other.

---

# Phase 1 — The data model ("design the warehouse before stocking it")

**What you're building:** the **tables** — spreadsheet-like containers where data lives. This is the most important phase: code is easy to change later, but reshaping data after real orders exist is painful. So we design it all now.

**The tables in plain terms:**
- **products** — one row per item you sell (name, price, stock, photo).
- **categories** — groups like "Mugs," "Shirts" (used in Phase 7).
- **orders** — one row per purchase (who, total, address, status).
- **order_items** — the lines inside an order ("2× Blue Mug"); one order has many items, so it's a separate table.
- **profiles** — extra per-user info (name, and `customer` vs `admin` role).
- **reviews** — star ratings (Phase 9).

### 1.1 Tables (SQL)
```sql
-- helper to auto-stamp updated_at
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                 -- url-friendly id, e.g. "blue-mug"
  name text not null, description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'usd',
  image_url text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,   -- hide instead of delete
  category_id uuid references categories(id) on delete set null,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create trigger products_updated before update on products
  for each row execute function set_updated_at();
create index products_active_idx on products(is_active);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  status text not null default 'pending'
    check (status in ('pending','paid','fulfilled','shipped','cancelled','refunded')),
  total_cents integer not null, currency text not null default 'usd',
  shipping_address jsonb, stripe_session_id text, tracking_number text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create trigger orders_updated before update on orders
  for each row execute function set_updated_at();
create index orders_user_idx on orders(user_id);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,        -- snapshot, frozen at purchase
  unit_price_cents integer not null, -- snapshot
  quantity integer not null check (quantity > 0)
);
create index order_items_order_idx on order_items(order_id);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  rating integer not null check (rating between 1 and 5),
  body text, created_at timestamptz default now(),
  unique (product_id, user_id)        -- one review per user per product
);
```

### 1.2 Auto-create a profile when someone signs up
**Why:** so every auth user automatically gets a matching `profiles` row (with a default `customer` role).
```sql
create or replace function handle_new_user() returns trigger language plpgsql security definer as $$
begin insert into profiles(id, full_name) values (new.id, new.raw_user_meta_data->>'full_name'); return new; end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();
```

### 1.3 Safe stock decrement (used by the payment webhook)
**Why a database function:** if two people check out the last mug at the same moment, naive code could sell both. This function subtracts stock and *fails loudly* if there isn't enough, all in one atomic step.
```sql
create or replace function decrement_stock(p_order_id uuid)
returns void language plpgsql security definer as $$
declare item record;
begin
  for item in select product_id, quantity from order_items where order_id = p_order_id loop
    update products set stock_quantity = stock_quantity - item.quantity
      where id = item.product_id and stock_quantity >= item.quantity;
    if not found then raise exception 'Insufficient stock for product %', item.product_id; end if;
  end loop;
end $$;
```

### 1.4 Row-Level Security (RLS)
**What it is:** rules on each table about who may read/write rows — a safety net so that even if the frontend talked to the DB directly, it couldn't read other people's orders. Enable RLS on all tables. Policies: products/categories/reviews → readable by everyone; orders/order_items/profiles → a user can only read their own rows. No client *write* policies — all writes go through the backend (which uses the admin key).

### 1.5 Seed data
Insert 1–2 categories and 4–6 products with varied prices/stock; make one product `stock_quantity = 1` so you can test the oversell guard later.

- **Done when:** all tables, triggers, the RPC, RLS, and seed rows exist and show up in the Supabase dashboard.

---

# Phase 2 — Products API + catalog UI ("the first thing a shopper sees")

**What you're building:** the first complete slice — the backend can hand out product data, and the frontend shows a shop page and individual product pages.

**Key concept — "API endpoint":** a URL on the backend the frontend can call, like `GET /products` ("give me the product list"). The backend reads the DB and returns **JSON** (plain structured text).

### 2.1 Backend `products` module (mirrors the existing `me` module)
Files under `Backend/src/products/`:
- `products.service.ts` — the DB logic:
  - `findAll(params)` → `supabase.admin.from('products').select('*').eq('is_active',true).order('created_at',{ascending:false})` + `.range()` for paging; returns `{ items, total }`.
  - `findBySlug(slug)` → `.eq('slug',slug).single()`; throw `NotFoundException` if absent.
- `products.controller.ts` (public, no guard): `GET /products?page=&limit=`, `GET /products/:slug`.
- `dto/list-products.dto.ts` — validates `page`/`limit` with `class-validator`.
- Register the module in `Backend/src/app.module.ts`.

### 2.2 Frontend catalog
- `Frontend/src/lib/types.ts` — TypeScript shapes: `Product`, `Category`, `Paginated<T>`.
- `Frontend/src/lib/format.ts` — `formatMoney(cents, currency)` using `Intl.NumberFormat` (turns `1999` into `$19.99`).
- `Frontend/src/lib/server-api.ts` — a server-side `fetch` to the backend for **public** data (no login needed), so pages render fast and are SEO-friendly.
- `Frontend/src/app/products/page.tsx` — the shop grid (a **Server Component**: rendered on the server before reaching the browser).
- `Frontend/src/app/products/[slug]/page.tsx` — one product's page; `generateMetadata` sets the page title for SEO; `next/image` optimizes the photo.
- `Frontend/src/components/ProductCard.tsx` — photo + name + price + "Out of stock" badge when `stock_quantity === 0`.
- Add a "Shop" link in the header/home page.
- **Done when:** `/products` lists real DB products and each links to a working detail page.

---

# Phase 3 — Shopping cart ("a notepad in the browser")

**What you're building:** the ability to collect items before buying.

**Key decision — the cart lives in the browser, not the database.** It's simpler, and since we re-validate everything at checkout anyway, there's no risk. We store it in **localStorage** (a small per-browser storage that survives refreshes).

**The one gotcha:** Next.js renders pages on the server first, where `localStorage` doesn't exist. If you read the cart during that first render you get a "hydration mismatch" error. Fix: load the saved cart inside a `useEffect` (runs only in the browser) and expose a `ready` flag.

**Steps / files:**
1. `Frontend/src/lib/cart-context.tsx` — a React **Context** (shared state any component can read) holding `items: {productId, quantity}[]`, with `add`, `setQty`, `remove`, `clear`. Saves to localStorage on change; loads in `useEffect`.
2. Wrap `CartProvider` around the app in `Frontend/src/app/layout.tsx`.
3. `Frontend/src/components/AddToCartButton.tsx` — on the product page; disabled when out of stock.
4. `Frontend/src/components/CartBadge.tsx` — the little count in the header.
5. `Frontend/src/app/cart/page.tsx` — list items, edit quantity, remove, show subtotal (display-only), "Checkout" button. Include an empty-cart state.
- **Done when:** the cart survives a page refresh and totals are right.

---

# Phase 4 — Checkout & payment with Stripe ("take the money safely")

**What you're building:** the actual purchase. We use **Stripe Checkout** — Stripe hosts the card-entry page, so sensitive card data never touches your servers (far less legal/security burden).

**The flow in plain terms:** user clicks Checkout → your backend creates a pending order and asks Stripe for a payment page → user is redirected to Stripe and pays → **Stripe calls your backend** ("payment succeeded!") at a special URL called a **webhook** → your backend marks the order paid and reduces stock.

**Key concept — "webhook":** instead of your code asking Stripe "did they pay yet?", Stripe phones *you* when it's done. The webhook is the source of truth for payment, because the user could close the browser right after paying.

### 4.1 Backend setup
- `npm i stripe`. Add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `FRONTEND_URL` to the Joi env check (`Backend/src/config/env.validation.ts`).
- `Backend/src/payments/stripe.service.ts` — wraps the Stripe SDK (`createCheckoutSession`, `constructEvent`).

### 4.2 Orders module (`Backend/src/orders/`)
- `dto/checkout.dto.ts` — validates incoming `{ items:[{productId,quantity}], shippingAddress:{...} }`.
- `orders.service.ts` → `createCheckout(userId, dto)` does these steps **in order** (this is where the "never trust the client" rule lives):
  1. Look up the real products from the DB by id.
  2. Check each is active and `stock_quantity >= quantity`; reject otherwise.
  3. Compute `total_cents` from **DB** prices (ignore anything the client sent).
  4. Insert an `orders` row (`status='pending'`) + its `order_items` (snapshot name/price).
  5. Create a Stripe Checkout Session with `success_url=${FRONTEND_URL}/checkout/success?order={id}`, `cancel_url=.../cancel`, and `metadata.order_id`.
  6. Save `stripe_session_id`; return the Stripe `url`.
  - Also `findForUser` / `findOneForUser` for order history (only the owner's rows).
- `orders.controller.ts` (protected by `SupabaseAuthGuard`): `POST /orders/checkout`, `GET /orders`, `GET /orders/:id`.

### 4.3 The webhook (`Backend/src/webhooks/`)
- **Raw body gotcha:** Stripe signs the exact bytes it sent. NestJS normally parses JSON into an object, which breaks the signature check. So enable **raw body** for just the `/webhooks/stripe` route in `Backend/src/main.ts`.
- `webhooks.controller.ts` — `POST /webhooks/stripe` (public, but verified with `STRIPE_WEBHOOK_SECRET`). On `checkout.session.completed`: read `metadata.order_id`, then **idempotently** `update orders set status='paid' where id=? and status='pending'` and call the `decrement_stock` RPC. The `where status='pending'` makes a duplicate delivery a no-op.

### 4.4 Frontend checkout
- `Frontend/src/app/checkout/page.tsx` — protected; a shipping-address form; on submit calls `POST /orders/checkout` via `apiFetch`, then `window.location = url` to Stripe.
- `checkout/success/page.tsx` — reads `?order=`, shows confirmation, and `clear()`s the cart.
- `checkout/cancel/page.tsx` — "payment cancelled," link back to cart.
- `Frontend/src/app/orders/page.tsx` — order history (protected, like the existing dashboard).
- **Done when:** paying with Stripe's test card `4242 4242 4242 4242` lands on the success page, the order flips to `paid`, stock drops, and it appears in `/orders`. **← You now have a real store.**

---

# Phase 5 — Order management & fulfillment ("after the sale")

**What/why:** once paid, you need to actually fulfil orders and let customers track them.
- **Backend:** admin-only `PATCH /orders/:id/status` to move `paid → fulfilled → shipped` and set a `tracking_number`; a `POST /orders/:id/refund` that calls Stripe and sets `status='refunded'`. Validate that transitions are legal.
- **Frontend:** `orders/[id]/page.tsx` with a status timeline, items, address, and tracking.
- **Done when:** an order can move through its lifecycle and the customer sees status + tracking.

---

# Phase 6 — Admin panel & roles ("stop editing the database by hand")

**What/why:** so far products are added via SQL. A real store needs a screen where a non-technical admin manages products and orders. We gate it by the `role` column from Phase 1.
- **Backend:** `roles.guard.ts` + a `@Roles('admin')` decorator (checks `profiles.role`). Admin endpoints: product create/edit/delete, category management, order queue, simple stats. Product images upload to **Supabase Storage** (a file bucket); save the resulting URL in `products.image_url`.
- **Frontend:** an `Frontend/src/app/admin/` area (blocked for non-admins) — product forms with image upload + stock editing, an order queue with status controls, and a small dashboard (orders today, revenue, low stock).
- **Done when:** an admin can add/edit products and manage orders with no SQL; a normal customer gets blocked from `/admin`.

---

# Phase 7 — Catalog UX ("help people find things")

**What/why:** as the catalog grows, shoppers need search, categories, and filters.
- **Backend:** extend `GET /products` with `?category=&q=&sort=&minPrice=&maxPrice=&page=`; add Postgres **full-text search** on name+description.
- **Frontend:** category nav, a debounced search bar, a filter sidebar, sort dropdown, pagination, and loading/empty states. Optional "related products."
- **Done when:** shoppers can find products by category and keyword and page through results.

---

# Phase 8 — Customer accounts ("make returning easy")

**What/why:** give logged-in users a home base.
- **Backend:** extend `/me` to read/update the profile; saved shipping addresses; account-scoped order history.
- **Frontend:** `Frontend/src/app/account/` — edit profile, manage saved addresses (auto-filled at checkout), see full order history. Optional wishlist.
- **Done when:** a returning customer has a profile, reusable addresses, and history.

---

# Phase 9 — Reviews & notifications ("social proof + emails")

**What/why:** reviews build trust; transactional emails keep buyers informed.
- **Reviews:** `POST /products/:id/reviews`, ideally limited to people who actually bought it (check their `order_items`). Show an average rating + a review list/form on the product page.
- **Email** (e.g. Resend/Postmark): an order-confirmation email sent from the webhook, and a shipping email from the status change. Add the email key to env validation; put sending logic in a `notifications` module.
- **Done when:** verified buyers can review, and purchases trigger confirmation + shipping emails.

---

# Phase 10 — Production hardening & launch ("make it safe and fast for real users")

**What/why:** the difference between a demo and a live store.
- **Security:** rate limiting (`@nestjs/throttler`), Helmet, validation on every input, an RLS audit, CORS locked to your real domain, secrets only in the host's env (never committed).
- **Reliability:** error tracking (Sentry) on both apps, structured logs, confirmed DB indexes, graceful out-of-stock and payment-failure handling.
- **Performance/SEO:** Next.js caching/ISR for the catalog, image optimization, `sitemap.xml` + `robots.txt`, social-share (OpenGraph) metadata, a Core Web Vitals pass.
- **Quality:** unit tests for the pricing + stock logic, one end-to-end checkout test, and a **separate staging Supabase project** so you never test against live data.
- **Deploy:** Frontend → Vercel; Backend → Railway/Render/Fly; a Supabase prod project; switch Stripe to **live** keys and register the live webhook URL.
- **Done when:** the store runs on production infra with monitoring, live payments, and tests guarding the money paths.

---

## Environment variables (cumulative)
- **Backend** `.env` (+ Joi in `Backend/src/config/env.validation.ts`): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `FRONTEND_URL` (P4); email provider key (P9); `SENTRY_DSN` (P10).
- **Frontend** `.env.local`: `NEXT_PUBLIC_API_URL` aligned to the backend port (P0); Supabase Storage URL if needed (P6).

## Verification (end-to-end)
1. **Schema:** apply migrations; confirm tables, RPC, RLS, seed rows in the dashboard.
2. **Run:** Backend `npm run start:dev`; Frontend `npm run dev`; ports aligned.
3. **Catalog/cart (P2–3):** browse `/products` → detail → add to cart → `/cart` totals correct.
4. **Checkout (P4):** `stripe listen --forward-to localhost:3001/webhooks/stripe`; pay with `4242 4242 4242 4242` → success, order `paid`, stock down, in `/orders`.
5. **Edge cases:** out-of-stock can't be over-ordered; a tampered client price doesn't change the charge; a **replayed** webhook doesn't double-decrement stock.
6. **Admin (P6):** as an `admin`, create a product with an image → it appears on the storefront; as a customer, `/admin` is forbidden.
7. **Later:** search returns expected results (P7); a saved address prefills checkout (P8); a purchase triggers a confirmation email + allows a review (P9); Lighthouse + a load test before launch (P10).

## Suggested build order
Ship **Phases 0–4** first for a working, payable store, then layer **5 → 10**. Phase 6 (admin) is the highest-value step right after launch — it removes your daily dependence on SQL.
