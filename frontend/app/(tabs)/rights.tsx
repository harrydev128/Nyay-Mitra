import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { rightsAPI } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

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
};

export default function RightsScreen() {
  const router = useRouter();
  const { language, setLanguage } = useAppContext();
  const [categories, setCategories] = useState<RightsCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await rightsAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.log('Error loading categories:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCategories();
  };

  const getText = (hindi: string, english: string) => {
    return language === 'hindi' ? hindi : english;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.saffron} />
          <Text style={styles.loadingText}>
            {getText('लोड हो रहा है...', 'Loading...')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {getText('अपने अधिकार जानें', 'Know Your Rights')}
          </Text>
          <Text style={styles.headerSubtitle}>
            {getText('50+ स्थितियों में आपके कानूनी अधिकार', 'Your legal rights in 50+ situations')}
          </Text>
        </View>
      </View>

      {/* Search Prompt */}
      <TouchableOpacity
        style={styles.searchPrompt}
        onPress={() => router.push('/chat')}
      >
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
        <Text style={styles.searchPromptText}>
          {getText('AI से अपना सवाल पूछें...', 'Ask AI your question...')}
        </Text>
        <Ionicons name="mic" size={20} color={Colors.saffron} />
      </TouchableOpacity>

      {/* Categories Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.saffron]}
          />
        }
      >
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => router.push(`/rights/${category.id}`)}
              activeOpacity={0.7}
            >
              <View style={[styles.categoryIconBg, { backgroundColor: category.color }]}>
                <Ionicons
                  name={ICON_MAP[category.icon] || 'help-circle'}
                  size={32}
                  color={Colors.white}
                />
              </View>
              <Text style={styles.categoryTitle} numberOfLines={2}>
                {getText(category.name_hindi, category.name_english)}
              </Text>
              <Text style={styles.categoryDesc} numberOfLines={3}>
                {getText(category.description_hindi, category.description_english)}
              </Text>
              <View style={styles.categoryArrow}>
                <Ionicons name="chevron-forward" size={20} color={category.color} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.infoIconBg}>
            <Ionicons name="information-circle" size={24} color={Colors.white} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              {getText('अपने अधिकारों के लिए लड़ें', 'Fight for Your Rights')}
            </Text>
            <Text style={styles.infoText}>
              {getText(
                'यह जानकारी भारतीय कानून पर आधारित है। गंभीर मामलों में वकील से सलाह अवश्य लें।',
                'This information is based on Indian law. Always consult a lawyer for serious matters.'
              )}
            </Text>
          </View>
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  searchPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 12,
  },
  searchPromptText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
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
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  categoryDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  categoryArrow: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.deepBlue,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    gap: 12,
  },
  infoIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
});
