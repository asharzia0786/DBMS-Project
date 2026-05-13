export type NotificationJobName =
  | "quote-response"
  | "order-confirmation"
  | "order-status-update"
  | "inquiry-response";

export type QuoteResponseJob = {
  type: "quote-response";
  to: string;
  orderId: string;
  quoteAmount: number;
};

export type OrderConfirmationJob = {
  type: "order-confirmation";
  to: string;
  orderId: string;
  amount: number;
};

export type OrderStatusUpdateJob = {
  type: "order-status-update";
  to: string;
  orderId: string;
  status: string;
};

export type InquiryResponseJob = {
  type: "inquiry-response";
  to: string;
  subject: string;
  message: string;
};

export type NotificationJobData =
  | QuoteResponseJob
  | OrderConfirmationJob
  | OrderStatusUpdateJob
  | InquiryResponseJob;
