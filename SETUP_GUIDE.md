# DBMS Project - Complete Setup Guide

Step-by-step guide to get the project running locally.

---

## Prerequisites

### System Requirements

- **Node.js:** 18.0.0 or higher
- **npm:** 9.0.0 or higher (comes with Node.js)
- **PostgreSQL:** 13 or higher
- **Git:** 2.0 or higher

### Check Your Versions

```bash
node --version      # Should be v18.0.0 or higher
npm --version       # Should be 9.0.0 or higher
psql --version      # Should be 13+
git --version       # Should be 2.0+
```

---

## Step 1: PostgreSQL Setup

### macOS (Homebrew)

```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create database
createdb myapp

# Verify installation
psql postgres -c "SELECT version();"
```

### Windows

1. Download PostgreSQL from https://postgresql.org/download/windows
2. Run installer and note the password you set for `postgres` user
3. Keep all default settings (port 5432)
4. Complete installation

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt-get update

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb myapp
```

### Verify PostgreSQL

```bash
# Connect to PostgreSQL
psql postgres

# You should see a prompt like:
# postgres=#

# Type to exit
postgres=# \q
```

---

## Step 2: Clone & Setup Backend

### Navigate to Project

```bash
cd F:\DBMS Project\backend
# or
cd ~/path/to/DBMS-Project/backend
```

### Install Dependencies

```bash
npm install
```

**Expected output:** Should show `added XXX packages`

### Create Environment File

```bash
# Copy example template
cp .env.example .env

# Edit the .env file with your PostgreSQL password
# Open with your editor
```

### Configure .env for Local Development

Edit `backend/.env`:

```bash
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5173
FRONTEND_URLS=http://localhost:5173

DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/myapp?schema=public
# Replace PASSWORD with the one you set during PostgreSQL installation
# Example: postgresql://postgres:mypassword123@localhost:5432/myapp?schema=public

CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

RESEND_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

REDIS_URL=
```

### Generate Prisma Client

```bash
npm run prisma:generate
```

**Expected output:** Should say `generated successfully`

### Initialize Database

```bash
npm run prisma:push
```

**What this does:**
- Creates all database tables
- Sets up relationships
- Initializes indexes

**Expected output:**
```
PostgreSQL
  ✓ Already in sync, no schema change or pending migration detected.

✓ Your database is now in sync with your Prisma schema.
```

### Verify Database Setup

```bash
# Open Prisma Studio to see database
npm run prisma:studio
```

This opens http://localhost:5555 where you can view/edit database tables visually.

---

## Step 3: Setup Frontend

### Navigate to Frontend Directory

```bash
cd ../Frontend
# or from root: cd Frontend
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

```bash
cp .env.example .env
```

### Configure .env for Local Development

Edit `Frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
VITE_APP_URL=http://localhost:5173
VITE_CLERK_PUBLISHABLE_KEY=
```

---

## Step 4: Start Development Servers

### Terminal 1 - Backend

```bash
cd F:\DBMS Project\backend
npm run dev
```

**Expected output:**
```
Backend listening on http://localhost:4000
```

### Terminal 2 - Frontend

```bash
cd F:\DBMS Project\Frontend
npm run dev
```

**Expected output:**
```
  VITE v5.4.2  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Verify Installation

Open your browser:
- **Frontend:** http://localhost:5173 (should see landing page)
- **Backend Health:** http://localhost:4000/health (should show `{"success":true,"data":{"status":"ok"}}`)

---

## Step 5: (Optional) Add Sample Data

### Using Prisma Studio

```bash
# Terminal 1: Stop backend (Ctrl+C)
npm run prisma:studio
```

1. Open http://localhost:5555
2. Click on "Product" table
3. Click "Add" button
4. Fill in product details
5. Save

**Sample Product:**
```
name: Imperial Bed
slug: imperial-bed
category: Beds
material: Walnut
finish: Natural Oil
basePrice: 480000
description: Premium walnut bed with CNC carvings
```

### Using SQL

```bash
psql postgresql://postgres:password@localhost:5432/myapp

