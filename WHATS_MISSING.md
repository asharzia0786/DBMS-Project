# ❌ What's Missing - Pre-Deployment Requirements

**Project:** Luxury CNC Furniture E-Commerce  
**Assessment Date:** May 6, 2026  
**Deployment Status:** Not Ready (8-12 hours work remaining)

---

## 📊 Missing Items Summary

| Category | Items Missing | Priority | Estimated Time | Status |
|----------|---------------|----------|-----------------|--------|
| **Third-Party Services** | 4 main services | HIGH | 2-3 hours | ⏳ Setup |
| **Frontend Features** | 3 major features | HIGH | 4-6 hours | ⏳ Build |
| **Backend Features** | 2 critical paths | MEDIUM | 2-3 hours | ⏳ Implement |
| **Data** | Product catalog | HIGH | 1-2 hours | ⏳ Import |
| **Infrastructure** | Environment setup | HIGH | 1-2 hours | ⏳ Configure |
| **Testing** | Deployment tests | MEDIUM | 1-2 hours | ⏳ Write |
| **Documentation** | Deployment guide | MEDIUM | Done | ✅ Complete |

**Total Estimated Effort:** 11-18 hours  
**Critical Path:** Third-party services → Backend → Frontend → Testing → Deploy

---

## 1. Third-Party Services Setup (⏳ HIGH PRIORITY)

### ❌ Missing: Clerk Authentication Setup

**Status:** Not Configured  
**Why Needed:** User authentication, authorization (admin vs customer)  
**Impact:** Users cannot login; protected routes fail

**Setup Required:**
```bash
Time: 30 minutes
Steps:
1. Create Clerk account (https://clerk.com)
2. Create application
3. Get publishable & secret keys
4. Add to backend .env
5. Add to frontend .env
6. Test login flow
```

**Files Affected:**
- `backend/server/integrations/clerk.ts` - Already implemented ✅
- `backend/server.ts` - Already integrated ✅
- `Frontend/src/components/...` - NO Clerk UI components

**What's Missing:**
- [ ] Frontend login page component
- [ ] Frontend sign-up page component
- [ ] Protected route wrapper
- [ ] User profile page
- [ ] Logout functionality

**Action:**
```
Add to Frontend/src/components/:
- LoginPage.tsx
- SignUpPage.tsx
- ProtectedRoute.tsx
- UserProfile.tsx
```

---

### ❌ Missing: Cloudinary Media Upload Setup

**Status:** Not Configured  
**Why Needed:** Image uploads for products and custom orders  
**Impact:** File uploads won't work; no image handling

**Setup Required:**
```bash
Time: 30 minutes
Steps:
1. Create Cloudinary account (https://cloudinary.com)
2. Get credentials (cloud name, api key, api secret)
3. Add to backend .env
4. Create upload preset
5. Test with admin interface
```

**Files Affected:**
- `backend/server/integrations/cloudinary.ts` - Already implemented ✅
- `backend/app/api/media.routes.ts` - Already implemented ✅
- `Frontend/src/lib/api.ts` - NO upload client

**What's Missing:**
- [ ] Frontend image upload component
- [ ] Image preview before upload
- [ ] Multiple image upload support
- [ ] Progress indicator
- [ ] Error handling UI

**Action:**
```
Add to Frontend/src/lib/:
- cloudinary-client.ts (upload handler)
- useImageUpload.ts (custom hook)

Add to Frontend/src/components/:
- ImageUploadWidget.tsx
```

---

### ❌ Missing: Resend Email Setup

**Status:** Not Configured  
**Why Needed:** Send order confirmations, quotes, inquiry responses  
**Impact:** Customers don't get notifications

**Setup Required:**
```bash
Time: 45 minutes
Steps:
1. Create Resend account (https://resend.com)
2. Get API key
3. Verify sender domain
4. Add API key to backend .env
5. Test email sending
```

**Files Affected:**
- `backend/server/integrations/resend.ts` - Already implemented ✅
- `backend/server/services/notification.service.ts` - Partially implemented

**What's Missing:**
- [ ] Email integration with order workflow
- [ ] Email integration with custom-order workflow
- [ ] Email templates (HTML)
- [ ] Email testing in admin panel
- [ ] Email bounce handling

