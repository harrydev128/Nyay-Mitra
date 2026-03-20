import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function LanguageToggle() {
  const { language, changeLanguage } = useAppContext();
  
  return (
    <TouchableOpacity 
      style={styles.toggle} 
      onPress={() => changeLanguage(language === 'hi' ? 'en' : 'hi')}
    >
      <Text style={styles.toggleText}>
        {language === 'hi' ? 'EN' : 'हि'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggle: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toggleText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});
