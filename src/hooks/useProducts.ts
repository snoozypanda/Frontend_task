import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Product,
  ProductFormData,
  ValidationError,
  TransactionType,
  ProductCategory,
} from "../types";
import { validateProductForm } from "../utils/validation";
import { generateId } from "../utils/formatting";
import { getItem, setItem, STORAGE_KEYS } from "../utils/storage";
import { useSimulatedApi } from "./useSimulatedApi";

const LOW_STOCK_THRESHOLD = 10;

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { loading, error, execute } = useSimulatedApi();

  // Load products from AsyncStorage on mount
  useEffect(() => {
    const loadProducts = async () => {
      const stored = await getItem<Product[]>(STORAGE_KEYS.PRODUCTS);
      if (stored) setProducts(stored);
      setIsLoaded(true);
    };
    loadProducts();
  }, []);

  // Persist products whenever they change
  const persistProducts = useCallback(async (updated: Product[]) => {
    setProducts(updated);
    await setItem(STORAGE_KEYS.PRODUCTS, updated);
  }, []);

  const addProduct = useCallback(
    async (
      formData: ProductFormData,
      onTransaction?: (sku: string, name: string, qty: number) => void
    ): Promise<{ success: boolean; errors: ValidationError[] }> => {
      // Validate form
      const validationErrors = validateProductForm(formData);
      if (validationErrors.length > 0) {
        return { success: false, errors: validationErrors };
      }

      // Check SKU uniqueness
      const existingProduct = products.find(
        (p) => p.sku.toLowerCase() === formData.sku.trim().toLowerCase()
      );
      if (existingProduct) {
        return {
          success: false,
          errors: [
            {
              field: "sku",
              message: `SKU must be unique. This SKU is already assigned to '${existingProduct.name}'.`,
            },
          ],
        };
      }

      const result = await execute(async () => {
        const newProduct: Product = {
          id: generateId(),
          sku: formData.sku.trim().toUpperCase(),
          name: formData.name.trim(),
          price: parseFloat(formData.price),
          quantity: formData.quantity,
          category: formData.category,
          lastUpdated: new Date().toISOString(),
        };
        const updated = [newProduct, ...products];
        await persistProducts(updated);

        // Log initial stock as INBOUND transaction
        if (formData.quantity > 0 && onTransaction) {
          onTransaction(newProduct.sku, newProduct.name, formData.quantity);
        }

        return newProduct;
      });

      if (result.success) {
        return { success: true, errors: [] };
      }
      return {
        success: false,
        errors: [{ field: "general", message: result.error || "Failed to add product" }],
      };
    },
    [products, execute, persistProducts]
  );

  const updateStock = useCallback(
    async (
      sku: string,
      delta: number
    ): Promise<{ success: boolean; newQuantity: number }> => {
      const productIndex = products.findIndex((p) => p.sku === sku);
      if (productIndex === -1) {
        return { success: false, newQuantity: 0 };
      }

      const product = products[productIndex];
      const newQuantity = Math.max(0, product.quantity + delta);

      const updated = [...products];
      updated[productIndex] = {
        ...product,
        quantity: newQuantity,
        lastUpdated: new Date().toISOString(),
      };

      await persistProducts(updated);
      return { success: true, newQuantity };
    },
    [products, persistProducts]
  );

  // Computed values
  const totalStockValue = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    [products]
  );

  const activeSkuCount = useMemo(() => products.length, [products]);

  const lowStockItems = useMemo(
    () => products.filter((p) => p.quantity > 0 && p.quantity <= LOW_STOCK_THRESHOLD),
    [products]
  );

  return {
    products,
    isLoaded,
    loading,
    error,
    addProduct,
    updateStock,
    totalStockValue,
    activeSkuCount,
    lowStockItems,
    lowStockCount: lowStockItems.length,
  };
};
