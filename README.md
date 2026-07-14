# ServCrust — Full-Stack Microservices Platform

A construction materials e-commerce and careers platform built with a React frontend communicating to Node.js gRPC microservices via **pure gRPC-Web** — no REST layer anywhere.

---

## Tech Stack

### Frontend

| Layer                  | Technology                                            |
| ---------------------- | ----------------------------------------------------- |
| Framework              | React 18 + Vite + TypeScript                          |
| Styling                | Tailwind CSS                                          |
| State management       | Zustand (auth + UI state, persisted via localStorage) |
| Server state / caching | React Query (TanStack Query v5)                       |
| Routing                | React Router v6                                       |
| RPC communication      | gRPC-Web with protobufjs/light (binary encode/decode) |
| Animations             | react-lottie                                          |

### Backend

| Layer                 | Technology                                |
| --------------------- | ----------------------------------------- |
| Language              | Node.js + TypeScript (ts-node)            |
| Service communication | gRPC (native HTTP/2 between services)     |
| Browser communication | gRPC-Web proxy (HTTP/1.1 → HTTP/2 bridge) |
| Database              | MySQL via Prisma ORM                      |
| Authentication        | JWT (jsonwebtoken)                        |
| Schema                | Protocol Buffers v3                       |

### Architecture pattern

Two independent gRPC microservices behind a single gRPC-Web proxy. The browser talks only to the proxy; services never expose ports directly to the internet.

Each service is internally layered as **gRPC handler → service → repository → Prisma**:

- **Handlers** (`grpc/handlers/`) receive the RPC call, run auth checks, and shape the response.
- **Services** (`services/`) hold business logic that isn't tied to gRPC.
- **Repositories** (`repositories/`) are the only layer that talks to Prisma/MySQL.

### Security & resilience

- **Short-lived access tokens + rotating refresh tokens** — a 15-minute JWT access token (`JWT_ACCESS_EXPIRY`) paired with a 7-day opaque refresh token (`JWT_REFRESH_EXPIRY`). Only a SHA-256 hash of the refresh token is stored (`tokenService.ts`); presenting one revokes it and issues a new one, so a stolen-and-replayed token stops working the moment the real client refreshes.
- **Silent refresh on the frontend** — `grpc/transport.ts` catches a 401 (`UNAUTHENTICATED`), transparently calls `RefreshToken`, and retries the original request once. If refresh itself fails, the existing session is cleared and the user is redirected to `/login`.
- **Rate limiting at the proxy** — `Login` / `Register` / `AdminLogin` / `RefreshToken` are limited per client IP (`RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX`) via an in-memory fixed-window limiter in `grpc-web-proxy/src/rateLimiter.ts`.
- **Process crash handlers** — `service-a`, `service-b`, and the gRPC-Web proxy each register `uncaughtException`/`unhandledRejection` handlers that log and exit cleanly instead of hanging in a broken state.
- **Frontend error boundary** — `components/ErrorBoundary.tsx` catches render errors app-wide so a single broken component can't blank the whole page.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                  BROWSER  (React 18 + Vite + TypeScript)         │
│                                                                  │
│  Zustand: authStore, uiStore                                     │
│  React Query: useProducts / useCart / useUserOrders / useJobs …  │
│                                                                  │
│  gRPC-Web clients  (protobufjs/light — binary encode/decode)     │
│  ┌─────────────────┐  ┌─────────────────┐                        │
│  │ serviceAClient  │  │ serviceBClient  │                        │
│  └────────┬────────┘  └────────┬────────┘                        │
└───────────┼────────────────────┼────────────────────────────────┘
            │                    │
            │  gRPC-Web  (HTTP POST + binary protobuf frames)
            │  Content-Type: application/grpc-web+proto
            ▼
