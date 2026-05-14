import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface QuickActionButtonProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: "primary" | "secondary";
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  label,
  icon,
  onPress,
  variant = "secondary",
}) => {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center gap-2 px-5 py-3 rounded-xl ${
        isPrimary
          ? "bg-primary"
          : "bg-surface-container-high border border-outline-variant/30"
      }`}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={18}
        color={isPrimary ? "#FFFFFF" : "#4F46E5"}
      />
      <Text
        className={`font-hanken text-base font-semibold ${
          isPrimary ? "text-white" : "text-on-surface"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(QuickActionButton);
