import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../context/AppContext';
import { LightColors, DarkColors } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen() {
    const { theme, toggleTheme, setIsLoggedIn, setUserEmail, setUser } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const styles = getStyles(Colors);
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        // Referral logic
        let initialPlan = 'free';
        let initialPoints = 0;
        let referredBy = null;

        if (referralCode.trim()) {
            // Mock validation: if code exists, give 7 days premium or points
            Alert.alert('Referral Applied!', 'You will get 7 days of Silver Premium free!');
            initialPlan = 'silver';
            referredBy = referralCode.trim();
        }

        const newUser = {
            name: name,
            email: email,
            plan: initialPlan,
            points: initialPoints,
            referralCode: 'NM' + Math.floor(1000 + Math.random() * 9000),
            referredBy: referredBy,
            premiumExpiry: initialPlan !== 'free' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
        };

        try {
            await AsyncStorage.setItem('nyaymitra_user', JSON.stringify(newUser));

            // Sync with SideDrawer referral_data
            const existingData = await AsyncStorage.getItem('referral_data');
            const referralStore = existingData ? JSON.parse(existingData) : {
                myCode: newUser.referralCode,
                totalReferred: 0,
                referredList: [],
                totalRewardDays: 0,
                pendingReward: null
            };

            if (referredBy) {
                referralStore.referredList.push({
                    name: 'NM Referral: ' + referredBy,
                    date: new Date().toLocaleDateString(),
                    status: 'Awarded'
                });
                referralStore.totalRewardDays += 7;
                await AsyncStorage.setItem('referral_data', JSON.stringify(referralStore));
            } else if (!existingData) {
                await AsyncStorage.setItem('referral_data', JSON.stringify(referralStore));
            }

            setUser(newUser as any);
            setUserEmail(email);
            setIsLoggedIn(true);
            router.replace('/(tabs)');
        } catch {
            Alert.alert('Error', 'Failed to create account');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={toggleTheme}>
                            <Text style={{ fontSize: 24 }}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="person-add" size={50} color={Colors.white} />
                        </View>
                        <Text style={styles.appName}>Join NyayMitra</Text>
                        <Text style={styles.tagline}>Get expert legal help in minutes</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.title}>Create Account</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor={Colors.textSecondary}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={Colors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={Colors.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <View style={[styles.inputContainer, { borderColor: referralCode ? Colors.saffron : Colors.border }]}>
                            <Ionicons name="gift-outline" size={20} color={referralCode ? Colors.saffron : Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Referral Code (Optional)"
                                placeholderTextColor={Colors.textSecondary}
                                value={referralCode}
                                onChangeText={setReferralCode}
                                autoCapitalize="characters"
                            />
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.signupButton,
                                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
                            ]}
                            onPress={handleSignup}
                        >
                            <Text style={styles.signupButtonText}>Sign Up</Text>
                        </Pressable>

                        <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
                            <Text style={styles.loginText}>
                                Already have an account? <Text style={styles.loginHighlight}>Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const getStyles = (Colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.deepBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 10,
        ...Platform.select({
            web: { boxShadow: `0px 5px 10px ${Colors.deepBlue}4D` },
            default: {
                shadowColor: Colors.deepBlue,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            }
        })
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.deepBlue,
    },
    tagline: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    form: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        elevation: 5,
        ...Platform.select({
            web: { boxShadow: '0px 2px 10px rgba(0,0,0,0.1)' },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            }
        })
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: Colors.textPrimary,
        fontSize: 16,
    },
    signupButton: {
        backgroundColor: Colors.deepBlue,
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        elevation: 4,
        ...Platform.select({
            web: { boxShadow: `0px 4px 8px ${Colors.deepBlue}4D` },
            default: {
                shadowColor: Colors.deepBlue,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            }
        })
    },
    signupButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    loginHighlight: {
        color: Colors.deepBlue,
        fontWeight: 'bold',
    },
});
