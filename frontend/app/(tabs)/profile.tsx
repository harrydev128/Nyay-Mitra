import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useAppContext } from '../../context/AppContext';
import { supabase } from '../../services/supabase';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const router = useRouter();
    const {
        language,
        setLanguage,
        isPremium,
        setIsPremium,
        isLoggedIn,
        setIsLoggedIn,
        userEmail,
        setUserEmail,
    } = useAppContext();

    const [password, setPassword] = useState('');

    const getText = (hindi: string, english: string) => {
        return language === 'hindi' ? hindi : english;
    };

    const handleLogin = async () => {
        if (!userEmail || !password) {
            Alert.alert(
                getText('त्रुटि', 'Error'),
                getText('कृपया ईमेल और पासवर्ड दर्ज करें', 'Please enter email and password')
            );
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password,
        });

        if (error) {
            Alert.alert(
                getText('लॉगिन असफल', 'Login Failed'),
                getText(
                    'ईमेल या पासवर्ड गलत है, या सर्वर में समस्या है।',
                    error.message || 'Incorrect email or password, or server error.'
                )
            );
            return;
        }

        const email = data.user?.email || userEmail;
        setUserEmail(email);
        setIsLoggedIn(true);
        router.replace('/');
    };

    const handleSignup = async () => {
        if (!userEmail || !password) {
            Alert.alert(
                getText('त्रुटि', 'Error'),
                getText('कृपया ईमेल और पासवर्ड दर्ज करें', 'Please enter email and password')
            );
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email: userEmail,
            password,
        });

        if (error) {
            Alert.alert(
                getText('साइन अप असफल', 'Sign Up Failed'),
                getText(
                    'खाता नहीं बनाया जा सका। कृपया बाद में पुनः प्रयास करें।',
                    error.message || 'Could not create account. Please try again later.'
                )
            );
            return;
        }

        const email = data.user?.email || userEmail;
        setUserEmail(email);
        setIsLoggedIn(true);
        router.replace('/');
    };

    const handleUpgrade = () => {
        Alert.alert(
            getText('प्रीमियम में अपग्रेड करें', 'Upgrade to Premium'),
            getText('क्या आप ₹99/माह के लिए प्रीमियम प्लान लेना चाहते हैं?', 'Do you want to get the Premium plan for ₹99/month?'),
            [
                { text: getText('नहीं', 'No'), style: 'cancel' },
                {
                    text: getText('हाँ, खरीदें', 'Yes, Buy'),
                    onPress: () => {
                        setIsPremium(true);
                        Alert.alert(getText('बधाई हो!', 'Congratulations!'), getText('अब आप NyayMitra प्रीमियम सदस्य हैं।', 'You are now a NyayMitra Premium member.'));
                    }
                }
            ]
        );
    };

    if (!isLoggedIn) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{getText('साइन इन करें', 'Sign In')}</Text>
                    <TouchableOpacity
                        style={styles.langToggle}
                        onPress={() => setLanguage(language === 'hindi' ? 'english' : 'hindi')}
                    >
                        <Text style={styles.langText}>{language === 'hindi' ? 'EN' : 'हि'}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.loginContainer}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="shield-checkmark" size={80} color={Colors.saffron} />
                        <Text style={styles.appName}>NyayMitra</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{getText('ईमेल', 'Email')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. rahul@example.com"
                            value={userEmail}
                            onChangeText={setUserEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{getText('पासवर्ड', 'Password')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="********"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>{getText('लॉगिन करें', 'Login')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.signupLink} onPress={handleSignup}>
                        <Text style={styles.signupText}>
                            {getText('खाता नहीं है? साइन अप करें', "Don't have an account? Sign Up")}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{getText('प्रोफ़ाइल', 'Profile')}</Text>
                    <TouchableOpacity
                        style={styles.langToggle}
                        onPress={() => setLanguage(language === 'hindi' ? 'english' : 'hindi')}
                    >
                        <Text style={styles.langText}>{language === 'hindi' ? 'EN' : 'हि'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={100} color={Colors.deepBlue} />
                    </View>
                    <Text style={styles.userName}>{userEmail.split('@')[0]}</Text>
                    <Text style={styles.userEmail}>{userEmail}</Text>

                    <View style={[styles.badge, isPremium ? styles.premiumBadge : styles.freeBadge]}>
                        <Text style={styles.badgeText}>
                            {isPremium ? getText('प्रीमियम सदस्य', 'Premium Member') : getText('मुफ्त यूजर', 'Free User')}
                        </Text>
                    </View>
                </View>

                {!isPremium && (
                    <View style={styles.upgradeCard}>
                        <View style={styles.upgradeHeader}>
                            <Ionicons name="star" size={28} color={Colors.saffron} />
                            <Text style={styles.upgradePrice}>₹99 / {getText('माह', 'month')}</Text>
                        </View>
                        <Text style={styles.upgradeTitle}>{getText('प्रीमियम में अपग्रेड करें', 'Upgrade to Premium')}</Text>

                        <View style={styles.featuresList}>
                            {[
                                { hindi: 'असीमित AI वकील एक्सेस', english: 'Unlimited AI Lawyer Access' },
                                { hindi: 'स्मार्ट डॉक्यूमेंट जनरेटर', english: 'Smart Document Generator' },
                                { hindi: 'हाई-क्वालिटी डॉक स्कैनर', english: 'High-Quality Doc Scanner' },
                                { hindi: 'विज्ञापन मुक्त अनुभव', english: 'Ad-Free Experience' },
                            ].map((f, i) => (
                                <View key={i} style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={18} color={Colors.saffron} />
                                    <Text style={styles.featureText}>{getText(f.hindi, f.english)}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                            <Text style={styles.upgradeButtonText}>{getText('अभी अपग्रेड करें', 'Upgrade Now')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.menuSection}>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="document-text-outline" size={24} color={Colors.textPrimary} />
                        <Text style={styles.menuItemText}>{getText('मेरे डॉक्यूमेंट्स', 'My Documents')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="card-outline" size={24} color={Colors.textPrimary} />
                        <Text style={styles.menuItemText}>{getText('सदस्यता विवरण', 'Subscription Details')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
                        <Text style={styles.menuItemText}>{getText('सेटिंग्स', 'Settings')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={async () => {
                            await supabase.auth.signOut();
                            setIsLoggedIn(false);
                            setUserEmail('');
                            router.replace('/');
                        }}
                    >
                        <Ionicons name="log-out-outline" size={24} color={Colors.red} />
                        <Text style={styles.logoutText}>{getText('लॉग आउट', 'Logout')}</Text>
                    </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    loginContainer: {
        flexGrow: 1,
        padding: 30,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.deepBlue,
        marginTop: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: Colors.saffron,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
        elevation: 4,
        shadowColor: Colors.saffron,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    loginButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    signupText: {
        color: Colors.lightBlue,
        fontSize: 14,
        fontWeight: '600',
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: Colors.white,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    userEmail: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    badge: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    premiumBadge: {
        backgroundColor: Colors.saffron + '20',
        borderWidth: 1,
        borderColor: Colors.saffron,
    },
    freeBadge: {
        backgroundColor: Colors.textLight + '20',
        borderWidth: 1,
        borderColor: Colors.textLight,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    upgradeCard: {
        margin: 20,
        padding: 24,
        backgroundColor: Colors.deepBlue,
        borderRadius: 24,
        elevation: 8,
        shadowColor: Colors.deepBlue,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    upgradeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    upgradePrice: {
        fontSize: 18,
        color: Colors.saffron,
        fontWeight: '800',
    },
    upgradeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 20,
    },
    featuresList: {
        marginBottom: 24,
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        fontWeight: '500',
    },
    upgradeButton: {
        backgroundColor: Colors.saffron,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        elevation: 4,
    },
    upgradeButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    menuSection: {
        backgroundColor: Colors.white,
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    menuItemText: {
        flex: 1,
        marginLeft: 16,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: 10,
    },
    logoutText: {
        marginLeft: 16,
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.red,
    },
});
