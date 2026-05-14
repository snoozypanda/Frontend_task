import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  ProductFormData,
  ProductCategory,
  ValidationError,
  ToastMessage,
} from "../types";
import QuantityStepper from "../components/QuantityStepper";
import InfoBanner from "../components/InfoBanner";
import Toast from "../components/Toast";
import { generateId } from "../utils/formatting";

interface AddProductScreenProps {
  onAddProduct: (
    formData: ProductFormData,
    onTransaction?: (sku: string, name: string, qty: number) => void
  ) => Promise<{ success: boolean; errors: ValidationError[] }>;
  loading: boolean;
  onLogTransaction?: (sku: string, name: string, qty: number) => void;
}

const CATEGORIES: ProductCategory[] = [
  ProductCategory.Electronics,
  ProductCategory.Apparel,
  ProductCategory.Accessories,
  ProductCategory.HomeGoods,
  ProductCategory.Other,
];

const AddProductScreen: React.FC<AddProductScreenProps> = ({
  onAddProduct,
  loading,
  onLogTransaction,
}) => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<ProductFormData>({
    sku: "",
    name: "",
    price: "",
    quantity: 1,
    category: ProductCategory.Electronics,
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const getFieldError = (field: string): string | null => {
    const error = errors.find((e) => e.field === field);
    return error ? error.message : null;
  };

  const skuError = getFieldError("sku");
  const nameError = getFieldError("name");
  const priceError = getFieldError("price");
  const generalError = getFieldError("general");

  const handleSubmit = useCallback(async () => {
    setErrors([]);
    const result = await onAddProduct(formData, onLogTransaction);

    if (result.success) {
      setToast({
        id: generateId(),
        type: "success",
        title: "Product added!",
        message: `${formData.name} has been added to your inventory.`,
      });
      setTimeout(() => {
        setFormData({
          sku: "",
          name: "",
          price: "",
          quantity: 1,
          category: ProductCategory.Electronics,
        });
      }, 500);
    } else {
      setErrors(result.errors);
      if (result.errors.some((e) => e.field === "general")) {
        setToast({
          id: generateId(),
          type: "error",
          title: "Failed to add product",
          message: result.errors.find((e) => e.field === "general")?.message,
        });
      }
    }
  }, [formData, onAddProduct, onLogTransaction]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <View className="px-5 py-3 flex-row justify-between items-center border-b border-outline-variant/20">
        <View className="flex-row items-center gap-2">
          <Ionicons name="cube" size={22} color="#4F46E5" />
          <Text className="font-hanken text-xl font-bold text-primary">
            InventoryFlow
          </Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color="#464555" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-5 mt-6 mb-6">
            <Text className="font-hanken text-[28px] font-bold text-on-surface leading-[34px] tracking-tight">
              New Product
            </Text>
            <Text className="font-inter text-base text-on-surface-variant mt-1">
              Complete the details below to add a new item to your inventory system.
            </Text>
          </View>

          {(skuError || generalError) && (
            <View className="px-5 mb-4">
              <InfoBanner
                title="Input Error"
                message={skuError || generalError || "Please fix the errors below."}
                variant="error"
              />
            </View>
          )}

          <View className="px-5 gap-5">
            <View>
              <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase mb-2">
                SKU NUMBER
              </Text>
              <View
                className={`flex-row items-center h-[44px] rounded-lg px-4 ${
                  skuError
                    ? "bg-error-container/30 border-2 border-error"
                    : "bg-[#F3F4F6]"
                }`}
              >
                <Ionicons
                  name="barcode-outline"
                  size={20}
                  color={skuError ? "#BA1A1A" : "#777587"}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  className="flex-1 font-mono text-[13px] font-medium text-on-surface"
                  placeholder="PRD-10293"
                  placeholderTextColor="#777587"
                  value={formData.sku}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, sku: text }))
                  }
                  autoCapitalize="characters"
                />
              </View>
              {skuError && (
                <Text className="font-inter text-xs text-error mt-1">
                  {skuError}
                </Text>
              )}
            </View>

            <View>
              <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase mb-2">
                PRODUCT NAME
              </Text>
              <TextInput
                className={`h-[44px] rounded-lg px-4 font-inter text-base text-on-surface ${
                  nameError
                    ? "bg-error-container/30 border-2 border-error"
                    : "bg-[#F3F4F6]"
                }`}
                placeholder="Full item description"
                placeholderTextColor="#777587"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
              />
              {nameError && (
                <Text className="font-inter text-xs text-error mt-1">
                  {nameError}
                </Text>
              )}
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase mb-2">
                  UNIT PRICE ($)
                </Text>
                <TextInput
                  className={`h-[44px] rounded-lg px-4 font-inter text-base text-on-surface ${
                    priceError
                      ? "bg-error-container/30 border-2 border-error"
                      : "bg-[#F3F4F6]"
                  }`}
                  placeholder="0.00"
                  placeholderTextColor="#777587"
                  value={formData.price}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, price: text }))
                  }
                  keyboardType="decimal-pad"
                />
                {priceError && (
                  <Text className="font-inter text-xs text-error mt-1">
                    {priceError}
                  </Text>
                )}
              </View>

              <View>
                <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase mb-2">
                  INITIAL QTY
                </Text>
                <QuantityStepper
                  value={formData.quantity}
                  onIncrement={() =>
                    setFormData((prev) => ({ ...prev, quantity: prev.quantity + 1 }))
                  }
                  onDecrement={() =>
                    setFormData((prev) => ({ ...prev, quantity: Math.max(0, prev.quantity - 1) }))
                  }
                />
              </View>
            </View>

            <View>
              <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase mb-2">
                CATEGORY
              </Text>
              <TouchableOpacity
                className="h-[44px] rounded-lg px-4 bg-[#F3F4F6] flex-row items-center justify-between"
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <Text className="font-inter text-base text-on-surface">
                  {formData.category}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#777587" />
              </TouchableOpacity>

              {showCategoryPicker && (
                <View
                  className="mt-2 bg-white rounded-xl p-2 border border-outline-variant/30"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 4,
                  }}
                >
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      className={`px-4 py-3 rounded-lg ${
                        formData.category === cat ? "bg-primary-fixed/30" : ""
                      }`}
                      onPress={() => {
                        setFormData((prev) => ({ ...prev, category: cat }));
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text
                        className={`font-inter text-sm ${
                          formData.category === cat
                            ? "text-primary font-semibold"
                            : "text-on-surface"
                        }`}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              className="h-[48px] bg-primary rounded-xl items-center justify-center flex-row gap-2 mt-2"
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <Text className="font-hanken text-lg font-semibold text-white">
                  Adding...
                </Text>
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                  <Text className="font-hanken text-lg font-semibold text-white">
                    Add Product
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View className="px-5 mt-6">
            <InfoBanner
              title="Registration Tip"
              message="Adding a detailed name and SKU helps your team find items 40% faster during stocktakes."
              variant="tip"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddProductScreen;
