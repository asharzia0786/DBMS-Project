# Backend Postman Tests

Use this as a checklist in Postman for the backend API.

## Setup

Base URL:

```text
http://localhost:4000
```

Use this Postman environment:

- `baseUrl` = `http://localhost:4000`
- `clerkToken` = a valid Clerk Bearer token
- `productId` = a real product UUID
- `productSlug` = a real product slug
- `orderId` = a real order UUID
- `customOrderId` = a real custom order UUID
- `inquiryId` = a real inquiry UUID

For auth requests, add:

```text
Authorization: Bearer {{clerkToken}}
```

---

## 1) Health

### GET `/health`
Expect:
- `200 OK`
- JSON body with `success: true`
- `data.status = "ok"`

Negative:
- none required

---

## 2) Products

### GET `/api/products`
Test:
1. No query params
2. `page=1&pageSize=20`
3. Search/filter combos:
   - `search=bed`
   - `category=bed`
   - `material=walnut`
   - `finish=polished`

Expect:
- `200 OK`
- paginated response

Negative:
- `page=0` or `pageSize=0` should fail validation

### GET `/api/products/:slug`
Test:
1. Valid slug
2. Missing/invalid slug

Expect:
- valid slug -> `200 OK`
- missing product -> `404` or not found response

### POST `/api/products` (admin)
Headers:
- auth token
- admin user

Body:
```json
{
  "name": "Walnut Bed",
  "slug": "walnut-bed",
  "description": "Handcrafted walnut bed",
  "basePrice": 450000,
  "category": "Bed",
  "material": "Walnut",
  "finish": "Polished",
  "images": [
    {
      "imageUrl": "https://example.com/image.jpg",
      "altText": "Walnut bed"
    }
  ]
}
```

Expect:
- `201 Created`

Negative:
- non-admin -> `403`
- invalid slug -> validation error
- missing name/basePrice -> validation error

### PATCH `/api/products/:id` (admin)
Body:
```json
{
  "name": "Updated Walnut Bed"
}
```

Expect:
- `200 OK`

Negative:
- empty body -> validation error
- non-admin -> `403`
- invalid UUID -> validation error

### DELETE `/api/products/:id` (admin)
Expect:
- `200 OK`

Negative:
- non-admin -> `403`
- invalid UUID -> validation error

---

## 3) Custom orders

### POST `/api/custom-orders`
Auth required.

Body:
```json
{
  "customerEmail": "buyer@example.com",
  "description": "I want a custom walnut dining table with carved legs.",
  "referenceImages": ["https://example.com/ref1.jpg"],
  "dimensions": "6ft x 3ft",
  "material": "Walnut"
}
```

Expect:
- `201 Created`

Negative:
- description shorter than 10 chars -> validation error
- invalid URL in `referenceImages` -> validation error
- no auth -> `401`

### GET `/api/custom-orders`
Auth required.

Expect:
- customer sees own custom orders
- `200 OK`

Negative:
- no auth -> `401`

### GET `/api/custom-orders/admin`
Admin only.

Expect:
- `200 OK`

Negative:
- non-admin -> `403`

### GET `/api/custom-orders/:id`
Auth required.

Expect:
- owner or admin can view
- `200 OK`

Negative:
- not owner and not admin -> `404`
- invalid UUID -> validation error

### PATCH `/api/custom-orders/:id/status`
Admin only.

Body:
```json
{
  "status": "QUOTED",
  "quotedPrice": 250000
}
```

Expect:
- `200 OK`

Negative:
- non-admin -> `403`
- invalid status -> validation error
- quotedPrice <= 0 -> validation error

---

## 4) Inquiries

### POST `/api/inquiries`
Public.

Body:
```json
{
  "fullName": "Ali Khan",
  "email": "ali@example.com",
  "phone": "+92 300 1234567",
  "city": "Lahore",
  "message": "I want to ask about a custom sofa."
}
```

Expect:
- `201 Created`

Negative:
- invalid email -> validation error
- short name/message -> validation error
- missing fields -> validation error

