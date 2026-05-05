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
] as const;

export type CustomOrderStatus = (typeof CUSTOM_ORDER_STATUSES)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const CUSTOM_ORDER_TRANSITIONS: Record<
  CustomOrderStatus,
  readonly CustomOrderStatus[]
> = {
  REQUESTED: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["QUOTED"],
  QUOTED: ["APPROVED"],
  APPROVED: ["IN_PRODUCTION"],
  IN_PRODUCTION: ["COMPLETED"],
  COMPLETED: ["DELIVERED"],
  DELIVERED: [],
};

export const ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ["PAID"],
  PAID: ["PROCESSING"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
};
