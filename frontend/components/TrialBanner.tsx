import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../context/AppContext";

export default function TrialBanner() {
  const { hasFullAccess, trialDaysLeft, isPremium, theme, language } = useAppContext();
  const router = useRouter();
  const isDark = theme === "dark";

  if (isPremium) return null;
  if (!hasFullAccess && trialDaysLeft === 0) return (
    <TouchableOpacity
      onPress={() => router.push("/premium")}
      style={{ backgroundColor: "#FF4444", margin: 12, borderRadius: 12, padding: 14, alignItems: "center" }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
        🔒 {language === "hi" ? "Free Trial खत्म! Premium लें →" : "Trial Ended! Get Premium →"}
      </Text>
    </TouchableOpacity>
  );

  if (trialDaysLeft > 0) return (
    <TouchableOpacity
      onPress={() => router.push("/premium")}
      style={{ backgroundColor: trialDaysLeft <= 2 ? "#FF6B00" : "#1a237e", margin: 12, borderRadius: 12, padding: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>
        🎁 {language === "hi" ? `Free Trial — ${trialDaysLeft} दिन बाकी` : `Free Trial — ${trialDaysLeft} days left`}
      </Text>
      <Text style={{ color: "#FFD700", fontSize: 12, fontWeight: "bold" }}>
        {language === "hi" ? "Premium देखें →" : "See Plans →"}
      </Text>
    </TouchableOpacity>
  );

  return null;
}
