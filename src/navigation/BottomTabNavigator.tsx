import React, { useCallback } from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { TransactionType } from "../types";

import DashboardScreen from "../screens/DashboardScreen";
import InventoryScreen from "../screens/InventoryScreen";
import AddProductScreen from "../screens/AddProductScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { useUsers } from "../hooks/useUsers";
import { useProducts } from "../hooks/useProducts";
import { useTransactions } from "../hooks/useTransactions";

const Tab = createBottomTabNavigator();
const InventoryStack = createNativeStackNavigator();

const InventoryStackNavigator: React.FC<{
  products: ReturnType<typeof useProducts>;
  transactions: ReturnType<typeof useTransactions>;
  onStockChange: (sku: string, delta: number, type: TransactionType) => void;
}> = ({ products, transactions, onStockChange }) => {
  // Moved to BottomTabNavigator

  const handleLogTransaction = useCallback(
    (sku: string, name: string, qty: number) => {
      transactions.logTransaction(sku, name, TransactionType.INBOUND, qty);
    },
    [transactions]
  );

  return (
    <InventoryStack.Navigator screenOptions={{ headerShown: false }}>
      <InventoryStack.Screen name="InventoryMain">
        {() => (
          <InventoryScreen
            products={products.products}
            totalStockValue={products.totalStockValue}
            activeSkuCount={products.activeSkuCount}
            lowStockCount={products.lowStockCount}
            isLoaded={products.isLoaded}
            loading={products.loading}
            onStockChange={onStockChange}
          />
        )}
      </InventoryStack.Screen>
      <InventoryStack.Screen name="AddProduct">
        {() => (
          <AddProductScreen
            onAddProduct={products.addProduct}
            loading={products.loading}
            onLogTransaction={handleLogTransaction}
          />
        )}
      </InventoryStack.Screen>
    </InventoryStack.Navigator>
  );
};

const BottomTabNavigator: React.FC = () => {
  const users = useUsers();
  const products = useProducts();
  const transactions = useTransactions();

  const handleStockChange = useCallback(
    async (sku: string, delta: number, type: TransactionType) => {
      const product = products.products.find((p) => p.sku === sku);
      if (!product) return;
      const result = await products.updateStock(sku, delta);
      if (result.success) {
        await transactions.logTransaction(sku, product.name, type, Math.abs(delta));
      }
    },
    [products, transactions]
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "Dashboard") iconName = focused ? "grid" : "grid-outline";
          else if (route.name === "Inventory") iconName = focused ? "cube" : "cube-outline";
          else if (route.name === "History") iconName = focused ? "receipt" : "receipt-outline";
          else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#777587",
        tabBarLabelStyle: {
          fontFamily: "Inter",
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.5,
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#C7C4D8",
          borderTopWidth: 0.5,
          paddingTop: 8,
          paddingBottom: 28,
          height: 80,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      })}
    >
      <Tab.Screen name="Dashboard">
        {() => (
          <DashboardScreen
            userName={users.currentUser?.fullName?.split(" ")[0] || "User"}
            products={products.products}
            totalStockValue={products.totalStockValue}
            recentTransactions={transactions.recentTransactions}
            transactionCount={transactions.transactions.length}
            isLoaded={products.isLoaded && transactions.isLoaded}
            onStockChange={handleStockChange}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Inventory">
        {() => <InventoryStackNavigator products={products} transactions={transactions} onStockChange={handleStockChange} />}
      </Tab.Screen>
      <Tab.Screen name="History">
        {() => (
          <HistoryScreen
            groupedTransactions={transactions.groupedTransactions}
            pagination={transactions.pagination}
            totalInbound={transactions.totalInbound}
            totalOutbound={transactions.totalOutbound}
            totalAdjusted={transactions.totalAdjusted}
            isLoaded={transactions.isLoaded}
            onNextPage={transactions.nextPage}
            onPrevPage={transactions.prevPage}
            onGoToPage={transactions.goToPage}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => (
          <ProfileScreen
            currentUser={users.currentUser}
            isRegistered={users.isRegistered}
            loading={users.loading}
            isLoaded={users.isLoaded}
            onRegister={users.registerUser}
            onLogout={users.logout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
