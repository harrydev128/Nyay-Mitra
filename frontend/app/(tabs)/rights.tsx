import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Platform,
  Animated,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LightColors, DarkColors } from '../../constants/colors';
import { LightColors as Colors } from "../../constants/colors";
import { rightsAPI } from '../../services/api';
import { useAppContext } from '../../context/AppContext';
import AdBanner from '../../components/AdBanner';

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
  'briefcase': 'briefcase',
  'shield': 'shield',
  'car': 'car',
  'home': 'home',
  'shopping-cart': 'cart',
  'building': 'business',
  'female': 'woman',
  'landmark': 'document-text',
  'people': 'people',
  'document-text': 'document-text',
  'laptop': 'laptop',
  'heart': 'heart',
  'document': 'document',
  'person': 'person',
  'accessibility': 'accessibility',
  'book': 'book',
  'medical': 'medical',
  'restaurant': 'restaurant',
  'leaf': 'leaf',
  'how-to-vote': 'checkbox',
  'shield-checkmark': 'shield-checkmark',
  'eye': 'eye',
  'lock-closed': 'lock-closed',
  'card': 'card',
  'receipt': 'receipt',
  'construct': 'build',
  'cash': 'cash',
  'woman': 'woman',
  'church': 'home',
  'newspaper': 'document-text',
  'globe': 'globe',
  'school': 'school',
  'paw': 'paw',
  'wifi': 'wifi',
};

const CATEGORIES = ["सभी", "नागरिक", "आपराधिक", "परिवार", "उपभोक्ता", "श्रम", "संपत्ति"];

const RIGHTS_MAP: Record<string, string> = {
  'rti_rights': 'नागरिक', 'voter_rights': 'नागरिक', 'privacy_rights': 'नागरिक',
  'religious_rights': 'नागरिक', 'media_rights': 'नागरिक', 'nri_rights': 'नागरिक',
  'internet_rights': 'नागरिक', 'refugee_rights': 'नागरिक',
  'police_arrest': 'आपराधिक', 'bail_rights': 'आपराधिक', 'fir_rights': 'आपराधिक',
  'witness_rights': 'आपराधिक', 'prisoner_rights': 'आपराधिक', 'cyber_crime': 'आपराधिक',
  'women_rights': 'परिवार', 'child_rights': 'परिवार', 'marriage_rights': 'परिवार',
  'divorce_rights': 'परिवार', 'senior_citizen': 'परिवार', 'domestic_violence': 'परिवार',
  'maternity_rights': 'परिवार',
  'consumer_rights': 'उपभोक्ता', 'banking_rights': 'उपभोक्ता', 'insurance_rights': 'उपभोक्ता',
  'food_security': 'उपभोक्ता', 'health_rights': 'उपभोक्ता',
  'employee_rights': 'श्रम', 'minimum_wage': 'श्रम', 'labor_rights': 'श्रम',
  'agriculture_rights': 'श्रम', 'tribal_rights': 'श्रम', 'disability_rights': 'श्रम',
  'tenant_rights': 'संपत्ति', 'property_rights': 'संपत्ति', 'environment_rights': 'संपत्ति',
  'tax_rights': 'संपत्ति',
};

const debounce = (func: Function, delay: number) => {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const RightCard = React.memo(({ item, language, cardTitleColor, cardDescColor, cardBgColor, isBookmarked, onToggleBookmark, onPress, styles }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ width: '48%', opacity: fadeAnim }}>
      <Pressable
        style={({ pressed }) => [
          styles.categoryCard,
          { backgroundColor: cardBgColor },
          pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
        ]}
        onPress={() => onPress(item.id)}
      >
        <TouchableOpacity
          style={styles.bookmarkIcon}
          onPress={(e) => {
            e.stopPropagation();
            onToggleBookmark(item.id);
          }}
        >
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={20}
            color={isBookmarked ? "#FF6B00" : "#888888"}
          />
        </TouchableOpacity>
        <View style={[styles.categoryIconBg, { backgroundColor: item.color }]}>
          <Ionicons
            name={ICON_MAP[item.icon] || 'help-circle'}
            size={32}
            color={Colors.white}
          />
        </View>
        <Text style={[styles.categoryTitle, { color: cardTitleColor }]} numberOfLines={2}>
          {language === 'hindi' ? item.name_hindi : item.name_english}
        </Text>
        <Text style={[styles.categoryDesc, { color: cardDescColor }]} numberOfLines={3}>
          {language === 'hindi' ? item.description_hindi : item.description_english}
        </Text>
        <View style={styles.categoryArrow}>
          <Ionicons name="chevron-forward" size={20} color={item.color} />
        </View>
      </Pressable>
    </Animated.View>
  );
});
RightCard.displayName = 'RightCard';

