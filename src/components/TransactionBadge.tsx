import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TransactionType } from "../types";

interface TransactionBadgeProps {
  type: TransactionType;
}

const badgeConfig: Record<
  TransactionType,
  { label: string; icon: keyof typeof Ionicons.glyphMap; bgColor: string; textColor: string }
> = {
  [TransactionType.INBOUND]: {
    label: "INBOUND",
    icon: "add-circle-outline",
    bgColor: "bg-secondary-container/20",
    textColor: "text-stock-green",
  },
  [TransactionType.OUTBOUND]: {
    label: "OUTBOUND",
    icon: "remove-circle-outline",
    bgColor: "bg-surface-container-high",
    textColor: "text-on-surface-variant",
  },
  [TransactionType.ADJUST]: {
    label: "ADJUST",
    icon: "create-outline",
    bgColor: "bg-tertiary-fixed/20",
    textColor: "text-stock-amber",
  },
};

const TransactionBadge: React.FC<TransactionBadgeProps> = ({ type }) => {
  const config = badgeConfig[type];

  const iconColor =
    type === TransactionType.INBOUND
      ? "#0D9488"
      : type === TransactionType.OUTBOUND
      ? "#464555"
      : "#D97706";

  return (
    <View className={`flex-row items-center gap-1 px-2 py-1 rounded-full ${config.bgColor}`}>
      <Ionicons name={config.icon} size={14} color={iconColor} />
      <Text className={`font-inter text-[10px] font-semibold tracking-wider ${config.textColor}`}>
        {config.label}
      </Text>
    </View>
  );
};

export default React.memo(TransactionBadge);
