// ─── Enums ───────────────────────────────────────────────

export enum TransactionType {
  INBOUND = "INBOUND",
  OUTBOUND = "OUTBOUND",
  ADJUST = "ADJUST",
}

export enum ProductCategory {
  Electronics = "Electronics",
  Apparel = "Apparel",
  Accessories = "Accessories",
  HomeGoods = "Home Goods",
  Other = "Other",
}

// ─── Models ──────────────────────────────────────────────

export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  category: ProductCategory;
  lastUpdated: string;
  imageUri?: string;
}

export interface Transaction {
  id: string;
  productSku: string;
  productName: string;
  type: TransactionType;
  quantity: number;
  timestamp: string;
  location?: string;
}

// ─── Form State ──────────────────────────────────────────

export interface ProductFormData {
  sku: string;
  name: string;
  price: string;
  quantity: number;
  category: ProductCategory;
}

export interface UserFormData {
  fullName: string;
  email: string;
}

// ─── Validation ──────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

// ─── Pagination ──────────────────────────────────────────

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

// ─── Toast ───────────────────────────────────────────────

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}
