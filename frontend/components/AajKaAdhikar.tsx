import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { supabase } from "../services/supabase";
import { useAppContext } from "../context/AppContext";
import { scheduleDailyTipNotification } from "../utils/notifications";

export default function AajKaAdhikar() {
  const { theme, language } = useAppContext();
  const isDark = theme === "dark";
  const [tip, setTip] = useState<{ tip_hindi: string; tip_english: string; category: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTip();
  }, []);

  const fetchTip = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("daily_tips")
        .select("tip_hindi, tip_english, category")
        .lte("scheduled_date", today)
        .order("scheduled_date", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setTip(data);
        scheduleDailyTipNotification(data.tip_hindi, data.tip_english, language);
      }
    } catch (e) {}
    setLoading(false);
  };

  const categoryEmoji: Record<string, string> = {
    police: "👮", tenant: "🏠", consumer: "🛒", women: "👩",
    employment: "💼", education: "📚", civil: "🏛️", health: "🏥",
    children: "👶", finance: "💰", property: "🏗️", cyber: "💻",
  };

  if (loading) return (
    <View style={{ backgroundColor: isDark ? "#1B2B3B" : "#FFF3E0", borderRadius: 16, padding: 20, marginHorizontal: 16, marginVertical: 8, alignItems: "center" }}>
      <ActivityIndicator color="#FF6B00" />
    </View>
  );

  if (!tip) return null;

  return (
    <View style={{
      backgroundColor: isDark ? "#1B2B3B" : "#FFF3E0",
      borderRadius: 16, padding: 20,
      marginHorizontal: 16, marginVertical: 8,
      borderLeftWidth: 4, borderLeftColor: "#FF6B00",
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontSize: 18 }}>{categoryEmoji[tip.category] || "⚖️"}</Text>
        <Text style={{ fontSize: 12, fontWeight: "bold", color: "#FF6B00", marginLeft: 8, textTransform: "uppercase", letterSpacing: 1 }}>
          {language === "hi" ? "आज का अधिकार" : "Right of the Day"}
        </Text>
      </View>
      <Text style={{ fontSize: 15, color: isDark ? "#FFFFFF" : "#1a237e", lineHeight: 22, fontWeight: "500" }}>
        {language === "hi" ? tip.tip_hindi : tip.tip_english}
      </Text>
      <Text style={{ fontSize: 11, color: isDark ? "#AABBCC" : "#888", marginTop: 8 }}>
        {language === "hi" ? "📲 रोज सुबह 9 बजे नई जानकारी" : "📲 New tip every day at 9 AM"}
      </Text>
    </View>
  );
}
