import { useAppContext } from '../../context/AppContext';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors } from '../../constants/colors';
import { rightsAPI } from '../../services/api';

interface RightsDetail {
  id: string;
  category_id: string;
  title_hindi: string;
  title_english: string;
  content_hindi: string;
  content_english: string;
  key_rights_hindi?: string[];
  key_rights_english?: string[];
  action_steps_hindi?: string[];
  action_steps_english?: string[];
  steps_hindi: string[];
  steps_english: string[];
  emergency_contacts: { name: string; number: string }[];
  legal_sections: string[];
}

export default function RightsDetailScreen() {
  const { theme, toggleTheme } = useAppContext();
  const Colors = theme === 'dark' ? DarkColors : LightColors;
  const styles = getStyles(Colors, theme);
  const isDark = theme === 'dark';

  // Dark mode color variables
  const textPrimary = isDark ? '#FFFFFF' : '#1a237e';
  const textSecondary = isDark ? '#CCCCCC' : '#555555';
  const textBody = isDark ? '#EEEEEE' : '#333333';
  const sectionBg = isDark ? '#1B2B3B' : '#F8F9FA';
  const cardBg = isDark ? '#243447' : '#FFFFFF';
  const pageBg = isDark ? '#0D1B2A' : '#F5F5F5';
  const dividerColor = isDark ? '#2A3F55' : '#E0E0E0';

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const [detail, setDetail] = useState<RightsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getText = useCallback((hindi: string, english: string) => language === 'hi' ? hindi : english, [language]);

  const loadDetail = useCallback(async () => {
    try {
      const data = await rightsAPI.getDetail(id!);
      setDetail(data);
    } catch { } finally {
      setIsLoading(false);
    }
  }, [id]);

  const checkBookmark = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('bookmarks');
      if (data) {
        const bookmarks = JSON.parse(data);
        setIsBookmarked(bookmarks.some((b: any) => b.id === id));
      }
    } catch { }
  }, [id]);

  const trackRightView = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('nyaymitra_stats');
      const stats = data ? JSON.parse(data) : { aiQuestions: 0, docsGenerated: 0, rightsViewed: 0 };
      stats.rightsViewed = (stats.rightsViewed || 0) + 1;
      await AsyncStorage.setItem('nyaymitra_stats', JSON.stringify(stats));
    } catch { }
  }, []);

  useEffect(() => {
    loadDetail();
    checkBookmark();
    trackRightView();
  }, [id, loadDetail, checkBookmark, trackRightView]);

  const toggleBookmark = async () => {
    if (!detail) return;
    try {
      const data = await AsyncStorage.getItem('bookmarks');
      let bookmarks = data ? JSON.parse(data) : [];
      if (isBookmarked) {
        bookmarks = bookmarks.filter((b: any) => b.id !== id);
        setIsBookmarked(false);
        Alert.alert('', getText('हटाया गया', 'Removed'));
      } else {
        bookmarks.push({
          id: id,
          name: getText(detail.title_hindi, detail.title_english),
          savedAt: new Date().toISOString(),
        });
        setIsBookmarked(true);
        Alert.alert('', getText('सेव किया गया 🔖', 'Saved 🔖'));
      }
      await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    } catch { }
  };

  const handleShare = async () => {
    if (!detail) return;
    const message = `[${getText(detail.title_hindi, detail.title_english)}] के बारे में जानें! NyayMitra app पर: https://nyaymitra.app`;
    try {
      await Share.share({ message });
    } catch { }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: pageBg }]} edges={['top']}>
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={Colors.saffron} /></View>
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: pageBg }]} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.red} />
          <Text style={[styles.errorText, { color: textSecondary }]}>{getText('जानकारी नहीं मिली', 'Info not found')}</Text>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: Colors.saffron }]} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>{getText('वापस जाएं', 'Go Back')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getList = (hindi: string[], english: string[]) => language === 'hi' ? hindi : english;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: pageBg }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: dividerColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backArrow}>
          <Ionicons name="arrow-back" size={24} color={textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textPrimary }]} numberOfLines={1}>{getText(detail.title_hindi, detail.title_english)}</Text>
        <TouchableOpacity style={{ marginRight: 16 }} onPress={toggleTheme}>
          <Text style={{ fontSize: 22 }}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.langToggle, { backgroundColor: Colors.deepBlue }]} onPress={() => setLanguage(language === 'hi' ? 'english' : 'hi')}>
          <Text style={styles.langText}>{language === 'hi' ? 'EN' : 'हि'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkButton} onPress={toggleBookmark}>
          <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color={isBookmarked ? Colors.saffron : textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share" size={20} color={Colors.saffron} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.contentSection, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>{getText('विवरण', 'Description')}</Text>
          <Text style={[styles.contentText, { color: textBody }]}>{getText(detail.content_hindi, detail.content_english)}</Text>
        </View>

        {detail.key_rights_hindi && (
          <View style={[styles.contentSection, { backgroundColor: cardBg }]}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>{getText('मुख्य अधिकार', 'Key Rights')}</Text>
            {getList(detail.key_rights_hindi, detail.key_rights_english || []).map((right, i) => (
              <View key={i} style={styles.listItem}><Text style={[styles.bullet, { color: Colors.saffron }]}>•</Text><Text style={[styles.listText, { color: textBody }]}>{right}</Text></View>
            ))}
          </View>
        )}

        <View style={[styles.actionSection, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>{getText('आप क्या कर सकते हैं?', 'What can you do?')}</Text>
          {getList(detail.action_steps_hindi || [], detail.action_steps_english || []).map((step, i) => (
            <View key={i} style={styles.actionItem}>
              <View style={[styles.actionNumber, { backgroundColor: Colors.saffron }]}><Text style={styles.actionNumberText}>{i + 1}</Text></View>
              <Text style={[styles.actionText, { color: textBody }]}>{step}</Text>
            </View>
          ))}
        </View>

        {detail.emergency_contacts && detail.emergency_contacts.length > 0 && (
          <View style={[styles.contactsSection, { backgroundColor: cardBg }]}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>{getText('हेल्पलाइन', 'Helpline')}</Text>
            <View style={styles.contactsGrid}>
              {detail.emergency_contacts.map((contact, i) => (
                <TouchableOpacity key={i} style={[styles.contactCard, { backgroundColor: Colors.green }]} onPress={() => Linking.openURL(`tel:${contact.number}`)}>
                  <Ionicons name="call" size={20} color="#fff" />
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                  <Text style={styles.contactName}>{contact.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.aiHelpSection, { backgroundColor: Colors.deepBlue }]}>
          <View style={styles.aiHelpContent}>
            <Ionicons name="chatbubbles" size={32} color="#fff" />
            <View style={styles.aiHelpText}>
              <Text style={styles.aiHelpTitle}>{getText('और सवाल हैं?', 'Have More Questions?')}</Text>
              <Text style={styles.aiHelpSubtitle}>{getText('AI वकील से पूछें', 'Ask AI Lawyer')}</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.aiHelpButton, { backgroundColor: cardBg }]} onPress={() => router.push('/chat')}>
            <Text style={[styles.aiHelpButtonText, { color: Colors.saffron }]}>{getText('अभी पूछें', 'Ask Now')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (Colors: any, theme: string) => StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700' },
  backArrow: { padding: 8, marginRight: 8 },
  langToggle: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  langText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  bookmarkButton: { padding: 8, marginLeft: 8 },
  shareButton: { padding: 8 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, marginTop: 12, marginBottom: 20 },
  backButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  backButtonText: { color: '#fff', fontWeight: '600' },
  contentSection: { padding: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 16 },
  contentText: { fontSize: 15, lineHeight: 24 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bullet: { fontSize: 16, marginRight: 8 },
  listText: { flex: 1, fontSize: 14, lineHeight: 20 },
  actionSection: { padding: 20, marginBottom: 12 },
  actionItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  actionNumber: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  actionNumberText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  actionText: { flex: 1, fontSize: 14, lineHeight: 20 },
  contactsSection: { padding: 20, marginBottom: 12 },
  contactsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  contactCard: { borderRadius: 12, padding: 16, alignItems: 'center', flex: 1, minWidth: 100 },
  contactNumber: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginTop: 8 },
  contactName: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 },
  aiHelpSection: { margin: 20, borderRadius: 16, padding: 20 },
  aiHelpContent: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  aiHelpText: { flex: 1 },
  aiHelpTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  aiHelpSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },
  aiHelpButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8 },
  aiHelpButtonText: { fontWeight: '600', fontSize: 15 },
});
