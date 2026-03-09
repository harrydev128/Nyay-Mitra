import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { rightsAPI } from '../../services/api';

interface RightsDetail {
  id: string;
  category_id: string;
  title_hindi: string;
  title_english: string;
  content_hindi: string;
  content_english: string;
  steps_hindi: string[];
  steps_english: string[];
  emergency_contacts: { name: string; number: string }[];
  legal_sections: string[];
}

export default function RightsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const [detail, setDetail] = useState<RightsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    try {
      const data = await rightsAPI.getDetail(id!);
      setDetail(data);
    } catch (error) {
      console.log('Error loading detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getText = (hindi: string, english: string) => {
    return language === 'hindi' ? hindi : english;
  };

  const getList = (hindi: string[], english: string[]) => {
    return language === 'hindi' ? hindi : english;
  };

  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.saffron} />
        </View>
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.red} />
          <Text style={styles.errorText}>
            {getText('जानकारी नहीं मिली', 'Information not found')}
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>
              {getText('वापस जाएं', 'Go Back')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {getText(detail.title_hindi, detail.title_english)}
        </Text>
        <TouchableOpacity
          style={styles.langToggle}
          onPress={() => setLanguage(language === 'hindi' ? 'english' : 'hindi')}
        >
          <Text style={styles.langText}>
            {language === 'hindi' ? 'EN' : 'हि'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Content */}
        <View style={styles.contentSection}>
          <View style={styles.titleBadge}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.white} />
            <Text style={styles.titleBadgeText}>
              {getText('आपके अधिकार', 'Your Rights')}
            </Text>
          </View>
          <Text style={styles.contentText}>
            {getText(detail.content_hindi, detail.content_english)}
          </Text>
        </View>

        {/* Steps */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>
            {getText('क्या करें - स्टेप बाय स्टेप', 'What to Do - Step by Step')}
          </Text>
          {getList(detail.steps_hindi, detail.steps_english).map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Emergency Contacts */}
        {detail.emergency_contacts && detail.emergency_contacts.length > 0 && (
          <View style={styles.contactsSection}>
            <Text style={styles.sectionTitle}>
              {getText('आपातकालीन नंबर', 'Emergency Numbers')}
            </Text>
            <View style={styles.contactsGrid}>
              {detail.emergency_contacts.map((contact, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.contactCard}
                  onPress={() => callNumber(contact.number)}
                >
                  <Ionicons name="call" size={20} color={Colors.white} />
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                  <Text style={styles.contactName}>{contact.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Legal Sections */}
        {detail.legal_sections && detail.legal_sections.length > 0 && (
          <View style={styles.legalSection}>
            <Text style={styles.sectionTitle}>
              {getText('संबंधित कानून', 'Related Laws')}
            </Text>
            <View style={styles.legalList}>
              {detail.legal_sections.map((section, index) => (
                <View key={index} style={styles.legalItem}>
                  <Ionicons name="document-text" size={16} color={Colors.deepBlue} />
                  <Text style={styles.legalText}>{section}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* AI Help CTA */}
        <View style={styles.aiHelpSection}>
          <View style={styles.aiHelpContent}>
            <Ionicons name="chatbubbles" size={32} color={Colors.white} />
            <View style={styles.aiHelpText}>
              <Text style={styles.aiHelpTitle}>
                {getText('और सवाल हैं?', 'Have More Questions?')}
              </Text>
              <Text style={styles.aiHelpSubtitle}>
                {getText('AI वकील से पूछें - 24/7 उपलब्ध', 'Ask AI Lawyer - Available 24/7')}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.aiHelpButton}
            onPress={() => router.push('/chat')}
          >
            <Text style={styles.aiHelpButtonText}>
              {getText('अभी पूछें', 'Ask Now')}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.saffron} />
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle" size={16} color={Colors.textSecondary} />
          <Text style={styles.disclaimerText}>
            {getText(
              'यह सामान्य जानकारी है। गंभीर मामलों में वकील से सलाह अवश्य लें।',
              'This is general information. Always consult a lawyer for serious matters.'
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 12,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.saffron,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backArrow: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  langToggle: {
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  langText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  contentSection: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 12,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.saffron,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 16,
  },
  titleBadgeText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  contentText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  stepsSection: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.saffron,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  contactsSection: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 12,
  },
  contactsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactCard: {
    backgroundColor: Colors.green,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
    flex: 1,
  },
  contactNumber: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  contactName: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 4,
  },
  legalSection: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 12,
  },
  legalList: {
    gap: 12,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  legalText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  aiHelpSection: {
    backgroundColor: Colors.deepBlue,
    margin: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
  },
  aiHelpContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  aiHelpText: {
    flex: 1,
  },
  aiHelpTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  aiHelpSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 4,
  },
  aiHelpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  aiHelpButtonText: {
    color: Colors.saffron,
    fontWeight: '600',
    fontSize: 15,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
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
