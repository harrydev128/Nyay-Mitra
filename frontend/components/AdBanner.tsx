import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';

export default function AdBanner() {
  const { isPremium, language } = useAppContext();
  const [dismissed, setDismissed] = useState(false);

  // Premium users ko ad nahi dikhega
  if (isPremium || dismissed) return null;

  // ✅ FIX: 'hindi' ki jagah 'hi'
  const getText = (hindi: string, english: string) => {
    return language === 'hi' ? hindi : english;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.adText}>
          {getText('विज्ञापन | NyayMitra Partner', 'Advertisement | Ad by NyayMitra Partner')}
        </Text>
        {/* ✅ FIX: dismiss button kaam karega ab */}
        <TouchableOpacity onPress={() => setDismissed(true)} style={styles.dismissButton}>
          <Ionicons name="close" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // ✅ FIX: position absolute hataya - ab footer ke neeche rahega
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adText: {
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  dismissButton: {
    padding: 4,
  },
});
