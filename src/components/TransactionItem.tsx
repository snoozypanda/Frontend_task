import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Transaction, TransactionType } from "../types";
import { formatTime } from "../utils/formatting";
import TransactionBadge from "./TransactionBadge";

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isInbound = transaction.type === TransactionType.INBOUND;
  const isOutbound = transaction.type === TransactionType.OUTBOUND;

  const quantityColor = isInbound
    ? "text-stock-green"
    : isOutbound
    ? "text-on-surface-variant"
    : "text-stock-amber";

  const quantityPrefix = isInbound ? "+" : "-";

  return (
    <View
      className="bg-white p-4 rounded-xl"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View className="flex-row gap-3">
        {/* Product Icon Placeholder */}
        <View className="w-12 h-12 rounded-md bg-surface-container-high items-center justify-center">
          <Ionicons name="cube-outline" size={24} color="#777587" />
        </View>

        {/* Transaction Details */}
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-2">
              <Text className="font-hanken text-base font-semibold text-on-surface" numberOfLines={1}>
                {transaction.productName}
              </Text>
              <Text className="font-mono text-[13px] font-medium text-on-surface-variant tracking-tight">
                {transaction.productSku}
              </Text>
            </View>
            <TransactionBadge type={transaction.type} />
          </View>

          <View className="flex-row justify-between items-center mt-3">
            <Text className="font-inter text-sm text-on-surface-variant">
              {formatTime(transaction.timestamp)}
              {transaction.location ? ` • ${transaction.location}` : ""}
            </Text>
            <Text className={`font-hanken text-lg font-bold ${quantityColor}`}>
              {quantityPrefix}
              {transaction.quantity} units
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(TransactionItem);
