# Microservices Architecture

## Overview

The backend is composed of three processes that run concurrently:

```
Browser / gRPC-Web client
         │
         │  HTTP POST (application/grpc-web+proto)  port 8080
         ▼
┌─────────────────────────┐
│   grpc-web-proxy        │  Express.js — translates gRPC-Web frames → native gRPC calls
└────────┬───────┬────────┘
         │       │  native gRPC (binary protobuf over HTTP/2)
    ┌────▼──┐ ┌──▼────┐
    │ svc-a │ │ svc-b │
    │ :50051│ │ :50052│
    └───┬───┘ └───┬───┘
        │         │
        └────┬────┘
             ▼
       MongoDB :27017
       database: myData
```

### Process map

| Process | Entry point | Port | Responsibility |
|---------|-------------|------|----------------|
| grpc-web-proxy | `grpc-web-proxy/src/server.ts` | 8080 | HTTP→gRPC bridge, auth header forwarding |
| service-a | `services/service-a/src/server.ts` | 50051 | User auth, Admin auth, Products, Orders |
| service-b | `services/service-b/src/server.ts` | 50052 | Records (legacy), Jobs, Applications |

All three are started together with `npm run dev` (root `package.json` uses `concurrently`).

---

## Folder structure

```
backend/
├── proto/
│   ├── service-a.proto        # ServiceA protobuf definitions
│   └── service-b.proto        # ServiceB protobuf definitions
├── grpc-web-proxy/
│   └── src/
│       ├── server.ts          # Express app bootstrap
│       ├── proxy.ts           # SERVICE_MAP + handleGrpcWeb handler
│       ├── app.ts             # Express middleware / route mounting
│       ├── types.ts           # Proxy-level types
│       ├── config/            # Proxy config (port, CORS, service hosts)
│       └── grpc-clients/
│           ├── types.ts       # Client interface types
│           ├── serviceAClient.ts
│           └── serviceBClient.ts
├── services/
│   ├── service-a/src/
│   │   ├── config/            # ServiceAConfig (grpc, db, jwt)
│   │   ├── constants/         # Status enums, error messages, ROLES
│   │   ├── models/
│   │   │   ├── types.ts       # IItem, IUser, IAdmin, IProduct, IOrder interfaces
│   │   │   ├── itemModel.ts   # Legacy Item schema
│   │   │   ├── userModel.ts   # User schema (role: USER)
│   │   │   ├── adminModel.ts  # Admin schema (role: ADMIN, immutable)
│   │   │   ├── productModel.ts
│   │   │   └── orderModel.ts
│   │   ├── repositories/      # DB layer (no business logic)
│   │   │   ├── itemRepository.ts
│   │   │   ├── userRepository.ts
│   │   │   ├── adminRepository.ts
│   │   │   ├── productRepository.ts  # includes decrementStock()
│   │   │   └── orderRepository.ts
│   │   ├── services/          # Business logic
│   │   │   ├── types.ts       # All service-level DTOs and params
│   │   │   ├── authService.ts # Register + Login (JWT role:USER)
│   │   │   ├── adminService.ts# Admin login (JWT role:ADMIN)
│   │   │   ├── productService.ts
│   │   │   └── orderService.ts# Stock check + decrement on create
│   │   ├── utils/
│   │   │   ├── types.ts       # GrpcProductDto, GrpcOrderDto, etc.
│   │   │   └── index.ts       # productToGrpc(), orderToGrpc() mappers
│   │   ├── grpc/
│   │   │   ├── handlers/
│   │   │   │   ├── types.ts   # UnaryCall<T>, UnaryCb, request types
│   │   │   │   ├── adminHandler.ts   # AdminLogin + exported requireAdmin()
│   │   │   │   ├── productHandler.ts
│   │   │   │   ├── orderHandler.ts
│   │   │   │   └── itemHandler.ts    # legacy
│   │   │   └── server.ts      # gRPC server bootstrap + handler registration
│   │   └── scripts/
│   │       └── seed.ts        # `npm run seed` — admin + users + products + orders
│   └── service-b/src/
│       ├── config/            # ServiceBConfig (grpc, db, jwt)
│       ├── constants/         # Job/Application status enums
│       ├── models/
│       │   ├── types.ts       # IRecord, IJob, IApplication interfaces
│       │   ├── recordModel.ts # Legacy Record schema
│       │   ├── jobModel.ts
│       │   └── applicationModel.ts  # unique index on {userId, jobId}
│       ├── repositories/
│       │   ├── recordRepository.ts
│       │   ├── jobRepository.ts
│       │   └── applicationRepository.ts  # findByUserAndJob for dup check
│       ├── services/
│       │   ├── types.ts
│       │   ├── recordService.ts       # legacy
│       │   ├── jobService.ts
│       │   └── applicationService.ts  # ConflictError on duplicate apply
│       ├── utils/
│       │   ├── types.ts       # GrpcJobDto, GrpcApplicationDto
│       │   └── index.ts       # jobToGrpc(), applicationToGrpc()
│       ├── grpc/
│       │   ├── handlers/
│       │   │   ├── types.ts
│       │   │   ├── jobHandler.ts        # inline requireAdmin (uses config.jwt.secret)
│       │   │   └── applicationHandler.ts
│       │   └── server.ts
│       └── scripts/
│           └── seed.ts        # `npm run seed` — jobs + applications
└── shared/
    └── ...                    # Shared errors, middleware, helpers
```

