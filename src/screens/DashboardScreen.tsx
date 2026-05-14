import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Product, Transaction, TransactionType } from "../types";
import {
  formatCurrency,
  formatNumber,
  getGreeting,
} from "../utils/formatting";
import StockValueCard from "../components/StockValueCard";
import StatCard from "../components/StatCard";
import QuickActionButton from "../components/QuickActionButton";
import TransactionItem from "../components/TransactionItem";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";

interface DashboardScreenProps {
  userName: string;
  products: Product[];
  totalStockValue: number;
  recentTransactions: Transaction[];
  transactionCount: number;
  isLoaded: boolean;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName,
  products,
  totalStockValue,
  recentTransactions,
  transactionCount,
  isLoaded,
}) => {
  const navigation = useNavigation<any>();

  const handleAddProduct = useCallback(() => {
    navigation.navigate("Inventory", { screen: "AddProduct" });
  }, [navigation]);

  const handleViewAllTransactions = useCallback(() => {
    navigation.navigate("History");
  }, [navigation]);

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <LoadingState message="Loading dashboard..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-2 flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Ionicons name="cube" size={24} color="#4F46E5" />
            <Text className="font-hanken text-xl font-bold text-primary">
              InventoryFlow
            </Text>
          </View>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Ionicons name="notifications-outline" size={24} color="#464555" />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View className="px-5 mt-4">
          <Text className="font-hanken text-[28px] font-bold text-on-surface leading-[34px] tracking-tight">
            {getGreeting()}, {userName || "User"}
          </Text>
          <Text className="font-inter text-base text-on-surface-variant mt-1">
            Here's what's happening with your stock today.
          </Text>
        </View>

        {/* Total Stock Value Card */}
        <View className="px-5 mt-6">
          <StockValueCard totalValue={totalStockValue} variant="dashboard" />
        </View>

        {/* Stat Cards */}
        <View className="px-5 mt-3 flex-row gap-3">
          <StatCard
            label="Products"
            value={formatNumber(products.length)}
            icon="layers-outline"
          />
          <StatCard
            label="Transactions"
            value={formatNumber(transactionCount)}
            icon="swap-horizontal-outline"
          />
        </View>

        {/* Quick Actions */}
        <View className="px-5 mt-6">
          <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase mb-3">
            QUICK ACTIONS
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            <QuickActionButton
              label="Add Product"
              icon="add-circle-outline"
              onPress={handleAddProduct}
              variant="primary"
            />
            <QuickActionButton
              label="Stock In"
              icon="arrow-down-outline"
              onPress={() => navigation.navigate("Inventory")}
            />
            <QuickActionButton
              label="Stock Out"
              icon="arrow-up-outline"
              onPress={() => navigation.navigate("Inventory")}
            />
          </ScrollView>
        </View>

        {/* Recent Transactions */}
        <View className="px-5 mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
              RECENT TRANSACTIONS
            </Text>
            <TouchableOpacity onPress={handleViewAllTransactions}>
              <Text className="font-inter text-xs font-semibold text-primary tracking-wider">
                VIEW ALL
              </Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <EmptyState
              icon="receipt-outline"
              title="No transactions yet"
              message="Stock adjustments will appear here as you manage your inventory."
            />
          ) : (
            <View className="gap-3">
              {recentTransactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
