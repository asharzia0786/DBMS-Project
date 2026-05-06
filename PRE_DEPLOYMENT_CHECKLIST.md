# 📋 Pre-Deployment Checklist - Action Items

**Project:** Luxury CNC Furniture E-Commerce  
**Version:** 1.0  
**Date:** May 6, 2026  
**Purpose:** Step-by-step actions to go from development to production

---

## 🚀 Quick Start: First Time Setup

If you're starting deployment today, follow this order:

### Phase 1: Third-Party Accounts (Do This First - Can be done in parallel)

#### Task 1.1: Create Clerk Account
- [ ] Go to https://clerk.com
- [ ] Sign up with email
- [ ] Verify email
- [ ] Create application named "Luxury CNC"
- [ ] Go to Dashboard → API Keys
- [ ] Copy `CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
- [ ] Copy `CLERK_SECRET_KEY` (starts with `sk_`)
- [ ] Save both keys to password manager
- [ ] Add to `backend/.env`:
  ```
  CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
  CLERK_SECRET_KEY=sk_live_xxxxx
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
  ```
- [ ] Add to `Frontend/.env`:
  ```
  VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
  ```
- [ ] Go to Settings → URLs
- [ ] Add Allowed URLs: `http://localhost:5173`, `http://localhost:4000`
- [ ] Test locally: `npm run dev` in backend and frontend
- [ ] Try logging in with test account

**Time:** 30 minutes  
**Status:** ⏳ Not Done

---

#### Task 1.2: Create Stripe Account (For Payments)
- [ ] Go to https://stripe.com
- [ ] Click "Start now"
- [ ] Create account
- [ ] Verify email
- [ ] Go to Dashboard
- [ ] Click "Developers" → "API Keys"
- [ ] Copy Publishable Key (starts with `pk_test_`)
- [ ] Copy Secret Key (starts with `sk_test_`)
- [ ] Save to password manager
- [ ] Add to `backend/.env`:
  ```
  STRIPE_PUBLIC_KEY=pk_test_xxxxx
  STRIPE_SECRET_KEY=sk_test_xxxxx
  ```
- [ ] Later (for production): Get `pk_live_` and `sk_live_` keys

**Time:** 20 minutes  
**Status:** ⏳ Not Done

---

#### Task 1.3: Create Cloudinary Account (For Image Uploads)
- [ ] Go to https://cloudinary.com
- [ ] Click "Sign Up"
- [ ] Sign up with email or Google
- [ ] Verify email
- [ ] Go to Dashboard
- [ ] Find "Cloud Name" - copy it
- [ ] Go to Settings → API Keys
- [ ] Copy "API Key"
- [ ] Copy "API Secret"
- [ ] Save all three to password manager
- [ ] Add to `backend/.env`:
  ```
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  ```
- [ ] Go to Settings → Upload
- [ ] Scroll to "Upload presets"
- [ ] Click "Add upload preset"
- [ ] Name: `furniture_images`
- [ ] Folder: `cnc-store/products`
- [ ] Click Save

**Time:** 25 minutes  
**Status:** ⏳ Not Done

---

#### Task 1.4: Create Resend Account (For Email)
- [ ] Go to https://resend.com
- [ ] Click "Get Started"
- [ ] Sign up with email or GitHub
- [ ] Verify email
- [ ] Go to Dashboard → API Keys
- [ ] Copy API key (starts with `re_`)
- [ ] Save to password manager
- [ ] Add to `backend/.env`:
  ```
  RESEND_API_KEY=re_xxxxxxxxxxxxx
  ```
- [ ] Go to Dashboard → Domains
- [ ] Add new domain: yourdomain.com
- [ ] Add DNS records (instructions will be provided):
  ```
  Type: TXT, Name: _resend.yourdomain.com, Value: [provided]
  Type: MX, Name: yourdomain.com, Value: [provided]
  ```
- [ ] Wait for DNS propagation (5-30 minutes)
- [ ] Click "Verify" in Resend dashboard