**Action:**
```
Update backend/server/services/:
- order.service.ts (call notification on status change)
- custom-order.service.ts (call notification on status change)
- Add email template rendering
```

---

### ❌ Missing: Redis/Upstash Queue Setup (Optional)

**Status:** Not Configured  
**Why Needed:** Async job processing (emails, exports)  
**Impact:** Without it - emails are sent synchronously (slower)

**Setup Required:**
```bash
Time: 20 minutes (optional)
Steps:
1. Create Upstash account (https://upstash.com)
2. Create Redis database
3. Get connection details
4. Add to backend .env
5. Setup worker process
```

**Files Affected:**
- `backend/server/integrations/queue.ts` - Already scaffolded

**What's Missing:**
- [ ] Worker process implementation
- [ ] Job enqueueing logic
- [ ] Error retry logic
- [ ] Monitoring/dashboard

**Action (Optional - Can defer):**
```
- Implement later if performance issues arise
- System works fine with synchronous emails
- Add queue when traffic increases
```

---

## 2. Frontend Features (⏳ HIGH PRIORITY)

### ❌ Missing: Authentication UI Components

**Status:** No UI components built  
**Impact:** Users cannot create accounts or login  
**Time Estimate:** 3-4 hours

**Missing Components:**

```typescript
// 1. LoginPage.tsx
// Location: Frontend/src/components/LoginPage.tsx
// Features:
// - Email/password form
// - OAuth buttons (Google, GitHub)
// - "Forgot password" link
// - "Sign up" redirect
// - Error messages
// - Loading state

// 2. SignUpPage.tsx
// Location: Frontend/src/components/SignUpPage.tsx
// Features:
// - Name, email, password fields
// - Password confirmation
// - Terms agreement checkbox
// - Error messages
// - Loading state

// 3. ProtectedRoute.tsx
// Location: Frontend/src/components/ProtectedRoute.tsx
// Features:
// - Check if user is authenticated
// - Redirect to login if not
// - Show admin-only content

// 4. UserProfile.tsx
// Location: Frontend/src/components/UserProfile.tsx
// Features:
// - Display user info
// - Edit profile
// - Logout button
// - View order history

// 5. Navigation.tsx (Update)
// Add:
// - User menu in header
// - Login/logout links
// - Admin dashboard link
```

**Implementation:**
```bash
# Install Clerk React library
npm install @clerk/react

# Create auth context
Frontend/src/contexts/auth.tsx

# Create protected route wrapper
Frontend/src/components/ProtectedRoute.tsx

# Create login/signup pages
Frontend/src/components/LoginPage.tsx
Frontend/src/components/SignUpPage.tsx
```

---

### ❌ Missing: Admin Dashboard

**Status:** Not Built  
**Impact:** Admin cannot manage products, orders, or inquiries  
**Time Estimate:** 4-5 hours

**Missing Pages:**

```typescript
// 1. AdminDashboard.tsx
// Location: Frontend/src/components/admin/Dashboard.tsx
// Features:
// - Sales overview
// - Recent orders
// - Recent inquiries
// - Quick stats

// 2. ProductManagement.tsx
// Location: Frontend/src/components/admin/ProductManagement.tsx
// Features:
// - List all products
// - Add new product
// - Edit product
// - Delete product
// - Upload images
// - Filter by category

// 3. OrderManagement.tsx
// Location: Frontend/src/components/admin/OrderManagement.tsx
// Features:
// - List all orders
// - View order details
// - Update order status
// - View customer info
// - Print order details

// 4. CustomOrderManagement.tsx
// Location: Frontend/src/components/admin/CustomOrderManagement.tsx
// Features:
// - List custom order requests
// - View customer specs
// - Add quote price
// - Change status
// - Send quote to customer

// 5. InquiryManagement.tsx
// Location: Frontend/src/components/admin/InquiryManagement.tsx
// Features:
// - List inquiries
// - Mark as read/responded
// - Reply to inquiry
// - Archive inquiry

// 6. AdminLayout.tsx
// Location: Frontend/src/components/admin/AdminLayout.tsx
// Features:
// - Sidebar navigation
// - Admin-only access
// - Responsive design
```