### GET `/api/inquiries`
Admin only.

Expect:
- `200 OK`

Negative:
- no auth -> `401`
- non-admin -> `403`

### PATCH `/api/inquiries/:id/status`
Admin only.

Body:
```json
{
  "status": "REPLIED",
  "responseMessage": "Thanks, we will contact you soon."
}
```

Expect:
- `200 OK`

Negative:
- non-admin -> `403`
- invalid UUID -> validation error
- empty status -> validation error

---

## 5) Media

### GET `/api/media/upload-signature?folder=luxury-cnc/products`
Admin only.

Expect:
- `200 OK`
- signature payload returned

Negative:
- no auth -> `401`
- non-admin -> `403`
- missing/blank folder should default to `luxury-cnc`

---

## 6) Users

### GET `/api/users/me`
Auth required.

Expect:
- `200 OK`
- returns current user id, clerkId, role

Negative:
- no auth -> `401`

---

## 7) Orders

### POST `/api/orders`
Auth required.

Body:
```json
{
  "type": "1x Walnut Bed",
  "totalAmount": 450000,
  "paymentStatus": "PENDING",
  "paymentMethod": "COD",
  "customerEmail": "buyer@example.com"
}
```

Expect:
- `201 Created`

Negative:
- no auth -> `401`
- totalAmount <= 0 -> validation error

### GET `/api/orders`
Auth required.

Expect:
- customer sees own orders
- `200 OK`

Negative:
- no auth -> `401`

### GET `/api/orders/admin`
Admin only.

Expect:
- `200 OK`

Negative:
- non-admin -> `403`

### GET `/api/orders/:id`
Auth required.

Expect:
- owner or admin can view
- `200 OK`

Negative:
- wrong user -> `404`
- invalid UUID -> validation error

### PATCH `/api/orders/:id/status`
Admin only for normal status changes.

Body:
```json
{
  "status": "PROCESSING"
}
```

Expect:
- `200 OK`

Negative:
- non-admin -> `403`
- invalid status -> validation error

### PATCH `/api/orders/:id/cancel`
Customer or admin.

Expect:
- `200 OK`
- status becomes `CANCELLED`

Negative:
- no auth -> `401`
- wrong user -> `404`
- already cancelled -> `400`
- delivered order -> `400`

---

## 8) SafePay

### POST `/api/payments/safepay/session`
Auth required.

Body:
```json
{
  "orderId": "uuid-here",
  "amount": 450000
}
```

Expect:
- `201 Created`
- tracker token returned

Negative:
- no auth -> `401`
- invalid UUID -> validation error
- amount <= 0 -> validation error

### POST `/api/webhooks/safepay`
Public webhook.

Body examples:
```json
{
  "orderId": "uuid-here",
  "trackerToken": "tracker-value",
  "status": "PAID"
}
```

Also test:
- `SUCCESS`
- `SUCCEEDED`
- `PAYMENT.SUCCEEDED`

Expect:
- successful payment updates the order
- non-paid statuses return `{ received: true, updated: false }`

Negative:
- missing orderId/trackerToken/status should fail schema parsing or be ignored depending on payload shape

---

## 9) Order cancellation smoke test

### Customer cancel
1. Login as customer.
2. Create an order.
3. Call `PATCH /api/orders/:id/cancel`.
4. Confirm `status = CANCELLED`.

### Admin cancel
1. Login as admin.
2. Pick a `PENDING`, `PAID`, or `PROCESSING` order.
3. Call `PATCH /api/orders/:id/cancel`.
4. Confirm status changes to `CANCELLED`.

### Forbidden cancel
1. Pick a `DELIVERED` order.
2. Try to cancel it.
3. Expect `400`.

---

## 10) Recommended Postman order

1. Health
2. Users/me
3. Products
4. Create inquiry
5. Create custom order
6. Create order
7. Cancel order
8. Admin product/order/custom-order/inquiry actions
9. Media signature
10. SafePay session
11. SafePay webhook