INSERT INTO "Product" (id, name, slug, category, material, finish, "basePrice", description, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Imperial Bed', 'imperial-bed', 'Beds', 'Walnut', 'Natural Oil', 480000, 'Premium walnut bed', NOW(), NOW());

\q
```

---

## Step 6: Setup Authentication (Clerk) - Optional for Development

If you want to test protected routes:

### Create Clerk Account

1. Go to https://clerk.com
2. Sign up for free account
3. Create a new application

### Get Clerk Keys

1. In Clerk Dashboard, go to **API Keys**
2. Copy `Publishable Key`
3. Copy `Secret Key`

### Update Environment Variables

**backend/.env:**
```
CLERK_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

**Frontend/.env:**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

### Restart Servers

```bash
# Stop both servers (Ctrl+C)
# Terminal 1: npm run dev (backend)
# Terminal 2: npm run dev (frontend)
```

---

## Step 7: Setup Media Upload (Cloudinary) - Optional

If you want to test image uploads:

### Create Cloudinary Account

1. Go to https://cloudinary.com
2. Sign up for free account
3. Go to **Dashboard**

### Get Cloudinary Credentials

1. **Cloud Name:** Displayed at top of Dashboard
2. **API Key:** In Settings → API Keys
3. **API Secret:** In Settings → API Keys

### Update Environment Variables

**backend/.env:**
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Restart Backend

```bash
# Terminal 1: npm run dev
```

---

## Troubleshooting Setup

### "npm: command not found"

**Solution:** Install Node.js from https://nodejs.org

### "psql: command not found"

**Solution:** PostgreSQL not installed. Follow PostgreSQL setup above.

### "Cannot connect to PostgreSQL"

**Debug:**
```bash
# Check if PostgreSQL is running
psql postgres

# If fails, start PostgreSQL:
# macOS: brew services start postgresql
# Windows: Services → PostgreSQL → Start
# Linux: sudo systemctl start postgresql
```

### "Database URL invalid"

**Check:** Verify password and username in DATABASE_URL:
```
postgresql://postgres:YOUR_PASSWORD@localhost:5432/myapp
```

Example with password "abc123":
```
postgresql://postgres:abc123@localhost:5432/myapp
```

### "Port 4000 already in use"

**Solution:**
```bash
# Find and kill process on port 4000
# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :4000
kill -9 <PID>
```

### "Module not found errors"

**Solution:**
```bash
# Backend
cd backend
rm -rf node_modules
npm install
npm run prisma:generate

# Frontend
cd ../Frontend
rm -rf node_modules
npm install
```

### "Prisma Client not generated"

**Solution:**
```bash
cd backend
npm run prisma:generate
npm run build
```

### "Frontend won't load"

**Check:**
1. Backend is running: `curl http://localhost:4000/health`
2. Frontend development server started: `npm run dev`
3. No port conflicts (try port 3000 if 5173 in use)

### "API calls fail (CORS error)"

**Solution:** Ensure backend CORS is configured:

**backend/.env:**
```
FRONTEND_URL=http://localhost:5173
FRONTEND_URLS=http://localhost:5173
```

Then restart backend.

---

## Project Structure Reference

```
DBMS Project/
├── backend/
│   ├── app/api/                    # API routes
│   ├── server/
│   │   ├── services/               # Business logic
│   │   ├── repositories/           # Database queries
│   │   ├── validators/             # Input validation
│   │   ├── types/                  # TypeScript types
│   │   └── middleware/             # Express middleware
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   └── migrations/             # DB migrations
│   ├── server.ts                   # Express app
│   ├── .env                        # Environment variables
│   ├── .env.example                # Environment template
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── lib/                    # Utilities
│   │   ├── App.tsx                 # Main app
│   │   └── main.tsx                # Entry point
│   ├── public/                     # Static assets
│   ├── .env                        # Environment variables
│   ├── .env.example                # Environment template
│   ├── vite.config.ts
│   └── package.json
│
├── API_GUIDE.md                    # Complete API documentation
├── SETUP_GUIDE.md                  # This file
└── README.md
```

---

## Common Commands Reference

### Backend

```bash
cd backend

# Development
npm run dev                 # Start dev server with auto-reload

# Building
npm run build              # Compile TypeScript
npm start                  # Run compiled JavaScript

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:push        # Sync schema with database
npm run prisma:migrate     # Create migration
npm run prisma:studio      # Open database GUI (http://localhost:5555)

# Other
npm run lint               # Run linter (if configured)
npm run typecheck          # Check TypeScript types
```

### Frontend

```bash
cd Frontend

# Development
npm run dev                # Start dev server with hot reload

# Building
npm run build              # Build for production
npm run preview            # Preview production build locally

# Linting
npm run lint               # Run ESLint
npm run typecheck          # Check TypeScript types
```

---

## Next Steps

1. ✅ **Development:** Server running, ready to develop
2. ⚙️ **Configure Clerk** (optional): Add authentication
3. 🖼️ **Configure Cloudinary** (optional): Enable image uploads
4. 📊 **Add Sample Data:** Populate database with products
5. 🚀 **Deploy:** See API_GUIDE.md Deployments section

---

## Need Help?

- Check API_GUIDE.md for detailed API documentation
- Review database schema: `npm run prisma:studio`
- Check logs: Look at terminal output for errors
- Verify connectivity: `curl http://localhost:4000/health`

---

## Quick Reset

If something goes wrong, reset everything:

```bash
# Stop all servers (Ctrl+C)

# Backend reset
cd backend
npm run prisma:db:push --force-reset  # WARNING: Deletes all data
npm run prisma:generate
npm install

# Frontend reset
cd ../Frontend
npm install

# Start fresh
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd Frontend && npm run dev
```

---

## File Checklist

Make sure you have these files before starting:

- ✅ `backend/.env` (created from .env.example)
- ✅ `Frontend/.env` (created from .env.example)
- ✅ PostgreSQL running and `myapp` database created
- ✅ `node_modules/` folders (created by `npm install`)
- ✅ `backend/dist/` folder (will be created by `npm run build`)

---

Happy coding! 🚀
