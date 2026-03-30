import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../services/supabase";
import { useAppContext } from "../../context/AppContext";

export default function VerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { theme } = useAppContext();
  const isDark = theme === "dark";
  const bg = isDark ? "#0D1B2A" : "#F5F5F5";
  const cardBg = isDark ? "#1B2B3B" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#1a237e";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("6 digit OTP daalen");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: "signup",
      });
      if (verifyError) {
        setError("OTP galat hai ya expire ho gaya");
        return;
      }
      if (data.user) {
        router.replace("/auth/login");
        window.alert("Email verify ho gaya! Ab login karein.");
      }
    } catch (e) {
      setError("Kuch gadbad hui, dobara try karein");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await supabase.auth.resend({ type: "signup", email: email });
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (e) {}
    setResending(false);
  };

  const handleMagicLink = async () => {
    setResending(true);
    try {
      await supabase.auth.signInWithOtp({ email: email });
      window.alert("Magic link bhej diya! Email check karein aur link click karein.");
    } catch (e) {}
    setResending(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <View style={{ backgroundColor: cardBg, borderRadius: 20, padding: 28 }}>
          <Text style={{ fontSize: 28, fontWeight: "bold", color: textColor, textAlign: "center", marginBottom: 8 }}>
            📧 Email Verify करें
          </Text>
          <Text style={{ color: isDark ? "#AABBCC" : "#666", textAlign: "center", marginBottom: 24, fontSize: 14 }}>
            {email} पर OTP भेजा गया है
          </Text>

          <Text style={{ color: textColor, fontSize: 13, marginBottom: 8 }}>6-digit OTP डालें</Text>
          <TextInput
            style={{
              backgroundColor: isDark ? "#0D1B2A" : "#F5F5F5",
              color: textColor,
              borderRadius: 12,
              padding: 16,
              fontSize: 24,
              letterSpacing: 8,
              textAlign: "center",
              borderWidth: 1,
              borderColor: isDark ? "#2A3F55" : "#E0E0E0",
              marginBottom: 8,
            }}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor={isDark ? "#445566" : "#CCCCCC"}
          />

          {error ? <Text style={{ color: "#FF4444", textAlign: "center", marginBottom: 8 }}>{error}</Text> : null}
          {resent ? <Text style={{ color: "#00CC66", textAlign: "center", marginBottom: 8 }}>✅ OTP dobara bhej diya!</Text> : null}

          <TouchableOpacity
            style={{ backgroundColor: "#FF6B00", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 }}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>✅ Verify करें</Text>}
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: isDark ? "#2A3F55" : "#E0E0E0" }} />
            <Text style={{ color: isDark ? "#AABBCC" : "#666", paddingHorizontal: 12 }}>या</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: isDark ? "#2A3F55" : "#E0E0E0" }} />
          </View>

          <TouchableOpacity
            style={{ backgroundColor: "#1a237e", borderRadius: 12, padding: 16, alignItems: "center" }}
            onPress={handleMagicLink}
            disabled={resending}
          >
            {resending ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>🔗 Magic Link भेजें</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 16, alignItems: "center" }} onPress={handleResend} disabled={resending}>
            <Text style={{ color: "#FF6B00", fontSize: 13 }}>OTP नहीं आया? दोबारा भेजें</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 12, alignItems: "center" }} onPress={() => router.back()}>
            <Text style={{ color: isDark ? "#AABBCC" : "#666", fontSize: 13 }}>← वापस जाएं</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
