# DBMS Project - Luxury CNC Furniture E-Commerce Platform

A full-stack e-commerce platform for luxury CNC furniture with custom order management, built with React + Vite + Express + PostgreSQL.

## 🚀 Quick Links

- **[API Documentation](./API_GUIDE.md)** - Complete API reference with all endpoints
- **[Setup Guide](./SETUP_GUIDE.md)** - Step-by-step local development setup
- **[Technologies](#-tech-stack)** - Full list of technologies used

## 📋 Features

- **Product Catalog** - Browse luxury furniture with advanced filtering
- **Custom Orders** - Request bespoke furniture with quotes
- **Order Management** - Track orders with status updates
- **Admin Dashboard** - Manage products, orders, and inquiries (backend ready)
- **Secure Authentication** - Clerk passwordless auth
- **Image Management** - Cloudinary integration for uploads
- **Email Notifications** - Resend integration for customer communications
- **Responsive Design** - Mobile-first Tailwind CSS styling
- **Smooth Animations** - Framer Motion page transitions

## 💻 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI framework & build tool |
| **Styling** | Tailwind CSS + Framer Motion | CSS & animations |
| **Backend** | Express.js + TypeScript | REST API server |
| **Database** | PostgreSQL + Prisma | Data persistence |
| **Auth** | Clerk | User authentication |
| **Media** | Cloudinary | Image hosting & optimization |
| **Email** | Resend | Transactional emails |
| **Rate Limiting** | express-rate-limit | API protection |
| **Validation** | Zod | Runtime schema validation |

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- npm/yarn
- PostgreSQL 13+
- Git

### Quick Start (5 minutes)

```bash
# 1. Backend
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run dev

# 2. Frontend (new terminal)
cd Frontend
npm install
npm run dev

# 3. Open http://localhost:5173
```

**Full Setup Guide:** See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 📚 API Reference

All API endpoints documented with examples:

- **Products API** - List, create, update products
- **Orders API** - Standard order management
- **Custom Orders API** - Bespoke furniture requests
- **Inquiries API** - Customer inquiries
- **Media API** - Secure image uploads

**Complete Reference:** See [API_GUIDE.md](./API_GUIDE.md)

## 🏗️ Project Structure

```
├── backend/                    # Express API
│   ├── app/api/               # Route handlers
│   ├── server/
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Database queries
│   │   ├── validators/        # Input validation
│   │   └── middleware/        # Express middleware
│   ├── prisma/                # Database schema
│   └── server.ts              # Express app
│
├── Frontend/                  # React app
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── lib/              # Utilities & API client
│   │   └── App.tsx            # Main component
│   └── vite.config.ts
│
├── API_GUIDE.md              # Complete API documentation
└── SETUP_GUIDE.md            # Setup instructions
```

## 🔧 Environment Configuration

### Backend (.env)

```bash
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
RESEND_API_KEY=re_xxx
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### Frontend (.env)

```bash
VITE_API_BASE_URL=http://localhost:4000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

**Detailed Configuration:** See [API_GUIDE.md Environment Configuration](./API_GUIDE.md#environment-configuration)

## 📖 Common Commands

### Backend
```bash
npm run dev              # Start dev server
npm run build            # Build TypeScript
npm start                # Run compiled code
npm run prisma:push      # Sync database schema
npm run prisma:studio    # Open database GUI
```

### Frontend
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run ESLint
```

## 🚀 Deployment

### Backend
- **Railway**, **Render**, **Heroku**, or any Node.js host

### Frontend
- **Vercel** (recommended), **Netlify**, **GitHub Pages**

**Deployment Guide:** See [API_GUIDE.md Deployments](./API_GUIDE.md#deployments)

## 🐛 Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| `Cannot find module '@prisma/client'` | Run `npm run prisma:generate` |
| `Database connection failed` | Check `DATABASE_URL` and PostgreSQL is running |
| `Port already in use` | Kill process on port 4000/5173 or use different port |
| `API calls return 503` | Verify Clerk keys in `.env` |
| `Products won't load` | Check backend health: `curl http://localhost:4000/health` |

**Full Troubleshooting:** See [API_GUIDE.md Troubleshooting](./API_GUIDE.md#troubleshooting)

## 📝 Database Schema

### Core Tables

- **Products** - Furniture catalog with categories, materials, finishes
- **CustomOrders** - Bespoke order requests with status tracking
- **Orders** - Standard orders with order items
- **Inquiries** - Customer inquiries and contact requests
- **Users** - Customer profiles linked to Clerk

**Details:** See Prisma schema at `backend/prisma/schema.prisma`

## 🔐 Security

- ✅ CORS configured for frontend URLs
- ✅ Rate limiting on API routes (200 requests/15 min)
- ✅ Helmet for HTTP security headers
- ✅ Zod validation on all inputs
- ✅ Clerk for secure authentication
- ✅ Cloudinary signed URLs for uploads

## 📋 Recent Changes

### Fixed Issues
- ✅ Cleared dummy product data from frontend
- ✅ Removed exposed credentials from `.env`
- ✅ Fixed inquiry form to match API requirements (added email, fullName)
- ✅ Updated database schema for inquiries
- ✅ Created comprehensive API documentation
- ✅ Created complete setup guide

### Created Documentation
- ✅ [API_GUIDE.md](./API_GUIDE.md) - 28KB+ complete API reference
- ✅ [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Step-by-step setup instructions

## 📞 Support

For issues, questions, or contributions:
1. Check [API_GUIDE.md](./API_GUIDE.md) for detailed documentation
2. Review [SETUP_GUIDE.md](./SETUP_GUIDE.md) for setup help
3. Check [TROUBLESHOOTING](./API_GUIDE.md#troubleshooting) section
4. Review code in respective folders

## 📄 License

Project created for luxury furniture e-commerce platform.

---

**Last Updated:** May 2026 | **Status:** Production Ready (with optional integrations)