**Time:** 30 minutes (+ 30 mins for DNS)  
**Status:** ⏳ Not Done

---

#### Task 1.5: Create Database (Supabase Recommended)
- [ ] Go to https://supabase.com
- [ ] Click "Start your project"
- [ ] Sign up with GitHub or email
- [ ] Create new organization
- [ ] Create new project
- [ ] Choose region closest to you
- [ ] Set database password
- [ ] Click "Create new project"
- [ ] Wait for provisioning (2-5 minutes)
- [ ] Go to Project → Settings → Database
- [ ] Click "Connection Pooling" tab
- [ ] Copy connection string with pooling
- [ ] Format should be: `postgresql://[user]:[password]@[host]:[port]/[database]`
- [ ] Add to `backend/.env`:
  ```
  DATABASE_URL=postgresql://user:password@host.supabase.co:5432/postgres?schema=public
  ```
- [ ] Test connection: `psql "your-connection-string" -c "SELECT 1;"`
- [ ] Should return: `?column? = 1`

**Time:** 20 minutes (+ waiting for provisioning)  
**Status:** ⏳ Not Done

---

### Phase 2: Backend Setup

#### Task 2.1: Migrate Database Schema
```bash
cd backend

# 1. Install dependencies
npm install

# 2. Generate Prisma client
npm run prisma:generate
# Should output: Generated Prisma Client

# 3. Deploy migrations to production database
npm run prisma:deploy
# Should output: Already in sync (if first time)

# 4. Verify
npm run prisma:studio
# Opens http://localhost:5555
# Check that all tables exist: User, Product, Order, etc.
```

**Checklist:**
- [ ] `npm run prisma:generate` succeeds
- [ ] `npm run prisma:deploy` succeeds
- [ ] Prisma Studio shows all tables
- [ ] No "migration failed" errors

**Time:** 15 minutes  
**Status:** ⏳ Not Done

---

#### Task 2.2: Build Backend
```bash
cd backend

# 1. Clean install
npm ci

# 2. Build
npm run build

# 3. Check for errors
# Should show: ✅ Successfully compiled XX files

# 4. Verify no hardcoded credentials
grep -r "localhost" src/ app/ | grep -v "comment\|example" | grep -v ".md"
# Should return: nothing or only comments

# 5. Verify environment variables
echo "Checking required env vars..."
npm run check-env  # If this script exists, run it
```

**Checklist:**
- [ ] `npm run build` succeeds
- [ ] No `.ts` compilation errors
- [ ] No hardcoded URLs or credentials in code
- [ ] `dist/` folder created with compiled `.js` files

**Time:** 10 minutes  
**Status:** ⏳ Not Done

---

#### Task 2.3: Test Backend Locally
```bash
# 1. Start backend
npm run dev

# 2. In another terminal, test endpoints
curl http://localhost:4000/health
# Should return: {"success":true,"data":{"status":"ok"}}

# 3. Test products endpoint
curl http://localhost:4000/api/products
# Should return: {"success":true,"data":{...}}

# 4. Check logs for errors
# Backend terminal should show: "Backend listening on http://localhost:4000"
```

**Checklist:**
- [ ] Backend starts without errors
- [ ] Health endpoint returns 200
- [ ] /api/products endpoint returns 200
- [ ] No "Cannot connect to database" errors

**Time:** 5 minutes  
**Status:** ⏳ Not Done

---

### Phase 3: Frontend Setup

#### Task 3.1: Build Frontend
```bash
cd Frontend

# 1. Install dependencies
npm ci

# 2. Build
npm run build

# 3. Check for errors
# Should show: "✓ 123 modules transformed"

# 4. Verify no hardcoded credentials
grep -r "localhost" src/ | grep -v "comment" | grep -v ".md"
# Should return: only config references

# 5. Check bundle size
# dist/ folder should be < 1MB
du -sh dist/
```

