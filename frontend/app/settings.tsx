import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Linking,
    Switch,
    Platform,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';
import HeaderToggle from '../components/HeaderToggle';

export default function SettingsScreen() {
    const { theme, language, setLanguage } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const styles = getStyles(Colors, theme);
    const isDark = theme === 'dark';
    const router = useRouter();
    const params = useLocalSearchParams();
    const initSection = (params.section as string) || 'main';

    // Dark mode color variables
    const bg = isDark ? '#0D1B2A' : '#F5F5F5';
    const cardBg = isDark ? '#1B2B3B' : '#FFFFFF';
    const textColor = isDark ? '#FFFFFF' : '#1a237e';
    const subText = isDark ? '#AABBCC' : '#666666';
    const borderColor = isDark ? '#2A3F55' : '#E0E0E0';

    const [activeSection, setActiveSection] = useState<'main' | 'privacy' | 'terms' | 'help' | 'about' | 'notifications'>(initSection as any);
    const [notifSettings, setNotifSettings] = useState({ push: true, legal: true, referral: true });

    const loadSettings = useCallback(async () => {
        try {
            const saved = await AsyncStorage.getItem('notification_settings');
            if (saved) setNotifSettings(JSON.parse(saved));
        } catch { }
    }, []);

    useEffect(() => { loadSettings(); }, [loadSettings]);

    const saveNotifSettings = async (updates: any) => {
        const newSettings = { ...notifSettings, ...updates };
        setNotifSettings(newSettings);
        await AsyncStorage.setItem('notification_settings', JSON.stringify(newSettings));
    };

    const getText = (hindi: string, english: string) => language === 'hi' ? hindi : english;

    const handleRateApp = () => {
        Alert.alert(getText("ऐप रेट करें ⭐", "Rate App ⭐"), getText("क्या आप NyayMitra को Play Store पर रेट करना चाहते हैं?", "Rate on Play Store?"), [
            { text: getText("बाद में", "Later") },
            { text: getText("अभी रेट करें", "Rate Now"), onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.nyaymitra') }
        ]);
    };

    const renderHeader = (title: string) => (
        <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
            <TouchableOpacity onPress={() => activeSection === 'main' ? router.back() : setActiveSection('main')} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={textColor} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
            </View>
            <HeaderToggle />
        </View>
    );

    if (activeSection !== 'main') {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
                {renderHeader(getText(activeSection === 'notifications' ? 'नोटिफिकेशन' : activeSection === 'privacy' ? 'प्राइवेसी' : activeSection === 'terms' ? 'नियम' : activeSection === 'help' ? 'सहायता' : 'ऐप के बारे में', activeSection.toUpperCase()))}
                <ScrollView contentContainerStyle={styles.textPage}>
                    {activeSection === 'notifications' && (
                        <View style={styles.listSection}>
                            {Object.entries(notifSettings).map(([key, val]) => (
                                <View key={key} style={[styles.switchItem, { borderBottomColor: borderColor }]}>
                                    <Text style={[styles.switchLabel, { color: textColor }]}>{getText(key === 'push' ? 'पुश नोटिफिकेशन' : key === 'legal' ? 'कानूनी अपडेट' : 'Referral अपडेट', key)}</Text>
                                    <Switch value={val} onValueChange={(v) => saveNotifSettings({ [key]: v })} trackColor={{ false: '#767577', true: Colors.saffron }} />
                                </View>
                            ))}
                        </View>
                    )}
                    {activeSection === 'privacy' && (
                        <ScrollView>
                          <Text style={[styles.pageContent, { color: textColor }]}>
                            {'प्राइवेसी पॉलिसी — NyayMitra\n\nअंतिम अपडेट: मार्च 2026\n\n1. हम क्या जानकारी लेते हैं\nNyayMitra केवल जरूरी जानकारी लेता है:\n• नाम और ईमेल (login के लिए)\n• आपके सवाल और दस्तावेज (AI सेवा के लिए)\n• Device की जानकारी (app सुधार के लिए)\n\n2. जानकारी का उपयोग\n• AI कानूनी सहायता प्रदान करने के लिए\n• App सेवाएं बेहतर बनाने के लिए\n• आपकी जानकारी किसी तीसरे पक्ष को नहीं बेची जाती\n\n3. डेटा सुरक्षा\n• डेटा encrypted रहता है\n• Indian IT Act 2000 और DPDP Act 2023 का पालन\n\n4. आपके अधिकार\n• डेटा देखने का अधिकार\n• डेटा हटवाने का अधिकार\n• Account बंद करने का अधिकार\n\n5. संपर्क: support@nyaymitra.app'}
                          </Text>
                        </ScrollView>
                      )}
                    {activeSection === 'terms' && (
                        <ScrollView>
                          <Text style={[styles.pageContent, { color: textColor }]}>
                            {'नियम और शर्तें — NyayMitra\n\nअंतिम अपडेट: मार्च 2026\n\n1. सेवा का उद्देश्य\nNyayMitra एक AI-आधारित कानूनी जानकारी app है।\n• यह कानूनी जागरूकता देता है\n• यह वकील का विकल्प नहीं है\n• गंभीर मामलों में वकील से सलाह लें\n\n2. उपयोग की शर्तें\n• केवल कानूनी उद्देश्यों के लिए उपयोग करें\n• गलत जानकारी देना प्रतिबंधित है\n• 18 वर्ष से कम के लिए माता-पिता की अनुमति जरूरी\n\n3. सीमाएं\n• AI की जानकारी कानूनी सलाह नहीं है\n• NyayMitra किसी नुकसान के लिए जिम्मेदार नहीं\n\n4. भारतीय कानून\nयह app Indian Contract Act 1872, IT Act 2000, Consumer Protection Act 2019 के अनुसार है।\n\n5. संपर्क: support@nyaymitra.app'}
                          </Text>
                        </ScrollView>
                      )}
                    {activeSection === 'help' && (
                        <View>
                            <Text style={[styles.sectionHeading, { color: textColor }]}>{getText('FAQ', 'FAQ')}</Text>
                            <View style={[styles.faqItem, { backgroundColor: cardBg, borderColor: borderColor }]}>
                                <Text style={[styles.faqQ, { color: textColor }]}>Q: AI वकील सही जवाब नहीं दे रहा?</Text>
                                <Text style={[styles.faqA, { color: subText }]}>A: इंटरनेट कनेक्शन जांचें।</Text>
                            </View>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto:support@nyaymitra.app')} style={[styles.contactItem, { backgroundColor: cardBg, borderColor: borderColor }]}>
                                <Ionicons name="mail-outline" size={20} color={textColor} /><Text style={[styles.contactText, { color: textColor }]}>support@nyaymitra.app</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {activeSection === 'about' && (
                        <View style={styles.aboutPage}>
                            <View style={[styles.aboutLogoBg, { backgroundColor: cardBg }]}><Text style={{ fontSize: 60 }}>⚖️</Text></View>
                            <Text style={[styles.aboutTitle, { color: textColor }]}>NyayMitra</Text>
                            <Text style={[styles.aboutVersion, { color: subText }]}>Version 1.0.0</Text>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        );
    }

    const items = [
        { id: 'lang', icon: 'language-outline', title: getText('भाषा बदलें', 'Change Language'), sub: getText('हिंदी / English', 'Hindi / English'), action: () => setLanguage(language === 'hi' ? 'english' : 'hi') },
        { id: 'notifications', icon: 'notifications-outline', title: getText('नोटिफिकेशन', 'Notifications'), sub: getText('पुश सेटिंग्स', 'Push settings'), action: () => setActiveSection('notifications') },
        { id: 'privacy', icon: 'shield-checkmark-outline', title: getText('प्राइवेसी पॉलिसी', 'Privacy Policy'), sub: getText('डेटा सुरक्षा', 'Data protection'), action: () => setActiveSection('privacy') },
        { id: 'terms', icon: 'document-text-outline', title: getText('नियम और शर्तें', 'Terms & Conditions'), sub: getText('उपयोग की शर्तें', 'Usage terms'), action: () => setActiveSection('terms') },
        { id: 'rate', icon: 'star-outline', title: getText('ऐप रेट करें', 'Rate App'), sub: getText('Play Store पर', 'On Play Store'), action: handleRateApp },
        { id: 'help', icon: 'help-circle-outline', title: getText('सहायता', 'Help & Support'), sub: getText('FAQ और संपर्क', 'FAQ and Contact'), action: () => setActiveSection('help') },
        { id: 'about', icon: 'information-circle-outline', title: getText('ऐप के बारे में', 'About App'), sub: 'NyayMitra v1.0.0', action: () => setActiveSection('about') },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
            {renderHeader(getText('सेटिंग्स ⚙️', 'Settings ⚙️'))}
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.settingsList, { backgroundColor: cardBg }]}>
                    {items.map((item) => (
                        <Pressable key={item.id} style={({ pressed }) => [styles.settingsItem, { borderBottomColor: borderColor }, pressed && { backgroundColor: isDark ? '#243447' : '#f8f9fa' }]} onPress={item.action}>
                            <View style={[styles.settingsIconBg, { backgroundColor: isDark ? '#243447' : Colors.background }]}><Ionicons name={item.icon as any} size={22} color={textColor} /></View>
                            <View style={styles.settingsInfo}><Text style={[styles.settingsTitle, { color: textColor }]}>{item.title}</Text><Text style={[styles.settingsSubtitle, { color: subText }]}>{item.sub}</Text></View>
                            <Ionicons name="chevron-forward" size={20} color={subText} />
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (Colors: any, theme: string) => StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    backButton: { padding: 8 },
    settingsList: { marginTop: 12 },
    settingsItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1 },
    settingsIconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    settingsInfo: { flex: 1 },
    settingsTitle: { fontSize: 16, fontWeight: '600' },
    settingsSubtitle: { fontSize: 13, marginTop: 2 },
    textPage: { padding: 24, flexGrow: 1 },
    pageContent: { fontSize: 16, lineHeight: 24 },
    sectionHeading: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
    faqItem: { marginBottom: 20, padding: 16, borderRadius: 12, borderWidth: 1 },
    faqQ: { fontSize: 15, fontWeight: 'bold', marginBottom: 8 },
    faqA: { fontSize: 14 },
    contactItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, padding: 16, borderRadius: 12, borderWidth: 1 },
    contactText: { fontSize: 16 },
    aboutPage: { alignItems: 'center', paddingVertical: 40 },
    aboutLogoBg: { width: 120, height: 120, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, ...Platform.select({ web: { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5 } }), marginBottom: 20 },
    aboutTitle: { fontSize: 28, fontWeight: 'bold' },
    aboutVersion: { fontSize: 16, marginTop: 4 },
    listSection: { paddingHorizontal: 0 },
    switchItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
    switchLabel: { fontSize: 16, fontWeight: '500' },
});
