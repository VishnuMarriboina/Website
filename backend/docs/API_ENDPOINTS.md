# API & gRPC Endpoint Reference

All client requests go through the gRPC-Web proxy at `http://localhost:8080`.

URL pattern: `POST http://localhost:8080/{serviceKey}/{MethodName}`

Content-Type: `application/grpc-web+proto`

Authorization: `Bearer <jwt>` (header forwarded as gRPC metadata)

---

## Service A  (`servicea.ServiceA`, port 50051)

### Legacy — Items

| Method | URL path | Auth | Request fields | Response |
|--------|----------|------|----------------|----------|
| HealthCheck | `/servicea.ServiceA/HealthCheck` | No | — | `{ status, message }` |
| GetAll | `/servicea.ServiceA/GetAll` | No | `page, limit` | `{ items[], total, page, limit }` |
| GetById | `/servicea.ServiceA/GetById` | No | `id` | `{ item }` |
| Create | `/servicea.ServiceA/Create` | No | `name, value` | `{ item }` |
| Update | `/servicea.ServiceA/Update` | No | `id, name?, value?` | `{ item }` |
| Delete | `/servicea.ServiceA/Delete` | No | `id` | `{ success, message }` |

### User auth

| Method | URL path | Auth | Request fields | Response |
|--------|----------|------|----------------|----------|
| Register | `/servicea.ServiceA/Register` | No | `name, email, password` | `{ token, user }` |
| Login | `/servicea.ServiceA/Login` | No | `email, password` | `{ token, user }` |

### Admin auth

| Method | URL path | Auth | Request fields | Response |
|--------|----------|------|----------------|----------|
| AdminLogin | `/servicea.ServiceA/AdminLogin` | No | `email, password` | `{ token, admin }` |

### Products

| Method | URL path | Auth | Role | Request fields | Response |
|--------|----------|------|------|----------------|----------|
| GetProducts | `/servicea.ServiceA/GetProducts` | No | — | `page?, limit?, status?, category?, search?` | `{ data[], meta }` |
| GetProductById | `/servicea.ServiceA/GetProductById` | No | — | `id` | `{ data }` |
| CreateProduct | `/servicea.ServiceA/CreateProduct` | Yes | ADMIN | `name, description?, category?, image?, price?, stock?, status?` | `{ data }` |
| UpdateProduct | `/servicea.ServiceA/UpdateProduct` | Yes | ADMIN | `id, name?, description?, category?, image?, price?, stock?, status?` | `{ data }` |
| DeleteProduct | `/servicea.ServiceA/DeleteProduct` | Yes | ADMIN | `id` | `{ success, message }` |
| ActivateProduct | `/servicea.ServiceA/ActivateProduct` | Yes | ADMIN | `id` | `{ data }` |
| DeactivateProduct | `/servicea.ServiceA/DeactivateProduct` | Yes | ADMIN | `id` | `{ data }` |

Product status values: `active`, `inactive`, `draft`, `archived`

### Orders

| Method | URL path | Auth | Role | Request fields | Response |
|--------|----------|------|------|----------------|----------|
| CreateOrder | `/servicea.ServiceA/CreateOrder` | Yes | USER/ADMIN | `productId, quantity` | `{ data }` |
| GetOrderById | `/servicea.ServiceA/GetOrderById` | Yes | ADMIN | `id` | `{ data }` |
| GetOrders | `/servicea.ServiceA/GetOrders` | Yes | ADMIN | `page?, limit?, orderStatus?` | `{ data[], meta }` |
| GetUserOrders | `/servicea.ServiceA/GetUserOrders` | Yes | USER(own)/ADMIN | `userId?, page?, limit?` | `{ data[], meta }` |

Order status values: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

---

## Service B  (`serviceb.ServiceB`, port 50052)

### Legacy — Records

| Method | URL path | Auth | Request fields | Response |
|--------|----------|------|----------------|----------|
| HealthCheck | `/serviceb.ServiceB/HealthCheck` | No | — | `{ status, message }` |
| GetAll | `/serviceb.ServiceB/GetAll` | No | `page, limit` | `{ records[], total, page, limit }` |
| GetById | `/serviceb.ServiceB/GetById` | No | `id` | `{ record }` |
| Create | `/serviceb.ServiceB/Create` | No | `title, content` | `{ record }` |
| Update | `/serviceb.ServiceB/Update` | No | `id, title?, content?` | `{ record }` |
| Delete | `/serviceb.ServiceB/Delete` | No | `id` | `{ success, message }` |

