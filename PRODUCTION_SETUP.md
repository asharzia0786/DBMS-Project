# Production setup

Use this checklist when moving the app beyond local development.

## 1. PostgreSQL

1. Create a production database.
2. Set `DATABASE_URL` in `backend/.env`.
3. Run Prisma deploy on the production backend:
   ```bash
   npm run prisma:deploy
   ```

## 2. Clerk

1. Create a Clerk application.
2. Set backend keys:
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. Set frontend key:
   - `VITE_CLERK_PUBLISHABLE_KEY`
4. Add your production frontend origin to Clerk allowed URLs.

## 3. Cloudinary

1. Create a Cloudinary account and upload preset or signed upload config.
2. Set:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## 4. Resend

1. Create a Resend project.
2. Verify your sending domain.
3. Set:
   - `RESEND_API_KEY`
   - `EMAIL_FROM`

## 5. Upstash Redis

1. Create a Redis database in Upstash.
2. Set:
    - `UPSTASH_REDIS_REST_URL`
    - `UPSTASH_REDIS_REST_TOKEN`
    - `REDIS_URL`
3. See `UPSTASH_SETUP.md` for the exact dashboard values and worker steps.

## 6. SafePay

1. Create live SafePay credentials if payments are required.
2. Set:
   - `SAFEPAY_SECRET_KEY`
   - `SAFEPAY_MERCHANT_API_KEY`
   - `SAFEPAY_ENVIRONMENT=production`
   - `SAFEPAY_WEBHOOK_SECRET`

## 7. Frontend deployment

1. Deploy the frontend app.
2. Set:
   - `VITE_API_BASE_URL`
   - `VITE_APP_URL`
   - `VITE_CLERK_PUBLISHABLE_KEY`

## 8. Backend deployment

1. Deploy the backend app.
2. Set:
   - `NODE_ENV=production`
   - `PORT`
   - `FRONTEND_URL`
   - `FRONTEND_URLS`
   - all service credentials above

## 9. Validation

1. Confirm the frontend loads and navigates correctly.
2. Confirm product catalog, custom orders, inquiries, uploads, and payments work with real credentials.
3. Confirm worker/queue processes can send notifications.
