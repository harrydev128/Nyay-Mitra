import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function HeaderToggle() {
  const { language, changeLanguage, theme, toggleTheme } = useAppContext();
  const isDark = theme === 'dark';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <TouchableOpacity onPress={toggleTheme} style={{ padding: 6 }}>
        <Text style={{ fontSize: 18 }}>{isDark ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => changeLanguage(language === 'hindi' ? 'en' : 'hi')}
        style={{ backgroundColor: '#FF6B00', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>
          {language === 'hindi' ? 'EN' : 'हि'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
