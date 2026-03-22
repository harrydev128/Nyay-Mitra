import React from 'react';
import { View, Text } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function LegalDisclaimer({ position = 'after' }: { position?: 'before' | 'after' }) {
  const { language, theme } = useAppContext();
  const isDark = theme === 'dark';
  const isHindi = language === 'hi';

  if (position === 'before') return null;

  return (
    <View style={{
      marginTop: 10, marginBottom: 4,
      backgroundColor: isDark ? 'rgba(232,97,10,0.10)' : '#FFF8F0',
      borderLeftWidth: 3, borderLeftColor: '#E8610A',
      borderRadius: 8, padding: 12,
    }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#E8610A', marginBottom: 8 }}>
        {isHindi ? '⚠️ महत्वपूर्ण अस्वीकरण' : '⚠️ Important Disclaimer'}
      </Text>
      {isHindi ? (
        <View>
        <Text key={"0"} style={{ fontSize: 12, color: isDark ? "#CCDDEE" : "#444", lineHeight: 20, marginBottom: 4 }}>1. यह जानकारी केवल सामान्य कानूनी जागरूकता के लिए है — यह कानूनी सलाह नहीं है।</Text>
        <Text key={"1"} style={{ fontSize: 12, color: isDark ? "#CCDDEE" : "#444", lineHeight: 20, marginBottom: 4 }}>2. NyayMitra एक AI सहायक है, यह किसी वकील का विकल्प नहीं है।</Text>
        <Text key={"2"} style={{ fontSize: 12, color: isDark ? "#CCDDEE" : "#444", lineHeight: 20, marginBottom: 4 }}>3. अपने मामले की सटीक जानकारी के लिए किसी योग्य वकील से अवश्य परामर्श लें।</Text>
        <Text key={"3"} style={{ fontSize: 12, color: isDark ? "#CCDDEE" : "#444", lineHeight: 20, marginBottom: 4 }}>4. यहाँ दी गई जानकारी का दुरुपयोग कानूनी अपराध हो सकता है।</Text>
        <Text key={"4"} style={{ fontSize: 12, color: isDark ? "#CCDDEE" : "#444", lineHeight: 20, marginBottom: 4 }}>5. कोर्ट की तारीख, धारा और प्रक्रिया अलग-अलग राज्यों में अलग हो सकती है।</Text>
        </View>
      ) : (
        <View>
        <Text key={"0"} style={{ fontSize: 12, color: isDark ? "#CCDDEE" : "#444", lineHeight: 20, marginBottom: 4 }}>1. This information is for general legal awareness only — it is NOT legal advice.</Text>
        <Text key={"1"} style={{ fontSize: 12, color: isDark ? "#CCDDEE" : "#444", lineHeight: 20, marginBottom: 4 }}>2. NyayMitra is an AI assistant and is not a substitute for a qualified lawyer.</Text>
        <Text key={"2"} style={{ fontSize: 12, color: isDark ? "#CCDDEE" : "#444", lineHeight: 20, marginBottom: 4 }}>3. Always consult a licensed lawyer for advice specific to your case.</Text>
        <Text key={"3"} style={{ fontSize: 12, color: isDark ? "#CCDDEE" : "#444", lineHeight: 20, marginBottom: 4 }}>4. Misuse of information provided here may constitute a legal offense.</Text>
        <Text key={"4"} style={{ fontSize: 12, color: isDark ? "#CCDDEE" : "#444", lineHeight: 20, marginBottom: 4 }}>5. Court procedures, sections and timelines may vary by state and jurisdiction.</Text>
        </View>
      )}
      <Text style={{ fontSize: 11, color: isDark ? '#8A95C0' : '#999', marginTop: 8, fontStyle: 'italic' }}>
        {isHindi ? '— NyayMitra | भारत का AI कानूनी सहायक' : "— NyayMitra | India's AI Legal Assistant"}
      </Text>
    </View>
  );
}
