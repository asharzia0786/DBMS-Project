# DBMS Project - Complete API & Configuration Guide

A luxury CNC furniture e-commerce platform with custom order management, built with React + Express + PostgreSQL.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [System Architecture](#system-architecture)
3. [Environment Configuration](#environment-configuration)
4. [Backend API Reference](#backend-api-reference)
5. [Frontend Setup](#frontend-setup)
6. [Database Setup](#database-setup)
7. [Authentication (Clerk)](#authentication-clerk)
8. [Media Upload (Cloudinary)](#media-upload-cloudinary)
9. [Deployments](#deployments)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 13+ (running locally or remote)
- Clerk account (for authentication)
- Cloudinary account (for media uploads)

### Development Setup (5 minutes)

```bash
# 1. Backend setup
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run dev

# 2. Frontend setup (in another terminal)
cd Frontend
npm install
npm run dev

# 3. Open browser
# Frontend: http://localhost:5173
# Backend: http://localhost:4000/api
# Health check: http://localhost:4000/health
```

---

## System Architecture

### Project Structure

```
DBMS Project/
├── backend/                          # Express + TypeScript API
│   ├── app/api/                      # Route handlers
│   │   ├── products.routes.ts
│   │   ├── orders.routes.ts
│   │   ├── custom-orders.routes.ts
│   │   ├── inquiries.routes.ts
│   │   └── media.routes.ts
│   ├── server/
│   │   ├── services/                 # Business logic
│   │   ├── repositories/             # Database queries (Prisma)
│   │   ├── validators/               # Zod validation schemas
│   │   ├── types/                    # Shared TypeScript types
│   │   ├── integrations/             # External services (Clerk, Cloudinary, Resend)
│   │   ├── middleware/               # Express middleware
│   │   └── utils/                    # Helpers, env config, error handling
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema
│   │   └── migrations/               # DB migrations
│   ├── .env                          # Environment variables (gitignored)
│   ├── .env.example                  # Template for .env
│   ├── server.ts                     # Express app entry point
│   └── package.json
│
├── Frontend/                         # React + Vite frontend
│   ├── src/
│   │   ├── components/               # React components
│   │   ├── pages/                    # Page layouts
│   │   ├── lib/                      # Utilities (API client, helpers)
│   │   ├── App.tsx                   # Main App component
│   │   └── main.tsx                  # Entry point
│   ├── public/                       # Static assets
│   ├── .env                          # Environment variables (gitignored)
│   ├── .env.example                  # Template for .env
│   ├── vite.config.ts                # Vite configuration
│   └── package.json
│
└── prisma/
    └── schema.prisma                 # Database schema
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | UI framework |
| Frontend Styling | Tailwind CSS | Utility-first CSS |
| Frontend Animations | Framer Motion | Smooth animations |
| Frontend Icons | Lucide React | Icon library |
| Authentication | Clerk | User auth & identity |
| Backend | Express.js | REST API server |
| Language | TypeScript | Type safety |
| Database | PostgreSQL | Primary data store |
| ORM | Prisma | Database abstraction |
| Validation | Zod | Runtime schema validation |
| Media Storage | Cloudinary | Image upload & optimization |
| Email | Resend | Email delivery |
| Rate Limiting | express-rate-limit | API protection |
| Security | Helmet | HTTP security headers |
| CORS | cors | Cross-origin requests |
| Logging | Morgan | HTTP request logging |
| Task Queue | BullMQ (optional) | Background jobs |
| Caching | Redis (optional) | Upstash Redis |

### API Response Format

All endpoints return standardized JSON responses:

**Success Response (200-299):**
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ }
}
```

**Error Response (400+):**
```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

---

## Environment Configuration

### Backend Environment Variables

Create `backend/.env` with these variables:

```bash
# Server
NODE_ENV=development
PORT=4000

# Frontend URLs (for CORS)
FRONTEND_URL=http://localhost:5173
FRONTEND_URLS=http://localhost:5173,https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myapp?schema=public
# Format: postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?schema=public

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Email (Resend)
RESEND_API_KEY=re_xxx

# Media Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Caching (Optional - for Redis/Upstash)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
REDIS_URL=redis://localhost:6379
```

#### Getting Credentials

**Clerk:**
1. Go to [clerk.com](https://clerk.com)
2. Create account and new application
3. Copy `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from Dashboard → API Keys

**Cloudinary:**
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Find credentials at Dashboard → Settings → API Keys

**Resend (Email):**
1. Go to [resend.com](https://resend.com)
2. Create account and get API key
3. Verify sender domain

**PostgreSQL:**
- Local: `postgresql://postgres:password@localhost:5432/myapp?schema=public`
- Remote: Use hosted provider like Supabase, Railway, Render

**Upstash Redis (Optional):**
1. Go to [console.upstash.com](https://console.upstash.com)
2. Create Redis database
3. Copy REST URL and Token

### Frontend Environment Variables

Create `Frontend/.env`:

```bash
# API
VITE_API_BASE_URL=http://localhost:4000/api
VITE_APP_URL=http://localhost:5173

# Clerk (must match backend public key)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

#### Frontend Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `http://localhost:4000/api` |
| `VITE_APP_URL` | Frontend application URL | `http://localhost:5173` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public key for authentication | `pk_test_xxx` |

---

## Backend API Reference

### Base URL

- **Development:** `http://localhost:4000/api`
- **Production:** `https://your-api-domain.com/api`

### Health Check

```http
GET /health
```

Returns `{ "success": true, "data": { "status": "ok" } }`

---

## Products API

### List Products

```http
GET /api/products
```

**Query Parameters:**
- `page` (int, default=1) - Page number
- `pageSize` (int, default=12) - Items per page
- `search` (string) - Search by name/description
- `category` (string) - Filter by category
- `material` (string) - Filter by material (e.g., "Walnut", "Shisham")
- `finish` (string) - Filter by finish (e.g., "Matte", "Glossy")

**Example:**
```
GET /api/products?page=1&pageSize=12&category=Beds&material=Walnut
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Imperial Sovereign Bed",
        "slug": "imperial-sovereign-bed",
        "description": "...",
        "category": "Beds",
        "material": "Solid Walnut",
        "finish": "Natural Oil",
        "basePrice": 480000,
        "images": [
          {
            "id": "uuid",
            "imageUrl": "https://cloudinary.com/...",
            "altText": "Front view"
          }
        ],
        "metadata": {
          "collection": "Royal Heritage",
          "sizes": ["King", "Queen", "Double"],
          "warranty": "5 years"
        },
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 45,
    "page": 1,
    "pageSize": 12,
    "totalPages": 4
  }
}
```

### Get Product by Slug

```http
GET /api/products/:slug
```

**Example:**
```
GET /api/products/imperial-sovereign-bed
```

### Create Product (Admin Only)

```http
POST /api/products
Authorization: Bearer <clerk-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Product Name",
  "slug": "product-slug",
  "description": "Product description",
  "category": "Beds",
  "material": "Walnut",
  "finish": "Natural Oil",
  "basePrice": 480000,
  "imageUrls": [
    "https://cloudinary.com/image1.jpg"
  ],
  "metadata": {
    "collection": "Royal Heritage",
    "sizes": ["King", "Queen", "Double"]
  }
}
```

### Update Product (Admin Only)

```http
PATCH /api/products/:id
Authorization: Bearer <clerk-token>
Content-Type: application/json
```

**Request Body:** (partial update)
```json
{
  "basePrice": 500000,
  "metadata": { "sizes": ["King", "Queen", "Double", "Single"] }
}
```

### Delete Product (Admin Only)

```http
DELETE /api/products/:id
Authorization: Bearer <clerk-token>
```

---

## Custom Orders API

Workflow: REQUESTED → UNDER_REVIEW → QUOTED → APPROVED → IN_PRODUCTION → COMPLETED → DELIVERED

### Get My Custom Orders

```http
GET /api/custom-orders
Authorization: Bearer <clerk-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "userId": "clerk_user_id",
        "status": "QUOTED",
        "description": "Custom walnut dining table with...",
        "budgetMin": 50000,
        "budgetMax": 100000,
        "quotedPrice": 75000,
        "notes": "Admin notes here",
        "attachments": [
          {
            "url": "https://cloudinary.com/...",
            "fileName": "sketch.jpg"
          }
        ],
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-16T14:20:00Z"
      }
    ]
  }
}
```

### Create Custom Order Request

```http
POST /api/custom-orders
Authorization: Bearer <clerk-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "description": "Custom walnut dining table with inlay work. Minimum 6 seater, can be extended to 8.",
  "budgetMin": 50000,
  "budgetMax": 100000
}
```

**Validation Rules:**
- `description`: Min 10 characters, max 2000
- `budgetMin`: Positive integer
- `budgetMax`: Must be > budgetMin

### Get Custom Order Details

```http
GET /api/custom-orders/:id
Authorization: Bearer <clerk-token>
```

Accessible only by:
- Order creator
- Admins

### Update Custom Order Status (Admin Only)

```http
PATCH /api/custom-orders/:id/status
Authorization: Bearer <clerk-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "QUOTED",
  "quotedPrice": 75000,
  "notes": "Quote includes premium inlay work. Timeline: 6 weeks."
}
```

**Valid Status Transitions:**
```
REQUESTED → UNDER_REVIEW (default)
         → UNDER_REVIEW → QUOTED (with optional quotedPrice)
         → QUOTED → APPROVED (customer accepts quote)
         → APPROVED → IN_PRODUCTION
         → IN_PRODUCTION → COMPLETED
         → COMPLETED → DELIVERED (terminal state)
```

### Get All Custom Orders (Admin Only)

```http
GET /api/custom-orders/admin
Authorization: Bearer <clerk-token>
```

Returns all custom orders with filters available:
- `status` (REQUESTED, UNDER_REVIEW, QUOTED, etc.)
- `page` and `pageSize`

---

## Orders API

Standard order lifecycle: PENDING → CONFIRMED → SHIPPED → DELIVERED

### Get My Orders

```http
GET /api/orders
Authorization: Bearer <clerk-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "userId": "clerk_user_id",
        "type": "STANDARD",
        "status": "PENDING",
        "paymentStatus": "PENDING",
        "totalAmount": 480000,
        "currency": "PKR",
        "items": [
          {
            "productId": "uuid",
            "quantity": 1,
            "unitPrice": 480000,
            "subtotal": 480000
          }
        ],
        "shippingAddress": {
          "fullName": "John Doe",
          "address": "123 Main St",
          "city": "Karachi",
          "postalCode": "75600",
          "country": "Pakistan",
          "phone": "+92-300-1234567"
        },
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-16T14:20:00Z"
      }
    ]
  }
}
```

### Create Order

```http
POST /api/orders
Authorization: Bearer <clerk-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "STANDARD",
  "items": [
    {
      "productId": "uuid",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "address": "123 Main St",
    "city": "Karachi",
    "postalCode": "75600",
    "country": "Pakistan",
    "phone": "+92-300-1234567"
  }
}
```

### Get Order Details

```http
GET /api/orders/:id
Authorization: Bearer <clerk-token>
```

Accessible only by order creator or admins.

### Update Order Status (Admin Only)

```http
PATCH /api/orders/:id/status
Authorization: Bearer <clerk-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "CONFIRMED",
  "paymentStatus": "PAID"
}
```

**Valid Statuses:**
- `PENDING` → `CONFIRMED` (payment received)
- `CONFIRMED` → `SHIPPED`
- `SHIPPED` → `DELIVERED`

### Get All Orders (Admin Only)

```http
GET /api/orders/admin
Authorization: Bearer <clerk-token>
```

---

## Inquiries API

### Create Inquiry (Public)

```http
POST /api/inquiries
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+92-300-1234567",
  "city": "Karachi",
  "message": "I'm interested in your custom order services..."
}
```

**Validation Rules:**
- `fullName`: Min 2 chars
- `email`: Valid email format
- `phone`: 7-30 digits with +
- `city`: Min 2 chars
- `message`: Min 10 chars

### Get All Inquiries (Admin Only)

```http
GET /api/inquiries
Authorization: Bearer <clerk-token>
```

Returns all inquiries with creation date sorted newest first.

---

## Media Upload API

Cloudinary integration for image uploads. Returns secure signed URLs for client-side uploads.

### Get Upload Signature

```http
GET /api/media/upload-signature
Authorization: Bearer <clerk-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "signature": "abc123xyz789...",
    "timestamp": 1642243200,
    "cloudName": "your-cloud-name",
    "uploadPreset": "product_images"
  }
}
```

**Usage (Frontend):**
```javascript
// Get signature from backend
const { signature, timestamp, cloudName } = await getUploadSignature();

// Upload directly to Cloudinary
const formData = new FormData();
formData.append('file', file);
formData.append('api_key', CLOUDINARY_API_KEY);
formData.append('signature', signature);
formData.append('timestamp', timestamp);

const response = await fetch(
  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  { method: 'POST', body: formData }
);

const data = await response.json();
console.log('Image URL:', data.secure_url);
```

---

## Frontend Setup

### Components Overview

| Component | Purpose | Location |
|-----------|---------|----------|
| `Hero` | Hero section with featured image | `src/components/Hero.tsx` |
| `ProductShowcase` | Grid of featured products | `src/components/ProductShowcase.tsx` |
| `CraftsmanshipStory` | Brand story section | `src/components/CraftsmanshipStory.tsx` |
| `WorkshopExperience` | Workshop gallery section | `src/components/WorkshopExperience.tsx` |
| `ObjectScrollExperience` | Interactive scroll animation | `src/components/ObjectScrollExperience.tsx` |
| `FinalCTA` | Call-to-action with inquiry form | `src/components/FinalCTA.tsx` |
| `Navigation` | Top navigation bar | `src/components/Navigation.tsx` |
| `Footer` | Footer section | `src/components/Footer.tsx` |

### API Client (`src/lib/api.ts`)

```typescript
// Products
export async function fetchProducts(query?: ProductQuery): Promise<Product[]>

// Custom Orders
export async function fetchMyCustomOrders(): Promise<CustomOrder[]>
export async function createCustomOrder(payload: CreateCustomOrderPayload): Promise<CustomOrder>

// Orders
export async function fetchMyOrders(): Promise<Order[]>
export async function createOrder(payload: CreateOrderPayload): Promise<Order>

// Inquiries
export async function submitInquiry(payload: CreateInquiryPayload): Promise<void>

// Media
export async function getUploadSignature(): Promise<UploadSignature>
```

### Usage Examples

```typescript
// Fetch products
import { fetchProducts } from '../lib/api';

const products = await fetchProducts({
  category: 'Beds',
  material: 'Walnut',
  page: 1,
  pageSize: 12
});

// Submit inquiry
import { submitInquiry } from '../lib/api';

await submitInquiry({
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+92-300-1234567',
  city: 'Karachi',
  message: 'I would like to...'
});
```

---

## Database Setup

### Prerequisites

- PostgreSQL 13 or higher
- `postgresql` client CLI (for psql commands)

### Local PostgreSQL Setup (macOS)

```bash
# Install with Homebrew
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create database
createdb myapp

# Verify connection
psql postgres -c "SELECT version();"
```

### Local PostgreSQL Setup (Windows)

1. Download from [postgresql.org](https://postgresql.org/download/windows)
2. Run installer (default port 5432)
3. Note the `postgres` password you set
4. Update `.env`:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/myapp?schema=public
   ```

### Local PostgreSQL Setup (Linux - Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb myapp
```

### Using a Remote Database

Popular options (all have free tiers):

**Supabase (Recommended):**
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Copy connection string from Project Settings → Database
4. Update `.env`:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/postgres?schema=public
   ```

**Railway:**
1. Create project at [railway.app](https://railway.app)
2. Add PostgreSQL plugin
3. Copy connection string
4. Update `.env`

**Neon:**
1. Create database at [console.neon.tech](https://console.neon.tech)
2. Copy connection string
3. Update `.env`

### Initialize Database

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Create/update database schema
npm run prisma:push

# (Optional) Open Prisma Studio to view/edit data
npm run prisma:studio
# Opens at http://localhost:5555
```

### Database Schema

Key tables:

**Products**
- `id` (UUID primary key)
- `name`, `slug`, `description`
- `category`, `material`, `finish`
- `basePrice` (in PKR)
- `images` (relation to ProductImage)
- `metadata` (JSONB for flexible data)
- `createdAt`, `updatedAt`

**CustomOrders**
- `id` (UUID primary key)
- `userId` (Clerk user ID)
- `status` (REQUESTED, UNDER_REVIEW, QUOTED, APPROVED, IN_PRODUCTION, COMPLETED, DELIVERED)
- `description`, `budgetMin`, `budgetMax`
- `quotedPrice`, `notes`
- `attachments` (JSONB array)
- `createdAt`, `updatedAt`

**Orders**
- `id` (UUID primary key)
- `userId` (Clerk user ID)
- `type` (STANDARD, CUSTOM, GIFT)
- `status` (PENDING, CONFIRMED, SHIPPED, DELIVERED)
- `paymentStatus` (PENDING, PAID, FAILED, REFUNDED)
- `totalAmount`, `currency`
- `orderItems` (relation)
- `shippingAddress` (JSONB)
- `createdAt`, `updatedAt`

**Inquiries**
- `id` (UUID primary key)
- `fullName`, `email`, `phone`, `city`, `message`
- `createdAt`

---

## Authentication (Clerk)

Clerk provides passwordless, multi-factor authentication out of the box.

### Setup Clerk

1. **Create Account:** [clerk.com](https://clerk.com)
2. **Create Application:** Choose "Build your own" or template
3. **Get Keys:**
   - Go to Dashboard → API Keys
   - Copy `Publishable Key` and `Secret Key`
   - Update `.env` files

### Backend Authentication

All protected routes use Clerk middleware:

```typescript
// server.ts
import { clerkMiddleware } from "@clerk/express";

app.use(clerkMiddleware());

// Routes automatically have access to req.auth
app.get("/api/protected", (req, res) => {
  const { userId } = req.auth;
  // userId is set if authenticated, null if not
});
```

### Frontend Authentication

**Coming Soon:** Frontend auth UI integration needed.

Currently, Clerk is configured but frontend doesn't have:
- Login/signup pages
- Protected routes
- User profile pages
- Logout button

Recommendation: Install `@clerk/react` and add:
```tsx
import { ClerkProvider, SignIn, SignUp, UserButton } from '@clerk/react';

function App() {
  return (
    <ClerkProvider publishableKey={VITE_CLERK_PUBLISHABLE_KEY}>
      {/* Your app */}
    </ClerkProvider>
  );
}
```

---

## Media Upload (Cloudinary)

Cloudinary provides secure image hosting, optimization, and transformations.

### Setup Cloudinary

1. **Create Account:** [cloudinary.com](https://cloudinary.com)
2. **Get Credentials:**
   - Dashboard → Settings → API Keys
   - Copy `Cloud Name`, `API Key`, `API Secret`
   - Update `.env` files

### Upload Flow

1. **Frontend → Backend:** Request signed upload URL
   ```
   GET /api/media/upload-signature
   ```

2. **Backend:** Return Cloudinary signature (server-side security)
   ```json
   {
     "signature": "...",
     "timestamp": 1642243200,
     "cloudName": "your-cloud",
     "uploadPreset": "product_images"
   }
   ```

3. **Frontend → Cloudinary:** Upload image with signature
   ```javascript
   const formData = new FormData();
   formData.append('file', imageFile);
   formData.append('api_key', CLOUDINARY_API_KEY);
   formData.append('signature', signature);
   
   fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
     method: 'POST',
     body: formData
   });
   ```

4. **Store URL:** Save returned `secure_url` in database

---

## Deployments

### Backend Deployment

**Option 1: Railway (Recommended)**

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Create project
railway init

# 4. Link PostgreSQL plugin
railway add

# 5. Set environment variables
railway variables set CLERK_SECRET_KEY=sk_test_...
railway variables set DATABASE_URL=postgresql://...
# ... set all required vars

# 6. Deploy
railway up

# 7. Get production URL
railway open
```

**Option 2: Render**

1. Connect GitHub repo to [render.com](https://render.com)
2. Create Web Service
3. Set build command: `npm ci && npm run build && npm run prisma:deploy`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

**Option 3: Heroku**

```bash
# 1. Install Heroku CLI
# Download from heroku.com/products/heroku-cli

# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 5. Set environment variables
heroku config:set CLERK_SECRET_KEY=sk_test_...
heroku config:set NODE_ENV=production

# 6. Deploy
git push heroku main
```

### Frontend Deployment

**Option 1: Vercel (Recommended)**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Set environment variables
# Project Settings → Environment Variables
# Add VITE_API_BASE_URL pointing to your deployed backend
```

**Option 2: Netlify**

```bash
# Build
npm run build

# Deploy dist folder to Netlify
# Set environment variables in Netlify dashboard
```

**Option 3: GitHub Pages**

Update `vite.config.ts`:
```typescript
export default {
  base: '/DBMS-Project/',
  // ... rest of config
};
```

Then deploy:
```bash
npm run build
# Deploy dist folder to gh-pages branch
```

### Environment Variables for Production

**Backend (.env in production):**
```bash
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://yourdomain.com
FRONTEND_URLS=https://yourdomain.com
DATABASE_URL=postgresql://... # Remote PostgreSQL
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
RESEND_API_KEY=re_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**Frontend (.env in production):**
```bash
VITE_API_BASE_URL=https://your-backend-api.com/api
VITE_APP_URL=https://yourdomain.com
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

---

## Troubleshooting

### 1. "Cannot find module '@prisma/client'"

**Solution:**
```bash
cd backend
npm run prisma:generate
npm install
```

### 2. "Database connection failed"

**Check:**
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT 1;"

# Check DATABASE_URL in .env
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

### 3. "Clerk is not fully configured"

**Solution:** Backend warning message. Add keys:
```bash
# backend/.env
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

Then restart backend:
```bash
npm run dev
```

### 4. "API calls return 503"

**Cause:** Often missing Clerk configuration or authentication middleware issue.

**Debug:**
1. Check Clerk keys are set in `.env`
2. Verify backend middleware order in `server.ts`
3. Check browser console for CORS errors
4. Test with: `curl http://localhost:4000/health`

### 5. "Products won't load on frontend"

**Check:**
1. Backend running: `curl http://localhost:4000/health`
2. `VITE_API_BASE_URL` correctly set in frontend `.env`
3. Database has products: 
   ```bash
   npm run prisma:studio
   # Check Products table
   ```
4. Check browser Network tab for API response

### 6. "Images not loading"

**Cause:** Missing Cloudinary configuration.

**Solution:**
```bash
# Add to backend/.env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 7. "TypeScript compilation errors"

**Solution:**
```bash
# Rebuild type definitions
npm run prisma:generate

# Type check
npm run typecheck  # if available

# Or compile
npm run build
```

### 8. "CORS errors in browser"

**Check:** Frontend and backend URLs in CORS config.

**Solution:** Update `backend/.env`:
```bash
FRONTEND_URL=http://localhost:5173  # for local dev
FRONTEND_URLS=http://localhost:5173,https://yourdomain.com  # for production
```

### 9. "Port already in use"

**Backend (port 4000):**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :4000
kill -9 <PID>
```

**Frontend (port 5173):**
```bash
npm run dev -- --port 3000  # Use different port
```

### 10. "Migrations failed"

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npm run prisma:db:push --force-reset

# Or create new migration
npm run prisma:migrate -- --name init
```

---

## Support & Resources

- **Clerk Docs:** https://clerk.com/docs
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Prisma Docs:** https://prisma.io/docs
- **Express Docs:** https://expressjs.com
- **React Docs:** https://react.dev
- **PostgreSQL Docs:** https://postgresql.org/docs

---

## License & Project Info

**Project:** Luxury CNC Furniture E-Commerce Platform
**Created:** 2024
**Tech Stack:** React + Vite + Express + PostgreSQL

For questions or issues, create a GitHub issue or contact the development team.
