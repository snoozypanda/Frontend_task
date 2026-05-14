import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Product, TransactionType } from "../types";
import { formatNumber } from "../utils/formatting";
import StockValueCard from "../components/StockValueCard";
import StatCard from "../components/StatCard";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";

interface InventoryScreenProps {
  products: Product[];
  totalStockValue: number;
  activeSkuCount: number;
  lowStockCount: number;
  isLoaded: boolean;
  loading: boolean;
  onStockChange: (
    sku: string,
    delta: number,
    type: TransactionType
  ) => void;
}

type SortOption = "name" | "quantity" | "lastUpdated" | "price";

const InventoryScreen: React.FC<InventoryScreenProps> = ({
  products,
  totalStockValue,
  activeSkuCount,
  lowStockCount,
  isLoaded,
  loading,
  onStockChange,
}) => {
  const navigation = useNavigation<any>();
  const [sortBy, setSortBy] = useState<SortOption>("lastUpdated");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortedProducts = React.useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "quantity":
        sorted.sort((a, b) => b.quantity - a.quantity);
        break;
      case "lastUpdated":
        sorted.sort(
          (a, b) =>
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
        );
        break;
      case "price":
        sorted.sort((a, b) => b.price - a.price);
        break;
    }
    return sorted;
  }, [products, sortBy]);

  const handleIncrement = useCallback(
    (sku: string) => {
      onStockChange(sku, 1, TransactionType.INBOUND);
    },
    [onStockChange]
  );

  const handleDecrement = useCallback(
    (sku: string) => {
      onStockChange(sku, -1, TransactionType.OUTBOUND);
    },
    [onStockChange]
  );

  const handleAddProduct = useCallback(() => {
    navigation.navigate("AddProduct");
  }, [navigation]);

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <LoadingState message="Loading inventory..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-5 py-3 flex-row justify-between items-center border-b border-outline-variant/20">
        <View className="flex-row items-center gap-2">
          <Ionicons name="cube" size={22} color="#4F46E5" />
          <Text className="font-hanken text-xl font-bold text-primary">
            InventoryFlow
          </Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="search-outline" size={24} color="#464555" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stock Value Card */}
        <View className="px-5 mt-6">
          <StockValueCard totalValue={totalStockValue} variant="inventory" />
        </View>

        {/* Stat Cards */}
        <View className="px-5 mt-3 flex-row gap-3">
          <StatCard
            label="Active SKUs"
            value={formatNumber(activeSkuCount)}
            icon="barcode-outline"
          />
          <StatCard
            label="Low Stock"
            value={`${lowStockCount} Items`}
            icon="alert-circle-outline"
            valueColor="text-error"
          />
        </View>

        {/* Inventory List Header */}
        <View className="px-5 mt-6 flex-row justify-between items-center">
          <Text className="font-hanken text-xl font-semibold text-on-surface">
            Inventory Items
          </Text>
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => setShowSortMenu(!showSortMenu)}
          >
            <Text className="font-inter text-xs font-semibold text-primary tracking-wider">
              SORT BY
            </Text>
            <Ionicons name="chevron-down" size={16} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* Sort Menu */}
        {showSortMenu && (
          <View className="px-5 mt-2">
            <View className="bg-white rounded-xl p-2 border border-outline-variant/30"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              {(
                [
                  { key: "lastUpdated", label: "Last Updated" },
                  { key: "name", label: "Name" },
                  { key: "quantity", label: "Quantity" },
                  { key: "price", label: "Price" },
                ] as { key: SortOption; label: string }[]
              ).map((option) => (
                <TouchableOpacity
                  key={option.key}
                  className={`px-4 py-3 rounded-lg ${
                    sortBy === option.key ? "bg-primary-fixed/30" : ""
                  }`}
                  onPress={() => {
                    setSortBy(option.key);
                    setShowSortMenu(false);
                  }}
                >
                  <Text
                    className={`font-inter text-sm ${
                      sortBy === option.key
                        ? "text-primary font-semibold"
                        : "text-on-surface"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Product Cards */}
        <View className="px-5 mt-3 gap-3">
          {products.length === 0 ? (
            <EmptyState
              icon="cube-outline"
              title="No products yet"
              message="Add your first product to start managing your inventory."
            />
          ) : (
            sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={handleAddProduct}
        className="absolute bottom-28 right-5 w-14 h-14 rounded-2xl bg-primary items-center justify-center z-40"
        style={{
          shadowColor: "#4F46E5",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default InventoryScreen;
