# Deployment Guide for Today

This is a very simple guide for publishing the website.
Think of it like building a toy house:

- the **backend** is the kitchen and storage room
- the **frontend** is the pretty front of the house
- the **services** are helpers like mail, photos, money, and memory

If one helper is missing, part of the website may not work.

---

## Before you start

Make sure you have:

- a GitHub repo with your code
- accounts for the services you need
- your production domain or temporary site URL

You already set up **Clerk**, so that part is one thing less to worry about.

---

## Step 1: Get the backend ready

The backend is the brain that talks to the database and services.

### What to do

1. Open your backend deployment platform, Render.
2. Create a new service from the repo.
3. Set the backend environment variables.
4. Connect the production database.
5. Run Prisma deploy so the database gets the right tables.

### Why this matters

If the backend is not ready, the website cannot:

- load products
- save orders
- save inquiries
- upload images
- send emails

### Backend env values you need

- `DATABASE_URL`
- `FRONTEND_URL`
- `FRONTEND_URLS`
- `CLERK_SECRET_KEY`
- `CLERK_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `REDIS_URL`
- `SAFEPAY_SECRET_KEY`
- `SAFEPAY_MERCHANT_API_KEY`
- `SAFEPAY_ENVIRONMENT`
- `SAFEPAY_WEBHOOK_SECRET`

### Easy rule

If the backend is the brain, these env values are the brain’s glasses, phone, and keys.

---

## Step 2: Set up the database

The database is the notebook where the website remembers everything.

### What to do

1. Create a Neon PostgreSQL database.
2. Put the database address into `DATABASE_URL`.
3. Run the production migration command:

```bash
npm run prisma:deploy
```

### Why this matters

Without the database, the site cannot remember:

- products
- orders
- custom orders
- inquiries
- users

### Easy rule

No notebook means no memory.

---

## Step 3: Set up Cloudinary for images

Cloudinary is the photo shelf.

### What to do

1. Create a Cloudinary account.
2. Get these values:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

3. Put them in the backend env file.

### Why this matters

This helps the site store and show product images.

### Easy rule

If you want pretty pictures, the photo shelf must be open.

---

## Step 4: Set up Resend for email

Resend is the mailman.

### What to do

1. Create a Resend account.
2. Verify your sending domain.
3. Add:

- `RESEND_API_KEY`
- `EMAIL_FROM`

### Why this matters

This is used for emails like:

- inquiry messages
- order updates
- custom order messages

### Easy rule

No mailman means no emails.

---

## Step 5: Set up Upstash Redis

Upstash Redis is the fast helper box.

### What to do

1. Create a Redis database in Upstash.
2. Add these values:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `REDIS_URL`

### Why this matters

This helps background jobs and notifications work properly.

### Easy rule

This is like a quick note sticky pad for the worker.

---

## Step 6: Set up SafePay if you need live payments

SafePay is the money helper.

### What to do

1. Create live SafePay credentials.
2. Put these in the backend env:

- `SAFEPAY_SECRET_KEY`
- `SAFEPAY_MERCHANT_API_KEY`
- `SAFEPAY_ENVIRONMENT=production`
- `SAFEPAY_WEBHOOK_SECRET`

### Why this matters

If customers pay online, the payment system must be real and safe.

### Easy rule

Money needs extra care.

If you are not taking payments today, you can deploy without this part for now.

---

## Step 7: Deploy the frontend

The frontend is the pretty face of the website.

### What to do

1. Deploy the frontend on Cloudflare Pages.
2. Add these frontend env values:

- `VITE_API_BASE_URL`
- `VITE_APP_URL`
- `VITE_CLERK_PUBLISHABLE_KEY`

### Why this matters

This tells the frontend:

- where the backend lives
- what the public website URL is
- which Clerk app to use

### Easy rule

The face must know where to talk to the brain.

---

## Step 8: Connect the frontend and backend

Now make both halves talk to each other.

### What to do

1. Set `VITE_API_BASE_URL` to `https://api.habibandsons.com/api`.
2. Set `VITE_APP_URL` to `https://habibandsons.com`.
3. Set `FRONTEND_URLS` in the backend to `https://habibandsons.com,https://www.habibandsons.com`.

### Why this matters

If they do not know each other’s address, they cannot talk.

### Easy rule

Each side needs the other side’s home address.

---

## Step 9: Check Clerk again

You already set up Clerk, but production needs one more check.

### What to do

1. Add your live frontend domain in Clerk allowed URLs.
2. Confirm the login and sign-up routes work on the live site.
3. Confirm profile pages and protected pages open correctly.

### Why this matters

If Clerk does not trust the live domain, users cannot log in properly.

---

## Step 10: Check everything on the live site

This is the final “does it all work?” step.

### Test these things

- Home page opens
- Navbar links go to the right place
- Collection page opens
- Product pages open
- Login and sign-up work
- Custom order form works
- Inquiry form works
- Image upload works
- Admin dashboard works
- Emails send
- Payments work if enabled

### Why this matters

This is your final toy test:

if every button does the right thing, you are ready.

---

## Good order to deploy today

1. Backend
2. Database migration
3. Cloudinary
4. Resend
5. Redis
6. SafePay if needed
7. Frontend
8. Clerk production URLs
9. Final smoke test

---

## If something breaks

Try this order:

1. Check the env values.
2. Check the backend health endpoint.
3. Check if the frontend API URL is correct.
4. Check if the database migration ran.
5. Check the browser console and deployment logs.

---

## Final thought

Your website is almost ready.
You just need to give every helper the right keys and addresses, then make sure the frontend and backend can talk nicely.