**Checklist:**
- [ ] `npm run build` succeeds
- [ ] No compilation errors
- [ ] No hardcoded localhost URLs in source code
- [ ] `dist/` folder created

**Time:** 10 minutes  
**Status:** ⏳ Not Done

---

#### Task 3.2: Test Frontend Locally
```bash
cd Frontend

# 1. Start frontend
npm run dev

# 2. Open browser
open http://localhost:5173

# 3. Check page loads
# Should see: Landing page with hero, products, testimonials

# 4. Test API connection
# Open browser console (F12 → Console)
# Try: fetch('http://localhost:4000/api/products').then(r => r.json()).then(console.log)
# Should see: Product data in console

# 5. Test Clerk (if configured)
# Should see: Login button if Clerk is setup
```

**Checklist:**
- [ ] Frontend starts without errors
- [ ] Landing page loads
- [ ] No 404 errors in console
- [ ] Can connect to backend API
- [ ] Clerk login button visible (if configured)

**Time:** 5 minutes  
**Status:** ⏳ Not Done

---

### Phase 4: Data Setup

#### Task 4.1: Add Initial Products
```bash
cd backend

# Option 1: Use Prisma Studio (Easiest)
npm run prisma:studio

# This opens http://localhost:5555
# 1. Click "Product" table
# 2. Click "Add" button
# 3. Fill in:
#    - name: "Imperial Bed Frame"
#    - slug: "imperial-bed-frame" (must be unique)
#    - description: "Hand-crafted walnut bed..."
#    - basePrice: 480000 (in cents, so $4800)
#    - category: "Beds"
#    - material: "Walnut"
#    - finish: "Natural Oil"
# 4. Click "Save"
# 5. Repeat for at least 5 products

# Option 2: Via API (if admin routes built)
curl -X POST http://localhost:4000/api/products \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Imperial Bed Frame",
    "slug": "imperial-bed-frame",
    "basePrice": 480000,
    "category": "Beds",
    "material": "Walnut",
    "finish": "Natural Oil",
    "description": "Hand-crafted walnut bed..."
  }'
```

**Data Template (Minimum 5 products):**
```
Product 1:
- Name: Imperial Bed Frame
- Slug: imperial-bed-frame
- Price: 480000 (cents) = $4,800
- Category: Beds
- Material: Walnut
- Finish: Natural Oil

Product 2:
- Name: Nocturne Wardrobe
- Slug: nocturne-wardrobe
- Price: 550000 = $5,500
- Category: Cabinets
- Material: Walnut
- Finish: Lacquer

Product 3:
- Name: Crafted Dining Table
- Slug: crafted-dining-table
- Price: 650000 = $6,500
- Category: Tables
- Material: Oak
- Finish: Matte

Product 4:
- Name: Victorian Chair Set
- Slug: victorian-chair-set
- Price: 180000 = $1,800
- Category: Chairs
- Material: Maple
- Finish: Gloss

Product 5:
- Name: Modern Display Cabinet
- Slug: modern-display-cabinet
- Price: 420000 = $4,200
- Category: Cabinets
- Material: Walnut
- Finish: Natural Oil
```

**Checklist:**
- [ ] Added at least 5 products to database
- [ ] All products have unique slugs
- [ ] All products have images (can add later)
- [ ] Prices are in cents
- [ ] Frontend shows products when you refresh

**Time:** 30-60 minutes  
**Status:** ⏳ Not Done

---

### Phase 5: Deployment

#### Task 5.1: Choose Hosting Platforms

**Backend Hosting Options:**
- [ ] Railway (Recommended - easiest)
- [ ] Render
- [ ] Heroku
- [ ] AWS EC2

**Frontend Hosting Options:**
- [ ] Vercel (Recommended - easiest)
- [ ] Netlify
- [ ] AWS S3 + CloudFront

**For first deployment, recommended combo:**
- Backend: Railway
- Frontend: Vercel

---

#### Task 5.2: Deploy to Railway (Backend)

