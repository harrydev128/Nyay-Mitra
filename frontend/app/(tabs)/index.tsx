import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors } from '../../constants/colors';
import { useAppContext } from '../../context/AppContext';
import AdBanner from '../../components/AdBanner';
import SideDrawer from '../../components/SideDrawer';

const NOTIFICATION_STORAGE_KEY = 'notifications';

const defaultNotifications = [
  { id: '1', title: '⚖️ नया कानूनी अपडेट', body: 'BNS 2024 लागू - जानें क्या बदला', time: '2 घंटे पहले', read: false, route: '/(tabs)/rights' },
  { id: '2', title: '📄 दस्तावेज़ तैयार है', body: 'आपका दस्तावेज़ देखने के लिए तैयार है', time: '1 दिन पहले', read: false, route: '/(tabs)/documents' },
  { id: '3', title: '🎁 Referral bonus मिला!', body: '7 दिन Silver FREE मिला आपके referral से', time: '3 दिन पहले', read: false, route: '/referral' },
];

export default function HomeScreen() {
  const { theme, toggleTheme, notificationPanel, setNotificationPanel, toggleNotificationPanel, language, setLanguage, user } = useAppContext();
  const t = (hi: string, en: string) =>
    language === 'hi' ? hi : en;
  const Colors = theme === 'dark' ? DarkColors : LightColors;
  const router = useRouter();
  const isDark = theme === 'dark';
  const username = user?.name || user?.email?.split('@')[0] || 'User';
  const pageBg = isDark ? '#0D1B2A' : '#F5F5F5';
  const cardBg = isDark ? '#1B2B3B' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a237e';
  const subText = isDark ? '#AABBCC' : '#666666';
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const slideAnim = useRef(new Animated.Value(-400)).current;

  const getText = useCallback((hindi: string, english: string) => language === 'hi' ? hindi : english, [language]);

  const loadNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        setNotifications(defaultNotifications);
      }
    } catch (e) {
      if (__DEV__) console.error('Error loading notifications:', e);
      setNotifications(defaultNotifications);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const deleteNotification = async (id: string) => {
    try {
      const updated = notifications.filter(n => n.id !== id);
      setNotifications(updated);
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      if (__DEV__) console.error('Error deleting notification:', e);
    }
  };

  const markAllRead = async () => {
    try {
      const updated = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updated);
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      if (__DEV__) console.error('Error marking all read:', e);
    }
  };

  const handleNotificationPress = async (notification: any) => {
    try {
      setNotificationPanel(false); // close panel
      const updated = notifications.map(n => n.id === notification.id ? { ...n, read: true } : n);
      setNotifications(updated);
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated));
      router.push(notification.route as any); // navigate
    } catch (e) {
      if (__DEV__) console.error('Error handling notification press:', e);
      router.push(notification.route as any);
    }
  };

  const notificationCount = notifications.filter(n => !n.read).length;

  const helplines = [
    { num: '112', label: language === 'hi' ? 'पुलिस' : 'Police' },
    { num: '181', label: language === 'hi' ? 'महिला' : 'Women' },
    { num: '108', label: language === 'hi' ? 'एम्बुलेंस' : 'Ambulance' },
    { num: '1930', label: language === 'hi' ? 'साइबर' : 'Cyber' },
    { num: '15100', label: language === 'hi' ? 'कानूनी' : 'Legal Aid' },
    { num: '1098', label: language === 'hi' ? 'बाल' : 'Child' },
  ];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: notificationPanel ? 0 : -400,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [notificationPanel, slideAnim]);

  const callNumber = useCallback((number: string) => {
    try {
      Linking.openURL(`tel:${number}`);
    } catch (e) {
      if (__DEV__) console.error('Error calling number:', e);
    }
  }, []);


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top']}>
      {notificationPanel && (
        <Pressable style={styles.overlay} onPress={() => setNotificationPanel(false)} />
      )}

      {/* Header */}
      <View style={[styles.header, { backgroundColor: Colors.cardBackground, borderBottomColor: Colors.border, zIndex: 1001 }]}>
        <TouchableOpacity style={styles.hamburgerBtn} onPress={() => setDrawerVisible(true)}>
          <Ionicons name="menu" size={28} color={Colors.deepBlue} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.appName, { color: Colors.deepBlue }]}>NyayMitra ⚖️</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={{ marginRight: 16 }} onPress={toggleTheme}>
            <Text style={{ fontSize: 22 }}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.langToggle, { backgroundColor: Colors.deepBlue }]} onPress={() => setLanguage(language === 'hi' ? 'english' : 'hi')}>
            <Text style={styles.langText}>{language === 'hi' ? 'EN' : 'हि'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bellBtn} onPress={toggleNotificationPanel}>
            <Ionicons name="notifications-outline" size={24} color={Colors.deepBlue} />
            {notificationCount > 0 && (
              <View style={[styles.notifBadge, { backgroundColor: Colors.red }]}>
                <Text style={styles.notifCount}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Panel */}
      <Animated.View style={[styles.notifPanel, { backgroundColor: Colors.cardBackground, transform: [{ translateY: slideAnim }] }]}>
        <View style={[styles.notifHeader, { borderBottomColor: Colors.border }]}>
          <Text style={[styles.notifTitle, { color: Colors.textPrimary }]}>{getText('सूचनाएं', 'Notifications')}</Text>
          <TouchableOpacity onPress={markAllRead}>
            <Text style={[styles.markReadText, { color: Colors.lightBlue }]}>{getText('सभी पढ़ें', 'Mark all read')}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ maxHeight: 300 }}>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              Colors={Colors}
              onPress={() => handleNotificationPress(notification)}
              onDelete={() => deleteNotification(notification.id)}
            />
          ))}
          {notifications.length === 0 && (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: Colors.textSecondary }}>{getText('कोई सूचना नहीं', 'No notifications')}</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>

      <ScrollView style={{ flex: 1, backgroundColor: pageBg }} showsVerticalScrollIndicator={false}>
        {/* 1. Welcome Card */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#1a237e',
          margin: 16,
          borderRadius: 20,
          padding: 20,
          alignItems: 'center',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 }}>
              {language === 'hi' ? `नमस्ते, ${username}! 👋` : `Hello, ${username}! 👋`}
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 14 }}>
              {language === 'hi' ? 'आज आपकी कैसे मदद करें?' : 'How can we help today?'}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FF6B00',
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderRadius: 20,
                alignSelf: 'flex-start',
                gap: 6,
              }}
              onPress={() => router.push('/(tabs)/chat')}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 48, marginLeft: 12 }}>⚖️</Text>
        </View>

        {/* 2. Emergency Banner */}
        <TouchableOpacity
          style={{
            backgroundColor: '#CC0000',
            marginHorizontal: 16,
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
          onPress={() => router.push('/emergency')}
        >
          <Text style={{ fontSize: 32, marginRight: 12 }}>🆘</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
              {t('आपातकालीन मदद', 'Emergency Help')}
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>
              {t('पुलिस • बेदखली • धोखाधड़ी • मार-पीट', 'Police • Eviction • Fraud • Assault')}
            </Text>
          </View>
          <Text style={{ fontSize: 24, color: '#fff', fontWeight: 'bold' }}>›</Text>
        </TouchableOpacity>

        {/* 3. Section Header */}
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: textColor, paddingHorizontal: 20, marginBottom: 14 }}>
          {t('मुख्य सेवाएं', 'Core Services')}
        </Text>

        {/* 4. Main Features Grid */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 20 }}>
          {/* AI Vakeel */}
          <TouchableOpacity
            style={{
              backgroundColor: cardBg,
              borderRadius: 12,
              padding: 14,
              alignItems: 'center',
              borderWidth: 0.5,
              borderColor: isDark ? '#2A3F55' : '#E0E0E0',
              flex: 1,
            }}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <Text style={{ fontSize: 28, marginBottom: 6 }}>⚖️</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: textColor, textAlign: 'center' }}>
              {t('AI वकील', 'AI Lawyer')}
            </Text>
            <Text style={{ fontSize: 10, color: subText, textAlign: 'center', marginTop: 2 }}>
              {t('कानूनी सवाल पूछें', 'Ask legal questions')}
            </Text>
          </TouchableOpacity>

          {/* Rights */}
          <TouchableOpacity
            style={{
              backgroundColor: cardBg,
              borderRadius: 12,
              padding: 14,
              alignItems: 'center',
              borderWidth: 0.5,
              borderColor: isDark ? '#2A3F55' : '#E0E0E0',
              flex: 1,
            }}
            onPress={() => router.push('/(tabs)/rights')}
          >
            <Text style={{ fontSize: 28, marginBottom: 6 }}>📋</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: textColor, textAlign: 'center' }}>
              {t('अधिकार जानें', 'Know Rights')}
            </Text>
            <Text style={{ fontSize: 10, color: subText, textAlign: 'center', marginTop: 2 }}>
              {t('40+ कानूनी अधिकार', '40+ legal rights')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 20 }}>
          {/* Documents */}
          <TouchableOpacity
            style={{
              backgroundColor: cardBg,
              borderRadius: 12,
              padding: 14,
              alignItems: 'center',
              borderWidth: 0.5,
              borderColor: isDark ? '#2A3F55' : '#E0E0E0',
              flex: 1,
            }}
            onPress={() => router.push('/(tabs)/documents')}
          >
            <Text style={{ fontSize: 28, marginBottom: 6 }}>📄</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: textColor, textAlign: 'center' }}>
              {t('दस्तावेज़ बनाएं', 'Make Document')}
            </Text>
            <Text style={{ fontSize: 10, color: subText, textAlign: 'center', marginTop: 2 }}>
              {t('FIR, नोटिस, शिकायत', 'FIR, Notice, Complaint')}
            </Text>
          </TouchableOpacity>

          {/* Court Tracker */}
          <TouchableOpacity
            style={{
              backgroundColor: cardBg,
              borderRadius: 12,
              padding: 14,
              alignItems: 'center',
              borderWidth: 0.5,
              borderColor: isDark ? '#2A3F55' : '#E0E0E0',
              flex: 1,
              position: 'relative',
            }}
            onPress={() => router.push('/court-tracker')}
          >
            <View style={{
              position: 'absolute',
              top: 6, right: 6,
              backgroundColor: '#FF6B00',
              borderRadius: 4,
              paddingHorizontal: 4,
              paddingVertical: 2,
            }}>
              <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold' }}>NEW</Text>
            </View>
            <Text style={{ fontSize: 28, marginBottom: 6 }}>🏛️</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: textColor, textAlign: 'center' }}>
              {t('कोर्ट तारीख', 'Court Date')}
            </Text>
            <Text style={{ fontSize: 10, color: subText, textAlign: 'center', marginTop: 2 }}>
              {t('केस ट्रैक करें', 'Track your case')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 5. Section Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: textColor }}>
            {t('उपयोगी टूल्स', 'Useful Tools')}
          </Text>
        </View>

        {/* 6. New Features Row */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 20 }}>
          {[
            { icon: '🏠', title: language === 'hi' ? 'किराया\nसमझौता' : 'Rent\nAgreement' },
            { icon: '💰', title: language === 'hi' ? 'वेतन\nकैलकुलेटर' : 'Salary\nCalculator' },
            { icon: '🛡️', title: language === 'hi' ? 'सरकारी\nयोजनाएं' : 'Govt\nSchemes' },
          ].map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: cardBg,
                borderRadius: 12,
                padding: 10,
                alignItems: 'center',
                borderWidth: 0.5,
                borderColor: isDark ? '#2A3F55' : '#E0E0E0',
                flex: 1,
                position: 'relative',
              }}
              onPress={() => router.push(index === 0 ? '/rent-agreement' : index === 1 ? '/salary-calculator' : index === 2 ? '/govt-schemes' : index === 3 ? '/property-guide' : index === 4 ? '/rti-writer' : '/challan-checker')}
            >

              <Text style={{ fontSize: 20, marginBottom: 4 }}>{feature.icon}</Text>
              <Text style={{ fontSize: 11, color: textColor, textAlign: 'center', fontWeight: '500' }}>
                {t('किराया\nसमझौता', 'Rent\nAgreement')}
                {t('सरकारी\nयोजनाएं', 'Govt\nSchemes')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 20 }}>
          {[
            { icon: '🏘️', title: t('संपत्ति गाइड', 'Property Guide'), route: '/property-guide' },
            { icon: '📝', title: t('RTI आवेदन', 'RTI Application'), route: '/rti-writer' },
            { icon: '🚦', title: t('e-Challan चेकर', 'e-Challan'), route: '/challan-checker' },
          ].map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: cardBg,
                borderRadius: 12,
                padding: 10,
                alignItems: 'center',
                borderWidth: 0.5,
                borderColor: isDark ? '#2A3F55' : '#E0E0E0',
                flex: 1,
                position: 'relative',
              }}
              onPress={() => router.push(feature.route as any)}
            >
              <Text style={{ fontSize: 20, marginBottom: 4 }}>{feature.icon}</Text>
              <Text style={{ fontSize: 11, color: textColor, textAlign: 'center', fontWeight: '500' }}>
                {t('वेतन\nकैलकुलेटर', 'Salary\nCalculator')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 7. Section Header */}
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: textColor, paddingHorizontal: 20, marginBottom: 14 }}>
          {t('आपातकालीन हेल्पलाइन', 'Emergency Helplines')}
        </Text>

        {/* 8. Helplines Horizontal Scroll */}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 20 }}
        >
          {helplines.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: cardBg,
                borderWidth: 0.5,
                borderColor: isDark ? '#2A3F55' : '#E0E0E0',
                borderRadius: 8,
                padding: 6,
                paddingHorizontal: 10,
                alignItems: 'center',
              }}
              onPress={() => Linking.openURL('tel:' + item.num)}
            >
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#CC0000' }}>{item.num}</Text>
              <Text style={{ fontSize: 10, color: subText }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 10. Bottom Padding */}
        <View style={{ height: 80 }} />
      </ScrollView>
      <AdBanner />
      <SideDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </SafeAreaView>
  );
}

