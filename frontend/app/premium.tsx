import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LightColors, DarkColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';

export default function PremiumScreen() {
  const { theme, toggleTheme } = useAppContext();
  const Colors = theme === 'dark' ? DarkColors : LightColors;
  const styles = getStyles(Colors, theme);
  const router = useRouter();
  const { language, setLanguage } = useAppContext();

  const getText = (hindi: string, english: string) => language === 'hindi' ? hindi : english;

  const handlePlanSelect = useCallback((plan: string, price: number) => {
    Alert.alert(`${plan} Plan`, getText(`${plan} Plan (₹${price}/mo) के लिए भुगतान अभी प्रक्रिया में है।`, `Payment for ${plan} Plan (₹${price}/mo) is being processed.`), [
      { text: getText('कैंसल', 'Cancel'), style: 'cancel' },
      { text: getText('भुगतान करें', 'Pay'), onPress: () => Alert.alert(getText('सफलता', 'Success'), getText('आपका प्रीमियम सक्रिय हो गया है!', 'Your premium is active!')) }
    ]);
  }, [language]);

  const plans = [
    { id: 'free', name: 'FREE', price: 0, color: Colors.textSecondary, features: [getText('अधिकार जानकारी', 'Rights info'), getText('हेल्पलाइन', 'Helplines'), getText('2 AI सवाल/दिन', '2 AI queries/day'), getText('बेसिक स्कैनर', 'Basic scanner')], button: 'Current', disabled: true },
    { id: 'silver', name: 'SILVER', price: 49, color: Colors.saffron, features: [getText('अनलिमिटेड दस्तावेज', 'Unlimited documents'), getText('AI स्कैनर', 'AI scanner'), getText('सभी हेल्पलाइन', 'All helplines'), getText('बुकमार्क सेव', 'Save bookmarks'), getText('अनलिमिटेड AI सवाल', 'Unlimited AI queries')], button: 'Buy Now', popular: true },
    { id: 'gold', name: 'GOLD', price: 149, color: Colors.gold, features: [getText('सिल्वर के सभी फीचर', 'All Silver features'), getText('वकील द्वारा समीक्षा', 'Lawyer review'), getText('PDF डाउनलोड', 'Download PDFs'), getText('एक्शन प्लान', 'Action plan'), getText('प्रायोरिटी सपोर्ट', 'Priority support')], button: 'Buy Now', bestValue: true },
    { id: 'pro', name: 'PRO', price: 499, color: Colors.deepBlue, features: [getText('गोल्ड के सभी फीचर', 'All Gold features'), getText('1:1 वकील परामर्श', '1:1 Lawyer consultation'), getText('24/7 सपोर्ट', '24/7 Support'), getText('एडवांस्ड टेम्पलेट्स', 'Advanced templates'), getText('व्हाइट-लेबल डॉक्स', 'White-label docs')], button: 'Buy Now' }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: Colors.white, borderBottomColor: Colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={Colors.textPrimary} /></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.deepBlue }]}>{getText('प्रीमियम प्लान', 'Premium Plans')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ marginRight: 16 }} onPress={toggleTheme}><Text style={{ fontSize: 22 }}>{theme === 'dark' ? '🌙' : '☀️'}</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.langToggle, { backgroundColor: Colors.deepBlue }]} onPress={() => setLanguage(language === 'hindi' ? 'english' : 'hindi')}><Text style={styles.langText}>{language === 'hindi' ? 'EN' : 'हि'}</Text></TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <View key={plan.id} style={[styles.planCard, { backgroundColor: Colors.white, borderColor: plan.id === 'free' ? Colors.border : plan.color }]}>
              <View style={styles.planHeader}>
                <View><Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text><Text style={[styles.planPrice, { color: Colors.textSecondary }]}>₹{plan.price}/month</Text></View>
                {plan.popular && <View style={[styles.badge, { backgroundColor: Colors.saffron }]}><Text style={styles.badgeText}>POPULAR</Text></View>}
                {plan.bestValue && <View style={[styles.badge, { backgroundColor: Colors.gold }]}><Text style={styles.badgeText}>BEST VALUE</Text></View>}
              </View>
              <View style={styles.planFeatures}>{plan.features.map((f, i) => (<View key={i} style={styles.featureItem}><Ionicons name="checkmark-circle" size={20} color={plan.color} /><Text style={[styles.featureText, { color: Colors.textPrimary }]}>{f}</Text></View>))}</View>
              <Pressable style={({ pressed }) => [styles.selectButton, { backgroundColor: plan.disabled ? Colors.border : plan.color }, pressed && !plan.disabled && { opacity: 0.8 }]} onPress={() => !plan.disabled && handlePlanSelect(plan.name, plan.price)} disabled={plan.disabled}>
                <Text style={[styles.selectButtonText, { color: plan.disabled ? Colors.textSecondary : '#fff' }]}>{plan.button}</Text>
                {!plan.disabled && <Ionicons name="card" size={20} color="#fff" style={{ marginLeft: 8 }} />}
              </Pressable>
            </View>
          ))}
        </View>
        <View style={[styles.section, { backgroundColor: Colors.white }]}>
          <Text style={[styles.sectionTitle, { color: Colors.textPrimary }]}>{getText('प्रीमियम लाभ', 'Premium Benefits')}</Text>
          <View style={styles.benefitsList}>
            {[{ icon: 'shield-checkmark', text: getText('सुरक्षित भुगतान', 'Secure Payments') }, { icon: 'time', text: getText('24/7 समर्थन', '24/7 Support') }].map((b, i) => (
              <View key={i} style={styles.benefitItem}><Ionicons name={b.icon as any} size={24} color={Colors.saffron} /><Text style={[styles.benefitText, { color: Colors.textPrimary }]}>{b.text}</Text></View>
            ))}
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (Colors: any, theme: string) => StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  backButton: { padding: 8 },
  langToggle: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  langText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  plansContainer: { padding: 20, gap: 20 },
  planCard: { borderRadius: 16, padding: 24, elevation: 8, borderWidth: 2, ...Platform.select({ web: { boxShadow: '0px 4px 12px rgba(0,0,0,0.15)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 } }) },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  planName: { fontSize: 24, fontWeight: 'bold' },
  planPrice: { fontSize: 18 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  planFeatures: { gap: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureText: { fontSize: 16, flex: 1 },
  selectButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, marginTop: 20 },
  selectButtonText: { fontSize: 18, fontWeight: 'bold' },
  section: { margin: 20, padding: 20, borderRadius: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  benefitsList: { gap: 16 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitText: { fontSize: 16, flex: 1 },
});