**Implementation:**
```bash
# Create admin folder structure
mkdir -p Frontend/src/components/admin

# Create admin pages
Frontend/src/components/admin/Dashboard.tsx
Frontend/src/components/admin/ProductManagement.tsx
Frontend/src/components/admin/OrderManagement.tsx
Frontend/src/components/admin/CustomOrderManagement.tsx
Frontend/src/components/admin/InquiryManagement.tsx
Frontend/src/components/admin/AdminLayout.tsx

# Add admin routes
Frontend/src/App.tsx (add route: /admin/*)

# Create admin context
Frontend/src/contexts/admin.tsx
```

---

### ❌ Missing: Shopping Cart & Checkout

**Status:** Not Implemented  
**Impact:** Users can browse but not purchase  
**Time Estimate:** 3-4 hours

**Missing Components:**

```typescript
// 1. Shopping Cart Page
// Location: Frontend/src/components/Cart.tsx
// Features:
// - List cart items
// - Update quantities
// - Remove items
// - Calculate totals
// - Proceed to checkout

// 2. Checkout Flow
// Location: Frontend/src/components/Checkout.tsx
// Features:
// - Shipping address form
// - Payment method selection
// - Order summary
// - Place order button
// - Order confirmation

// 3. Cart Context
// Location: Frontend/src/contexts/cart.tsx
// Features:
// - Add to cart
// - Remove from cart
// - Update quantity
// - Get cart total
// - Clear cart

// 4. Payment Integration
// - PayFast Integration (recommended)
// - Or: Cash on delivery
```

**Implementation:**
```bash
# Create cart context
Frontend/src/contexts/cart.tsx

# Create checkout components
Frontend/src/components/Cart.tsx
Frontend/src/components/Checkout.tsx
Frontend/src/components/OrderConfirmation.tsx

# Add payment gateway (example: Stripe)
npm install @stripe/react-stripe-js @stripe/js

# Create payment handler
Frontend/src/lib/stripe.ts
Frontend/src/components/PaymentForm.tsx
```

---

### ❌ Missing: Custom Order Request Form

**Status:** No UI component  
**Impact:** Users cannot request custom orders  
**Time Estimate:** 2 hours

**Missing Component:**

```typescript
// CustomOrderForm.tsx
// Location: Frontend/src/components/CustomOrderForm.tsx
// Features:
// - Description text area
// - Reference image upload (multiple)
// - Dimensions input
// - Material selection
// - Special requests
// - Submit button
// - Confirmation message

// API call:
// POST /api/custom-orders
// Payload: {
//   description: string
//   referenceImages: string[] (Cloudinary URLs)
//   dimensions?: string
//   material?: string
// }
```

**Implementation:**
```bash
Frontend/src/components/CustomOrderForm.tsx

# Update routing
Frontend/src/App.tsx (add /custom-order route)
```

---

## 3. Backend Features (⏳ MEDIUM PRIORITY)

### ❌ Missing: Payment Processing

**Status:** No Payment Routes  
**Impact:** Cannot accept payments  
**Time Estimate:** 2-3 hours

**Missing Routes:**

```typescript
// 1. Initiate Payment
// POST /api/payments/create-intent
// Payload: { orderId: string, amount: number }
// Returns: { clientSecret: string }

// 2. Confirm Payment
// POST /api/payments/confirm
// Payload: { orderId: string, paymentIntentId: string }
// Returns: { success: boolean }

// 3. Payment Webhook
// POST /api/webhooks/stripe
// Payload: Stripe event
// Actions: Update order status based on payment
```

**Implementation:**
```bash
# Install Stripe SDK
npm install stripe

# Create payment routes
backend/app/api/payments.routes.ts

# Create payment service
backend/server/services/payment.service.ts

# Create webhook handler
backend/app/api/webhooks.routes.ts

# Add payment fields to Order model
# Update: backend/prisma/schema.prisma
# Add: stripePaymentIntentId, paymentMethod, paidAt
```

**Environment Variables Needed:**
```bash
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

### ❌ Missing: Email Notifications on Events

**Status:** Partially Implemented  
**Impact:** Customers don't get notified  
**Time Estimate:** 1-2 hours

**Missing Integrations:**

```typescript
// 1. Quote Response Email
// When custom order status → QUOTED
// Call: notificationService.sendQuoteResponse()

