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
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#E8610A', marginBottom: 6 }}>
        ⚠️ {isHindi ? 'महत्वपूर्ण अस्वीकरण' : 'Important Disclaimer'}
      </Text>
      {isHindi ? (
        <Text style={{ fontSize: 12, color: isDark ? '#CCDDEE' : '#444', lineHeight: 20 }}>
          {'1. यह जानकारी केवल सामान्य कानूनी जागरूकता के लिए है — यह कानूनी सलाह नहीं है।

2. NyayMitra एक AI सहायक है, यह किसी वकील का विकल्प नहीं है।

3. अपने मामले की सटीक जानकारी के लिए किसी योग्य वकील से अवश्य परामर्श लें।

4. यहाँ दी गई जानकारी का दुरुपयोग कानूनी अपराध हो सकता है।

5. कोर्ट की तारीख, धारा और प्रक्रिया अलग-अलग राज्यों में अलग हो सकती है।'}
        </Text>
      ) : (
        <Text style={{ fontSize: 12, color: isDark ? '#CCDDEE' : '#444', lineHeight: 20 }}>
          {'1. This information is for general legal awareness only — it is NOT legal advice.

2. NyayMitra is an AI assistant and is not a substitute for a qualified lawyer.

3. Always consult a licensed lawyer for advice specific to your case.

4. Misuse of information provided here may constitute a legal offense.

5. Court procedures, sections and timelines may vary by state and jurisdiction.'}
        </Text>
      )}
      <Text style={{ fontSize: 11, color: isDark ? '#8A95C0' : '#999', marginTop: 8, fontStyle: 'italic' }}>
        — NyayMitra | {isHindi ? 'भारत का AI कानूनी सहायक' : 'India's AI Legal Assistant'}
      </Text>
    </View>
  );
}
