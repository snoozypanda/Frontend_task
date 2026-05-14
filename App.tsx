import "./global.css";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import { View, ActivityIndicator, Text } from "react-native";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await Font.loadAsync({
          HankenGrotesk: require("./assets/fonts/HankenGrotesk-Regular.ttf"),
          "HankenGrotesk-SemiBold": require("./assets/fonts/HankenGrotesk-SemiBold.ttf"),
          "HankenGrotesk-Bold": require("./assets/fonts/HankenGrotesk-Bold.ttf"),
          Inter: require("./assets/fonts/Inter-Regular.ttf"),
          "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
          "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
          JetBrainsMono: require("./assets/fonts/JetBrainsMono-Medium.ttf"),
        });
      } catch (e) {
        console.warn("Some fonts failed to load. Falling back to system fonts.", e);
      } finally {
        setFontsLoaded(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F9F9FF" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 16, color: "#464555", fontSize: 14 }}>Loading InventoryFlow...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <BottomTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
