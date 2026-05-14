import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ToastMessage } from "../types";

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

const toastConfig: Record<
  string,
  { bgColor: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string }
> = {
  success: {
    bgColor: "bg-secondary-container",
    icon: "checkmark-circle",
    iconColor: "#006F66",
  },
  error: {
    bgColor: "bg-error-container",
    icon: "close-circle",
    iconColor: "#93000A",
  },
  info: {
    bgColor: "bg-primary-fixed",
    icon: "information-circle",
    iconColor: "#4F46E5",
  },
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (toast) {
      // Slide in
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();

      // Auto dismiss after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }).start(() => onDismiss());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  const config = toastConfig[toast.type] || toastConfig.info;

  return (
    <Animated.View
      className="absolute top-12 left-5 right-5 z-50"
      style={{ transform: [{ translateY }] }}
    >
      <View
        className={`${config.bgColor} p-4 rounded-xl flex-row items-center gap-3`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Ionicons name={config.icon} size={24} color={config.iconColor} />
        <View className="flex-1">
          <Text className="font-hanken text-base font-semibold text-on-surface">
            {toast.title}
          </Text>
          {toast.message && (
            <Text className="font-inter text-sm text-on-surface-variant mt-0.5">
              {toast.message}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export default Toast;