// 2. Order Confirmation Email
// When order is created
// Call: notificationService.sendOrderConfirmation()

// 3. Order Status Change Email
// When order status changes
// Call: notificationService.sendOrderStatusUpdate()

// 4. Inquiry Response Email
// When inquiry is marked RESPONDED
// Call: notificationService.sendInquiryResponse()
```

**Implementation:**
```bash
# Update backend/server/services/custom-order.service.ts
# Add: Send email when status changes to QUOTED

# Update backend/server/services/order.service.ts
# Add: Send email when order is confirmed
# Add: Send email on status changes

# Extend NotificationService with more email types
backend/server/services/notification.service.ts

# Add email templates (or inline HTML)
backend/server/templates/emails/ (new folder)
```

---

### ❌ Missing: Order History & Tracking

**Status:** API Partially Implemented  
**Impact:** Users cannot see their past orders  
**Time Estimate:** 1 hour

**What Exists:**
- ✅ GET /api/orders (list user orders)
- ✅ GET /api/orders/:id (get order details)

**What's Missing:**
- [ ] Frontend order history page
- [ ] Order status tracking UI
- [ ] Estimated delivery dates
- [ ] Shipment tracking (if applicable)

**Frontend Implementation:**
```bash
# Create components
Frontend/src/components/OrderHistory.tsx
Frontend/src/components/OrderDetails.tsx
Frontend/src/components/OrderTracking.tsx
```

---

## 4. Data & Content (⏳ HIGH PRIORITY)

### ❌ Missing: Product Catalog Data

**Status:** No Products in Database  
**Impact:** Store appears empty  
**Time Estimate:** 2-4 hours (depending on catalog size)

**Required Data:**

```typescript
Products needed:
- Name
- Description (2-3 sentences)
- Price (in cents, e.g., 100 = $1)
- Category (Beds, Tables, Chairs, Cabinets, etc.)
- Material (Walnut, Oak, Maple, etc.)
- Finish (Natural Oil, Lacquer, Matte, Gloss, etc.)
- Images (high-quality photos)
- Customization options (JSON metadata)

Minimum: 5 products
Recommended: 20+ products

Example:
{
  name: "Imperial Bed",
  slug: "imperial-bed",
  basePrice: 480000,
  category: "Beds",
  material: "Walnut",
  finish: "Natural Oil",
  description: "Hand-crafted walnut bed...",
  images: ["url1", "url2", ...]
}
```

**How to Add:**

**Option 1: Prisma Studio (UI)**
```bash
npm run prisma:studio
# Opens http://localhost:5555
# Click Products → Add → Fill form
```

**Option 2: API (POST /api/products)**
```bash
# Requires admin authentication
curl -X POST http://localhost:4000/api/products \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Imperial Bed",
    "slug": "imperial-bed",
    ...
  }'
```

**Option 3: CSV Import Script**
```bash
# Create: backend/scripts/import-products.ts
# Read CSV file and insert into database
# Run: npx ts-node scripts/import-products.ts
```

---

### ❌ Missing: Content Pages

**Status:** Landing page exists, but other pages missing  
**Impact:** Limited information for customers  
**Time Estimate:** 2-3 hours

**Missing Pages:**

```typescript
// 1. About Page
// Location: Frontend/src/components/About.tsx
// Content: Company story, craftsmanship, values

// 2. Gallery Page
// Location: Frontend/src/components/Gallery.tsx
// Content: Portfolio of furniture pieces with images

// 3. Services Page
// Location: Frontend/src/components/Services.tsx
// Content: Types of orders (catalog, custom, restoration)

// 4. FAQs Page
// Location: Frontend/src/components/FAQs.tsx
// Content: Common questions and answers

// 5. Contact Page
// Location: Frontend/src/components/Contact.tsx
// Content: Contact form, location, phone, hours

// 6. Privacy Policy Page
// Location: Frontend/src/components/PrivacyPolicy.tsx