┌──────────────────────────────────────────────────────────────────┐
│          gRPC-Web PROXY  :8080  (Node.js + ts-node)              │
│                                                                  │
│  1. Decode gRPC-Web binary frame  (strip 5-byte header)          │
│  2. Deserialize protobuf bytes → JS object  (protobufjs)         │
│  3. Forward Authorization header as gRPC metadata                │
│  4. Call downstream gRPC service  (@grpc/grpc-js)                │
│  5. Serialize response → protobuf bytes  (protobufjs)            │
│  6. Re-encode as gRPC-Web frame → send to browser                │
└──────────┬───────────────────────────┬───────────────────────────┘
           │  native gRPC (HTTP/2)     │  native gRPC (HTTP/2)
           ▼                           ▼
┌──────────────────────┐   ┌──────────────────────┐
│  SERVICE A  :50051   │   │  SERVICE B  :50052   │
│                      │   │                      │
│  Auth (User + Admin) │   │  Jobs                │
│  Products            │   │  Applications        │
│  Orders              │   │  Records (legacy)    │
│  Cart                │   │                      │
│  Items (legacy)      │   │                      │
│  Prisma + MySQL      │   │  Prisma + MySQL      │
└──────────┬───────────┘   └──────────┬───────────┘
           └──────────┬───────────────┘
                      ▼
                MySQL :3306
              (shared database)
```

---

## Folder Structure

```
Website/
├── frontend/                        ← React 18 + Vite + TypeScript
│   ├── src/
│   │   ├── grpc/
│   │   │   ├── transport.ts         ← binary gRPC-Web fetch transport
│   │   │   ├── proto/
│   │   │   │   ├── serviceA.ts      ← protobufjs descriptor (Service A)
│   │   │   │   └── serviceB.ts      ← protobufjs descriptor (Service B)
│   │   │   └── clients/
│   │   │       ├── serviceAClient.ts
│   │   │       ├── serviceBClient.ts
│   │   │       └── types.ts         ← all TS interfaces
│   │   ├── hooks/
│   │   │   ├── useServiceA.ts       ← React Query hooks (auth, products, cart, orders)
│   │   │   └── useServiceB.ts       ← React Query hooks (jobs, applications)
│   │   ├── store/
│   │   │   ├── authStore.ts         ← Zustand — JWT + user session
│   │   │   └── uiStore.ts           ← Zustand — global UI state
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   ├── Services.tsx         ← Careers / Job listings
│   │   │   ├── Login.tsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.tsx
│   │   │       ├── Dashboard.tsx
│   │   │       ├── AdminOrders.tsx
│   │   │       ├── AdminProducts.tsx
│   │   │       ├── AdminStock.tsx
│   │   │       ├── AdminUsers.tsx
│   │   │       ├── AdminJobs.tsx
│   │   │       ├── AdminApplications.tsx
│   │   │       └── AdminProfile.tsx
│   │   └── components/
│   │       ├── Header.tsx
│   │       └── ErrorBoundary.tsx    ← app-wide render-error fallback (wraps <App/> in main.tsx)
│   └── .env.example
│
├── backend/
│   ├── proto/
│   │   ├── service-a.proto          ← ServiceA contract
│   │   └── service-b.proto          ← ServiceB contract
│   ├── grpc-web-proxy/              ← HTTP/1.1 → gRPC-HTTP/2 bridge
│   │   ├── src/
│   │   │   ├── proxy.ts             ← SERVICE_MAP — must update for every new RPC
│   │   │   ├── rateLimiter.ts       ← in-memory per-IP limiter for auth RPCs
│   │   │   └── grpc-clients/
│   │   │       ├── serviceAClient.ts
│   │   │       └── serviceBClient.ts
│   │   └── .env.example
│   ├── services/
│   │   ├── service-a/               ← Auth, Products, Orders, Cart
│   │   │   ├── prisma/schema.prisma ← MySQL schema (Admin, User, Product, Order, Cart, Item, RefreshToken)
│   │   │   ├── src/
│   │   │   │   ├── grpc/handlers/   ← receives RPC calls, auth checks, response shaping
│   │   │   │   ├── services/        ← business logic (adminService, authService, tokenService)
│   │   │   │   ├── repositories/    ← only layer that talks to Prisma (incl. refreshTokenRepository)
│   │   │   │   ├── models/types.ts  ← shared TS interfaces (no ORM models — Prisma owns the schema)
│   │   │   │   └── scripts/seed.ts
│   │   │   └── .env.example
│   │   └── service-b/               ← Jobs, Applications
│   │       ├── prisma/schema.prisma ← MySQL schema (Job, Application, Record)
│   │       ├── src/
│   │       │   ├── grpc/handlers/
│   │       │   ├── services/
│   │       │   ├── repositories/
│   │       │   ├── models/types.ts
│   │       │   └── scripts/seed.ts
│   │       └── .env.example
│   ├── docker-compose.yml           ← MongoDB only (legacy — unused now that both services use MySQL)
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## User View

