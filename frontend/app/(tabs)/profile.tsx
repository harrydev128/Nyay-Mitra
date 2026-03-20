import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors } from '../../constants/colors';
import { useAppContext } from '../../context/AppContext';

interface Stats {
  aiQuestions: number;
  docsGenerated: number;
  rightsViewed: number;
}

export default function ProfileScreen() {
  const { theme, toggleTheme } = useAppContext();
  const Colors = theme === 'dark' ? DarkColors : LightColors;
  const styles = getStyles(Colors, theme);
  const isDark = theme === 'dark';
  const router = useRouter();
  const { language, setLanguage, user, isPremium, logout } = useAppContext();

  // Dark mode color variables
  const bg = isDark ? '#0D1B2A' : '#F5F5F5';
  const cardBg = isDark ? '#1B2B3B' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a237e';
  const subText = isDark ? '#AABBCC' : '#666666';
  const borderColor = isDark ? '#2A3F55' : '#E0E0E0';

  const [referralCount, setReferralCount] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState<Stats>({ aiQuestions: 0, docsGenerated: 0, rightsViewed: 0 });
  const [premiumDaysLeft, setPremiumDaysLeft] = useState(0);

  const getText = (hindi: string, english: string) => language === 'hi' ? hindi : english;

  const loadProfileData = useCallback(async () => {
    try {
      const refData = await AsyncStorage.getItem('referral_data');
      if (refData) {
        const parsed = JSON.parse(refData);
        setReferralCount(parsed.referralCount || 0);
        setReferralCode(parsed.myCode || user?.referralCode || '');
      } else {
        setReferralCode(user?.referralCode || '');
      }

      const aiCount = await AsyncStorage.getItem('stats_ai_count');
      const docsCount = await AsyncStorage.getItem('stats_docs_count');
      const rightsCount = await AsyncStorage.getItem('stats_rights_count');

      setStats({
        aiQuestions: parseInt(aiCount || '0'),
        docsGenerated: parseInt(docsCount || '0'),
        rightsViewed: parseInt(rightsCount || '0')
      });

      if (user?.premiumExpiry) {
        const expiry = new Date(user.premiumExpiry);
        const diff = Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        setPremiumDaysLeft(Math.max(0, diff));
      }
    } catch { }
  }, [user]);

  useFocusEffect(useCallback(() => { loadProfileData(); }, [loadProfileData]));

  const handleLogout = async () => {
    Alert.alert(getText('लॉग आउट', 'Logout'), getText('क्या आप लॉग आउट करना चाहते हैं?', 'Do you want to log out?'), [
      { text: getText('नहीं', 'No'), style: 'cancel' },
      { text: getText('हां', 'Yes'), style: 'destructive', onPress: async () => { await logout(); router.replace('/auth/login' as any); } },
    ]);
  };

  const handleShareReferral = async () => {
    const code = referralCode || user?.referralCode || '';
    const message = `NyayMitra - भारत का AI वकील! \nमेरे code ${code} से join करो और 7 दिन FREE Premium पाओ।\nDownload: https://nyaymitra.app`;
    try { await Share.share({ message }); } catch { }
  };

  const profileCompletion = user ? Math.round(([user.name, user.email, user.referralCode].filter(Boolean).length / 3) * 100) : 0;

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top']}>
        <View style={styles.notLoggedIn}>
          <Ionicons name="person-circle-outline" size={80} color={Colors.textLight} />
          <Text style={[styles.notLoggedInText, { color: Colors.textSecondary }]}>{getText('लॉग इन करें', 'Please login')}</Text>
          <TouchableOpacity style={[styles.loginButton, { backgroundColor: Colors.saffron }]} onPress={() => router.push('/auth/login' as any)}>
            <Text style={styles.loginButtonText}>{getText('लॉग इन करें', 'Login')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: Colors.white, borderBottomColor: Colors.border }]}>
          <Text style={[styles.headerTitle, { color: Colors.deepBlue }]}>{getText('प्रोफ़ाइल', 'Profile')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{ marginRight: 16 }} onPress={toggleTheme}>
              <Text style={{ fontSize: 22 }}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.langToggle, { backgroundColor: Colors.deepBlue }]} onPress={() => setLanguage(language === 'hi' ? 'english' : 'hi')}>
              <Text style={styles.langText}>{language === 'hi' ? 'EN' : 'हि'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.userInfoCard, { backgroundColor: Colors.white }]}>
          <View style={styles.avatarSection}>
            <View style={[styles.progressRingOuter, { borderColor: Colors.saffron }]}>
              <Ionicons name="person-circle" size={56} color={Colors.deepBlue} />
            </View>
            <Text style={[styles.progressPercent, { color: Colors.saffron }]}>{profileCompletion}%</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: Colors.textPrimary }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: Colors.textSecondary }]}>{user.email}</Text>
            <View style={[styles.planBadge, isPremium ? { backgroundColor: Colors.saffron } : { backgroundColor: Colors.textLight }]}>
              <Text style={styles.badgeText}>{isPremium ? getText('प्रीमियम', 'Premium') : getText('मुफ्त', 'Free')}</Text>
            </View>
          </View>
        </View>

        {isPremium && premiumDaysLeft > 0 && (
          <View style={[styles.premiumCountdown, { backgroundColor: theme === 'dark' ? '#2A1A0A' : '#FFF3E0' }]}>
            <Ionicons name="diamond" size={20} color={Colors.saffron} />
            <Text style={[styles.premiumCountdownText, { color: Colors.saffron }]}>Silver: {premiumDaysLeft} {getText('दिन बाकी', 'days left')}</Text>
          </View>
        )}

        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>{getText('मेरी गतिविधि', 'My Activity')}</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: cardBg }]}><Ionicons name="chatbubbles" size={24} color={Colors.saffron} /><Text style={[styles.statNumber, { color: textColor }]}>{stats.aiQuestions}</Text><Text style={[styles.statLabel, { color: subText }]}>AI सवाल</Text></View>
            <View style={[styles.statCard, { backgroundColor: cardBg }]}><Ionicons name="document-text" size={24} color={Colors.deepBlue} /><Text style={[styles.statNumber, { color: textColor }]}>{stats.docsGenerated}</Text><Text style={[styles.statLabel, { color: subText }]}>डॉक्यूमेंट</Text></View>
            <View style={[styles.statCard, { backgroundColor: cardBg }]}><Ionicons name="shield-checkmark" size={24} color={Colors.green} /><Text style={[styles.statNumber, { color: textColor }]}>{stats.rightsViewed}</Text><Text style={[styles.statLabel, { color: subText }]}>अधिकार देखे</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>{getText('दोस्तों को Refer करें', 'Refer Friends')}</Text>
          <View style={[styles.referralCard, { backgroundColor: cardBg }]}>
            <View style={styles.referralHeader}>
              <Ionicons name="share-social" size={24} color={Colors.saffron} />
              <View style={styles.referralCodeContainer}>
                <Text style={[styles.referralLabel, { color: subText }]}>{getText('आपका कोड:', 'Your Code:')}</Text>
                <Text style={[styles.referralCode, { color: Colors.saffron, backgroundColor: Colors.background }]}>{referralCode || user.referralCode}</Text>
              </View>
            </View>
            <View style={styles.referralBtns}>
              <TouchableOpacity style={[styles.shareButton, { backgroundColor: Colors.saffron }]} onPress={handleShareReferral}><Ionicons name="share" size={18} color="#fff" /><Text style={styles.shareButtonText}>{getText('शेयर', 'Share')}</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/referral' as any)}><Text style={[styles.referralDetailText, { color: Colors.deepBlue }]}>{getText('विवरण →', 'Details →')}</Text></TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>{getText('प्रीमियम प्लान', 'Premium Plans')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {/* Silver Plan */}
            <View style={[styles.planCard, { borderColor: Colors.saffron, backgroundColor: cardBg, width: 280 }]}>
              <View style={styles.planHeader}><Text style={[styles.planName, { color: textColor }]}>SILVER</Text><Text style={[styles.planPrice, { color: subText }]}>₹49/mo</Text></View>
              <View style={styles.planFeatures}>
                {[getText('40+ श्रेणी-आधारित विस्तृत अधिकार','40+ Rights'), getText('अनलिमिटेड दस्तावेज तैयार करना','Unlimited documents'), getText('AI दस्तावेज स्कैनर एक्सेस','AI scanner'), getText('सभी हेल्पलाइन नंबर एक्सेस','All helplines'), getText('बुकमार्क सेव करने की सुविधा','Save bookmarks')].map((f, i) => (
                  <View key={i} style={styles.featureItem}><Ionicons name="checkmark-circle" size={16} color={Colors.saffron} /><Text style={[styles.featureText, { color: subText }]}>{f}</Text></View>
                ))}
              </View>
              <TouchableOpacity style={[styles.buyButton, { backgroundColor: Colors.saffron }]} onPress={() => router.push('/premium')}><Text style={styles.buyButtonText}>Buy Silver</Text></TouchableOpacity>
            </View>

            {/* Gold Plan */}
            <View style={[styles.planCard, { borderColor: Colors.gold, backgroundColor: cardBg, width: 280 }]}>
              <View style={styles.planHeader}><Text style={[styles.planName, { color: textColor }]}>GOLD</Text><Text style={[styles.planPrice, { color: subText }]}>₹149/mo</Text></View>
              <View style={styles.planFeatures}>
                {[getText('सिल्वर के सभी फीचर्स','All Silver features'), getText('वकील द्वारा दस्तावेज समीक्षा','Lawyer review'), getText('PDF डाउनलोड सुविधा','PDF download'), getText('स्टेप-बाय-स्टेप एक्शन प्लान','Action plan'), getText('प्रायोरिटी सपोर्ट','Priority support')].map((f, i) => (
                  <View key={i} style={styles.featureItem}><Ionicons name="checkmark-circle" size={16} color={Colors.gold} /><Text style={[styles.featureText, { color: subText }]}>{f}</Text></View>
                ))}
              </View>
              <TouchableOpacity style={[styles.buyButton, { backgroundColor: Colors.gold }]} onPress={() => router.push('/premium')}><Text style={styles.buyButtonText}>Buy Gold</Text></TouchableOpacity>
            </View>

            {/* Pro Plan */}
            <View style={[styles.planCard, { borderColor: Colors.deepBlue, backgroundColor: cardBg, width: 280 }]}>
              <View style={styles.planHeader}><Text style={[styles.planName, { color: textColor }]}>PRO</Text><Text style={[styles.planPrice, { color: subText }]}>₹499/mo</Text></View>
              <View style={styles.planFeatures}>
                {[getText('गोल्ड के सभी फीचर्स','All Gold features'), getText('1:1 वकील परामर्श','1:1 Lawyer consult'), getText('24/7 प्रायोरिटी सपोर्ट','24/7 Support'), getText('एडवांस्ड लीगल टेम्पलेट्स','Advanced templates'), getText('व्हाइट-लेबल दस्तावेज','White-label docs')].map((f, i) => (
                  <View key={i} style={styles.featureItem}><Ionicons name="checkmark-circle" size={16} color={Colors.deepBlue} /><Text style={[styles.featureText, { color: subText }]}>{f}</Text></View>
                ))}
              </View>
              <TouchableOpacity style={[styles.buyButton, { backgroundColor: Colors.deepBlue }]} onPress={() => router.push('/premium')}><Text style={styles.buyButtonText}>Buy Pro</Text></TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity style={[styles.logoutButton, { borderColor: borderColor, backgroundColor: cardBg }]} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={Colors.red} />
          <Text style={[styles.logoutText, { color: Colors.red }]}>{getText('लॉग आउट', 'Logout')}</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (Colors: any, theme: string) => StyleSheet.create({
  container: { flex: 1 },
  notLoggedIn: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  notLoggedInText: { textAlign: 'center', fontSize: 16, marginTop: 16 },
  loginButton: { paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12, marginTop: 20 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  langToggle: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  langText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  userInfoCard: { margin: 16, padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', elevation: 3, ...Platform.select({ web: { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 } }) },
  avatarSection: { marginRight: 16, alignItems: 'center' },
  progressRingOuter: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, justifyContent: 'center', alignItems: 'center' },
  progressPercent: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  userDetails: { flex: 1 },
  userName: { fontSize: 20, fontWeight: 'bold' },
  userEmail: { fontSize: 13, marginTop: 2 },
  planBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 16, alignSelf: 'flex-start', marginTop: 8 },
  badgeText: { fontSize: 11, fontWeight: 'bold', color: '#fff' },
  premiumCountdown: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12, padding: 12, borderRadius: 12, gap: 8 },
  premiumCountdownText: { fontSize: 14, fontWeight: '600' },
  statsSection: { margin: 16, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', elevation: 2, ...Platform.select({ web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3 } }) },
  statNumber: { fontSize: 22, fontWeight: '800', marginTop: 6 },
  statLabel: { fontSize: 11, marginTop: 2, textAlign: 'center' },
  section: { margin: 16, marginTop: 4 },
  referralCard: { borderRadius: 16, padding: 16, elevation: 2, ...Platform.select({ web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 } }) },
  referralHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  referralCodeContainer: { flex: 1, alignItems: 'center' },
  referralLabel: { fontSize: 12 },
  referralCode: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 4 },
  referralBtns: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'space-between' },
  shareButton: { flex: 0.7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, gap: 6 },
  shareButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  referralDetailText: { fontSize: 13, fontWeight: '600' },
  planCard: { borderRadius: 16, padding: 16, elevation: 2, borderWide: 2, ...Platform.select({ web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 } }), borderWidth: 2 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  planName: { fontSize: 16, fontWeight: 'bold' },
  planPrice: { fontSize: 14 },
  planFeatures: { gap: 8 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, flex: 1 },
  buyButton: { alignItems: 'center', paddingVertical: 10, borderRadius: 10, marginTop: 12 },
  buyButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, marginHorizontal: 16, borderWide: 1, gap: 8, borderWidth: 1 },
  logoutText: { fontSize: 16, fontWeight: 'bold' },
});
