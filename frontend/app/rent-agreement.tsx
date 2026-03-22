import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Share } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import HeaderToggle from '../components/HeaderToggle';

export default function RentAgreementScreen() {
  const router = useRouter();
  const { theme, language } = useAppContext();
  const isDark = theme === 'dark';
  const bg = isDark ? '#0D1B2A' : '#F5F5F5';
  const cardBg = isDark ? '#1B2B3B' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a237e';
  const subText = isDark ? '#AABBCC' : '#666666';
  const t = (hi: string, en: string) => language === 'hi' ? hi : en;

  const [form, setForm] = useState({ landlord: '', tenant: '', address: '', rent: '', deposit: '', startDate: '', duration: '', state: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const viewShotRef = useRef<any>(null);

  const generate = async () => {
    if (!form.landlord || !form.tenant || !form.rent) {
      Alert.alert(t('त्रुटि', 'Error'), t('कृपया सभी जरूरी फील्ड भरें', 'Please fill required fields'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://nyay-mitra-production.up.railway.app/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_type: 'rent_agreement', language, fields: form, user_situation: 'Generate complete rent agreement' })
      });
      const data = await res.json();
      setResult(data.document || data.content || '');
    } catch (e) {
      Alert.alert(t('त्रुटि', 'Error'), t('कृपया दोबारा कोशिश करें', 'Please try again'));
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#1a237e', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff', fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{t('किराया समझौता', 'Rent Agreement')}</Text>
        </View>
        <HeaderToggle />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16 }}>
        {!result ? (
          <>
            {[
              { key: 'landlord', hi: 'मकान मालिक का नाम *', en: 'Landlord Name *' },
              { key: 'tenant', hi: 'किरायेदार का नाम *', en: 'Tenant Name *' },
              { key: 'address', hi: 'मकान का पता', en: 'Property Address' },
              { key: 'rent', hi: 'मासिक किराया (₹) *', en: 'Monthly Rent (₹) *' },
              { key: 'deposit', hi: 'जमानत राशि (₹)', en: 'Security Deposit (₹)' },
              { key: 'startDate', hi: 'शुरू तारीख (DD/MM/YYYY)', en: 'Start Date (DD/MM/YYYY)' },
              { key: 'duration', hi: 'अवधि (जैसे: 11 महीने)', en: 'Duration (e.g. 11 months)' },
              { key: 'state', hi: 'राज्य', en: 'State' },
            ].map(f => (
              <View key={f.key} style={{ marginBottom: 12 }}>
                <Text style={{ color: textColor, fontSize: 13, marginBottom: 4 }}>{t(f.hi, f.en)}</Text>
                <TextInput
                  style={{ backgroundColor: cardBg, color: textColor, borderRadius: 8, padding: 12, borderWidth: 0.5, borderColor: isDark ? '#2A3F55' : '#E0E0E0' }}
                  value={form[f.key as keyof typeof form]}
                  onChangeText={val => setForm({ ...form, [f.key]: val })}
                  placeholderTextColor={subText}
                />
              </View>
            ))}
            <TouchableOpacity
              style={{ backgroundColor: loading ? '#ccc' : '#FF6B00', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 }}
              onPress={generate}
              disabled={loading}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                {loading ? t('तैयार हो रहा है...', 'Generating...') : t('📄 समझौता बनाएं', '📄 Generate Agreement')}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.95 }}>
            <View style={{ backgroundColor: '#FFFFFF', marginBottom: 16, borderWidth: 1, borderColor: '#E0E0E0', overflow: 'hidden', minHeight: 700 }}>
              {/* Full page watermark */}
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 0 }}>
                {[0,1,2,3,4,5,6,7,8,9].map(i => (
                  <Text key={i} style={{ fontSize: 18, color: 'rgba(232,97,10,0.05)', fontWeight: 'bold', transform: [{ rotate: '-45deg' }], marginVertical: 16, letterSpacing: 3 }}>
                    NyayMitra • AI Generated • NyayMitra • AI Generated
                  </Text>
                ))}
              </View>
              {/* Document Content */}
              <View style={{ padding: 28, zIndex: 1 }}>
                {/* Header */}
                <View style={{ alignItems: 'flex-end', marginBottom: 16 }}>
                  <Text style={{ fontSize: 11, color: '#888', fontStyle: 'italic' }}>⚖️ NyayMitra - AI Legal Assistant</Text>
                </View>
                <View style={{ height: 1, backgroundColor: '#333', marginBottom: 20 }} />
                {/* Title */}
                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 20, letterSpacing: 1 }}>
                  {t('किराया समझौता', 'RENT AGREEMENT')}
                </Text>
                {/* Body */}
                <Text style={{ fontSize: 13, lineHeight: 24, color: '#111', textAlign: 'justify' }}>{result}</Text>
                {/* Footer */}
                <View style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 14, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: '#E8610A', fontWeight: 'bold', letterSpacing: 1 }}>⚖️ NyayMitra</Text>
                  <Text style={{ fontSize: 11, color: '#666', marginTop: 3 }}>AI Generated Document | भारत का AI कानूनी सहायक</Text>
                  <Text style={{ fontSize: 10, color: '#aaa', marginTop: 3, textAlign: 'center' }}>⚠️ कानूनी उपयोग से पहले किसी योग्य वकील से समीक्षा अवश्य करवाएं</Text>
                </View>
              </View>
            </View>
            </ViewShot>
            <View style={{ gap: 8, marginBottom: 16 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#FF6B00', borderRadius: 12, padding: 16, alignItems: 'center' }}
                onPress={async () => {
                  try {
                    if (viewShotRef.current) {
                      const uri = await viewShotRef.current.capture();
                      await Share.share({ url: uri, message: t('किराया समझौता - NyayMitra', 'Rent Agreement - NyayMitra') });
                    } else {
                      await Share.share({ message: result });
                    }
                  } catch (e) {
                    await Share.share({ message: result });
                  }
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>📤 {t('Share / Print करें', 'Share / Print')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#1a237e', borderRadius: 12, padding: 16, alignItems: 'center' }} onPress={() => setResult('')}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('नया बनाएं', 'Create New')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
