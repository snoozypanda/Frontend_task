import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Transaction, TransactionType, PaginationState } from "../types";
import { formatNumber } from "../utils/formatting";
import TransactionItem from "../components/TransactionItem";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";

interface HistoryScreenProps {
  groupedTransactions: Record<string, Transaction[]>;
  pagination: PaginationState;
  totalInbound: number;
  totalOutbound: number;
  totalAdjusted: number;
  isLoaded: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToPage: (page: number) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({
  groupedTransactions,
  pagination,
  totalInbound,
  totalOutbound,
  totalAdjusted,
  isLoaded,
  onNextPage,
  onPrevPage,
  onGoToPage,
}) => {
  const dateGroups = Object.entries(groupedTransactions);

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <LoadingState message="Loading history..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-5 py-3 flex-row justify-between items-center border-b border-outline-variant/20">
        <View className="flex-row items-center gap-2">
          <Ionicons name="cube" size={22} color="#4F46E5" />
          <Text className="font-hanken text-xl font-bold text-primary">InventoryFlow</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity><Ionicons name="filter-outline" size={22} color="#464555" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="search-outline" size={22} color="#464555" /></TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View className="px-5 mt-6">
          <Text className="font-hanken text-[28px] font-bold text-on-surface leading-[34px] tracking-tight">History</Text>
          <Text className="font-inter text-base text-on-surface-variant mt-1">Real-time log of all stock movements and adjustments.</Text>
        </View>

        {/* Summary Cards */}
        <View className="px-5 mt-6">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <View className="bg-surface-container-high p-4 rounded-xl border border-outline-variant/30 h-24 justify-between">
                <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase">TOTAL INBOUND</Text>
                <Text className="font-hanken text-2xl font-bold text-stock-green">{formatNumber(totalInbound)}<Text className="text-sm font-normal text-on-surface-variant"> items</Text></Text>
              </View>
            </View>
            <View className="flex-1 gap-3">
              <View className="bg-surface-container-high p-3 rounded-xl border border-outline-variant/30">
                <Text className="font-inter text-[10px] font-semibold text-on-surface-variant tracking-widest uppercase">ADJUSTED</Text>
                <Text className="font-hanken text-lg font-bold text-stock-amber">{formatNumber(totalAdjusted)}</Text>
              </View>
              <View className="bg-surface-container-high p-3 rounded-xl border border-outline-variant/30">
                <Text className="font-inter text-[10px] font-semibold text-on-surface-variant tracking-widest uppercase">OUTBOUND</Text>
                <Text className="font-hanken text-lg font-bold text-on-surface">{formatNumber(totalOutbound)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Transaction Groups */}
        {pagination.totalItems === 0 ? (
          <EmptyState icon="receipt-outline" title="No transactions yet" message="Stock adjustments will appear here as you manage your inventory." />
        ) : (
          <View className="px-5 mt-6 gap-6">
            {dateGroups.map(([dateLabel, txs]) => (
              <View key={dateLabel}>
                <View className="flex-row items-center mb-3">
                  <View className="flex-1 h-px bg-outline-variant/30" />
                  <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest mx-4">{dateLabel}</Text>
                  <View className="flex-1 h-px bg-outline-variant/30" />
                </View>
                <View className="gap-3">
                  {txs.map((tx) => (<TransactionItem key={tx.id} transaction={tx} />))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <View className="px-5 mt-8 flex-row items-center justify-center gap-2">
            <TouchableOpacity onPress={onPrevPage} disabled={pagination.currentPage === 1}
              className={`flex-row items-center gap-1 px-3 py-2 rounded-lg ${pagination.currentPage === 1 ? "opacity-40" : ""}`}>
              <Ionicons name="chevron-back" size={16} color="#464555" />
              <Text className="font-mono text-xs font-medium text-on-surface-variant tracking-widest">PREVIOUS</Text>
            </TouchableOpacity>
            {Array.from({ length: Math.min(pagination.totalPages, 3) }, (_, i) => i + 1).map((page) => (
              <TouchableOpacity key={page} onPress={() => onGoToPage(page)}
                className={`w-8 h-8 rounded-lg items-center justify-center ${pagination.currentPage === page ? "bg-primary" : "bg-surface-container-high"}`}>
                <Text className={`font-mono text-sm font-medium ${pagination.currentPage === page ? "text-white" : "text-on-surface"}`}>{page}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={onNextPage} disabled={pagination.currentPage === pagination.totalPages}
              className={`flex-row items-center gap-1 px-3 py-2 rounded-lg ${pagination.currentPage === pagination.totalPages ? "opacity-40" : ""}`}>
              <Text className="font-mono text-xs font-medium text-on-surface-variant tracking-widest">NEXT</Text>
              <Ionicons name="chevron-forward" size={16} color="#464555" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
