type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  error: string;
};

type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const API_BASE_URL = (configuredApiBaseUrl || "/api").replace(/\/$/, "");
const FALLBACK_API_BASE_URL = "/api";
const LOCALBACK_API_BASE_URL = "http://localhost:4000/api";

export type ProductImage = {
  id: string;
  imageUrl: string;
  altText: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  stock: number;
  category: string | null;
  material: string | null;
  finish: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  images: ProductImage[];
};

export type ProductListResponse = {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type Order = {
  id: string;
  userId: string;
  customerEmail?: string | null;
  type: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod?: string | null;
  safepayTrackerToken?: string | null;
  paidAt?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderListResponse = {
  items: Order[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type CustomOrder = {
  id: string;
  userId: string;
  customerEmail?: string | null;
  description: string;
  referenceImages: string[];
  dimensions: string | null;
  material: string | null;
  status: string;
  quotedPrice: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CustomOrderListResponse = {
  items: CustomOrder[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type Inquiry = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type InquiryListResponse = {
  items: Inquiry[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type CreateInquiryPayload = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  message: string;
};

export type ProductPayload = {
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  stock: number;
  category?: string;
  material?: string;
  finish?: string;
  metadata?: Record<string, unknown>;
  images?: Array<{ imageUrl: string; altText?: string }>;
};

export type CreateOrderPayload = {
  type: string;
  totalAmount: number;
  paymentStatus?: string;
  paymentMethod?: string;
  customerEmail?: string;
  items: Array<{ productId: string; quantity: number }>;
};

export type CreateCustomOrderPayload = {
  customerEmail?: string;
  description: string;
  referenceImages: string[];
  dimensions?: string;
  material?: string;
};

export type UploadSignature = {
  signature: string;
  timestamp: number;
  folder: string;
  cloudName: string;
  apiKey: string;
};

export type SafepaySessionResponse = {
  trackerToken: string;
  clientToken?: string;
  environment: "sandbox" | "production";
  merchantApiKey: string;
};

export type CurrentUserResponse = {
  id: string;
  clerkId: string;
  role: string;
};

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const bases = Array.from(
    new Set([API_BASE_URL, FALLBACK_API_BASE_URL, LOCALBACK_API_BASE_URL].map((base) => base.replace(/\/$/, ""))),
  );
  let lastError: Error | null = null;

  for (const baseUrl of bases) {
    let response: Response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers || {}),
        },
      });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Request failed.");
      if (baseUrl !== bases[bases.length - 1]) {
        continue;
      }
      throw lastError;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      lastError = new Error(
        `API returned ${response.status} ${response.statusText} instead of JSON. Check VITE_API_BASE_URL and backend routing. Response starts with: ${text.slice(0, 80)}`,
      );
      if (baseUrl !== bases[bases.length - 1]) {
        continue;
      }
      throw lastError;
    }

    const body = (await response.json()) as ApiEnvelope<T>;

    if (!response.ok || !body.success) {
      throw new Error(body.success ? "Request failed." : body.error);
    }

    return body.data;
  }

  throw lastError || new Error("Request failed.");
}

export function fetchProducts(page = 1, pageSize = 20): Promise<ProductListResponse> {
  return request<ProductListResponse>(`/products?page=${page}&pageSize=${pageSize}`);
}

export function fetchProductBySlug(slug: string): Promise<Product> {
  return request<Product>(`/products/${slug}`);
}

export function submitInquiry(payload: CreateInquiryPayload) {
  return request<{ id: string; createdAt: string }>("/inquiries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchUserOrders(token: string, page = 1, pageSize = 5): Promise<OrderListResponse> {
  return request<OrderListResponse>(`/orders?page=${page}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createOrder(token: string, payload: CreateOrderPayload): Promise<Order> {
  return request<Order>("/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function createSafepaySession(
  token: string,
  payload: { orderId: string; amount: number },
): Promise<SafepaySessionResponse> {
  return request<SafepaySessionResponse>("/payments/safepay/session", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function fetchAdminOrders(token: string, page = 1, pageSize = 20): Promise<OrderListResponse> {
  return request<OrderListResponse>(`/orders/admin?page=${page}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateOrderStatus(token: string, id: string, status: string): Promise<Order> {
  return request<Order>(`/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
}

export function cancelOrder(token: string, id: string): Promise<Order> {
  return request<Order>(`/orders/${id}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createCustomOrder(
  token: string,
  payload: CreateCustomOrderPayload,
): Promise<CustomOrder> {
  return request<CustomOrder>("/custom-orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function fetchUserCustomOrders(
  token: string,
  page = 1,
  pageSize = 10,
): Promise<CustomOrderListResponse> {
  return request<CustomOrderListResponse>(`/custom-orders?page=${page}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function fetchAdminCustomOrders(
  token: string,
  page = 1,
  pageSize = 20,
): Promise<CustomOrderListResponse> {
  return request<CustomOrderListResponse>(`/custom-orders/admin?page=${page}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateCustomOrderStatus(
  token: string,
  id: string,
  status: string,
  quotedPrice?: number,
): Promise<CustomOrder> {
  return request<CustomOrder>(`/custom-orders/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, quotedPrice }),
  });
}

export function fetchAdminInquiries(
  token: string,
  page = 1,
  pageSize = 20,
): Promise<InquiryListResponse> {
  return request<InquiryListResponse>(`/inquiries?page=${page}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateInquiryStatus(
  token: string,
  id: string,
  payload: { status: string; responseMessage?: string },
): Promise<Inquiry> {
  return request<Inquiry>(`/inquiries/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function createProduct(token: string, payload: ProductPayload): Promise<Product> {
  return request<Product>("/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updateProduct(token: string, id: string, payload: Partial<ProductPayload>): Promise<Product> {
  return request<Product>(`/products/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(token: string, id: string): Promise<{ id: string }> {
  return request<{ id: string }>(`/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getUploadSignature(token: string, folder = "luxury-cnc"): Promise<UploadSignature> {
  return request<UploadSignature>(`/media/upload-signature?folder=${encodeURIComponent(folder)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function syncCurrentUser(token: string): Promise<CurrentUserResponse> {
  return request<CurrentUserResponse>("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