Pages accessible to all visitors and registered users.

| Route       | Page                                           | Auth required |
| ----------- | ---------------------------------------------- | ------------- |
| `/`         | Home                                           | No            |
| `/products` | Product catalogue — browse and add to cart     | No            |
| `/services` | Careers — active job listings, Apply Now modal | No            |
| `/contact`  | Contact form                                   | No            |
| `/login`    | Login / Register                               | No            |
| `/qr`       | QR code scanner                                | No            |
| `/cart`     | Shopping cart + checkout (two-column layout)   | Yes           |
| `/orders`   | Order history + click-to-open detail modal     | Yes           |
| `/profile`  | Account info, order count, application count   | Yes           |

### User flows

**Shopping:** Browse products → Add to cart → Checkout → Order created, stock decremented, cart cleared.

**Careers:** View job listings → Click Apply Now → Auth gate (redirect to login if not signed in) → Submit resume URL + cover letter → Application created.

---

## Admin View

All admin routes require `role: ADMIN` in the JWT. Accessed at `/admin/*`.

| Route                 | Page         | What you can do                                                                                                       |
| --------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| `/admin`              | Dashboard    | Recent orders summary, stock overview                                                                                 |
| `/admin/orders`       | Orders       | View all orders, filter by status (pending / confirmed / shipped / delivered / cancelled) with per-status counts      |
| `/admin/products`     | Products     | Create, edit, activate, deactivate products                                                                           |
| `/admin/stock`        | Stock        | Inventory management                                                                                                  |
| `/admin/users`        | Users        | View all registered users                                                                                             |
| `/admin/jobs`         | Jobs         | Create, edit, activate, deactivate job listings                                                                       |
| `/admin/applications` | Applications | Review applications, update status (pending → reviewed → shortlisted → accepted / rejected), delete, filter by status |
| `/admin/profile`      | Profile      | Admin account info                                                                                                    |

### Application status flow

