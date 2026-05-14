import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  valueColor = "text-on-surface",
}) => {
  return (
    <View className="bg-surface-container-high p-4 rounded-xl flex-1 border border-outline-variant/30">
      <View className="flex-row items-center gap-1 mb-1">
        <Ionicons name={icon} size={16} color="#777587" />
        <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
          {label}
        </Text>
      </View>
      <Text className={`font-hanken text-xl font-semibold mt-1 ${valueColor}`}>
        {value}
      </Text>
    </View>
  );
};

export default React.memo(StatCard);
