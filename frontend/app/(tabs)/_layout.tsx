import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors } from '../../constants/colors';
import { useAppContext } from '../../context/AppContext';

export default function TabLayout() {
  const { theme, toggleTheme } = useAppContext();
  const Colors = theme === 'dark' ? DarkColors : LightColors;
  const styles = getStyles(Colors);

  const { language } = useAppContext();

  const getText = (hindi: string, english: string) => {
    return language === 'hi' ? hindi : english;
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.saffron,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.cardBackground,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          height: Platform.OS === 'ios' ? 88 : 70,
          elevation: 8,
          ...Platform.select({
            web: { boxShadow: '0px -2px 8px rgba(0,0,0,0.1)' },
            default: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: getText('होम', 'Home'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: getText('AI वकील', 'AI Lawyer'),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTab : null}>
              <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={24} color={focused ? Colors.white : color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="rights"
        options={{
          title: getText('अधिकार', 'Rights'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: getText('दस्तावेज़', 'Documents'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: getText('प्रोफाइल', 'Profile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
      {/* Hide more from tabs but keep file to prevent errors */}
      <Tabs.Screen
        name="more"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  activeTab: {
    backgroundColor: Colors.saffron,
    borderRadius: 20,
    padding: 8,
    marginTop: -10,
  },
});
