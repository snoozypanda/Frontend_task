import React, { useState, useCallback } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { User, UserFormData, ValidationError, ToastMessage } from "../types";
import InfoBanner from "../components/InfoBanner";
import Toast from "../components/Toast";
import LoadingState from "../components/LoadingState";
import { generateId } from "../utils/formatting";

interface ProfileScreenProps {
  currentUser: User | null;
  isRegistered: boolean;
  loading: boolean;
  isLoaded: boolean;
  onRegister: (data: UserFormData) => Promise<{ success: boolean; errors: ValidationError[] }>;
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ currentUser, isRegistered, loading, isLoaded, onRegister, onLogout }) => {
  const [formData, setFormData] = useState<UserFormData>({ fullName: "", email: "" });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message || null;

  const handleRegister = useCallback(async () => {
    setErrors([]);
    const result = await onRegister(formData);
    if (result.success) {
      setToast({ id: generateId(), type: "success", title: "Welcome!", message: "Your account has been created successfully." });
    } else {
      setErrors(result.errors);
    }
  }, [formData, onRegister]);

  if (!isLoaded) {
    return (<SafeAreaView className="flex-1 bg-background"><LoadingState message="Loading profile..." /></SafeAreaView>);
  }

  // Registered user view
  if (isRegistered && currentUser) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <Toast toast={toast} onDismiss={() => setToast(null)} />
        <View className="px-5 py-3 flex-row justify-between items-center border-b border-outline-variant/20">
          <View className="flex-row items-center gap-2">
            <Ionicons name="cube" size={22} color="#4F46E5" />
            <Text className="font-hanken text-xl font-bold text-primary">InventoryFlow</Text>
          </View>
          <TouchableOpacity><Ionicons name="settings-outline" size={22} color="#464555" /></TouchableOpacity>
        </View>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="items-center mt-10">
            <View className="w-24 h-24 rounded-full bg-primary items-center justify-center mb-4">
              <Text className="font-hanken text-3xl font-bold text-white">
                {currentUser.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </Text>
            </View>
            <Text className="font-hanken text-2xl font-bold text-on-surface">{currentUser.fullName}</Text>
            <Text className="font-inter text-base text-on-surface-variant mt-1">{currentUser.email}</Text>
            <Text className="font-inter text-sm text-outline mt-1">
              Member since {new Date(currentUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </Text>
          </View>
          <View className="px-5 mt-8 gap-3">
            <View className="bg-white p-4 rounded-xl flex-row items-center gap-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <Ionicons name="person-outline" size={22} color="#4F46E5" />
              <View className="flex-1"><Text className="font-inter text-sm text-on-surface-variant">Full Name</Text><Text className="font-hanken text-base font-semibold text-on-surface">{currentUser.fullName}</Text></View>
            </View>
            <View className="bg-white p-4 rounded-xl flex-row items-center gap-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
              <Ionicons name="mail-outline" size={22} color="#4F46E5" />
              <View className="flex-1"><Text className="font-inter text-sm text-on-surface-variant">Email</Text><Text className="font-hanken text-base font-semibold text-on-surface">{currentUser.email}</Text></View>
            </View>
          </View>
          <View className="px-5 mt-8">
            <TouchableOpacity onPress={onLogout} className="h-[48px] bg-error/10 rounded-xl items-center justify-center flex-row gap-2 border border-error/20" activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={20} color="#BA1A1A" />
              <Text className="font-hanken text-base font-semibold text-error">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Registration form view
  const fullNameError = getFieldError("fullName");
  const emailError = getFieldError("email");

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Toast toast={toast} onDismiss={() => setToast(null)} />
      <View className="px-5 py-3 flex-row justify-between items-center border-b border-outline-variant/20">
        <View className="flex-row items-center gap-2">
          <Ionicons name="cube" size={22} color="#4F46E5" />
          <Text className="font-hanken text-xl font-bold text-primary">InventoryFlow</Text>
        </View>
        <TouchableOpacity><Ionicons name="help-circle-outline" size={24} color="#464555" /></TouchableOpacity>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="px-5 mt-6 mb-6">
            <Text className="font-hanken text-[28px] font-bold text-on-surface leading-[34px] tracking-tight">Create Account</Text>
            <Text className="font-inter text-base text-on-surface-variant mt-2">Start managing your inventory with precision and ease. Join InventoryFlow today.</Text>
          </View>
          <View className="px-5 gap-5">
            <View>
              <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase mb-2">Full Name</Text>
              <TextInput className={`h-[44px] rounded-lg px-4 font-inter text-base text-on-surface ${fullNameError ? "bg-error-container/30 border-2 border-error" : "bg-[#F3F4F6]"}`}
                placeholder="Enter your full name" placeholderTextColor="#777587" value={formData.fullName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, fullName: text }))} />
              {fullNameError && <Text className="font-inter text-xs text-error mt-1">{fullNameError}</Text>}
            </View>
            <View>
              <Text className="font-inter text-xs font-semibold text-on-surface-variant tracking-widest uppercase mb-2">Email Address</Text>
              <TextInput className={`h-[44px] rounded-lg px-4 font-inter text-base text-on-surface ${emailError ? "bg-error-container/30 border-2 border-error" : "bg-[#F3F4F6]"}`}
                placeholder="name@company.com" placeholderTextColor="#777587" value={formData.email}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))} keyboardType="email-address" autoCapitalize="none" />
              {emailError && <Text className="font-inter text-xs text-error mt-1">{emailError}</Text>}
            </View>
            <TouchableOpacity onPress={handleRegister} disabled={loading} activeOpacity={0.7}
              className="h-[48px] bg-primary rounded-xl items-center justify-center flex-row gap-2">
              <Text className="font-hanken text-lg font-semibold text-white">{loading ? "Registering..." : "Register"}</Text>
              {!loading && <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>
          <View className="mt-auto px-5 pt-6">
            <InfoBanner title="Requirement check" message="Ensure your email is a valid corporate domain for enterprise syncing features." variant="info" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
