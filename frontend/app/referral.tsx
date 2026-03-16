import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Share,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { LightColors, DarkColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';
import HeaderToggle from '../components/HeaderToggle';



export default function ReferralScreen() {
    const { theme } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const styles = getStyles(Colors, theme);
    const isDark = theme === 'dark';
    const router = useRouter();
    const { language } = useAppContext();

    // Dark mode color variables
    const bg = isDark ? '#0D1B2A' : '#F5F5F5';
    const cardBg = isDark ? '#1B2B3B' : '#FFFFFF';
    const textColor = isDark ? '#FFFFFF' : '#1a237e';
    const subText = isDark ? '#AABBCC' : '#666666';
    const borderColor = isDark ? '#2A3F55' : '#E0E0E0';
    const descCardBg = isDark ? '#1A1A00' : '#FFF3E0';
    const descCardText = isDark ? '#FFDD99' : '#333333';

    const [referralData, setReferralData] = useState({
        myCode: '',
        totalReferred: 0,
        referredUsers: [] as any[],
        rewardDays: 0,
        lifetimeFree: false,
    });

    const generateCode = () =>
        'NYM' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const getText = useCallback((hindi: string, english: string) =>
        language === 'hi' ? hindi : english, [language]);

    const loadData = async () => {
        try {
            const saved = await AsyncStorage.getItem('referral_data');
            if (saved) {
                const p = JSON.parse(saved);
                setReferralData({
                    myCode: p.myCode || generateCode(),
                    totalReferred: p.totalReferred || 0,
                    referredUsers: Array.isArray(p.referredUsers) ? p.referredUsers : [],
                    rewardDays: p.rewardDays || 0,
                    lifetimeFree: p.lifetimeFree || false,
                });
            } else {
                const code = generateCode();
                const newData = { myCode: code, totalReferred: 0, referredUsers: [], rewardDays: 0, lifetimeFree: false };
                setReferralData(newData);
                await AsyncStorage.setItem('referral_data', JSON.stringify(newData));
            }
        } catch {
            setReferralData({ myCode: generateCode(), totalReferred: 0, referredUsers: [], rewardDays: 0, lifetimeFree: false });
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const copyCode = async () => {
        try {
            if (!referralData.myCode) return;
            await Clipboard.setStringAsync(referralData.myCode);
            Alert.alert('', getText('कॉपी हुआ! ✅', 'Copied! ✅'));
        } catch (e) {
            if (__DEV__) console.error('Error copying code:', e);
        }
    };

    const shareCode = async () => {
        const myCode = referralData.myCode;
        const message = `NyayMitra से जुड़ें! 🇮🇳
भारत का AI कानूनी सहायक

मेरे code से join करें: ${myCode}
✅ आपको मिलेगा 7 दिन Silver FREE!

Download: https://nyaymitra.app`;

        try {
            await Share.share({ message });
        } catch (e) {
            if (__DEV__) console.error('Error sharing code:', e);
        }
    };

    const milestones = [
        { count: 1, text: getText('7 दिन free', '7 days free'), icon: '🥉' },
        { count: 5, text: getText('1 महीना free', '1 month free'), icon: '🥈' },
        { count: 10, text: getText('6 महीने free', '6 months free'), icon: '🥇' },
        { count: 50, text: getText('Lifetime FREE', 'Lifetime FREE'), icon: '👑' }
    ];

    const calculateRewards = (totalReferred: number) => {
        let rewardDays = 0;
        let lifetimeFree = false;
        
        if (totalReferred >= 50) {
            lifetimeFree = true;
        } else if (totalReferred >= 10) {
            rewardDays = 180;
        } else if (totalReferred >= 5) {
            rewardDays = 30;
        } else if (totalReferred >= 1) {
            rewardDays = 7;
        }
        
        return { rewardDays, lifetimeFree };
    };

    // Update rewards when totalReferred changes
    useEffect(() => {
        const { rewardDays, lifetimeFree } = calculateRewards(referralData.totalReferred);
        if (rewardDays !== referralData.rewardDays || lifetimeFree !== referralData.lifetimeFree) {
            const updated = { ...referralData, rewardDays, lifetimeFree };
            setReferralData(updated);
            AsyncStorage.setItem('referral_data', JSON.stringify(updated));
        }
    }, [referralData.totalReferred]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.deepBlue} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.headerTitle}>{getText('Refer & Earn 🎁', 'Refer & Earn 🎁')}</Text>
                </View>
                <HeaderToggle />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.codeCard}>
                    <Text style={styles.codeLabel}>{getText('आपका Referral Code', 'Your Referral Code')}</Text>
                    <Text style={[styles.codeText, { color: Colors.saffron }]}>{referralData.myCode || '...'}</Text>
                    <View style={styles.codeBtns}>
                        <TouchableOpacity style={styles.copyBtn} onPress={copyCode}>
                            <Ionicons name="copy-outline" size={18} color={Colors.white} />
                            <Text style={styles.copyBtnText}>{getText('कॉपी', 'Copy')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareBtn} onPress={shareCode}>
                            <Ionicons name="share-social-outline" size={18} color={Colors.white} />
                            <Text style={styles.shareBtnText}>{getText('शेयर', 'Share')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Description Card */}
                <View style={[styles.descriptionCard, { backgroundColor: descCardBg, borderLeftColor: Colors.saffron }]}>
                    <Text style={[styles.descriptionTitle, { color: descCardText }]}>🎁 Refer करें, दोनों को फायदा!</Text>
                    <Text style={[styles.descriptionText, { color: descCardText }]}>
                        जब आप किसी दोस्त को NyayMitra पर invite करते हैं:
                        {'\n'}✅ आपको मिलता है → 7 दिन Silver FREE
                        {'\n'}✅ आपके दोस्त को भी मिलता है → 7 दिन Silver FREE
                        {'\n\n'}और जितना ज़्यादा refer करें, उतना बड़ा इनाम:
                        {'\n'}🥉 1 Referral  = आपको 7 दिन FREE
                        {'\n'}🥈 5 Referrals = 1 महीना FREE  
                        {'\n'}🥇 10 Referrals = 6 महीने FREE
                        {'\n'}👑 50 Referrals = Lifetime FREE! (हमेशा के लिए)
                        {'\n\n'}आपका referral code शेयर करें और कानूनी सुरक्षा 
                        {'\n'}का तोहफा दें — खुद भी पाएं, दोस्त को भी दिलाएं! 🇮🇳
                    </Text>
                </View>

                <View style={[styles.progressSection, { backgroundColor: cardBg, borderRadius: 12, padding: 16 }]}>
                    <Text style={[styles.progressTitle, { color: textColor }]}>{getText('आपकी Progress', 'Your Progress')}</Text>
                    <Text style={[styles.progressCount, { marginBottom: 20, color: subText }]}>
                        {getText(`आपने ${referralData.totalReferred} लोगों को Refer किया`, `You referred ${referralData.totalReferred} people`)}
                    </Text>

                    {milestones.map((m, i) => {
                        const progress = Math.min(referralData.totalReferred / m.count, 1);
                        return (
                            <View key={i} style={[styles.milestoneCard, { backgroundColor: cardBg }]}>
                                <View style={styles.milestoneHeader}>
                                    <Text style={styles.milestoneIcon}>{m.icon}</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.milestoneLabel, { color: subText }, referralData.totalReferred >= m.count && { color: Colors.green }]}>
                                            {referralData.totalReferred}/{m.count} → {m.text}
                                        </Text>
                                        <View style={[styles.progressBar, { backgroundColor: borderColor }]}>
                                            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: Colors.saffron }]} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    })}

                    {/* Reward Status */}
                    {referralData.lifetimeFree && (
                        <View style={[styles.rewardStatusCard, { backgroundColor: Colors.gold, borderColor: Colors.gold }]}>
                            <Text style={styles.rewardStatusText}>👑 बधाई! आप Lifetime Premium Member हैं!</Text>
                        </View>
                    )}
                    
                    {referralData.rewardDays > 0 && !referralData.lifetimeFree && (
                        <View style={[styles.rewardStatusCard, { backgroundColor: Colors.saffron, borderColor: Colors.saffron }]}>
                            <Text style={styles.rewardStatusText}>🎉 आपको {referralData.rewardDays} दिन Silver FREE मिले हैं!</Text>
                        </View>
                    )}
                </View>

                <View style={[styles.usersSection, { backgroundColor: cardBg }]}>
                    <Text style={styles.usersTitle}>{getText('Refer किए गए लोग', 'Referred Users')}</Text>
                    {referralData.referredUsers && referralData.referredUsers.length > 0 ? (
                        referralData.referredUsers.map((u, i) => (
                            <View key={i} style={styles.userItem}>
                                <Ionicons name="person-circle" size={32} color={Colors.textLight} />
                                <View>
                                    <Text style={[styles.userText, { color: Colors.textPrimary }]}>{u.name || getText('यूजर', 'User')}</Text>
                                    <Text style={[styles.userDate, { color: Colors.textSecondary }]}>
                                        {u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : ''}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>{getText('अभी कोई referral नहीं। Share करें!', 'No referrals yet. Share now!')}</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (Colors: any, theme: string) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.deepBlue,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    codeCard: {
        backgroundColor: Colors.deepBlue,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
    },
    descriptionCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    codeLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 8,
    },
    codeText: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.saffron,
        letterSpacing: 3,
        marginBottom: 16,
    },
    codeBtns: {
        flexDirection: 'row',
        gap: 12,
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6,
    },
    copyBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.white,
    },
    shareBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6,
    },
    shareBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.white,
    },
    progressSection: {
        marginBottom: 20,
    },
    progressTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    progressCount: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    milestoneCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    milestoneHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    milestoneIcon: {
        fontSize: 24,
    },
    milestoneLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    progressBar: {
        height: 6,
        backgroundColor: Colors.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    rewardStatusCard: {
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
        alignItems: 'center',
    },
    rewardStatusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.white,
    },
    usersSection: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    usersTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 12,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    userText: {
        fontSize: 15,
        fontWeight: '600',
    },
    userDate: {
        fontSize: 12,
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.textSecondary,
        paddingVertical: 20,
        fontStyle: 'italic',
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#E3F2FD',
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: theme === 'dark' ? '#90CAF9' : Colors.deepBlue,
        lineHeight: 20,
    },
});