const NotificationItem = React.memo(({ notification, Colors, onPress, onDelete }: any) => (
  <View style={[styles.notifItem, { borderBottomColor: Colors.border, backgroundColor: notification.read ? 'transparent' : Colors.background + '40' }]}>
    <TouchableOpacity style={styles.notifContent} onPress={onPress}>
      <View style={[styles.notifIconContainer, { backgroundColor: Colors.background }]}>
        <Ionicons name={notification.icon || 'notifications-outline'} size={20} color={Colors.saffron} />
      </View>
      <View style={styles.notifTextContainer}>
        <Text style={[styles.notifItemTitle, { color: Colors.textPrimary, fontWeight: notification.read ? '400' : '700' }]}>{notification.title}</Text>
        <Text style={[styles.notifItemBody, { color: Colors.textSecondary }]} numberOfLines={1}>{notification.body}</Text>
        <Text style={[styles.notifItemTime, { color: Colors.textLight, fontSize: 10 }]}>{notification.time}</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
      <Ionicons name="close-circle-outline" size={20} color={Colors.textLight} />
    </TouchableOpacity>
  </View>
));
NotificationItem.displayName = 'NotificationItem';

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  hamburgerBtn: { padding: 4 },
  headerCenter: { flex: 1, alignItems: 'center' },
  appName: { fontSize: 22, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  langToggle: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  langText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  bellBtn: { padding: 4, position: 'relative' },
  notifBadge: { position: 'absolute', top: 0, right: 0, borderRadius: 8, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  notifCount: { fontSize: 10, fontWeight: '700', color: '#fff' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 },
  notifPanel: { position: 'absolute', top: 70, left: 10, right: 10, borderRadius: 16, padding: 16, zIndex: 1002, elevation: 10, ...Platform.select({ web: { boxShadow: '0px 5px 15px rgba(0,0,0,0.3)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10 } }) },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, paddingBottom: 10 },
  notifTitle: { fontSize: 18, fontWeight: 'bold' },
  markReadText: { fontSize: 14, fontWeight: '600' },
  notifList: { gap: 12 },
  notifItem: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, paddingVertical: 12 },
  notifContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  notifIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  notifTextContainer: { flex: 1 },
  notifItemTitle: { fontSize: 14, marginBottom: 2 },
  notifItemBody: { fontSize: 12, marginBottom: 4 },
  notifItemTime: { fontSize: 11 },
  deleteBtn: { padding: 8, marginLeft: 8 },
  notifDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
  greetingCard: { flexDirection: 'row', margin: 16, borderRadius: 20, padding: 20, alignItems: 'center', elevation: 4, ...Platform.select({ web: { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 } }) },
  greetingContent: { flex: 1 },
  greetingText: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
  greetingSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 14 },
  problemBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, alignSelf: 'flex-start', gap: 6 },
  problemBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  greetingEmoji: { fontSize: 48, marginLeft: 12 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', paddingHorizontal: 20, marginBottom: 14 },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
  helplineScroll: { paddingHorizontal: 20, gap: 10 },
  quickSolScroll: { paddingHorizontal: 20, gap: 12 },
  disclaimer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 20, alignItems: 'center', gap: 8, opacity: 0.7 },
  disclaimerText: { fontSize: 12, fontStyle: 'italic' },
})