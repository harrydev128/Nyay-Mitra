import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import HeaderToggle from '../components/HeaderToggle';

export default function SalaryCalculatorScreen() {
  const router = useRouter();
  const { theme, language } = useAppContext();
  const isDark = theme === 'dark';
  const bg = isDark ? '#0D1B2A' : '#F5F5F5';
  const cardBg = isDark ? '#1B2B3B' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a237e';
  const subText = isDark ? '#AABBCC' : '#666666';
  const t = (hi: string, en: string) => language === 'hi' ? hi : en;

  const [basic, setBasic] = useState('');
  const [hra, setHra] = useState('');
  const [other, setOther] = useState('');
  const [pf, setPf] = useState('12');

  const basicNum = parseFloat(basic) || 0;
  const hraNum = parseFloat(hra) || 0;
  const otherNum = parseFloat(other) || 0;
  const pfPct = parseFloat(pf) || 12;
  const gross = basicNum + hraNum + otherNum;
  const pfAmt = Math.round(basicNum * pfPct / 100);
  const tds = gross > 50000 ? Math.round(gross * 0.1) : 0;
  const net = gross - pfAmt - tds;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ backgroundColor: '#1a237e', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff', fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{t('वेतन कैलकुलेटर', 'Salary Calculator')}</Text>
        </View>
        <HeaderToggle />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ backgroundColor: cardBg, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: textColor, fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>{t('वेतन विवरण भरें', 'Enter Salary Details')}</Text>
          {[
            { label: t('मूल वेतन / Basic Salary', 'Basic Salary'), val: basic, set: setBasic },
            { label: 'HRA', val: hra, set: setHra },
            { label: t('अन्य भत्ते / Other Allowances', 'Other Allowances'), val: other, set: setOther },
            { label: t('PF % (default 12)', 'PF % (default 12)'), val: pf, set: setPf },
          ].map((f, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={{ color: subText, fontSize: 12, marginBottom: 4 }}>{f.label}</Text>
              <TextInput
                style={{ backgroundColor: isDark ? '#243447' : '#F5F5F5', color: textColor, borderRadius: 8, padding: 10, borderWidth: 0.5, borderColor: isDark ? '#2A3F55' : '#E0E0E0' }}
                value={f.val} onChangeText={f.set} keyboardType="numeric" placeholderTextColor={subText}
              />
            </View>
          ))}
        </View>
        {gross > 0 && (
          <View style={{ backgroundColor: cardBg, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <Text style={{ color: textColor, fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>{t('आपका वेतन', 'Your Salary')}</Text>
            {[
              { label: t('कुल वेतन', 'Gross Salary'), val: gross, color: textColor },
              { label: t('PF कटौती', 'PF Deduction'), val: pfAmt, color: '#CC0000' },
              { label: t('अनुमानित TDS', 'Estimated TDS'), val: tds, color: '#CC0000' },
              { label: t('इन-हैंड वेतन', 'Net Take Home'), val: net, color: '#00AA00' },
            ].map((r, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: isDark ? '#2A3F55' : '#E0E0E0' }}>
                <Text style={{ color: subText, fontSize: 14 }}>{r.label}</Text>
                <Text style={{ color: r.color, fontSize: 14, fontWeight: 'bold' }}>₹{r.val.toLocaleString('en-IN')}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={{ backgroundColor: cardBg, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: textColor, fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>{t('आपके अधिकार', 'Your Rights')}</Text>
          {[
            { icon: '💰', title: t('वेतन नहीं मिला?', 'Salary not paid?'), action: () => Linking.openURL('tel:1800-11-2228') },
            { icon: '📋', title: t('PF शिकायत', 'PF Complaint'), action: () => Linking.openURL('https://epfigms.gov.in') },
            { icon: '⚖️', title: t('श्रम विभाग शिकायत', 'Labour Complaint'), action: () => Linking.openURL('https://shramsuvidha.gov.in') },
          ].map((item, i) => (
            <TouchableOpacity key={i} onPress={item.action} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: isDark ? '#2A3F55' : '#E0E0E0' }}>
              <Text style={{ fontSize: 20, marginRight: 12 }}>{item.icon}</Text>
              <Text style={{ color: '#FF6B00', fontSize: 14, flex: 1 }}>{item.title}</Text>
              <Text style={{ color: subText }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
