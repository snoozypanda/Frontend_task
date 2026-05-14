import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types";
import { formatRelativeTime, formatNumber } from "../utils/formatting";

interface ProductCardProps {
  product: Product;
  onIncrement: (sku: string) => void;
  onDecrement: (sku: string) => void;
}

const LOW_STOCK_THRESHOLD = 10;

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onIncrement,
  onDecrement,
}) => {
  const isLowStock =
    product.quantity > 0 && product.quantity <= LOW_STOCK_THRESHOLD;
  const isOutOfStock = product.quantity === 0;

  return (
    <View className="bg-white p-4 rounded-xl relative overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      {/* Low Stock Badge */}
      {isLowStock && (
        <View className="absolute top-0 right-0 bg-error px-3 py-1 rounded-bl-xl z-10">
          <Text className="text-white font-inter text-[10px] font-semibold tracking-widest">
            LOW STOCK
          </Text>
        </View>
      )}
      {isOutOfStock && (
        <View className="absolute top-0 right-0 bg-on-surface px-3 py-1 rounded-bl-xl z-10">
          <Text className="text-white font-inter text-[10px] font-semibold tracking-widest">
            OUT OF STOCK
          </Text>
        </View>
      )}

      <View className="flex-row gap-4">
        {/* Product Image Placeholder */}
        <View className="w-20 h-20 rounded-md bg-surface-container-high overflow-hidden items-center justify-center">
          {product.imageUri ? (
            <Image
              source={{ uri: product.imageUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="cube-outline" size={32} color="#777587" />
          )}
        </View>

        {/* Product Details */}
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text
              className="font-hanken text-lg font-semibold text-on-surface flex-1 mr-2"
              numberOfLines={2}
            >
              {product.name}
            </Text>
            <View className="bg-surface-container px-2 py-0.5 rounded">
              <Text className="font-mono text-[13px] font-medium text-on-surface-variant tracking-tight">
                {product.sku}
              </Text>
            </View>
          </View>

          <Text className="font-inter text-sm text-on-surface-variant mt-1">
            Last updated: {formatRelativeTime(product.lastUpdated)}
          </Text>

          <View className="flex-row items-end justify-between mt-4">
            <View>
              <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                STOCK
              </Text>
              <Text
                className={`font-hanken text-2xl font-bold ${
                  isLowStock || isOutOfStock ? "text-error" : "text-primary"
                }`}
              >
                {formatNumber(product.quantity)} units
              </Text>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => onDecrement(product.sku)}
                className="w-10 h-10 items-center justify-center bg-surface-container-high rounded-lg active:opacity-70"
                disabled={product.quantity === 0}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={product.quantity === 0 ? "#C7C4D8" : "#4F46E5"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onIncrement(product.sku)}
                className="w-10 h-10 items-center justify-center bg-primary rounded-lg active:opacity-70"
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(ProductCard);
