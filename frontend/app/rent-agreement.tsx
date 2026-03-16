import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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

  const generate = async () => {
    if (!form.landlord || !form.tenant || !form.rent) {
      Alert.alert(t('त्रुटि', 'Error'), t('कृपया सभी जरूरी फील्ड भरें', 'Please fill required fields'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://192.168.1.4:8001/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_type: 'rent_agreement', language, fields: form, user_situation: 'Generate complete rent agreement' })
      });
      const data = await res.json();
      setResult(data.document || data.content || 'Document generated');
    } catch (e) {
      Alert.alert(t('त्रुटि', 'Error'), t('कृपया दोबारा कोशिश करें', 'Please try again'));
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ backgroundColor: '#1a237e', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff', fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{t('किराया समझौता', 'Rent Agreement')}</Text>
        </View>
        <HeaderToggle />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
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
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
              <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#1a237e', marginBottom: 16 }}>{t('किराया समझौता', 'Rent Agreement')}</Text>
              <Text style={{ fontSize: 14, lineHeight: 22, color: '#333', textAlign: 'justify' }}>{result}</Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: '#FF6B00', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 8 }} onPress={() => setResult('')}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('नया बनाएं', 'Create New')}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