### Jobs

| Method | URL path | Auth | Role | Request fields | Response |
|--------|----------|------|------|----------------|----------|
| GetJobs | `/serviceb.ServiceB/GetJobs` | No | — | `page?, limit?, status?, department?, search?` | `{ data[], meta }` |
| GetJobById | `/serviceb.ServiceB/GetJobById` | No | — | `id` | `{ data }` |
| CreateJob | `/serviceb.ServiceB/CreateJob` | Yes | ADMIN | `title, description?, department?, location?, experienceRequired?, salaryRange?, status?` | `{ data }` |
| UpdateJob | `/serviceb.ServiceB/UpdateJob` | Yes | ADMIN | `id, title?, description?, department?, location?, experienceRequired?, salaryRange?, status?` | `{ data }` |
| DeleteJob | `/serviceb.ServiceB/DeleteJob` | Yes | ADMIN | `id` | `{ success, message }` |
| ActivateJob | `/serviceb.ServiceB/ActivateJob` | Yes | ADMIN | `id` | `{ data }` |
| DeactivateJob | `/serviceb.ServiceB/DeactivateJob` | Yes | ADMIN | `id` | `{ data }` |

Job status values: `active`, `inactive`, `draft`, `closed`

### Applications

| Method | URL path | Auth | Role | Request fields | Response |
|--------|----------|------|------|----------------|----------|
| CreateApplication | `/serviceb.ServiceB/CreateApplication` | Yes | USER/ADMIN | `jobId, resumeUrl?, coverLetter?` | `{ data }` |
| GetApplicationById | `/serviceb.ServiceB/GetApplicationById` | Yes | USER/ADMIN | `id` | `{ data }` |
| GetApplications | `/serviceb.ServiceB/GetApplications` | Yes | ADMIN | `page?, limit?, applicationStatus?` | `{ data[], meta }` |
| GetUserApplications | `/serviceb.ServiceB/GetUserApplications` | Yes | USER(own)/ADMIN | `userId?, page?, limit?` | `{ data[], meta }` |
| GetJobApplications | `/serviceb.ServiceB/GetJobApplications` | Yes | ADMIN | `id` (jobId) | `{ data[], meta }` |

Application status values: `applied`, `reviewing`, `shortlisted`, `rejected`, `hired`

---

## Pagination meta object

All list responses include a `meta` object:
```json
{
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "hasNext": true,
  "hasPrev": false
}
```

---

## Testing with grpcurl

```bash
# Install grpcurl
brew install grpcurl   # or download from github.com/fullstorydev/grpcurl

# Admin login
grpcurl -plaintext -d '{"email":"admin@example.com","password":"Admin@123"}' \
  localhost:50051 servicea.ServiceA/AdminLogin

# List products (no auth)
grpcurl -plaintext -d '{"page":1,"limit":5}' \
  localhost:50051 servicea.ServiceA/GetProducts

# Create a product (admin token required)
grpcurl -plaintext \
  -H 'authorization: Bearer <ADMIN_TOKEN>' \
  -d '{"name":"Test Stone","price":120,"stock":500,"status":"active"}' \
  localhost:50051 servicea.ServiceA/CreateProduct

# User login
grpcurl -plaintext -d '{"email":"user1@example.com","password":"User@1234"}' \
  localhost:50051 servicea.ServiceA/Login

# Place an order (user token required)
grpcurl -plaintext \
  -H 'authorization: Bearer <USER_TOKEN>' \
  -d '{"productId":"<PRODUCT_ID>","quantity":2}' \
  localhost:50051 servicea.ServiceA/CreateOrder

# Apply to a job (user token required)
grpcurl -plaintext \
  -H 'authorization: Bearer <USER_TOKEN>' \
  -d '{"jobId":"<JOB_ID>","resumeUrl":"https://example.com/resume.pdf"}' \
  localhost:50052 serviceb.ServiceB/CreateApplication
```