```bash
# 1. Create Railway account
# Go to https://railway.app
# Sign up with GitHub

# 2. Install Railway CLI
npm install -g @railway/cli

# 3. Login
railway login

# 4. In backend directory
cd backend
railway init

# 5. Select "Create new project"
# 6. Name it: "luxury-cnc-api"

# 7. Add PostgreSQL database
# In Railway dashboard:
# - Go to your project
# - Click "+ Add"
# - Select "PostgreSQL"
# - Wait for creation

# 8. Add environment variables
# In Railway dashboard → Project → Variables
# Add all from backend/.env:
# - NODE_ENV=production
# - PORT=4000
# - CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
# - RESEND_API_KEY
# - CLOUDINARY_*
# - DATABASE_URL will be auto-created

# 9. Deploy
git push origin main
# Railway auto-deploys on git push

# 10. Get URL
# Railway dashboard shows: luxury-cnc-api.up.railway.app

# 11. Test
curl https://luxury-cnc-api.up.railway.app/health
# Should return: {"success":true,"data":{"status":"ok"}}
```

**Checklist:**
- [ ] Railway account created
- [ ] Project created
- [ ] PostgreSQL database added
- [ ] All environment variables set
- [ ] Backend deployed
- [ ] Health endpoint responds

**Time:** 30 minutes  
**Status:** ⏳ Not Done

---

#### Task 5.3: Deploy to Vercel (Frontend)

```bash
# 1. Create Vercel account
# Go to https://vercel.com
# Sign up with GitHub

# 2. Import GitHub repository
# - Click "New Project"
# - Select your DBMS-Project repository
# - Vercel detects Vite automatically

# 3. Environment variables
# Add these in Vercel dashboard:
# - VITE_API_BASE_URL=https://luxury-cnc-api.up.railway.app/api
# - VITE_APP_URL=https://yourdomain.com (later, for now: vercel URL)
# - VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx

# 4. Update root directory (if needed)
# - Root directory: Frontend

# 5. Deploy
# Click "Deploy"
# Vercel auto-builds and deploys

# 6. Get URL
# Vercel shows: yourdomain-luxury-cnc.vercel.app

# 7. Test
# Open https://yourdomain-luxury-cnc.vercel.app
# Should see landing page
```

**Checklist:**
- [ ] Vercel account created
- [ ] GitHub repo connected
- [ ] Environment variables set
- [ ] Frontend deployed
- [ ] Landing page loads
- [ ] Can call backend API

**Time:** 20 minutes  
**Status:** ⏳ Not Done

---

#### Task 5.4: Setup Custom Domain

```bash
# 1. Register domain (if not done)
# Go to: GoDaddy, Namecheap, Route53, etc.
# Cost: $10-15/year
# Register: yourdomain.com

# 2. Add to Vercel (Frontend)
# Vercel dashboard → Settings → Domains
# - Add domain: yourdomain.com
# - Copy DNS records provided
# - Add to domain registrar's DNS settings

# 3. Add to Railway (Backend) - Optional
# Railway dashboard → Project → Domains
# - Add domain: api.yourdomain.com
# - Copy DNS records
# - Add to domain registrar

# 4. Wait for DNS propagation
# Usually 5-30 minutes, sometimes up to 24 hours

# 5. Verify
# curl https://yourdomain.com
# curl https://api.yourdomain.com/health
```

**Checklist:**
- [ ] Domain registered
- [ ] Domain added to Vercel
- [ ] Domain added to Railway
- [ ] DNS records configured
- [ ] Domain resolves to frontend
- [ ] api.yourdomain.com works

**Time:** 30 minutes + DNS propagation  
**Status:** ⏳ Not Done

---

### Phase 6: Validation

#### Task 6.1: Smoke Tests (5 minutes after deployment)

