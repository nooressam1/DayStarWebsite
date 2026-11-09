# Simple React Folder Structure Guide
A clean, scalable, and easy-to-understand folder structure for React projects.

---

## 📁 The Folder Structure

```text
src/
│
├── api/                # Everything related to backend data & requests
│   ├── constants/      # API URL paths (endpoints.ts)
│   ├── services/       # Functions that call the backend (fetch/axios)
│   ├── hooks/          # React Query or custom data-fetching hooks
│   └── client.ts       # Base HTTP client (handles headers, auth tokens)
│
├── modules/            # Your app's features (Feature-based structure)
│   ├── auth/           # Login, signup, password reset
│   ├── cart/           # Shopping cart components and state
│   ├── checkout/       # Checkout steps, payment, order summary
│   ├── products/       # Product list, details, search, reviews
│   └── shared/         # Reusable feature pieces used across modules
│
├── components/         # Global generic UI components (Buttons, Inputs, Modals)
│
├── hooks/              # Global utility hooks (useDebounce, useWindowSize, etc.)
│
├── utils/              # Helper functions (formatCurrency, formatDate, validation)
│
├── types/              # Global TypeScript interfaces & types
│
├── context/            # React Context / Providers (AuthContext, ThemeContext)
│
└── pages/ (or app/)    # The actual screens/routes connected to your router
```

---

## 🔍 What Goes Where?

### 1. `src/api/` (Data & Server Communication)
Keep all backend communication outside your UI components.
- **`constants/endpoints.ts`**: All API URLs in one place (so you never type `/api/products` directly in a component).
- **`services/`**: Plain functions that send requests (e.g., `getProductList()`, `createOrder()`).
- **`hooks/`**: Data-fetching hooks (e.g., using TanStack Query or `useEffect`).
- **`client.ts`**: The shared fetch or axios instance with base URL and auth token attached.

### 2. `src/modules/` (Your Features)
Instead of having a giant folder with 50 components, group files by **Feature / Domain**.

Each feature folder is self-contained:
```text
modules/products/
├── components/         # Components only used in products (e.g., ProductCard, Reviews)
│   ├── ProductCard.tsx
│   ├── ProductDetails.tsx
│   └── ProductSkeleton.tsx
├── hooks/              # Hooks specific to products (e.g., useProductFilter.ts)
└── index.ts            # Public export file (exports what pages need)
```

### 3. `src/components/` (Common UI Elements)
Put purely generic UI building blocks here that have no business logic:
- `Button.tsx`
- `Input.tsx`
- `Modal.tsx`
- `Navbar.tsx` / `Footer.tsx`

### 4. `src/pages/` or `src/app/` (Routes)
Route files should be **very simple and thin**. They only:
1. Grab route params (like `id` or `slug`).
2. Import and render the module component.

---

## 💡 How It All Connects (Simple Example)

When building a page like **Checkout**:

1. **`api/constants/endpoints.ts`** holds the URL:
   `CHECKOUT: "/orders/checkout"`
2. **`api/services/order.service.ts`** has the function:
   `submitCheckout(orderData)`
3. **`api/hooks/useCheckout.ts`** manages the call and loading state.
4. **`modules/checkout/`** contains the UI pieces:
   `AddressStep.tsx`, `PaymentStep.tsx`, `OrderSummary.tsx`.
5. **`pages/checkout.tsx`** brings them together into the final screen.

---

## 🎯 3 Golden Rules

1. **Keep URLs in one file**: Never write hardcoded API URLs inside components.
2. **Group by feature, not file type**: Don't put all components across the entire app into one giant `components/` folder. Use `modules/` for specific features.
3. **Keep route files small**: Your route/page file should just assemble module components, not contain hundreds of lines of logic.
