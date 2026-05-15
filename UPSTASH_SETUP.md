# Upstash Redis setup

This project uses Upstash Redis for the notification queue and worker.
You need **two** Redis-related values:

- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for the REST client
- `REDIS_URL` for BullMQ / ioredis

## Step 1: Create the Redis database

1. Go to Upstash and create a new Redis database.
2. Pick the region closest to your users if possible.
3. Open the database dashboard.

## Step 2: Copy the REST values

1. Find the REST connection section.
2. Copy the REST URL.
3. Copy the REST token.
4. Put them into `backend/.env`:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

## Step 3: Copy the Redis URL

1. Find the normal Redis connection string.
2. Copy the `redis://...` URL.
3. Put it into `backend/.env`:

```bash
REDIS_URL=redis://default:password@host:port
```

## Step 4: Keep the worker running

The worker sends notification emails in the background.

Run it locally with:

```bash
npm run worker:dev
```

For production, run:

```bash
npm run worker:start
```

## Step 5: Test the connection

1. Start the backend.
2. Start the worker.
3. Create an action that sends a notification.
4. Check the logs for:
   - `Upstash Redis REST connection verified.`
   - `Notification worker started.`

## Step 6: Common mistakes

- Using the REST URL in `REDIS_URL`
- Leaving `REDIS_URL` blank
- Forgetting to start the worker process
- Setting Upstash values only in the frontend instead of the backend

## Step 7: Where this is used

- `backend/server/integrations/queue.ts`
- `backend/worker.ts`
- `backend/server/services/notification.service.ts`

## Quick checklist

- [ ] Upstash Redis database created
- [ ] REST URL added
- [ ] REST token added
- [ ] Redis URL added
- [ ] Worker running
- [ ] Notification test passed
