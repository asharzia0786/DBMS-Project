export const CUSTOM_ORDER_STATUSES = [
  "REQUESTED",
  "UNDER_REVIEW",
  "QUOTED",
  "APPROVED",
  "IN_PRODUCTION",
  "COMPLETED",
  "DELIVERED",
] as const;

export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type CustomOrderStatus = (typeof CUSTOM_ORDER_STATUSES)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const CUSTOM_ORDER_TRANSITIONS: Record<
  CustomOrderStatus,
  readonly CustomOrderStatus[]
> = {
  REQUESTED: [
    "UNDER_REVIEW",
    "QUOTED",
    "APPROVED",
    "IN_PRODUCTION",
    "COMPLETED",
    "DELIVERED",
  ],
  UNDER_REVIEW: [
    "REQUESTED",
    "QUOTED",
    "APPROVED",
    "IN_PRODUCTION",
    "COMPLETED",
    "DELIVERED",
  ],
  QUOTED: [
    "REQUESTED",
    "UNDER_REVIEW",
    "APPROVED",
    "IN_PRODUCTION",
    "COMPLETED",
    "DELIVERED",
  ],
  APPROVED: [
    "REQUESTED",
    "UNDER_REVIEW",
    "QUOTED",
    "IN_PRODUCTION",
    "COMPLETED",
    "DELIVERED",
  ],
  IN_PRODUCTION: [
    "REQUESTED",
    "UNDER_REVIEW",
    "QUOTED",
    "APPROVED",
    "COMPLETED",
    "DELIVERED",
  ],
  COMPLETED: [
    "REQUESTED",
    "UNDER_REVIEW",
    "QUOTED",
    "APPROVED",
    "IN_PRODUCTION",
    "DELIVERED",
  ],
  DELIVERED: [
    "REQUESTED",
    "UNDER_REVIEW",
    "QUOTED",
    "APPROVED",
    "IN_PRODUCTION",
    "COMPLETED",
  ],
};

export const ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
  PAID: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
  PROCESSING: ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"],
  SHIPPED: ["PENDING", "PAID", "PROCESSING", "DELIVERED"],
  DELIVERED: ["PENDING", "PAID", "PROCESSING", "SHIPPED"],
  CANCELLED: [],
};

export const INQUIRY_STATUSES = ["NEW", "READ", "RESPONDED", "ARCHIVED"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];
