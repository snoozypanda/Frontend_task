import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max = 99999,
}) => {
  return (
    <View className="flex-row items-center gap-0">
      <TouchableOpacity
        onPress={onDecrement}
        disabled={value <= min}
        className={`w-11 h-11 items-center justify-center bg-surface-container-high rounded-l-lg border border-outline-variant/30 ${
          value <= min ? "opacity-40" : "active:opacity-70"
        }`}
      >
        <Ionicons
          name="remove"
          size={20}
          color={value <= min ? "#C7C4D8" : "#4F46E5"}
        />
      </TouchableOpacity>
      <View className="h-11 px-5 items-center justify-center bg-surface-container border-y border-outline-variant/30">
        <Text className="font-mono text-base font-medium text-on-surface">
          {value}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onIncrement}
        disabled={value >= max}
        className={`w-11 h-11 items-center justify-center bg-primary rounded-r-lg ${
          value >= max ? "opacity-40" : "active:opacity-70"
        }`}
      >
        <Ionicons name="add" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(QuantityStepper);
