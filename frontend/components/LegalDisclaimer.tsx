import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { t } from '../constants/translations';

export default function LegalDisclaimer({ position = 'after' }: { position?: 'before' | 'after' }) {
  const { language } = useAppContext();
  
  const beforeText = language === 'hi' 
    ? '⚖️ *यह जानकारी केवल सामान्य कानूनी जागरूकता के लिए है।*'
    : '⚖️ *This is for general legal awareness only.*';
    
  const afterText = language === 'hi' 
    ? '\n\n---\n\n**⚠️ महत्वपूर्ण अस्वीकरण:**\n\n- यह सलाहा योग्य जानकारी है, वकील-क्लाइंट विशेषज्ञता नहीं\n- विधिवत रूप से योग्य वकील से परामर्श लें\n- कोर्ट की तारीख और कानूनी प्रक्रिया अलग-अलग अलग हो सकती है\n- अपने क्षेत्र के अनुभवी वकील से सलाह लें\n\n*यह जानकारी केवल सामान्य कानूनी जागरूकता के लिए है।*'
    : '\n\n---\n\n**⚠️ Important Disclaimer:**\n\n- This advice is for general awareness only, not legal-client privilege\n- Always consult a qualified lawyer in person for your specific case\n- Court dates and legal procedures may vary by jurisdiction\n- Consult a lawyer from your specific area for local laws\n\n*This is for general legal awareness only.*';

  if (position === 'before') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{beforeText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{afterText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});
