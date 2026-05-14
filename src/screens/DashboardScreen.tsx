import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Product, Transaction, TransactionType } from "../types";
import {
  formatCurrency,
  formatNumber,
  getGreeting,
  generateId,
} from "../utils/formatting";
import StockValueCard from "../components/StockValueCard";
import StatCard from "../components/StatCard";
import QuickActionButton from "../components/QuickActionButton";
import QuantityStepper from "../components/QuantityStepper";
import Toast from "../components/Toast";
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
  onStockChange: (sku: string, delta: number, type: TransactionType) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName,
  products,
  totalStockValue,
  recentTransactions,
  transactionCount,
  isLoaded,
  onStockChange,
}) => {
  const navigation = useNavigation<any>();
  
  const [quickActionType, setQuickActionType] = React.useState<"in" | "out" | null>(null);
  const [selectedProductSku, setSelectedProductSku] = React.useState<string | null>(null);
  const [adjustQuantity, setAdjustQuantity] = React.useState<number>(1);
  const [toast, setToast] = React.useState<{ id: string; type: "success" | "error"; title: string; message: string } | null>(null);

  const handleQuickActionClose = () => {
    setQuickActionType(null);
    setSelectedProductSku(null);
    setAdjustQuantity(1);
  };

  const handleConfirmAction = () => {
    if (!selectedProductSku) return;
    const type = quickActionType === "in" ? TransactionType.INBOUND : TransactionType.OUTBOUND;
    const delta = quickActionType === "in" ? adjustQuantity : -adjustQuantity;
    
    // Check if enough stock for outbound
    const product = products.find(p => p.sku === selectedProductSku);
    if (quickActionType === "out" && product && product.quantity < adjustQuantity) {
      setToast({
        id: generateId(),
        type: "error",
        title: "Insufficient Stock",
        message: `Cannot remove ${adjustQuantity}. Only ${product.quantity} in stock.`,
      });
      return;
    }

    onStockChange(selectedProductSku, delta, type);
    
    setToast({
      id: generateId(),
      type: "success",
      title: quickActionType === "in" ? "Stock Added" : "Stock Removed",
      message: `Successfully adjusted ${product?.name}.`,
    });
    
    handleQuickActionClose();
  };

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
              onPress={() => setQuickActionType("in")}
            />
            <QuickActionButton
              label="Stock Out"
              icon="arrow-up-outline"
              onPress={() => setQuickActionType("out")}
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

      {/* Quick Action Modal */}
      <Modal
        visible={quickActionType !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={handleQuickActionClose}
      >
        <View className="flex-1 justify-end bg-black/40">
          <TouchableOpacity 
            className="flex-1" 
            activeOpacity={1} 
            onPress={handleQuickActionClose} 
          />
          <View className="bg-white rounded-t-3xl min-h-[300px] p-5 pb-8 shadow-xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-hanken text-xl font-bold text-on-surface">
                {quickActionType === "in" ? "Quick Stock In" : "Quick Stock Out"}
              </Text>
              <TouchableOpacity onPress={handleQuickActionClose} className="w-8 h-8 bg-surface-container rounded-full items-center justify-center">
                <Ionicons name="close" size={20} color="#464555" />
              </TouchableOpacity>
            </View>

            {products.length === 0 ? (
              <EmptyState 
                icon="cube-outline" 
                title="No Products" 
                message="Add products to your inventory before adjusting stock." 
              />
            ) : (
              <ScrollView className="max-h-[60%]" showsVerticalScrollIndicator={false}>
                <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase mb-3">SELECT PRODUCT</Text>
                {products.map(p => (
                  <TouchableOpacity 
                    key={p.sku}
                    onPress={() => setSelectedProductSku(p.sku)}
                    className={`p-4 rounded-xl mb-3 border ${selectedProductSku === p.sku ? 'border-primary bg-primary-fixed/30' : 'border-outline-variant/30 bg-surface-container-high'}`}
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1 pr-3">
                        <Text className="font-inter text-xs font-semibold text-primary tracking-wider">{p.sku}</Text>
                        <Text className="font-hanken text-base font-semibold text-on-surface" numberOfLines={1}>{p.name}</Text>
                      </View>
                      <View className="items-end">
                        <Text className="font-inter text-[10px] text-on-surface-variant uppercase tracking-widest">In Stock</Text>
                        <Text className="font-mono text-base font-bold text-on-surface">{p.quantity}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {selectedProductSku && (
              <View className="mt-4 border-t border-outline-variant/20 pt-4">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="font-inter text-sm font-semibold text-on-surface">Quantity to {quickActionType === "in" ? "Add" : "Remove"}</Text>
                  <QuantityStepper
                    value={adjustQuantity}
                    onIncrement={() => setAdjustQuantity(prev => prev + 1)}
                    onDecrement={() => setAdjustQuantity(prev => Math.max(1, prev - 1))}
                  />
                </View>

                <TouchableOpacity 
                  className={`h-12 rounded-xl items-center justify-center flex-row gap-2 ${quickActionType === "in" ? "bg-primary" : "bg-error"}`}
                  onPress={handleConfirmAction}
                  activeOpacity={0.8}
                >
                  <Ionicons name={quickActionType === "in" ? "arrow-down" : "arrow-up"} size={20} color="#FFFFFF" />
                  <Text className="font-hanken text-lg font-bold text-white">Confirm {quickActionType === "in" ? "Stock In" : "Stock Out"}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </SafeAreaView>
  );
};

export default DashboardScreen;