// 7. Terms of Service Page
// Location: Frontend/src/components/TermsOfService.tsx
```

**Implementation:**
```bash
# Create page components
Frontend/src/components/About.tsx
Frontend/src/components/Gallery.tsx
Frontend/src/components/Services.tsx
Frontend/src/components/FAQs.tsx
Frontend/src/components/Contact.tsx
Frontend/src/components/PrivacyPolicy.tsx
Frontend/src/components/TermsOfService.tsx

# Add routes
Frontend/src/App.tsx
```

---

## 5. Infrastructure & Configuration (⏳ MEDIUM PRIORITY)

### ❌ Missing: Production Database

**Status:** Only local SQLite/PostgreSQL  
**Impact:** Cannot deploy without hosted database  
**Time Estimate:** 30 minutes

**Options:**

1. **Supabase** (Recommended)
   ```bash
   1. Go to https://supabase.com
   2. Create project
   3. Copy DATABASE_URL
   4. Add to Railway/Render environment
   ```

2. **Neon**
   ```bash
   1. Go to https://neon.tech
   2. Create database
   3. Copy connection string
   4. Add to production .env
   ```

3. **AWS RDS**
   ```bash
   1. Create RDS instance
   2. Configure security groups
   3. Get connection string
   4. Add to production .env
   ```

---

### ❌ Missing: Domain & DNS Setup

**Status:** No custom domain configured  
**Impact:** Site only accessible via platform URL  
**Time Estimate:** 30 minutes

**Required:**

1. **Register Domain**
   - Provider: GoDaddy, Namecheap, Route53, etc.
   - Time: 5 minutes
   - Cost: $10-15/year

2. **Configure DNS**
   - Point to frontend CDN (Vercel, Netlify)
   - Point to backend server (Railway, Render)
   - Setup SSL (auto-provisioned by platforms)

3. **Add to Environment**
   ```bash
   FRONTEND_URL=https://yourdomain.com
   VITE_API_BASE_URL=https://api.yourdomain.com/api
   ```

---

### ❌ Missing: SSL Certificates

**Status:** Only local HTTPS  
**Impact:** Not secure for production  
**Time Estimate:** Auto (platform handles it)

**Auto-Configured By:**
- Vercel: Automatic
- Railway: Automatic
- Render: Automatic
- Netlify: Automatic

**Action:** Just use custom domain and platforms auto-provision SSL

---

## 6. Testing (⏳ MEDIUM PRIORITY)

### ❌ Missing: Automated Tests

**Status:** No tests written  
**Impact:** Deployments risky, regressions possible  
**Time Estimate:** 2-3 hours

**Missing Test Files:**

```typescript
// Backend Unit Tests
backend/tests/product.service.test.ts
backend/tests/order.service.test.ts
backend/tests/custom-order.service.test.ts

// Backend Integration Tests
backend/tests/api/products.integration.test.ts
backend/tests/api/orders.integration.test.ts

// Frontend Component Tests
Frontend/tests/components/ProductShowcase.test.tsx
Frontend/tests/components/FinalCTA.test.tsx

// E2E Tests
Frontend/tests/e2e/checkout.e2e.ts
Frontend/tests/e2e/custom-order.e2e.ts
```

**Setup:**

```bash
# Backend - Install Jest
npm install --save-dev jest @types/jest ts-jest

# Create jest.config.js
# Write tests for critical paths

# Frontend - Install Vitest
npm install --save-dev vitest @testing-library/react

# Write component tests
```

---

### ❌ Missing: Load Testing

**Status:** No performance tests  
**Impact:** Unknown if system can handle production traffic  
**Time Estimate:** 1-2 hours

**Setup:**

```bash
# Install Artillery
npm install -g artillery