export default function RightsScreen() {
  const { theme } = useAppContext();
  const Colors = theme === 'dark' ? DarkColors : LightColors;
  const styles = getStyles(Colors, theme);
  const isDark = theme === 'dark';

  // Dark mode color variables
  const cardTitleColor = isDark ? '#FFFFFF' : '#1a237e';
  const cardDescColor = isDark ? '#CCCCCC' : '#666666';
  const cardBgColor = isDark ? '#1B2B3B' : '#FFFFFF';
  const searchBarBg = isDark ? '#1B2B3B' : '#FFFFFF';
  const searchBarText = isDark ? '#FFFFFF' : '#333333';
  const searchBarPlaceholder = isDark ? '#888888' : '#999999';
  const textPrimary = isDark ? '#FFFFFF' : '#1a237e';
  const textSecondary = isDark ? '#CCCCCC' : '#555555';
  const cardBg = isDark ? '#243447' : '#FFFFFF';
  const pageBg = isDark ? '#0D1B2A' : '#F5F5F5';
  const dividerColor = isDark ? '#2A3F55' : '#E0E0E0';
  const tabInactiveBg = isDark ? '#1E293B' : '#f1f5f9';

  const router = useRouter();
  const { language } = useAppContext();
  const [categories, setCategories] = useState<RightsCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayQuery, setDisplayQuery] = useState('');
  const [activeTab, setActiveTab] = useState('सभी');
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const incrementRightsCount = useCallback(async () => {
    try {
      const statsStr = await AsyncStorage.getItem('stats_rights_count');
      const count = parseInt(statsStr || '0') + 1;
      await AsyncStorage.setItem('stats_rights_count', count.toString());
    } catch {
      // ignore
    }
  }, []);

  const loadBookmarks = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('bookmarks');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await rightsAPI.getCategories();
      setCategories(data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    await Promise.all([loadCategories(), loadBookmarks(), incrementRightsCount()]);
  }, [loadCategories, loadBookmarks, incrementRightsCount]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const toggleBookmark = useCallback(async (id: string) => {
    try {
      setBookmarks(prev => {
        const next = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
        AsyncStorage.setItem('bookmarks', JSON.stringify(next));
        return next;
      });
    } catch {
      // ignore
    }
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((text: string) => setSearchQuery(text), 300),
    []
  );

  const handleSearch = (text: string) => {
    setDisplayQuery(text);
    debouncedSearch(text);
  };

  const filteredCategories = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return categories.filter(category => {
      const matchesSearch = !searchQuery.trim() ||
        category.name_hindi.toLowerCase().includes(searchLower) ||
        category.name_english.toLowerCase().includes(searchLower) ||
        category.description_hindi.toLowerCase().includes(searchLower) ||
        category.description_english.toLowerCase().includes(searchLower);

      const matchesTab = activeTab === "सभी" || RIGHTS_MAP[category.id] === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [categories, searchQuery, activeTab]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCategories();
  }, [loadCategories]);

  const getText = (hindi: string, english: string) => language === 'hindi' ? hindi : english;

  const renderRightItem = useCallback(({ item }: { item: RightsCategory }) => (
    <RightCard
      item={item}
      language={language}
      cardTitleColor={cardTitleColor}
      cardDescColor={cardDescColor}
      cardBgColor={cardBgColor}
      isBookmarked={bookmarks.includes(item.id)}
      onToggleBookmark={toggleBookmark}
      onPress={(id: string) => router.push(`/rights/${id}`)}
      styles={styles}
    />
  ), [language, cardTitleColor, cardDescColor, cardBgColor, bookmarks, toggleBookmark, router, styles]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: pageBg }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.saffron} />
          <Text style={[styles.loadingText, { color: textSecondary }]}>{getText('लोड हो रहा है...', 'Loading...')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: pageBg }]} edges={['top']}>
      <FlatList
        data={filteredCategories}
        renderItem={renderRightItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.scrollContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={8}
        ListHeaderComponent={
          <>
            <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: dividerColor }]}>
              <View>
                <Text style={[styles.headerTitle, { color: textPrimary }]}>{getText('अपने अधिकार जानें', 'Know Your Rights')}</Text>
                <Text style={[styles.headerSubtitle, { color: textSecondary }]}>{getText('40+ कानूनी अधिकार', '40+ Legal Rights')}</Text>
              </View>
            </View>

            <View style={[styles.searchContainer, { backgroundColor: cardBgColor, borderBottomColor: isDark ? '#2A3F55' : '#E0E0E0' }]}>
              <View style={[styles.searchInputContainer, { backgroundColor: searchBarBg }]}>
                <Ionicons name="search" size={20} color={searchBarPlaceholder} style={styles.searchIcon} />
                <TextInput
                  style={[styles.searchInput, { color: searchBarText }]}
                  placeholder={getText('अधिकार खोजें...', 'Search rights...')}
                  value={displayQuery}
                  onChangeText={handleSearch}
                  placeholderTextColor={searchBarPlaceholder}
                />
              </View>
            </View>

            <View style={[styles.tabsWrapper, { backgroundColor: cardBg, borderBottomColor: dividerColor }]}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={CATEGORIES}
                keyExtractor={item => item}
                renderItem={({ item: tab }) => (
                  <TouchableOpacity
                    style={[styles.tab, activeTab === tab && styles.activeTab, { backgroundColor: activeTab === tab ? Colors.saffron : tabInactiveBg }]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText, { color: activeTab === tab ? Colors.white : textSecondary }]}>{tab}</Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.tabsContainer}
              />
            </View>
          </>
        }
        ListFooterComponent={
          <>
            <View style={[styles.infoBanner, { backgroundColor: Colors.deepBlue }]}>
              <View style={styles.infoIconBg}>
                <Ionicons name="information-circle" size={24} color={Colors.white} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>{getText('अपने अधिकारों के लिए लड़ें', 'Fight for Your Rights')}</Text>
                <Text style={styles.infoText}>
                  {getText(
                    'यह जानकारी भारतीय कानून पर आधारित है। गंभीर मामलों में वकील से सलाह अवश्य लें।',
                    'This information is based on Indian law. Always consult a lawyer for serious matters.'
                  )}
                </Text>
              </View>
            </View>
            <AdBanner />
            <View style={{ height: 40 }} />
          </>
        }
        ListEmptyComponent={
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundEmoji}>🔍</Text>
            <Text style={[styles.notFoundText, { color: textSecondary }]}>
              {getText('कोई अधिकार नहीं मिला। दूसरे शब्द आज़माएं।', 'No rights found. Try different words.')}
            </Text>
            <TouchableOpacity style={[styles.resetButton, { backgroundColor: Colors.saffron }]} onPress={() => { setSearchQuery(''); setDisplayQuery(''); setActiveTab('सभी'); }}>
              <Text style={[styles.resetButtonText, { color: Colors.white }]}>{getText('सब दिखाएं', 'Show All')}</Text>
            </TouchableOpacity>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.saffron]} />
        }
      />
    </SafeAreaView>
  );
}

const getStyles = (Colors: any, theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
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
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#1E293B' : '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  tabsWrapper: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme === 'dark' ? '#1E293B' : '#f1f5f9',
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: Colors.saffron,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  categoryCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIconBg: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  categoryArrow: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 5,
    padding: 4,
  },
  notFoundContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    width: '100%',
  },
  notFoundEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: Colors.saffron,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.deepBlue,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 10,
    marginTop: 20,
    gap: 12,
  },
  infoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
  },
});
