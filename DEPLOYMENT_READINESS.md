# 🚀 Deployment Readiness Guide - Complete Checklist

**Project:** Luxury CNC Furniture E-Commerce Platform  
**Last Updated:** May 6, 2026  
**Status:** Pre-Deployment Preparation

---

## 📋 Table of Contents

1. [Quick Deployment Checklist](#quick-deployment-checklist)
2. [Third-Party Services Setup](#third-party-services-setup)
3. [Database Setup & Migration](#database-setup--migration)
4. [Environment Variables](#environment-variables)
5. [Build & Deployment Procedures](#build--deployment-procedures)
6. [Pre-Deployment Validation](#pre-deployment-validation)
7. [Production Architecture](#production-architecture)
8. [Monitoring & Scaling](#monitoring--scaling)
9. [Security Checklist](#security-checklist)
10. [Data & Initial Content](#data--initial-content)
11. [Backup & Disaster Recovery](#backup--disaster-recovery)
12. [Post-Deployment Steps](#post-deployment-steps)

---

## Quick Deployment Checklist

### Phase 1: Service Setup (1-2 hours)
- [ ] Create PostgreSQL production database
- [ ] Create Clerk account and app
- [ ] Create Cloudinary account and get credentials
- [ ] Create Resend account and verify domain
- [ ] Setup Redis/Upstash (optional but recommended)
- [ ] Collect all API keys and credentials

### Phase 2: Code Preparation (30 mins)
- [ ] Update all environment variables
- [ ] Run build: `npm run build` (backend)
- [ ] Run build: `npm run build` (frontend)
- [ ] Run tests (if any exist)
- [ ] Verify no hardcoded URLs or credentials

### Phase 3: Database Setup (30 mins)
- [ ] Run migrations: `npm run prisma:deploy`
- [ ] Seed initial data (products, categories)
- [ ] Verify database accessibility
- [ ] Backup initial schema

### Phase 4: Deployment (1-2 hours)
- [ ] Deploy backend to hosting platform
- [ ] Deploy frontend to hosting platform
- [ ] Configure DNS/custom domain
- [ ] Setup SSL certificates
- [ ] Enable monitoring and logging

### Phase 5: Validation (1 hour)
- [ ] Test health endpoints
- [ ] Test public endpoints
- [ ] Test authenticated endpoints
- [ ] Test file uploads
- [ ] Test email sending
- [ ] Monitor error logs

---

## Third-Party Services Setup

### 1. PostgreSQL Database (Production)

#### Option A: Managed PostgreSQL Services (Recommended)

**🥇 Supabase** (Most User-Friendly)
1. Go to https://supabase.com
2. Sign up and create new project
3. Choose region close to your users
4. Wait 2-5 minutes for provisioning
5. In "Settings" → "Database":
   - Copy Connection String (with pooling enabled)
   - Format: `postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/[DATABASE]`
6. Save as `DATABASE_URL` in backend `.env`

**Database Details from Supabase:**
- Host: `xxxxx.supabase.co`
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Password: Generated during setup
- Connection String: Settings → Database → Connection String

**Networking:**
- Supabase allows connections from anywhere by default
- For enhanced security: Add IP whitelist in Security settings

**Backups:**
- Automatic daily backups included
- Retention: 7 days (free tier)
- Manual backups: Available in Settings → Backups

---

**Neon** (Fast & Reliable)
1. Go to https://neon.tech
2. Sign up with GitHub/Google
3. Create new project
4. Select region
5. Copy connection string (includes credentials)
6. Format: `postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]`
7. Save as `DATABASE_URL`

**Advantages:**
- Free serverless database with generous limits
- Automatic scaling
- Connection pooling included
- Point-in-time recovery

---

**Railway** (Easiest Integration)
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new PostgreSQL service
4. Auto-generates credentials
5. Copy provided `DATABASE_URL`
6. Use directly in deployment

---

#### Option B: Self-Hosted PostgreSQL

**AWS RDS:**
1. Login to AWS Console
2. Navigate to RDS → Create Database
3. Choose PostgreSQL 13+
4. Configuration:
   - Multi-AZ: Yes (production)
   - Storage: 100GB SSD
   - Backup retention: 30 days
5. Security group: Allow inbound on port 5432
6. Get connection details
7. Format connection string: `postgresql://[USER]:[PASSWORD]@[ENDPOINT]:[PORT]/[DATABASE]`

**DigitalOcean Managed Databases:**
1. Go to https://cloud.digitalocean.com
2. Create → Databases → PostgreSQL
3. Choose region, size
4. Get connection details
5. Whitelist your server IPs

---

### 2. Clerk Authentication

#### Setup Process

1. **Create Clerk Account**
   - Go to https://clerk.com
   - Sign up for free
   - Create organization (if needed)

2. **Create Application**
   - In Clerk Dashboard: Create Application
   - Choose name: "Luxury CNC API"
   - Select social connections (optional): Google, GitHub

3. **Get API Keys**
   - Go to Dashboard → API Keys
   - Copy:
     - `CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
     - `CLERK_SECRET_KEY` (starts with `sk_`)

4. **Configure Allowed URLs**
   - Go to Settings → URLs
   - Add Allowed URLs:
     - Local: `http://localhost:5173`
     - Production: `https://yourdomain.com`

5. **Setup User Attributes (Optional)**
   - Customize user profiles if needed
   - Dashboard → User & Authentication → Attribute

6. **Enable Email Verification**
   - Settings → Email, Phone, & Social
   - Email verification: Enabled
   - Magic links: Enable if desired

#### Environment Variables Needed

```env
# Backend (.env)
CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

# Frontend (.env)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
```

#### Testing Clerk Integration

```bash
# Test auth endpoint with Clerk token
curl -H "Authorization: Bearer <clerk-token>" \
  http://localhost:4000/api/orders

# Should return user's orders (authenticated)
```

---

### 3. Cloudinary Media Upload

#### Setup Process

1. **Create Account**
   - Go to https://cloudinary.com
   - Sign up (free account available)
   - Verify email

2. **Get Credentials**
   - Login to Dashboard
   - Go to Settings → API Keys
   - Copy:
     - `CLOUDINARY_CLOUD_NAME` (your unique identifier)
     - `CLOUDINARY_API_KEY` (public API key)
     - `CLOUDINARY_API_SECRET` (private key - keep secret!)

3. **Configure Upload Settings**
   - Dashboard → Settings → Upload
   - Enable unsigned uploads: Yes
   - Add upload preset:
     - Name: `furniture_images`
     - Folder: `cnc-store/products`
     - Format: Auto
     - Quality: Auto

4. **Setup Asset Delivery**
   - Ensure HTTPS delivery is enabled
   - Set up CDN for fast delivery
   - Custom domain (optional): yourdomain.cloudinary.com

#### Environment Variables Needed

```env
# Backend (.env)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Upload URL Endpoint

Backend provides signed URLs at:
```
GET /api/media/upload-signature?folder=products
```

Response:
```json
{
  "success": true,
  "data": {
    "signature": "xxxxx",
    "timestamp": 1234567890,
    "folder": "products",
    "cloudName": "your_cloud_name",
    "apiKey": "your_api_key"
  }
}
```

#### Testing Uploads

```bash
# Get upload signature
curl -H "Authorization: Bearer <clerk-token>" \
  "http://localhost:4000/api/media/upload-signature?folder=products"

# Upload to Cloudinary (frontend handles this)
# Files stored at: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}
```

---

### 4. Resend Email Service

#### Setup Process

1. **Create Account**
   - Go to https://resend.com
   - Sign up with email/GitHub
   - Verify email address

2. **Get API Key**
   - Dashboard → API Keys
   - Copy default API key
   - Format: `re_xxxxxxxxxxxxx`

3. **Verify Sender Domain**
   - Go to Domains
   - Add your domain: yourdomain.com
   - Add DNS records:
     ```
     Type: TXT
     Name: _resend.yourdomain.com
     Value: [provided by Resend]
     
     Type: MX
     Name: yourdomain.com
     Value: feedback-smtp.yourdomain.com
     Priority: 10
     ```
   - Wait for DNS propagation (5-30 mins)
   - Click "Verify" in Resend dashboard

4. **Setup Email Templates**
   - Optional: Create email templates in Resend
   - Or: Send HTML inline (backend already does this)

#### Environment Variables Needed

```env
# Backend (.env)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

#### Email Sending

Backend `NotificationService` sends emails:

```typescript
// Quote email
await notificationService.sendQuoteResponse({
  to: "customer@example.com",
  orderId: "order-123",
  quoteAmount: 50000
});

// Order confirmation
await notificationService.sendOrderConfirmation({
  to: "customer@example.com",
  orderId: "order-456",
  amount: 150000
});
```

#### Verify It Works

```bash
# Backend must have: RESEND_API_KEY in .env
# Then:

# Queue email (if async job system enabled)
POST /api/orders/:id/send-confirmation

# Check logs
tail -f backend.log | grep "email"
```

---

### 5. Redis / Upstash (Job Queue - Optional but Recommended)

#### Option A: Upstash (Easiest)

1. **Create Account**
   - Go to https://upstash.com
   - Sign up with GitHub/Google
   - Verify email

2. **Create Database**
   - Console → Create Database
   - Name: `cnc-store-queue`
   - Region: Closest to your users
   - Type: Pro (if using BullMQ)

3. **Get Credentials**
   - Database page → Details
   - Copy:
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`

#### Environment Variables for Upstash

```env
# Backend (.env)
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx
```

#### Option B: Self-Hosted Redis

```bash
# Docker (recommended)
docker run --name cnc-redis -p 6379:6379 -d redis:7

# Then:
REDIS_URL=redis://localhost:6379

# Or with password:
REDIS_URL=redis://:password@localhost:6379
```

#### Optional: Configure Job Queue

The backend includes BullMQ for async jobs. To enable:

1. Set `REDIS_URL` in `.env`
2. Uncomment queue initialization in `queue.ts`
3. Create worker service:

```typescript
import { getNotificationQueue } from './integrations/queue';

export function startNotificationWorker() {
  const queue = getNotificationQueue();
  
  queue.process(async (job) => {
    if (job.data.type === 'quote') {
      await notificationService.sendQuoteResponse(job.data);
    }
  });
}
```

4. Start worker in background (e.g., as separate process or Lambda)

**If Redis is not configured:**
- The system works fine - emails are sent synchronously
- This is acceptable for small to medium traffic
- Add Redis later if performance becomes an issue

---

## Database Setup & Migration

### Initial Setup (First Time)

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Apply all migrations to production database
npm run prisma:deploy

# Verify schema
npm run prisma:studio
```

### Database Schema Overview

```
User
├── id (UUID)
├── clerkId (String, unique)
├── role (CUSTOMER | ADMIN)
├── customOrders (relation)
└── orders (relation)

Product
├── id (UUID)
├── name, slug (unique), description
├── basePrice (Int - in cents: 100 = $1)
├── category, material, finish (indexed)
├── metadata (JSON - flexible structure)
├── images (relation to ProductImage)
└── createdAt, updatedAt

ProductImage
├── id (UUID)
├── productId (FK)
├── imageUrl, altText
└── product (relation)

CustomOrder
├── id (UUID)
├── userId (FK to User)
├── description, referenceImages[]
├── dimensions, material
├── status (REQUESTED | QUOTED | APPROVED | PRODUCTION | COMPLETED | CANCELLED)
├── quotedPrice (Int, nullable)
└── createdAt, updatedAt

Order
├── id (UUID)
├── userId (FK to User)
├── type (String - e.g., "standard", "catalog")
├── totalAmount (Int - in cents)
├── paymentStatus (String - "pending", "paid", etc.)
├── status (PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED)
├── createdAt, updatedAt
└── user (relation)

Inquiry
├── id (UUID)
├── fullName, email, phone, city
├── message
├── status (NEW | READ | RESPONDED | ARCHIVED)
├── createdAt, updatedAt
└── indexes on (status, createdAt)
```

### Data Migration (If Moving from Existing System)

```bash
# 1. Export from old system (CSV format)
# Export: Products, Orders, Customers, etc.

# 2. Create migration script in backend
# File: backend/scripts/migrate-data.ts

import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function migrateData() {
  // Read CSV
  const products = fs.readFileSync('products.csv', 'utf-8');
  
  // Parse and insert
  // Example: for each product, create in Prisma
  
  console.log('Migration complete');
  await prisma.$disconnect();
}

migrateData().catch(console.error);

# 3. Run script
npx ts-node scripts/migrate-data.ts

# 4. Verify data in studio
npm run prisma:studio
```

### Backup Strategy

**Before Deployment:**

```bash
# Export entire database
pg_dump \
  "postgresql://user:password@host:5432/dbname" \
  > backup-$(date +%Y%m%d).sql

# Keep in version control or cloud storage
```

**During Production:**

- Use managed database provider's backup system
- Supabase: 7-day retention (free), 30+ days (paid)
- AWS RDS: Configurable retention (default 7 days)
- Daily exports to S3/Cloud Storage recommended

**Recovery Procedure:**

```bash
# Restore from backup
psql -h host -U user -d dbname < backup-20260506.sql

# Verify
npm run prisma:studio
```

---

## Environment Variables

### Backend (.env) - Complete Checklist

```bash
# ========== REQUIRED - Server Config ==========
NODE_ENV=production
PORT=4000

# ========== REQUIRED - Database ==========
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public

# ========== REQUIRED - CORS ==========
FRONTEND_URL=https://yourdomain.com
FRONTEND_URLS=https://yourdomain.com,https://www.yourdomain.com

# ========== REQUIRED - Authentication (Clerk) ==========
CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx

# ========== RECOMMENDED - Email (Resend) ==========
RESEND_API_KEY=re_xxxxxxxxxxxxx

# ========== RECOMMENDED - Media Upload (Cloudinary) ==========
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ========== OPTIONAL - Job Queue (Upstash) ==========
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx

# ========== OPTIONAL - Job Queue (Self-Hosted Redis) ==========
REDIS_URL=redis://localhost:6379

# ========== OPTIONAL - Logging & Monitoring ==========
LOG_LEVEL=info
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### Frontend (.env) - Complete Checklist

```bash
# ========== REQUIRED ==========
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_URL=https://yourdomain.com

# ========== REQUIRED - Authentication ==========
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
```

### Environment Variables Validation Script

```bash
#!/bin/bash
# File: backend/validate-env.sh

echo "Validating environment variables..."

required_vars=(
  "NODE_ENV"
  "PORT"
  "DATABASE_URL"
  "FRONTEND_URL"
  "FRONTEND_URLS"
  "CLERK_PUBLISHABLE_KEY"
  "CLERK_SECRET_KEY"
  "RESEND_API_KEY"
  "CLOUDINARY_CLOUD_NAME"
  "CLOUDINARY_API_KEY"
  "CLOUDINARY_API_SECRET"
)

missing=0
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing: $var"
    missing=$((missing + 1))
  else
    echo "✅ Found: $var"
  fi
done

if [ $missing -eq 0 ]; then
  echo "✅ All environment variables are set!"
  exit 0
else
  echo "❌ $missing variables missing!"
  exit 1
fi
```

---

## Build & Deployment Procedures

### Pre-Build Checklist

```bash
# 1. Verify no hardcoded credentials
grep -r "pk_test_\|sk_test_\|password123" backend/src backend/app

# 2. Verify no localhost URLs (except in comments)
grep -r "localhost:5173\|localhost:4000" backend/src backend/app

# 3. Run type check
cd backend
npm run build

# 4. Check for errors
# (Should see no .ts errors)
```

### Backend Build & Deploy

#### Build Process

```bash
cd backend

# Install dependencies
npm ci  # Use ci, not install, for production

# Generate Prisma client
npm run prisma:generate

# TypeScript compilation
npm run build

# Output: dist/ folder with compiled JS
```

#### Deploy to Railway (Recommended - Easiest)

```bash
# 1. Create Railway account: https://railway.app
# 2. Connect GitHub account
# 3. Import project
# 4. Railway auto-detects Node.js

# 5. In Railway Dashboard:
#    - Add PostgreSQL plugin (auto-linked)
#    - Set Environment Variables
#    - Copy from your .env (except DATABASE_URL)
#    - DATABASE_URL: Railway auto-provides

# 6. Deploy
#    - Push to main branch on GitHub
#    - Railway auto-deploys

# 7. Verify
#    - Check Deployments tab
#    - View logs
#    - Get deployed URL
```

#### Deploy to Render (Alternative)

```bash
# 1. Create account: https://render.com
# 2. Create Web Service
# 3. Connect GitHub repository
# 4. Build command: npm ci && npm run build && npm run prisma:deploy
# 5. Start command: node dist/server.js
# 6. Set environment variables from .env
# 7. Create/link PostgreSQL database
# 8. Deploy
```

#### Deploy to Heroku (Legacy but Works)

```bash
# 1. Create account: https://heroku.com
# 2. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

# 3. Login
heroku login

# 4. Create app
heroku create luxury-cnc-api

# 5. Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0 -a luxury-cnc-api

# 6. Set environment variables
heroku config:set CLERK_PUBLISHABLE_KEY=pk_live_xxxxx -a luxury-cnc-api
heroku config:set CLERK_SECRET_KEY=sk_live_xxxxx -a luxury-cnc-api
# ... set all other variables

# 7. Deploy
git push heroku main

# 8. Run migrations
heroku run npm run prisma:deploy -a luxury-cnc-api

# 9. Verify
heroku logs --tail -a luxury-cnc-api
```

### Frontend Build & Deploy

#### Build Process

```bash
cd Frontend

# Install dependencies
npm ci

# Build
npm run build

# Output: dist/ folder with static files
```

#### Deploy to Vercel (Recommended - Easiest)

```bash
# 1. Create Vercel account: https://vercel.com
# 2. Import GitHub project
# 3. Framework preset: Vite
# 4. Build command: npm run build
# 5. Output directory: dist

# 6. Environment variables:
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_URL=https://yourdomain.com
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx

# 7. Deploy (automatic on GitHub push)
# 8. Configure custom domain
```

#### Deploy to Netlify (Alternative)

```bash
# 1. Create Netlify account: https://netlify.com
# 2. Connect GitHub account
# 3. New site from Git
# 4. Select repository
# 5. Build settings:
#    - Build command: npm run build
#    - Publish directory: dist
# 6. Environment variables (same as above)
# 7. Deploy
# 8. Add custom domain: Site settings → Domain management
```

#### Deploy to AWS S3 + CloudFront

```bash
# 1. Build frontend
npm run build

# 2. Upload to S3
aws s3 sync dist/ s3://yourdomain-frontend --delete

# 3. Create CloudFront distribution
#    - Origin: S3 bucket
#    - SSL/HTTPS: Required
#    - Viewer Protocol: Redirect HTTP to HTTPS

# 4. Add custom domain to CloudFront
```

---

## Pre-Deployment Validation

### Testing Checklist

Create test file: `backend/tests/deployment.test.ts`

```typescript
import axios from 'axios';

const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

describe('Deployment Validation', () => {
  
  test('Health check endpoint', async () => {
    const response = await axios.get(`${API_URL}/health`);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  test('Database connection', async () => {
    const response = await axios.get(`${API_URL}/products`);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  test('Clerk integration', async () => {
    // Only test if Clerk is configured
    if (process.env.CLERK_SECRET_KEY) {
      // This would require a test token
      expect(process.env.CLERK_SECRET_KEY).toBeDefined();
    }
  });

  test('Cloudinary integration', async () => {
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      expect(process.env.CLOUDINARY_CLOUD_NAME).toBeDefined();
      expect(process.env.CLOUDINARY_API_KEY).toBeDefined();
    }
  });

  test('Resend integration', async () => {
    if (process.env.RESEND_API_KEY) {
      expect(process.env.RESEND_API_KEY).toBeDefined();
    }
  });

});
```

### Manual Verification Steps

```bash
# 1. Backend Health
curl https://api.yourdomain.com/health
# Should return: {"success":true,"data":{"status":"ok"}}

# 2. Public endpoints (no auth required)
curl https://api.yourdomain.com/api/products?page=1&pageSize=10

# 3. Frontend loads
curl https://yourdomain.com
# Should return HTML with no 404 errors

# 4. CORS headers present
curl -i https://api.yourdomain.com/health | grep -i "Access-Control"

# 5. Redirect HTTP to HTTPS
curl -i http://yourdomain.com | grep -i "301\|302"
```

### Performance Validation

```bash
# Install artillery
npm install -g artillery

# Create load test file: load-test.yml
config:
  target: "https://api.yourdomain.com"
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "API Load Test"
    flow:
      - get:
          url: "/health"
      - get:
          url: "/api/products?page=1&pageSize=10"

# Run test
artillery run load-test.yml

# Check results - should see:
# - Response time < 500ms
# - Error rate < 1%
# - All requests succeeding
```

---

## Production Architecture

### Recommended Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Users (Internet)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   Domain (yourdomain)  │
        │   DNS Records          │
        │   SSL Certificate      │
        └────────┬───────────────┘
                 │
        ┌────────┴───────────┐
        │                    │
        ▼                    ▼
    ┌─────────┐          ┌──────────┐
    │ Vercel  │          │ Railway  │
    │Frontend │          │Backend   │
    │ (CDN)   │          │ (Node)   │
    └─────────┘          └────┬─────┘
                              │
                ┌─────────────┬┴────────────┐
                │             │             │
                ▼             ▼             ▼
           ┌────────┐    ┌─────────┐   ┌────────┐
           │Supabase│    │Upstash  │   │Resend  │
           │PostgreSQL   │Redis    │   │Email   │
           └────────┘    └─────────┘   └────────┘
                │
                ▼
           ┌──────────────┐
           │  Cloudinary  │
           │  CDN Storage │
           └──────────────┘
```

### Infrastructure Costs (Estimated Monthly)

| Service | Free Tier | Pro Tier | Notes |
|---------|-----------|----------|-------|
| Vercel (Frontend) | $0 | $20-50 | Scaling based on bandwidth |
| Railway (Backend) | $5 credit | $10-50 | Hourly pricing |
| Supabase (Database) | $0 | $25+ | 500MB free, then $0.125/GB |
| Upstash (Redis) | $0 free tier | $20+ | If using job queue |
| Resend (Email) | 100/mo free | $20 | 1000 emails/mo included |
| Cloudinary (Images) | 25GB free | Pay as you go | 100GB = ~$400/mo |
| Domain | $10-15/yr | - | Registrar costs |
| SSL | $0 | - | Let's Encrypt (free) |
| **TOTAL** | ~$0 | ~$100-200 | Small business scale |

### Horizontal Scaling Plan

**Phase 1: Development**
- Single backend instance
- Shared database
- Works for 1-100 users

**Phase 2: Growth**
- Multiple backend instances (load balanced)
- Database: separate read replicas
- Redis for caching/sessions
- CDN for static content

**Phase 3: Scale**
- Microservices: separate auth/payments/orders
- Database sharding
- Message queues (Kafka)
- API Gateway (Kong/Nginx)
- Monitoring (Datadog, New Relic)

---

## Security Checklist

### Before Going Live

- [ ] Remove all `.env.example` files from production
- [ ] Rotate all API keys (create new ones for production)
- [ ] Enable HTTPS on all domains
- [ ] Add CORS whitelist (only your domain)
- [ ] Enable rate limiting (already in code)
- [ ] Add Helmet security headers (already in code)
- [ ] Setup database backups
- [ ] Enable database encryption at rest
- [ ] Add API authentication (Clerk enabled)
- [ ] Remove debug endpoints from production
- [ ] Enable request logging/monitoring
- [ ] Setup error tracking (Sentry)
- [ ] Configure WAF (Web Application Firewall)
- [ ] Enable DDoS protection (Cloudflare)

### Production .env Security

**Never store in:**
- ❌ Source code
- ❌ Configuration files (committed)
- ❌ Docker images
- ❌ Log files

**Always store in:**
- ✅ Environment variables (provided by platform)
- ✅ Secrets manager (AWS Secrets Manager, HashiCorp Vault)
- ✅ Encrypted password manager (team sharing)
- ✅ Platform-specific secrets (Railway, Render, Vercel)

### API Security Headers (Already Enabled)

```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
X-XSS-Protection: 1; mode=block
```

### Database Security

```sql
-- Create dedicated app user (not postgres)
CREATE USER appuser WITH PASSWORD 'strong_random_password';
GRANT CONNECT ON DATABASE myapp TO appuser;
GRANT USAGE ON SCHEMA public TO appuser;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO appuser;

-- Enable SSL
-- In PostgreSQL config: ssl = on

-- Enable row-level security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = userid);
```

### Monitoring & Alerts

Setup alerts for:
- [ ] Backend error rate > 1%
- [ ] API response time > 500ms
- [ ] Database connection pool exhausted
- [ ] Low disk space (database)
- [ ] Authentication failures > 10/min
- [ ] File upload failures
- [ ] Email sending failures

---

## Data & Initial Content

### Required Initial Data

#### 1. Products (At Least 3)

```typescript
// Script to seed products
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Imperial Bed Frame',
    slug: 'imperial-bed-frame',
    description: 'Hand-carved walnut bed with CNC precision details',
    basePrice: 480000, // $4800 (in cents)
    category: 'Beds',
    material: 'Walnut',
    finish: 'Natural Oil',
    metadata: {
      sizes: ['Queen', 'King'],
      customizationOptions: ['Headboard design', 'Footboard height'],
    },
    images: [
      { imageUrl: 'https://...', altText: 'Imperial Bed Front View' }
    ]
  },
  // ... more products
];

async function seedData() {
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log('✅ Seed complete');
  await prisma.$disconnect();
}

seedData().catch(console.error);
```

#### 2. Admin User

```typescript
// Create initial admin
const user = await prisma.user.create({
  data: {
    clerkId: 'user_admin_id', // From your Clerk account
    role: 'ADMIN'
  }
});
```

### Content to Prepare

1. **Product Catalog**
   - Product descriptions
   - High-quality images (upload to Cloudinary)
   - Pricing
   - Customization options

2. **Landing Page Copy**
   - Hero section text
   - Features description
   - CTA messaging
   - Contact information

3. **Policies**
   - Privacy Policy
   - Terms of Service
   - Refund Policy
   - Shipping Policy

4. **Contact Information**
   - Business address
   - Phone number
   - Email address
   - Social media links

---

## Backup & Disaster Recovery

### Database Backups

**Automated (Recommended):**

```bash
# Supabase: Automatic daily backups (Settings → Backups)
# Railway: Automatic backups (included)
# Neon: Point-in-time recovery (included)
```

**Manual Backup Script:**

```bash
#!/bin/bash
# File: backup-db.sh

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_${TIMESTAMP}.sql"

mkdir -p $BACKUP_DIR

pg_dump "$DATABASE_URL" > "${BACKUP_DIR}/${FILENAME}"

# Compress
gzip "${BACKUP_DIR}/${FILENAME}"

# Upload to cloud storage (example: AWS S3)
aws s3 cp "${BACKUP_DIR}/${FILENAME}.gz" "s3://backup-bucket/db/"

echo "✅ Backup complete: ${FILENAME}.gz"
```

**Schedule with cron:**
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup-db.sh
```

### Data Restore Procedure

```bash
# 1. Download backup
aws s3 cp s3://backup-bucket/db/backup_20260506_020000.sql.gz ./

# 2. Decompress
gunzip backup_20260506_020000.sql.gz

# 3. Restore (create new database first)
createdb restore_db
psql restore_db < backup_20260506_020000.sql

# 4. Test
psql restore_db -c "SELECT COUNT(*) FROM products;"

# 5. If good, rename
# Production restore: Drop current, rename restore_db
```

### Disaster Recovery Plan

| Scenario | Recovery Time | Procedure |
|----------|---------------|-----------|
| Database corrupted | 1 hour | Restore from latest backup |
| Lost API keys | 30 mins | Rotate keys in services, update env |
| Frontend CDN failure | 10 mins | Deploy to backup CDN |
| Backend instance down | 5 mins | Auto-scaling or manual restart |
| Complete data loss | 1-2 hours | Restore from backup, reindex |

---

## Monitoring & Scaling

### Essential Monitoring

#### Option 1: Sentry (Error Tracking)

```bash
# 1. Create Sentry account: https://sentry.io
# 2. Create project: Node.js
# 3. Get DSN

# 4. Install SDK
npm install @sentry/node @sentry/tracing

# 5. Add to backend/server.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

# 6. Set environment variable
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

#### Option 2: Railway/Render Built-in Monitoring

- Railway: Deployments → Logs → View metrics
- Render: Service → Logs → Metrics

#### Option 3: Datadog (Comprehensive)

```bash
# 1. Create Datadog account: https://www.datadoghq.com
# 2. Create API key
# 3. Install agent on server
# 4. Configure backend monitoring
# 5. Set up alerts/dashboards
```

### Logging

```typescript
// backend/server/utils/logger.ts
import morgan from 'morgan';

// HTTP request logging
app.use(morgan('combined'));

// Application logging
export function log(level: 'info' | 'error' | 'warn', message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data || '');
}

// Usage
log('info', 'Order created', { orderId: '123', userId: 'user-456' });
```

### Performance Metrics to Track

- [ ] API response time (p50, p95, p99)
- [ ] Error rate
- [ ] Database query time
- [ ] Memory usage
- [ ] CPU usage
- [ ] Concurrent users
- [ ] Request throughput
- [ ] Cache hit rate

### Scaling Triggers

**When to scale up:**

- API response time > 500ms
- Error rate > 2%
- Memory usage > 80%
- CPU usage > 75%
- Concurrent users > 1000

**How to scale:**

1. **Vertical:** Bigger instance (Railway → select larger machine)
2. **Horizontal:** Multiple instances (enable auto-scaling)
3. **Database:** Add read replicas (Supabase → Create replica)
4. **Cache:** Add Redis (Upstash → Upgrade tier)
5. **CDN:** Expand regions (Cloudinary → enabled by default)

---

## Post-Deployment Steps

### Day 1: Verification

- [ ] Test all user flows (signup, browse, order, checkout)
- [ ] Test admin flows (product management)
- [ ] Monitor error logs (Sentry/Logs)
- [ ] Check performance metrics
- [ ] Verify email sending works
- [ ] Test image uploads (Cloudinary)
- [ ] Verify HTTPS on all pages
- [ ] Test on mobile devices
- [ ] Check analytics integration (if using)

### Week 1: Optimization

- [ ] Analyze performance data
- [ ] Identify slow endpoints
- [ ] Optimize database queries
- [ ] Add caching where needed
- [ ] Review error logs
- [ ] Collect user feedback
- [ ] Fix any bugs found

### Month 1: Monitoring

- [ ] Setup automated backups (if not done)
- [ ] Implement uptime monitoring
- [ ] Create runbooks for common issues
- [ ] Plan security audit
- [ ] Review infrastructure costs
- [ ] Optimize database indexes
- [ ] Create incident response procedures

### Ongoing: Maintenance

```bash
# Monthly tasks
- Update dependencies: npm audit fix
- Review error logs
- Monitor performance trends
- Check database size
- Verify backups working
- Test disaster recovery

# Quarterly
- Security audit
- Performance benchmark
- Cost analysis
- Dependency updates
- Database optimization

# Annually
- Major version updates
- Architecture review
- Security certification
- Compliance check
```

---

## Deployment Validation Checklist - Final

### Pre-Flight (30 mins before deploy)

- [ ] All tests passing
- [ ] Build succeeds without warnings
- [ ] No console errors/warnings
- [ ] Environment variables double-checked
- [ ] Database migrations verified
- [ ] Backups current
- [ ] Team notified
- [ ] Rollback plan documented

### Launch (During deployment)

- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Monitor logs
- [ ] Check error rate
- [ ] Verify response times
- [ ] Test critical flows

### Post-Launch (1 hour after deploy)

- [ ] [ ] Health endpoints responsive
- [ ] [ ] All APIs returning data
- [ ] [ ] Authentication working
- [ ] [ ] File uploads working
- [ ] [ ] Emails sending
- [ ] [ ] Database queries fast
- [ ] [ ] No error spikes
- [ ] [ ] Users can access site
- [ ] [ ] Mobile works
- [ ] [ ] Prepare incident response

### Next 24 Hours

- [ ] Monitor closely
- [ ] Be ready to rollback
- [ ] Check logs hourly
- [ ] Respond to user issues
- [ ] Document any issues
- [ ] Plan fixes if needed

---

## Support & Troubleshooting

### Quick Fixes

```bash
# Backend won't start
npm run build
npm run prisma:generate
npm run dev

# Database connection error
psql "$DATABASE_URL" -c "SELECT 1"
# If fails, check DATABASE_URL in .env

# Clerk not working
echo $CLERK_SECRET_KEY
# Must start with sk_live_

# Cloudinary uploads failing
# Check: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

# Email not sending
# Check: RESEND_API_KEY is set
# Verify: Domain DNS records are correct

# Application won't build
npm ci --force
npm run build --verbose
```

### Getting Help

1. **Check Documentation:** See related docs in project root
2. **Check Logs:** `npm run dev` with verbose logging
3. **Check Status Pages:**
   - Supabase: https://status.supabase.com
   - Clerk: https://status.clerk.com
   - Cloudinary: https://status.cloudinary.com
4. **Check Community:**
   - Stack Overflow: tag:express.js, tag:prisma
   - GitHub Issues in related repos

---

## Deployment Command Summary

```bash
# Backend - Complete Deployment
cd backend
npm ci
npm run build
npm run prisma:generate

# Frontend - Complete Deployment
cd ../Frontend
npm ci
npm run build

# Test production build locally
npm run preview

# Deploy via Git push (if using GitHub integration)
git push origin main
# (Vercel/Railway auto-deploys)
```

---

**Document Version:** 1.0  
**Last Updated:** May 6, 2026  
**Status:** Ready for Deployment  
**Maintained By:** Development Team
