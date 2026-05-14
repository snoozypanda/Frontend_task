import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
}) => {
  return (
    <View className="flex-1 items-center justify-center py-16">
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text className="font-inter text-sm text-on-surface-variant mt-4">
        {message}
      </Text>
    </View>
  );
};

export default React.memo(LoadingState);
