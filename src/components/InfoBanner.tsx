import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InfoBannerProps {
  title: string;
  message: string;
  variant?: "info" | "tip" | "warning" | "error";
}

const variantConfig = {
  info: {
    bgColor: "bg-surface-container-low",
    borderColor: "border-outline-variant",
    iconColor: "#4F46E5",
    icon: "information-circle" as keyof typeof Ionicons.glyphMap,
  },
  tip: {
    bgColor: "bg-primary-fixed/30",
    borderColor: "border-primary-fixed-dim",
    iconColor: "#4F46E5",
    icon: "bulb-outline" as keyof typeof Ionicons.glyphMap,
  },
  warning: {
    bgColor: "bg-tertiary-fixed/30",
    borderColor: "border-tertiary-fixed-dim",
    iconColor: "#D97706",
    icon: "warning-outline" as keyof typeof Ionicons.glyphMap,
  },
  error: {
    bgColor: "bg-error-container",
    borderColor: "border-error",
    iconColor: "#BA1A1A",
    icon: "alert-circle" as keyof typeof Ionicons.glyphMap,
  },
};

const InfoBanner: React.FC<InfoBannerProps> = ({
  title,
  message,
  variant = "info",
}) => {
  const config = variantConfig[variant];

  return (
    <View
      className={`p-4 rounded-xl ${config.bgColor} border ${config.borderColor} flex-row items-start gap-3`}
    >
      <Ionicons name={config.icon} size={22} color={config.iconColor} style={{ marginTop: 2 }} />
      <View className="flex-1">
        <Text className="font-inter text-xs font-semibold text-on-surface tracking-wider uppercase">
          {title}
        </Text>
        <Text className="font-inter text-sm text-on-surface-variant mt-1 leading-5">
          {message}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(InfoBanner);
