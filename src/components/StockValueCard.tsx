import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../utils/formatting";

interface StockValueCardProps {
  totalValue: number;
  variant?: "dashboard" | "inventory";
}

const StockValueCard: React.FC<StockValueCardProps> = ({
  totalValue,
  variant = "dashboard",
}) => {
  if (variant === "inventory") {
    return (
      <View className="bg-primary p-5 rounded-xl h-32 justify-between">
        <Text className="font-inter text-xs font-semibold text-white/80 tracking-widest uppercase">
          TOTAL STOCK VALUE
        </Text>
        <View className="flex-row items-end justify-between">
          <Text className="font-hanken text-3xl font-bold text-white">
            {formatCurrency(totalValue)}
          </Text>
          <View className="bg-secondary-container px-2 py-1 rounded-full flex-row items-center gap-1">
            <Ionicons name="trending-up" size={14} color="#006F66" />
            <Text className="font-inter text-xs font-semibold text-on-secondary-container">
              12%
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      className="bg-white p-5 rounded-xl"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
        TOTAL STOCK VALUE
      </Text>
      <Text className="font-hanken text-3xl font-bold text-primary mt-2">
        {formatCurrency(totalValue)}
      </Text>
      <View className="flex-row items-center mt-2 gap-2">
        <View className="bg-secondary-container px-2 py-0.5 rounded-full">
          <Text className="font-inter text-xs font-semibold text-on-secondary-container">
            +12.5%
          </Text>
        </View>
        <Text className="font-inter text-sm text-on-surface-variant italic">
          vs last month
        </Text>
      </View>
    </View>
  );
};

export default React.memo(StockValueCard);
