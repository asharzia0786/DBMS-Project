# Luxury CNC Backend (separate service)

This backend is intentionally separate from `clerk-nextjs` and focuses on business APIs, workflows, and data access.

## Stack

- Node.js + Express + TypeScript
- PostgreSQL + Prisma
- Clerk middleware (`@clerk/express`)
- Zod validation
- Cloudinary (signed upload URLs)
- Resend (email integration)
- Upstash Redis + BullMQ (phase-ready)

## Architecture

```txt
/app/api/*                  -> thin API routes only
/server/services            -> business logic
/server/repositories        -> Prisma data access
/server/validators          -> Zod schemas
/server/types               -> shared types
/server/integrations        -> Clerk, Resend, Cloudinary, queue
/server/utils               -> helpers, env, errors
```

## Local setup

1. Copy env template:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client and prepare DB:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```
   The API process starts the notification worker automatically.

## Automated Resend emails

The backend can send these emails through Resend:

- Order confirmation when a customer places an order
- Logistics / shipping update when an order reaches `SHIPPED`
- Order status updates for admin status changes and cancellations
- Custom quote responses
- Inquiry responses from the admin inbox

Required env values:

- `RESEND_API_KEY`
- `EMAIL_FROM` (verified sender in Resend)

## API

- `GET /api/products`
- `GET /api/products?search=&category=&material=&finish=&page=&pageSize=`
- `POST /api/products` (admin)
- `PATCH /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `GET /api/products/:slug`
- `GET /api/custom-orders` (auth, current user's requests)
- `GET /api/custom-orders/admin` (admin)
- `GET /api/custom-orders/:id` (auth, owner or admin)
- `POST /api/custom-orders` (auth)
- `PATCH /api/custom-orders/:id/status` (admin)
- `GET /api/orders` (auth, current user's orders)
- `GET /api/orders/admin` (admin)
- `GET /api/orders/:id` (auth, owner or admin)
- `PATCH /api/orders/:id/cancel` (auth, owner or admin, cancellable orders only)
- `POST /api/orders` (auth)
- `PATCH /api/orders/:id/status` (admin)
- `GET /api/media/upload-signature` (admin)
- `POST /api/inquiries` (public)
- `GET /api/inquiries` (admin)

Product records include catalog fields from the CNC brief (`category`, `material`, `finish`) plus flexible `metadata` for variants, sizes, engraving options, and future dynamic pricing rules.

All responses:

```json
{
  "success": true,
  "data": {}
}
```

or

```json
{
  "success": false,
  "error": "message"
}
```

## Deployment checklist

1. Set production env values (`DATABASE_URL`, `FRONTEND_URLS`, Clerk keys, etc.).
2. Deploy with the root `render.yaml` Blueprint or use these Render commands:
   ```bash
   npm ci
   npm run prisma:generate
   npm run build
   npm run prisma:deploy
   npm run start
   ```
3. Point frontend `VITE_API_BASE_URL` to your deployed backend `/api` URL.

See `../PRODUCTION_SETUP.md` for the full service-by-service setup checklist.
See `../UPSTASH_SETUP.md` for the Redis and worker setup.
See `../POSTMAN_BACKEND_TESTS.md` for a Postman test checklist.
