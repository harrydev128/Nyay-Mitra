import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';

interface AdBannerProps {
  onDismiss?: () => void;
}

export default function AdBanner({ onDismiss }: AdBannerProps) {
  const { isPremium, language } = useAppContext();

  // Don't show for premium users
  if (isPremium) return null;

  const getText = (hindi: string, english: string) => {
    return language === 'hindi' ? hindi : english;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.adText}>
          {getText('विज्ञापन | Ad by NyayMitra Partner', 'Advertisement | Ad by NyayMitra Partner')}
        </Text>
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <Ionicons name="close" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 2,
    borderTopColor: Colors.saffron,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 4,
    ...Platform.select({
      web: { boxShadow: '0px -2px 8px rgba(0,0,0,0.1)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    }),
    zIndex: 100,
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
