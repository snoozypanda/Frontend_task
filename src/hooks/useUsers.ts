import { useState, useEffect, useCallback } from "react";
import { User, UserFormData, ValidationError } from "../types";
import { validateUserForm } from "../utils/validation";
import { generateId } from "../utils/formatting";
import { getItem, setItem, removeItem, STORAGE_KEYS } from "../utils/storage";
import { useSimulatedApi } from "./useSimulatedApi";

export const useUsers = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { loading, error, execute, setError } = useSimulatedApi();

  // Load user from AsyncStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const user = await getItem<User>(STORAGE_KEYS.USER);
      if (user) setCurrentUser(user);
      setIsLoaded(true);
    };
    loadUser();
  }, []);

  const registerUser = useCallback(
    async (
      formData: UserFormData
    ): Promise<{ success: boolean; errors: ValidationError[] }> => {
      // Validate
      const validationErrors = validateUserForm(formData);
      if (validationErrors.length > 0) {
        return { success: false, errors: validationErrors };
      }

      // Simulate API call
      const result = await execute(async () => {
        const newUser: User = {
          id: generateId(),
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          createdAt: new Date().toISOString(),
        };
        await setItem(STORAGE_KEYS.USER, newUser);
        return newUser;
      });

      if (result.success && result.data) {
        setCurrentUser(result.data);
        return { success: true, errors: [] };
      }

      return {
        success: false,
        errors: [{ field: "general", message: result.error || "Registration failed" }],
      };
    },
    [execute]
  );

  const logout = useCallback(async () => {
    await removeItem(STORAGE_KEYS.USER);
    setCurrentUser(null);
  }, []);

  return {
    currentUser,
    isRegistered: !!currentUser,
    isLoaded,
    loading,
    error,
    registerUser,
    logout,
  };
};
