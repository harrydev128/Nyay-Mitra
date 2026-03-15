import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LightColors, DarkColors } from '../../constants/colors';
import { useAppContext } from '../../context/AppContext';

export default function MoreScreen() {
  const { theme, toggleTheme } = useAppContext();
  const Colors = theme === 'dark' ? DarkColors : LightColors;
  const styles = getStyles(Colors);

  const router = useRouter();
  const { language, setLanguage } = useAppContext();

  const getText = (hindi: string, english: string) => {
    return language === 'hindi' ? hindi : english;
  };

  const emergencyNumbers = [
    { name_hindi: 'पुलिस', name_english: 'Police', number: '112', icon: 'shield', color: Colors.deepBlue },
    { name_hindi: 'महिला हेल्पलाइन', name_english: 'Women Helpline', number: '181', icon: 'woman', color: Colors.pink },
    { name_hindi: 'एम्बुलेंस', name_english: 'Ambulance', number: '108', icon: 'medkit', color: Colors.red },
    { name_hindi: 'कानूनी सहायता', name_english: 'Legal Aid', number: '15112', icon: 'call', color: Colors.green },
    { name_hindi: 'बाल हेल्पलाइन', name_english: 'Child Helpline', number: '1098', icon: 'people', color: Colors.saffron },
    { name_hindi: 'उपभोक्ता हेल्पलाइन', name_english: 'Consumer Helpline', number: '1800-11-4000', icon: 'cart', color: Colors.purple },
    { name_hindi: 'साइबर क्राइम', name_english: 'Cyber Crime', number: '1930', icon: 'laptop', color: Colors.lightBlue },
    { name_hindi: 'रोड एक्सीडेंट', name_english: 'Road Accident', number: '1073', icon: 'car', color: Colors.brown },
  ];



  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {getText('अधिक विकल्प', 'More Options')}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{ marginRight: 16 }} onPress={toggleTheme}>
              <Text style={{ fontSize: 22 }}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.langToggle}
              onPress={() => setLanguage(language === 'hindi' ? 'english' : 'hindi')}
            >
              <Text style={styles.langText}>{language === 'hindi' ? 'EN' : 'हि'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tools Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="apps" size={24} color={Colors.deepBlue} />
            <Text style={styles.sectionTitle}>
              {getText('टूल्स', 'Legal Tools')}
            </Text>
          </View>
          <View style={styles.menuList}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/doc-generator')}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="qr-code-outline" size={24} color={Colors.purple} />
                <Text style={styles.menuItemText}>
                  {getText('डॉक्यूमेंट जनरेटर', 'Document Generator')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/doc-scanner')}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="scan-outline" size={24} color={Colors.lightBlue} />
                <Text style={styles.menuItemText}>
                  {getText('डॉक्यूमेंट स्कैनर', 'Document Scanner')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Numbers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call" size={24} color={Colors.red} />
            <Text style={styles.sectionTitle}>
              {getText('हेल्पलाइन नंबर', 'Helplines')}
            </Text>
          </View>
          <View style={styles.emergencyGrid}>
            {emergencyNumbers.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.emergencyCard}
                onPress={() => callNumber(item.number)}
              >
                <View style={[styles.emergencyIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={`${item.icon}-outline` as any} size={22} color={Colors.white} />
                </View>
                <Text style={styles.emergencyNumber}>{item.number}</Text>
                <Text style={styles.emergencyName}>
                  {getText(item.name_hindi, item.name_english)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <View style={styles.menuList}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/profile')}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
                <Text style={styles.menuItemText}>
                  {getText('सेटिंग्स', 'Settings')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.deepBlue,
  },
  langToggle: {
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  langText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    backgroundColor: Colors.white,
    marginTop: 12,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  emergencyCard: {
    width: '23%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  emergencyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  emergencyName: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  comingSoonList: {
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 12,
  },
  comingSoonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
  },
  comingSoonIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  comingSoonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  comingSoonBadge: {
    backgroundColor: Colors.saffron,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },
  menuList: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  appLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    ...Platform.select({
      web: { boxShadow: `0px 4px 8px ${Colors.saffron}4D` },
      default: {
        shadowColor: Colors.saffron,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      }
    }),
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.deepBlue,
  },
  appTagline: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  appVersion: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 8,
  },
  tricolor: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  madeIn: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
});