```
pending → reviewed → shortlisted → accepted
                                 ↘ rejected
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- MySQL 8+ running locally (or a hosted MySQL URI in `.env`)

### 1. Configure environments

```bash
cp backend/.env.example                    backend/.env
cp backend/grpc-web-proxy/.env.example     backend/grpc-web-proxy/.env
cp backend/services/service-a/.env.example backend/services/service-a/.env
cp backend/services/service-b/.env.example backend/services/service-b/.env
cp frontend/.env.example                   frontend/.env
```

Open each `.env` and fill in `JWT_SECRET`, `DATABASE_URL` (MySQL connection string), and any other placeholders. `JWT_ACCESS_EXPIRY` (default `15m`) and `JWT_REFRESH_EXPIRY` (default `7d`) control the access/refresh token lifetimes — see [Security & resilience](#security--resilience).

> `.env` files are for local development only. In production, set environment variables directly in your hosting platform — never create a `.env.production` file.

### 2. Install dependencies

```bash
cd backend && bash scripts/install-all.sh
cd frontend && npm install
```

### 3. Push the Prisma schema to MySQL

```bash
cd backend/services/service-a && npm run db:push
cd ../service-b               && npm run db:push
```

Both services share the same `servcrust` MySQL database — `service-a` owns Admin/User/Product/Order/Cart, `service-b` owns Job/Application/Record.

### 4. Seed database

```bash
cd backend
npm run seed       # Admin + Users + Products + Orders + Carts (service-a), then Jobs + Applications (service-b)
```

`npm run seed` wipes and re-inserts all rows every run, so the end state is always the same. Every insert goes through the repository layer (`repositories/*.ts`), never Prisma directly.

Sample accounts after seeding:

| Role  | Email                   | Password    |
| ----- | ----------------------- | ----------- |
| Admin | `arjun.admin@store.com` | `Admin@123` |
| Admin | `sneha.admin@store.com` | `Admin@456` |
| User  | `priya.mehta@gmail.com` | `User@123`  |
| User  | `rahul.verma@gmail.com` | `User@456`  |
| User  | `ananya.k@gmail.com`    | `User@789`  |

### 5. Run

```bash
# Terminal 1 — all backend services (proxy + service-a + service-b)
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

### 6. Open

| Process        | URL                   | Protocol    |
| -------------- | --------------------- | ----------- |
| Frontend       | http://localhost:5173 | HTTP        |
| gRPC-Web Proxy | http://localhost:8080 | gRPC-Web    |
| Service A      | localhost:50051       | native gRPC |
| Service B      | localhost:50052       | native gRPC |
| MySQL          | localhost:3306        | —           |

### Docker

`docker-compose.yml` currently only provisions MongoDB and predates the MySQL/Prisma migration — it does **not** start a MySQL container. Run MySQL yourself (local install, Docker image, or a managed instance) and point `DATABASE_URL` at it until the compose file is updated.

```bash
cd backend
npm run docker:up    # MongoDB only — not used by either service currently
npm run docker:logs
npm run docker:down
```

---

## Backend — Service Reference

### Port map

| Service        | Port  | Protocol             |
| -------------- | ----- | -------------------- |
| gRPC-Web Proxy | 8080  | gRPC-Web (HTTP/1.1)  |
| Service A      | 50051 | native gRPC (HTTP/2) |
| Service B      | 50052 | native gRPC (HTTP/2) |
| MongoDB        | 27017 | —                    |

---

### Service A — `backend/services/service-a/`

Handles all e-commerce logic: auth, products, orders, cart.

**Proto contract**

```
service ServiceA {
  rpc HealthCheck       (HealthCheckRequest)      returns (HealthCheckResponse);

  rpc Register          (RegisterRequest)          returns (AuthResponse);
  rpc Login             (LoginRequest)             returns (AuthResponse);
  rpc RefreshToken      (RefreshTokenRequest)      returns (AuthResponse);
  rpc Logout            (RefreshTokenRequest)      returns (StatusResponse);
  rpc AdminLogin        (AdminLoginRequest)         returns (AdminAuthResponse);

  rpc GetProducts       (GetProductsRequest)        returns (GetProductsResponse);
  rpc GetProductById    (GetByIdRequest)            returns (ProductResponse);
  rpc CreateProduct     (CreateProductRequest)      returns (ProductResponse);
  rpc UpdateProduct     (UpdateProductRequest)      returns (ProductResponse);
  rpc DeleteProduct     (DeleteItemRequest)         returns (StatusResponse);
  rpc ActivateProduct   (GetByIdRequest)            returns (ProductResponse);
  rpc DeactivateProduct (GetByIdRequest)            returns (ProductResponse);

  rpc CreateOrder       (CreateOrderRequest)        returns (OrderResponse);
  rpc GetOrderById      (GetByIdRequest)            returns (OrderResponse);
  rpc GetOrders         (GetOrdersRequest)          returns (GetOrdersResponse);
  rpc GetUserOrders     (GetUserOrdersRequest)      returns (GetOrdersResponse);

  rpc AddToCart         (AddToCartRequest)          returns (CartResponse);
  rpc GetCart           (HealthCheckRequest)        returns (CartResponse);
  rpc UpdateCartItem    (UpdateCartItemRequest)     returns (CartResponse);
  rpc RemoveFromCart    (RemoveFromCartRequest)     returns (CartResponse);
  rpc ClearCart         (HealthCheckRequest)        returns (StatusResponse);
  rpc CheckoutCart      (HealthCheckRequest)        returns (OrderResponse);
}
```

**Cart → Order flow**

1. `AddToCart` — validates stock, upserts item into user's cart
2. `CheckoutCart` — atomically validates stock, decrements inventory, creates Order, clears cart

**Auth token flow**

1. `Register` / `Login` — issue a 15-minute JWT access token + a 7-day opaque refresh token (hash stored in `refresh_tokens`, plaintext returned to the client).
2. `RefreshToken` — validates the refresh token, revokes it, and issues a new access + refresh token pair (rotation).
3. `Logout` — revokes the presented refresh token server-side.

**Prisma models (MySQL):** Admin, User, Product, Order, OrderItem, Cart, CartItem, Item (legacy), RefreshToken

---

### Service B — `backend/services/service-b/`

Handles the careers board: job listings and applications.

**Proto contract**

```
service ServiceB {
  rpc HealthCheck               (HealthCheckRequest)              returns (HealthCheckResponse);

  rpc GetJobs                   (GetJobsRequest)                  returns (GetJobsResponse);
  rpc GetJobById                (GetByIdRequest)                  returns (JobResponse);
  rpc CreateJob                 (CreateJobRequest)                returns (JobResponse);
  rpc UpdateJob                 (UpdateJobRequest)                returns (JobResponse);
  rpc DeleteJob                 (DeleteRecordRequest)             returns (StatusResponse);
  rpc ActivateJob               (GetByIdRequest)                  returns (JobResponse);
  rpc DeactivateJob             (GetByIdRequest)                  returns (JobResponse);

  rpc CreateApplication         (CreateApplicationRequest)        returns (ApplicationResponse);
  rpc GetApplicationById        (GetByIdRequest)                  returns (ApplicationResponse);
  rpc GetApplications           (GetApplicationsRequest)          returns (GetApplicationsResponse);
  rpc GetUserApplications       (GetUserAppRequest)               returns (GetApplicationsResponse);
  rpc GetJobApplications        (GetByIdRequest)                  returns (GetApplicationsResponse);
  rpc UpdateApplicationStatus   (UpdateApplicationStatusRequest)  returns (ApplicationResponse);
  rpc DeleteApplication         (GetByIdRequest)                  returns (StatusResponse);
}
```

**Prisma models (MySQL):** Job, Application, Record (legacy)

---

### gRPC-Web Proxy — `backend/grpc-web-proxy/`

Bridges the browser (gRPC-Web over HTTP/1.1) to backend services (native gRPC over HTTP/2).

**Important:** `src/proxy.ts` contains a `SERVICE_MAP` that must be manually updated every time a new RPC is added to either service. It is not auto-generated.

**Frame format**

```
[ flag: 1 byte ][ length: 4 bytes big-endian ][ protobuf payload ]

Data frame:    flag = 0x00
Trailer frame: flag = 0x80  →  "grpc-status:0\r\ngrpc-message:\r\n"
```

**Environment variables**

| Variable                | Description                                                                |
| ----------------------- | --------------------------------------------------------------------------- |
| `PORT`                  | Proxy listen port (default 8080)                                           |
| `CORS_ORIGIN`           | Allowed browser origin                                                     |
| `SERVICE_A_GRPC_HOST`   | Service A hostname                                                         |
| `SERVICE_A_GRPC_PORT`   | Service A port (default 50051)                                             |
| `SERVICE_B_GRPC_HOST`   | Service B hostname                                                         |
| `SERVICE_B_GRPC_PORT`   | Service B port (default 50052)                                             |
| `RATE_LIMIT_WINDOW_MS`  | Rate-limit window in ms (default 900000 = 15 min)                          |
| `RATE_LIMIT_MAX`        | Max attempts per IP per window (default 20) — applies only to `Login` / `Register` / `AdminLogin` / `RefreshToken` |

---

## Frontend — React Query Hooks

### Service A hooks (`src/hooks/useServiceA.ts`)

```ts
useLogin()              // Login mutation
useRegister()           // Register mutation
useLogout()             // Clears local session + best-effort revokes the refresh token server-side
useProducts(params?)    // GetProducts — paginated, filterable
useCart()               // GetCart
useAddToCart()          // AddToCart mutation
useUpdateCartItem()     // UpdateCartItem mutation
useRemoveFromCart()     // RemoveFromCart mutation
useClearCart()          // ClearCart mutation
useCheckoutCart()       // CheckoutCart → creates Order, clears cart
useUserOrders(params?)  // GetUserOrders — current user's history
useCreateOrder()        // CreateOrder mutation
```

### Service B hooks (`src/hooks/useServiceB.ts`)

```ts
useJobs(params?)                    // GetJobs — filterable by status, department
useJob(id)                          // GetJobById
useCreateJob()                      // CreateJob (admin)
useUpdateJob()                      // UpdateJob (admin)
useDeleteJob()                      // DeleteJob (admin)
useActivateJob()                    // ActivateJob (admin)
useDeactivateJob()                  // DeactivateJob (admin)
useCreateApplication()              // CreateApplication (auth required)
useApplications(params?)            // GetApplications (admin only)
useUserApplications(userId: string) // GetUserApplications
useUpdateApplicationStatus()        // UpdateApplicationStatus (admin)
useDeleteApplication()              // DeleteApplication (admin)
```

---

## Documentation

`docs/SYSTEM_DESIGN.pdf` / `docs/SYSTEM_DESIGN.html` — a standalone system design write-up covering the gRPC-Web architecture, service boundaries, and data flow in more depth than this README.

`backend/PROJECT_PIPELINE.md` / `frontend/PROJECT_PIPELINE.md` — local-only pipeline diagrams (gitignored, not pushed to GitHub) mapping each npm script to the file it executes and what it does end to end.

---

## Backend Scripts

```bash
# From backend/
npm run install:all   # install deps for proxy + service-a + service-b
npm run dev            # start proxy + service-a + service-b concurrently (nodemon)
npm run start           # start all three without nodemon (production-style)
npm run seed             # wipe + reseed service-a (Admin, User, Product, Order, Cart), then service-b (Job, Application)
npm run seed:products   # idempotent extra product seeder (service-a) — skips items that already exist by name
npm run seed:jobs       # idempotent extra job seeder (service-b) — skips jobs that already exist by title
npm run seed:all         # seed + seed:products + seed:jobs
npm run docker:up       # start MongoDB via Docker Compose (legacy — neither service uses MongoDB anymore)
npm run docker:down     # stop containers
npm run docker:logs     # stream container logs

npm run proto:lint          # lint backend/proto/*.proto with buf
npm run proto:format        # format .proto files in place
npm run proto:format:check  # fail if .proto files aren't formatted (CI)
npm run proto:breaking      # fail if uncommitted .proto changes break the wire contract
npm run proto:generate      # regenerate TypeScript message types into service-a, service-b,
                             # grpc-web-proxy, and frontend/src/grpc/generated (run by install:all;
                             # re-run manually after editing a .proto file)
```

`**/generated/` is gitignored — those directories only exist after `proto:generate` runs, so a fresh clone must run `npm run install:all` (or `npm run proto:generate` directly) before service-a, service-b, grpc-web-proxy, or the frontend will typecheck.

Per-service Prisma scripts (run from `backend/services/service-a/` or `service-b/`):

```bash
npm run db:generate  # regenerate the Prisma client after editing schema.prisma
npm run db:migrate   # create + apply a migration (dev)
npm run db:push      # push schema.prisma to the database without a migration file
```