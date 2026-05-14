import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  USER: "@inventoryflow_user",
  PRODUCTS: "@inventoryflow_products",
  TRANSACTIONS: "@inventoryflow_transactions",
} as const;

/**
 * Get a typed item from AsyncStorage.
 */
export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return null;
  }
};

/**
 * Set a typed item in AsyncStorage.
 */
export const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to storage:`, error);
  }
};

/**
 * Remove an item from AsyncStorage.
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
  }
};

export { STORAGE_KEYS };
