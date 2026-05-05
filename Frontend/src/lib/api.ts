type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  error: string;
};

type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api").replace(
  /\/$/,
  "",
);

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

export type CreateInquiryPayload = {
  name: string;
  phone: string;
  city: string;
  message: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const body = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !body.success) {
    throw new Error(body.success ? "Request failed." : body.error);
  }

  return body.data;
}

export function fetchProducts(page = 1, pageSize = 20): Promise<ProductListResponse> {
  return request<ProductListResponse>(`/products?page=${page}&pageSize=${pageSize}`);
}

export function submitInquiry(payload: CreateInquiryPayload) {
  return request<{ id: string; createdAt: string }>("/inquiries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
