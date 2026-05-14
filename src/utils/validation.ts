import { ValidationError, UserFormData, ProductFormData } from "../types";

/**
 * Validate an email address using a standard regex pattern.
 */
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

/**
 * Validate a full name — at least 2 characters, no digits.
 */
export const validateFullName = (name: string): string | null => {
  if (!name.trim()) return "Full name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (/\d/.test(name)) return "Name should not contain numbers";
  return null;
};

/**
 * Validate SKU format — alphanumeric with optional hyphens, min 3 chars.
 */
export const validateSku = (sku: string): string | null => {
  if (!sku.trim()) return "SKU is required";
  if (sku.trim().length < 3) return "SKU must be at least 3 characters";
  const skuRegex = /^[A-Za-z0-9-]+$/;
  if (!skuRegex.test(sku)) return "SKU can only contain letters, numbers, and hyphens";
  return null;
};

/**
 * Validate product name — at least 2 characters.
 */
export const validateProductName = (name: string): string | null => {
  if (!name.trim()) return "Product name is required";
  if (name.trim().length < 2) return "Product name must be at least 2 characters";
  return null;
};

/**
 * Validate price — must be a positive number.
 */
export const validatePrice = (price: string): string | null => {
  if (!price.trim()) return "Price is required";
  const num = parseFloat(price);
  if (isNaN(num)) return "Price must be a valid number";
  if (num < 0) return "Price cannot be negative";
  return null;
};

/**
 * Validate quantity — must be a non-negative integer.
 */
export const validateQuantity = (qty: number): string | null => {
  if (qty < 0) return "Quantity cannot be negative";
  if (!Number.isInteger(qty)) return "Quantity must be a whole number";
  return null;
};

/**
 * Validate the full user registration form.
 */
export const validateUserForm = (data: UserFormData): ValidationError[] => {
  const errors: ValidationError[] = [];
  const nameErr = validateFullName(data.fullName);
  if (nameErr) errors.push({ field: "fullName", message: nameErr });
  const emailErr = validateEmail(data.email);
  if (emailErr) errors.push({ field: "email", message: emailErr });
  return errors;
};

/**
 * Validate the full product registration form.
 */
export const validateProductForm = (data: ProductFormData): ValidationError[] => {
  const errors: ValidationError[] = [];
  const skuErr = validateSku(data.sku);
  if (skuErr) errors.push({ field: "sku", message: skuErr });
  const nameErr = validateProductName(data.name);
  if (nameErr) errors.push({ field: "name", message: nameErr });
  const priceErr = validatePrice(data.price);
  if (priceErr) errors.push({ field: "price", message: priceErr });
  const qtyErr = validateQuantity(data.quantity);
  if (qtyErr) errors.push({ field: "quantity", message: qtyErr });
  return errors;
};