---

## Authentication flow

### User auth (service-a)
1. Client calls `Register` or `Login` via proxy → service-a
2. service-a returns JWT with payload `{ id, email, name, role: "USER" }`
3. Client stores token and sends `Authorization: Bearer <token>` in HTTP headers
4. Proxy extracts the header and forwards it as gRPC metadata key `authorization`
5. Handlers that require auth call `jwt.verify()` on the value from `call.metadata.get('authorization')`

### Admin auth (service-a)
1. Client calls `AdminLogin` with `{ email, password }`
2. service-a looks up Admin model (separate collection), verifies bcrypt hash
3. Returns JWT with payload `{ id, email, name, role: "ADMIN" }`
4. Same header forwarding as above — handlers check `decoded.role === 'ADMIN'`

### Auth in service-b
- service-b reads `JWT_SECRET` from env (must match service-a's secret)
- Handlers extract and verify the JWT from gRPC metadata directly (no shared middleware)

---

## RBAC summary

| Endpoint | Auth required | Role required |
|----------|--------------|---------------|
| Register / Login / AdminLogin | No | — |
| GetProducts / GetProductById | No | — |
| GetJobs / GetJobById | No | — |
| CreateOrder | Yes | USER or ADMIN |
| GetUserOrders | Yes | USER (own) / ADMIN (any) |
| CreateApplication | Yes | USER or ADMIN |
| GetUserApplications | Yes | USER (own) / ADMIN (any) |
| CreateProduct / UpdateProduct / DeleteProduct | Yes | ADMIN |
| ActivateProduct / DeactivateProduct | Yes | ADMIN |
| CreateJob / UpdateJob / DeleteJob | Yes | ADMIN |
| ActivateJob / DeactivateJob | Yes | ADMIN |
| GetOrderById / GetOrders | Yes | ADMIN |
| GetApplicationById / GetApplications / GetJobApplications | Yes | ADMIN |

---

## Error codes (gRPC status → HTTP analogue)

| gRPC status | Meaning |
|-------------|---------|
| UNAUTHENTICATED (16) | Missing / invalid / expired JWT |
| PERMISSION_DENIED (7) | Valid JWT but wrong role |
| NOT_FOUND (5) | Resource not found |
| ALREADY_EXISTS (6) | Duplicate resource (e.g. duplicate application) |
| INVALID_ARGUMENT (3) | Validation failure |
| INTERNAL (13) | Unexpected server error |

---

## Seed data

Run once after first start:
```bash
cd backend
npm run seed
```

Seeds (skips if already present):
- 1 admin: `admin@example.com` / `Admin@123`
- 10 users: `user1@example.com` … `user10@example.com` / `User@1234`
- 20 products across 4 categories
- 10 orders (one per user, first product)
- 10 jobs across 3 departments
- 10 applications (one per user, first job)

---

## Running the project

```bash
# 1. Install all dependencies
cd backend
npm install                        # root
npm --prefix services/service-a install
npm --prefix services/service-b install
npm --prefix grpc-web-proxy install

# 2. Configure environment
cp services/service-a/.env.example services/service-a/.env
cp services/service-b/.env.example services/service-b/.env
cp grpc-web-proxy/.env.example grpc-web-proxy/.env
# Edit .env files to set MONGODB_URI and JWT_SECRET

# 3. Start all services
npm run dev            # runs proxy + service-a + service-b concurrently

# 4. Seed data (first run)
npm run seed
```