```bash
# Test backend
curl https://api.yourdomain.com/health
# Should return: {"success":true,"data":{"status":"ok"}}

# Test products API
curl https://api.yourdomain.com/api/products
# Should return: {"success":true,"data":{...}}

# Test frontend
curl https://yourdomain.com
# Should return HTML starting with <!DOCTYPE html>

# Test in browser
# Open: https://yourdomain.com
# Should see: Landing page loads
# Open console (F12)
# No major errors

# Check logs
# Backend (Railway): No error messages
# Frontend (Vercel): No build warnings
```

**Checklist:**
- [ ] Backend health endpoint responds
- [ ] Product API returns data
- [ ] Frontend loads
- [ ] Frontend connects to API
- [ ] No critical errors in console

**Time:** 5 minutes  
**Status:** ⏳ Not Done

---

#### Task 6.2: Feature Tests (15 minutes)

```bash
# 1. Test Public Endpoints
[ ] GET /api/products (should return products)
[ ] GET /api/products/:id (should return one product)
[ ] GET /health (should return ok)

# 2. Test Inquiry Form
[ ] Fill out contact form
[ ] Submit
[ ] Check backend logs (inquiry saved)
[ ] Check Resend (email sent) - if configured

# 3. Test Clerk (if configured)
[ ] Click login
[ ] Try signing up
[ ] Should redirect to Clerk
[ ] After login, should return to app

# 4. Test Cloudinary (if configured)
[ ] Try uploading image
[ ] Image should appear on page
# Actually, if admin upload not built, test this later
```

**Checklist:**
- [ ] Products load from API
- [ ] Inquiry form works
- [ ] Clerk login works (if configured)
- [ ] Image upload works (if implemented)
- [ ] No errors in browser console

**Time:** 15 minutes  
**Status:** ⏳ Not Done

---

## 📊 Master Checklist

### Section 1: Accounts & Credentials
- [ ] Clerk account created
- [ ] Clerk keys saved securely
- [ ] Stripe account created
- [ ] Stripe keys saved securely
- [ ] Cloudinary account created
- [ ] Cloudinary credentials saved securely
- [ ] Resend account created
- [ ] Resend API key saved securely
- [ ] Supabase account created (or other DB)
- [ ] Database credentials saved securely

**Status:** ⏳ Pending  
**Time to Complete:** 2-3 hours  
**Blocker:** None

---

### Section 2: Environment Configuration
- [ ] backend/.env created with all variables
- [ ] Frontend/.env created with all variables
- [ ] DATABASE_URL correct in backend/.env
- [ ] CLERK keys correct
- [ ] STRIPE keys correct
- [ ] CLOUDINARY keys correct
- [ ] RESEND key correct
- [ ] No hardcoded credentials in source code
- [ ] Environment variables validated

**Status:** ⏳ Pending  
**Time to Complete:** 30 minutes  
**Blocker:** Section 1

---

### Section 3: Database
- [ ] PostgreSQL instance provisioned (Supabase/Neon)
- [ ] Database connection tested
- [ ] `npm run prisma:generate` succeeds
- [ ] `npm run prisma:deploy` succeeds
- [ ] All tables created
- [ ] Prisma Studio works
- [ ] Initial products added (5+)
- [ ] Database backup created

**Status:** ⏳ Pending  
**Time to Complete:** 1-2 hours  
**Blocker:** Section 2

---

### Section 4: Backend Build
- [ ] Dependencies installed (`npm ci`)
- [ ] TypeScript compiles (`npm run build`)
- [ ] No compilation errors
- [ ] Prisma client generated
- [ ] `npm run dev` works locally
- [ ] Health endpoint responds
- [ ] All APIs tested locally
- [ ] Backend ready to deploy

**Status:** ⏳ Pending  
**Time to Complete:** 30 minutes  
**Blocker:** Section 3

---

### Section 5: Frontend Build
- [ ] Dependencies installed (`npm ci`)
- [ ] Build succeeds (`npm run build`)
- [ ] No build errors
- [ ] `npm run dev` works locally
- [ ] Landing page loads
- [ ] Can connect to backend
- [ ] Frontend ready to deploy

