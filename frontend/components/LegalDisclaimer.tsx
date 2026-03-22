import React from 'react';
import { View, Text } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function LegalDisclaimer({ position = 'after' }: { position?: 'before' | 'after' }) {
  const { language, theme } = useAppContext();
  const isDark = theme === 'dark';

  if (position === 'before') return null;

  const isHindi = language === 'hi';

  return (
    <View style={{
      marginTop: 10, marginBottom: 4,
      backgroundColor: isDark ? 'rgba(232,97,10,0.08)' : '#FFF8F0',
      borderLeftWidth: 3, borderLeftColor: '#E8610A',
      borderRadius: 8, padding: 10,
    }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#E8610A', marginBottom: 4 }}>
        ⚠️ {isHindi ? 'महत्वपूर्ण अस्वीकरण' : 'Important Disclaimer'}
      </Text>
      <Text style={{ fontSize: 12, color: isDark ? '#AABBCC' : '#555', lineHeight: 18 }}>
        {isHindi
          ? 'यह जानकारी केवल कानूनी जागरूकता के लिए है, कानूनी सलाह नहीं। अपने मामले के लिए किसी योग्य वकील से अवश्य परामर्श लें।'
          : 'This information is for legal awareness only, not legal advice. Always consult a qualified lawyer for your specific case.'}
      </Text>
      <Text style={{ fontSize: 11, color: isDark ? '#8A95C0' : '#888', marginTop: 4 }}>
        — NyayMitra
      </Text>
    </View>
  );
}
