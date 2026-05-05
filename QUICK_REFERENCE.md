# 🚀 Quick Reference Guide

## Files You Need to Know About

### 📖 Documentation (READ THESE FIRST)
```
API_GUIDE.md              - Everything about the APIs and services
SETUP_GUIDE.md            - How to setup and run locally
COMPLETION_CHECKLIST.md   - What was done and verified
PROJECT_FIX_SUMMARY.md    - Detailed changes made
README_NEW.md             - Project overview
```

### 💻 Development
```
backend/                  - Express API server
Frontend/                 - React frontend
```

---

## Getting Started (3 Steps)

### 1️⃣ Read Setup Guide
```bash
Open: SETUP_GUIDE.md
```
Follow the step-by-step instructions for your operating system.

### 2️⃣ Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run dev

# Terminal 2 - Frontend
cd Frontend
npm install
npm run dev
```

### 3️⃣ Open Browser
```
Frontend: http://localhost:5173
Backend Health: http://localhost:4000/health
```

---

## What Was Fixed

| Issue | Status | Details |
|-------|--------|---------|
| Dummy Data | ✅ Removed | ProductShowcase no longer shows fallback products |
| Exposed Credentials | ✅ Cleared | All test keys removed from .env |
| Form Data Mismatch | ✅ Fixed | Inquiry form now sends email and fullName |
| Type Errors | ✅ Fixed | API payload types match backend validation |
| Documentation | ✅ Created | 56KB+ docs covering all aspects |

---

## Common Commands

### Backend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run prisma:studio    # Open database GUI
npm run prisma:push      # Sync database schema
npm start                # Run built code
```

### Frontend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run linter
```

---

## Environment Setup

### What You Need (Optional)
- Clerk (authentication) - [clerk.com](https://clerk.com)
- Cloudinary (images) - [cloudinary.com](https://cloudinary.com)
- Resend (email) - [resend.com](https://resend.com)

### How to Get Keys
See: **API_GUIDE.md → Environment Configuration → Getting Credentials**

---

## Adding Real Data

### Option 1: Database GUI (Easiest)
```bash
npm run prisma:studio
# Opens at http://localhost:5555
```

### Option 2: API Calls
```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Product Name",
    "slug": "product-slug",
    "category": "Beds",
    "material": "Walnut",
    "basePrice": 480000
  }'
```

---

## Testing Features

### Test Inquiry Form
1. Frontend: http://localhost:5173
2. Scroll to bottom → "Book a Consultation"
3. Fill form and submit
4. Should succeed

### Test Products API
```bash
curl http://localhost:4000/api/products
```

### View Database
```bash
npm run prisma:studio
```

---

## Troubleshooting

### Issue: "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
npm install
```

### Issue: "Database connection failed"
```bash
# Check PostgreSQL is running
psql postgres -c "SELECT 1;"

# Check DATABASE_URL in .env
echo $DATABASE_URL
```

### Issue: "Port already in use"
```bash
# Kill process on port 4000
lsof -i :4000
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

**More issues?** See: **API_GUIDE.md → Troubleshooting**

---

## Documentation Map

```
Start Here
    ↓
README_NEW.md (Overview)
    ↓
    ├─→ SETUP_GUIDE.md (Need to setup?)
    │
    ├─→ API_GUIDE.md (Need API details?)
    │
    ├─→ PROJECT_FIX_SUMMARY.md (Want to know what changed?)
    │
    └─→ COMPLETION_CHECKLIST.md (Want verification?)
```

---

## Important URLs

### Local Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- API: `http://localhost:4000/api`
- Health Check: `http://localhost:4000/health`
- Database GUI: `http://localhost:5555` (when running Prisma Studio)

### Services
- Clerk: https://clerk.com
- Cloudinary: https://cloudinary.com
- Resend: https://resend.com
- PostgreSQL: https://postgresql.org

---

## Database Schema Quick View

```
Products          - Furniture catalog
└─ ProductImages  - Product images

CustomOrders      - Bespoke requests
└─ User           - Customer reference

Orders            - Standard orders
└─ User           - Customer reference

Inquiries         - Customer inquiries
  - fullName
  - email (NEW)
  - phone
  - city
  - message

Users             - Customer profiles
```

---

## Project Status

✅ **All Errors Fixed**
✅ **Dummy Data Removed**
✅ **Credentials Cleared**
✅ **Comprehensive Docs**
✅ **Ready for Real Data**

---

## What's Ready to Use

### ✅ Working Features
- Product listing and filtering
- Custom order requests
- Standard orders
- Customer inquiries (with email)
- Secure image uploads (with Cloudinary)
- Rate limiting and security headers

### 🔄 Need Setup (Optional)
- User authentication (Clerk)
- Email notifications (Resend)
- Admin dashboard UI (backend ready)

### 📋 Not Included
- Payment processing
- Shipping integration
- Analytics
- Admin frontend

---

## Next Steps

### Immediately
1. ✅ Read SETUP_GUIDE.md
2. ✅ Setup local development
3. ✅ Add sample furniture data
4. ✅ Test forms work

### Soon
1. Configure Clerk (optional)
2. Configure Cloudinary (optional)
3. Deploy to production
4. Add real customer data

### Later
1. Build admin dashboard
2. Add payment integration
3. Add shipping integration
4. Setup analytics

---

## Support

| Need Help With | Read This |
|---|---|
| Setup | SETUP_GUIDE.md |
| APIs | API_GUIDE.md |
| Troubleshooting | API_GUIDE.md → Troubleshooting |
| Deployment | API_GUIDE.md → Deployments |
| What Changed | PROJECT_FIX_SUMMARY.md |
| Verification | COMPLETION_CHECKLIST.md |

---

## Key Facts to Remember

✅ **Dummy data is GONE** - Only real database products show
✅ **No test credentials** - All secrets cleared, use templates
✅ **Type-safe** - Forms match APIs perfectly
✅ **Well documented** - 56KB+ comprehensive guides
✅ **Production ready** - All deployment options available
✅ **Secure** - CORS, rate limiting, validation all working

---

**You're all set! 🎉**

Start with SETUP_GUIDE.md and follow the steps.
If you get stuck, check TROUBLESHOOTING in API_GUIDE.md.

Happy coding! 🚀