**Status:** ⏳ Pending  
**Time to Complete:** 20 minutes  
**Blocker:** Section 4

---

### Section 6: Deployment
- [ ] Railway account created
- [ ] Railway backend project created
- [ ] PostgreSQL connected to Railway
- [ ] Backend deployed to Railway
- [ ] Backend health check works
- [ ] Vercel account created
- [ ] Vercel frontend project created
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads from Vercel URL
- [ ] Frontend can call backend API

**Status:** ⏳ Pending  
**Time to Complete:** 1-2 hours  
**Blocker:** Sections 4-5

---

### Section 7: Domain & HTTPS
- [ ] Domain registered (yourdomain.com)
- [ ] Domain added to Vercel
- [ ] Domain added to Railway
- [ ] DNS records configured
- [ ] HTTPS working on frontend
- [ ] HTTPS working on backend
- [ ] SSL certificates auto-provisioned

**Status:** ⏳ Pending  
**Time to Complete:** 30 mins + DNS propagation  
**Blocker:** Section 6

---

### Section 8: Validation
- [ ] Health endpoint responds
- [ ] Products API returns data
- [ ] Frontend loads
- [ ] Frontend UI works
- [ ] Inquiry form works
- [ ] Clerk login works (if configured)
- [ ] Error logs reviewed
- [ ] Performance acceptable
- [ ] No security warnings

**Status:** ⏳ Pending  
**Time to Complete:** 30 minutes  
**Blocker:** Section 7

---

### Section 9: Documentation
- [ ] Updated README with production URLs
- [ ] Created admin guide (if applicable)
- [ ] Created runbook for common issues
- [ ] Documented deployment procedure
- [ ] Documented backup procedure
- [ ] Documented rollback procedure

**Status:** ⏳ Pending  
**Time to Complete:** 1-2 hours  
**Blocker:** Section 8

---

## 🎯 Progress Tracking

**Overall Progress:** 0% (0/9 sections complete)

**Timeline:**
- Start: [Fill in start date]
- Target Completion: [Start date + 2-3 days]
- Actual Completion: [Fill in when done]

**Team Assignments:**
- Backend Deploy: [Name]
- Frontend Deploy: [Name]
- Third-Party Setup: [Name]
- Database: [Name]
- Testing: [Name]

---

## 🔄 Deployment Runbook

### Before You Deploy
1. [ ] All checklists complete
2. [ ] Backups current
3. [ ] Rollback plan documented
4. [ ] Team notified
5. [ ] Monitoring setup
6. [ ] On-call person identified

### During Deployment
1. [ ] Deploy backend
2. [ ] Run migrations
3. [ ] Deploy frontend
4. [ ] Monitor logs
5. [ ] Test critical flows
6. [ ] Watch error rates

### After Deployment
1. [ ] Check health endpoint
2. [ ] Check error logs
3. [ ] Test from different regions
4. [ ] Monitor for 1 hour
5. [ ] Notify stakeholders
6. [ ] Document any issues

### Rollback Plan
If something breaks:
```bash
# Backend
railway down

# Frontend
vercel rollback

# Re-enable old deployment
# DNS stays the same, traffic returns to previous version
```

---

## 📞 Support Contacts

- **Technical Lead:** [Fill in name & contact]
- **DevOps:** [Fill in name & contact]
- **Database Admin:** [Fill in name & contact]
- **On-Call:** [Fill in name & phone]

---

## 📝 Sign-Off

**Deployment Prepared By:** _________________  
**Date:** _________________  
**Approved By:** _________________  
**Date:** _________________  

**Ready to Deploy:** YES / NO  
**If No, Reason:** _________________  
**Target Deployment Date:** _________________

---

**Document Version:** 1.0  
**Created:** May 6, 2026  
**Last Updated:** May 6, 2026  
**Status:** Ready to use for pre-deployment planning
