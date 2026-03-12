import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { rightsAPI } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

const { width } = Dimensions.get('window');

interface RightsCategory {
  id: string;
  name_hindi: string;
  name_english: string;
  icon: string;
  description_hindi: string;
  description_english: string;
  color: string;
}

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  'briefcase': 'briefcase-outline',
  'shield': 'shield-outline',
  'car': 'car-outline',
  'home': 'home-outline',
  'shopping-cart': 'cart-outline',
  'building': 'business-outline',
  'female': 'woman-outline',
  'landmark': 'document-text-outline',
};

export default function HomeScreen() {
  const router = useRouter();
  const { language, setLanguage } = useAppContext();
  const [categories, setCategories] = useState<RightsCategory[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await rightsAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.log('Error loading categories:', error);
    }
  };

  const getText = (hindi: string, english: string) => {
    return language === 'hindi' ? hindi : english;
  };

  const quickActions = [
    {
      icon: 'chatbubbles' as const,
      title_hindi: 'AI वकील',
      title_english: 'AI Lawyer',
      color: Colors.saffron,
      route: '/chat',
    },
    {
      icon: 'shield-checkmark' as const,
      title_hindi: 'अधिकार जानें',
      title_english: 'Know Rights',
      color: Colors.deepBlue,
      route: '/rights',
    },
    {
      icon: 'document-text' as const,
      title_hindi: 'FIR सहायता',
      title_english: 'FIR Helper',
      color: Colors.green,
      route: '/chat',
    },
    {
      icon: 'call' as const,
      title_hindi: 'हेल्पलाइन',
      title_english: 'Helplines',
      color: Colors.red,
      route: '/more',
    },
  ];



  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Language Toggle */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>NyayMitra</Text>
            <Text style={styles.tagline}>
              {getText('हर भारतीय का पॉकेट वकील', "Every Indian's Pocket Lawyer")}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.langToggle}
            onPress={() => setLanguage(language === 'hindi' ? 'english' : 'hindi')}
          >
            <Text style={styles.langText}>
              {language === 'hindi' ? 'EN' : 'हि'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <Ionicons name="shield-checkmark" size={48} color={Colors.white} />
              <Text style={styles.heroTitle}>
                {getText('कानूनी मदद अब आपकी जेब में', 'Legal Help Now In Your Pocket')}
              </Text>
              <Text style={styles.heroSubtitle}>
                {getText(
                  '24/7 AI कानूनी सहायक • हिंदी में बात करें',
                  '24/7 AI Legal Assistant • Talk in Hindi'
                )}
              </Text>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => router.push('/chat')}
              >
                <Text style={styles.heroButtonText}>
                  {getText('अभी मदद लें', 'Get Help Now')}
                </Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.saffron} />
              </TouchableOpacity>
            </View>
          </View>
          {/* Tricolor Strip */}
          <View style={styles.tricolorStrip}>
            <View style={[styles.colorBar, { backgroundColor: Colors.saffron }]} />
            <View style={[styles.colorBar, { backgroundColor: Colors.white }]} />
            <View style={[styles.colorBar, { backgroundColor: Colors.green }]} />
          </View>
        </View>

        {/* Quick Actions / Main Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getText('मुख्य सेवाएं', 'Core Services')}
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionCard}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon} size={24} color={Colors.white} />
                </View>
                <Text style={styles.quickActionText} numberOfLines={2}>
                  {getText(action.title_hindi, action.title_english)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Helplines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getText('आपातकालीन हेल्पलाइन', 'Emergency Helplines')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.helplineScroll}
          >
            {[
              { name: getText('पुलिस', 'Police'), number: '112', icon: 'shield' },
              { name: getText('महिला', 'Women'), number: '181', icon: 'woman' },
              { name: getText('एम्बुलेंस', 'Ambulance'), number: '108', icon: 'medkit' },
              { name: getText('कानूनी मदद', 'Legal Aid'), number: '15112', icon: 'call' },
              { name: getText('चाइल्ड', 'Child'), number: '1098', icon: 'people' },
              { name: getText('उपभोक्ता', 'Consumer'), number: '1800-11-4000', icon: 'cart' },
              { name: getText('साइबर', 'Cyber'), number: '1930', icon: 'laptop' },
              { name: getText('सड़क', 'Road'), number: '1073', icon: 'car' },
            ].map((helpline, index) => (
              <TouchableOpacity key={index} style={styles.helplineCard}>
                <Ionicons
                  name={`${helpline.icon}-outline` as any}
                  size={20}
                  color={Colors.red}
                />
                <Text style={styles.helplineNumber}>{helpline.number}</Text>
                <Text style={styles.helplineName}>{helpline.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Know Your Rights Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoPadding}>
              {getText('अपने अधिकार जानें', 'Know Your Rights')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/rights')}>
              <Text style={styles.seeAllText}>
                {getText('सभी देखें', 'See All')}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rightsScroll}
          >
            {categories.length > 0 ? (
              categories.slice(0, 5).map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.rightsCard}
                  onPress={() => router.push(`/rights/${category.id}`)}
                >
                  <View style={[styles.rightsIconBg, { backgroundColor: category.color }]}>
                    <Ionicons
                      name={ICON_MAP[category.icon] || 'help-circle-outline'}
                      size={28}
                      color={Colors.white}
                    />
                  </View>
                  <Text style={styles.rightsCardTitle} numberOfLines={2}>
                    {getText(category.name_hindi, category.name_english)}
                  </Text>
                  <Text style={styles.rightsCardDesc} numberOfLines={2}>
                    {getText(category.description_hindi, category.description_english)}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.placeholderCard}>
                <Text style={styles.placeholderText}>
                  {getText('लोड हो रहा है...', 'Loading...')}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>



        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.disclaimerText}>
            {getText(
              'यह ऐप सामान्य कानूनी जानकारी प्रदान करता है। गंभीर मामलों में वकील से सलाह लें।',
              'This app provides general legal information. Consult a lawyer for serious matters.'
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.deepBlue,
  },
  tagline: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  langToggle: {
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  langText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  heroSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.saffron,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  heroGradient: {
    backgroundColor: Colors.deepBlue,
    padding: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginTop: 12,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.saffron,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    gap: 8,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  tricolorStrip: {
    flexDirection: 'row',
    height: 6,
  },
  colorBar: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleNoPadding: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.saffron,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  quickActionCard: {
    width: (width - 48) / 2,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  rightsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  rightsCard: {
    width: 160,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rightsIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  rightsCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  rightsCardDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  placeholderCard: {
    width: width - 40,
    padding: 20,
    alignItems: 'center',
  },
  placeholderText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  helplineScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  helplineCard: {
    width: 112,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  helplineNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.red,
    marginTop: 6,
  },
  helplineName: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  comingSoonGrid: {
    paddingHorizontal: 20,
    gap: 10,
  },
  comingSoonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  comingSoonIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  comingSoonContent: {
    flex: 1,
  },
  comingSoonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  comingSoonBadge: {
    backgroundColor: Colors.background,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  comingSoonBadgeText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.saffron,
    gap: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