# Create load test file: load-test.yml
# Run before deployment
artillery run load-test.yml
```

---

## 7. Documentation (✅ COMPLETE)

### ✅ What Exists

- [x] API_GUIDE.md - Complete API reference
- [x] SETUP_GUIDE.md - Local setup instructions
- [x] DEPLOYMENT_READINESS.md - Pre-deployment checklist (just created)
- [x] README.md - Project overview
- [x] PROJECT_FIX_SUMMARY.md - Previous fixes
- [x] COMPLETION_CHECKLIST.md - Progress tracking

### ✅ What's Documented

- ✅ How to setup database
- ✅ How to configure services
- ✅ How to deploy to production
- ✅ All API endpoints
- ✅ Troubleshooting guide
- ✅ Environment variables
- ✅ Third-party service setup

---

## 🎯 Prioritized Implementation Plan

### Week 1 (30-40 hours)

**Day 1: Third-Party Services (6-8 hours)**
- [ ] Setup Clerk authentication (1 hour)
- [ ] Setup Cloudinary (1 hour)
- [ ] Setup Resend (1 hour)
- [ ] Setup payment gateway (Stripe) (2-3 hours)
- [ ] Test all integrations (1 hour)

**Day 2-3: Backend Features (6-8 hours)**
- [ ] Implement payment routes (2 hours)
- [ ] Add email notifications (2 hours)
- [ ] Add order history endpoints (1 hour)
- [ ] Test all backend features (1-2 hours)

**Day 4-5: Frontend Core (8-10 hours)**
- [ ] Build auth UI (login/signup) (3 hours)
- [ ] Build cart system (2 hours)
- [ ] Build checkout flow (2 hours)
- [ ] Build custom order form (1 hour)
- [ ] Testing and fixes (1-2 hours)

**Day 6: Admin Dashboard (6-8 hours)**
- [ ] Build admin layout (1 hour)
- [ ] Product management page (2 hours)
- [ ] Order management page (2 hours)
- [ ] Inquiry/custom order pages (1-2 hours)

### Week 2 (10-15 hours)

**Day 7: Data & Content (4-6 hours)**
- [ ] Import product catalog (2-3 hours)
- [ ] Create content pages (2-3 hours)

**Day 8: Testing & Deployment (6-8 hours)**
- [ ] Write tests (2 hours)
- [ ] Load testing (1 hour)
- [ ] Deploy to staging (1-2 hours)
- [ ] Deploy to production (1 hour)
- [ ] Monitor and fix (1-2 hours)

---

## 📋 Pre-Deployment Dependency Chain

```
Order of Implementation:

1. Third-Party Services ← MUST DO FIRST
   ├─ Clerk (auth)
   ├─ Stripe (payments)
   └─ All others

2. Backend Features ← DEPENDS ON #1
   ├─ Payment routes
   ├─ Email notifications
   └─ Auth middleware

3. Frontend Features ← DEPENDS ON #2
   ├─ Auth UI
   ├─ Cart & checkout
   └─ Admin dashboard

4. Data & Content ← DEPENDS ON #3
   ├─ Product catalog
   └─ Content pages

5. Testing ← DEPENDS ON #3
   ├─ Unit tests
   ├─ Integration tests
   └─ E2E tests

6. Deployment ← DEPENDS ON ALL
   ├─ Setup hosting
   ├─ Configure DNS
   └─ Launch
```

---

## ⚠️ Critical Path (Blocking Items)

These MUST be done before deployment:

- [ ] Clerk authentication working
- [ ] Database production instance created
- [ ] Payment processing working
- [ ] Email sending working
- [ ] Frontend can login
- [ ] Admin dashboard functional
- [ ] Product data in database
- [ ] SSL certificates active

---

## Summary Statistics

| Item | Count | Priority | Time |
|------|-------|----------|------|
| Frontend Components | 15+ | HIGH | 8-10 hrs |
| Backend Routes | 8+ | HIGH | 3-4 hrs |
| Third-Party Services | 4 | CRITICAL | 2-3 hrs |
| Product Data | 5-50+ | HIGH | 2-4 hrs |
| Content Pages | 7 | MEDIUM | 2-3 hrs |
| Tests | 10+ | MEDIUM | 2-3 hrs |
| **TOTAL** | **50+** | | **20-30 hrs** |

---

## ✅ Deployment Readiness Status

**Current Status:** 40% Ready  
**Ready to Deploy:** NO  
**Expected Ready:** In 20-30 hours of focused development  
**Recommendation:** Complete third-party setup and core features before any deployment

**Next Step:** Start with Third-Party Services setup (Clerk, Stripe, etc.)

---

**Document Version:** 1.0  
**Created:** May 6, 2026  
**Purpose:** Pre-deployment gap analysis and implementation guide
