import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    ScrollView,
    Share,
    Alert,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { LightColors, DarkColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.78;

interface SideDrawerProps {
    visible: boolean;
    onClose: () => void;
}

export default function SideDrawer({ visible, onClose }: SideDrawerProps) {
    const router = useRouter();
    const { user, language, logout, theme } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const styles = getStyles(Colors);
    const isDark = theme === 'dark';

    // Dark mode color variables
    const cardBg = isDark ? '#1B2B3B' : '#FFFFFF';
    const textColor = isDark ? '#FFFFFF' : '#1a237e';
    const subText = isDark ? '#AABBCC' : '#666666';
    const borderColor = isDark ? '#2A3F55' : '#E0E0E0';

    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;

    const getText = useCallback((hindi: string, english: string) =>
        language === 'hindi' ? hindi : english, [language]);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 200,
                }),
                Animated.timing(overlayAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -DRAWER_WIDTH,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, slideAnim, overlayAnim]);

    const navigateTo = (route: string) => {
        onClose();
        setTimeout(() => {
            router.push(route as any);
        }, 250);
    };

    const handleLogout = async () => {
        onClose();
        await logout();
        router.replace('/auth/login' as any);
    };

    const [referralData, setReferralData] = useState<any>(null);

    const loadReferralData = useCallback(async () => {
        try {
            const data = await AsyncStorage.getItem('referral_data');
            if (data) {
                setReferralData(JSON.parse(data));
            } else {
                const newData = {
                    myCode: 'NYM' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                    totalReferred: 0,
                    referredList: [],
                    totalRewardDays: 0,
                    pendingReward: null
                };
                await AsyncStorage.setItem('referral_data', JSON.stringify(newData));
                setReferralData(newData);
            }
        } catch (error) {
            console.error('SideDrawer load referral data error:', error);
        }
    }, []);

    useEffect(() => {
        if (visible) {
            loadReferralData();
        }
    }, [visible, loadReferralData]);

    const copyCode = async () => {
        if (!referralData) return;
        try {
            await Clipboard.setStringAsync(referralData.myCode);
            Alert.alert('', getText('कोड कॉपी हो गया! ✅', 'Code copied! ✅'));
        } catch (error) {
            console.error('SideDrawer copy code error:', error);
            Alert.alert('', getText('कोड: ' + referralData.myCode, 'Code: ' + referralData.myCode));
        }
    };

    const shareCode = async () => {
        if (!referralData) return;
        const message = `NyayMitra से जुड़ें! भारत का AI कानूनी सहायक 🇮🇳\n\nमेरे referral code से join करें: ${referralData.myCode}\nआपको मिलेगा: 7 दिन Silver FREE!\n\nDownload: https://nyaymitra.app`;
        try {
            await Share.share({ message, title: 'NyayMitra में Join करें' });
        } catch (error) {
            console.error('SideDrawer share code error:', error);
        }
    };

    const menuItems = [
        { icon: 'document-text-outline' as const, label: getText('दस्तावेज़ स्कैनर', 'Document Scanner'), emoji: '📄', route: '/doc-scanner' },
        { icon: 'folder-outline' as const, label: getText('मेरे केस', 'My Cases'), emoji: '📋', route: '/my-cases' },
        { icon: 'bookmark-outline' as const, label: getText('सेव किए अधिकार', 'Saved Rights'), emoji: '🔖', route: '/bookmarks' },
        { icon: 'star-outline' as const, label: getText('सफलता की कहानियां', 'Success Stories'), emoji: '⭐', route: '/success-stories' },
        { icon: 'settings-outline' as const, label: getText('सेटिंग्स', 'Settings'), emoji: '⚙️', route: '/settings' },
    ];

    if (!visible) return null;

    const planBadge = user?.plan === 'gold' ? 'GOLD' : user?.plan === 'silver' ? 'SILVER' : 'FREE';
    const planColor = user?.plan === 'gold' ? DarkColors.gold : user?.plan === 'silver' ? Colors.saffron : Colors.textLight;

    return (
        <View style={[StyleSheet.absoluteFill, { pointerEvents: 'box-none' }]}>
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.drawer, { backgroundColor: cardBg, transform: [{ translateX: slideAnim }] }]}>
                {/* User Info */}
                <View style={styles.userSection}>
                    <View style={styles.avatarCircle}>
                        <Ionicons name="person" size={32} color="#fff" />
                    </View>
                    <Text style={styles.userName}>{user?.name || getText('अतिथि', 'Guest')}</Text>
                    <Text style={styles.userEmail}>{user?.email || ''}</Text>
                    <View style={[styles.planBadge, { backgroundColor: planColor }]}>
                        <Text style={styles.planText}>{planBadge}</Text>
                    </View>
                </View>

                {/* Menu Items & Referral section */}
                <ScrollView style={styles.menuSection} showsVerticalScrollIndicator={false}>

                    {/* Referral UI Segment */}
                    <View style={styles.referralSection}>
                        <View style={styles.refHeader}>
                            <Ionicons name="gift" size={20} color={Colors.saffron} />
                            <Text style={[styles.refTitle, { color: textColor }]}>Refer & Earn</Text>
                        </View>

                        <View style={[styles.refCard, { backgroundColor: cardBg, borderColor: borderColor }]}>
                            <Text style={styles.refLabel}>आपका Referral Code</Text>
                            <Text style={styles.refCode}>{referralData?.myCode || '...'}</Text>
                            <View style={styles.refActions}>
                                <TouchableOpacity style={styles.refBtnCopy} onPress={copyCode}>
                                    <Text style={styles.refBtnText}>📋 Copy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.refBtnShare} onPress={shareCode}>
                                    <Text style={styles.refBtnTextWhite}>📤 Share</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[styles.refProgressContainer, { backgroundColor: cardBg, borderColor: borderColor }]}>
                            <Text style={styles.refCountText}>आपने अब तक {referralData?.totalReferred || 0} लोगों को Refer किया</Text>

                            {[
                                { count: 1, text: '7 days Silver', icon: '🥉' },
                                { count: 5, text: '1 month Silver', icon: '🥈' },
                                { count: 10, text: '6 months Silver', icon: '🥇' }
                            ].map((m, i) => {
                                const current = referralData?.totalReferred || 0;
                                const progress = Math.min(current / m.count, 1);
                                return (
                                    <View key={i} style={styles.refMilestone}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={[styles.refMilestoneText, { color: subText }]}>{m.icon} {m.count} referral → {m.text}</Text>
                                            <Text style={styles.refMilestoneProgress}>{current}/{m.count}</Text>
                                        </View>
                                        <View style={[styles.refProgressBarBg, { backgroundColor: borderColor }]}>
                                            <View style={[styles.refProgressBarFill, { width: `${progress * 100}%` }]} />
                                        </View>
                                    </View>
                                )
                            })}
                        </View>

                        <View style={styles.refListContainer}>
                            <Text style={[styles.refListTitle, { color: textColor }]}>Referred Users:</Text>
                            {referralData?.referredList && referralData.referredList.length > 0 ? (
                                referralData.referredList.map((ru: any, i: number) => (
                                    <Text key={i} style={styles.refUserItem}>👤 {ru.name} - {new Date(ru.date).toLocaleDateString()} ✓ joined</Text>
                                ))
                            ) : (
                                <Text style={styles.refEmptyText}>अभी कोई referral नहीं। Share करें और पुरस्कार पाएं!</Text>
                            )}
                        </View>
                    </View>

                    <View style={[styles.menuDivider, { backgroundColor: borderColor }]} />

                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuItem, { borderBottomColor: borderColor }]}
                            onPress={() => navigateTo(item.route)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.menuEmoji}>{item.emoji}</Text>
                            <Text style={[styles.menuLabel, { color: textColor }]}>{item.label}</Text>
                            <Ionicons name="chevron-forward" size={18} color={subText} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Bottom */}
                <View style={[styles.bottomSection, { borderTopColor: borderColor }]}>
                    <Text style={styles.appVersion}>NyayMitra v1.0.0</Text>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color={Colors.red} />
                        <Text style={styles.logoutText}>{getText('लॉग आउट', 'Logout')}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const getStyles = (Colors: any) => StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: Colors.white,
        elevation: 16,
        ...Platform.select({
            web: { boxShadow: '4px 0px 12px rgba(0,0,0,0.3)' } as any,
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 4, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
            }
        }),
    },
    userSection: {
        backgroundColor: Colors.deepBlue,
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    avatarCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.saffron,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 10,
    },
    planBadge: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 12,
    },
    planText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.white,
    },
    menuSection: {
        flex: 1,
        paddingTop: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    menuEmoji: {
        fontSize: 20,
        marginRight: 14,
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    bottomSection: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    appVersion: {
        fontSize: 12,
        color: Colors.textLight,
        marginBottom: 12,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F0',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
    },
    logoutText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.red,
    },
    referralSection: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    refHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    refTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginLeft: 8,
    },
    refCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    refLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    refCode: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.saffron,
        letterSpacing: 2,
        marginBottom: 16,
    },
    refActions: {
        flexDirection: 'row',
        gap: 12,
    },
    refBtnCopy: {
        backgroundColor: Colors.border,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    refBtnShare: {
        backgroundColor: Colors.saffron,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    refBtnText: {
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    refBtnTextWhite: {
        fontWeight: 'bold',
        color: Colors.white,
    },
    refProgressContainer: {
        marginTop: 16,
        backgroundColor: Colors.white,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    refCountText: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 12,
    },
    refMilestone: {
        marginBottom: 10,
    },
    refMilestoneText: {
        fontSize: 12,
        color: Colors.textPrimary,
        fontWeight: '500',
    },
    refMilestoneProgress: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    refProgressBarBg: {
        height: 6,
        backgroundColor: Colors.background,
        borderRadius: 3,
        marginTop: 4,
    },
    refProgressBarFill: {
        height: '100%',
        backgroundColor: Colors.saffron,
        borderRadius: 3,
    },
    refListContainer: {
        marginTop: 16,
    },
    refListTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    refUserItem: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    refEmptyText: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontStyle: 'italic',
    },
    menuDivider: {
        height: 1,
        backgroundColor: Colors.border,
        marginHorizontal: 20,
        marginBottom: 10,
    }
});
