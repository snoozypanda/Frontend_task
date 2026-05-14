import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "cube-outline",
  title,
  message,
}) => {
  return (
    <View className="flex-1 items-center justify-center py-16 px-8">
      <View className="w-20 h-20 rounded-full bg-surface-container items-center justify-center mb-4">
        <Ionicons name={icon} size={40} color="#C7C4D8" />
      </View>
      <Text className="font-hanken text-lg font-semibold text-on-surface text-center mb-2">
        {title}
      </Text>
      <Text className="font-inter text-sm text-on-surface-variant text-center leading-5">
        {message}
      </Text>
    </View>
  );
};

export default React.memo(EmptyState);
