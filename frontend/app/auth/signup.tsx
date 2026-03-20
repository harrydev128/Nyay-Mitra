import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, KeyboardAvoidingView, Platform, ScrollView, Pressable, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../context/AppContext';
import { LightColors, DarkColors } from '../../constants/colors';
import { supabase } from '../../services/supabase';

export default function SignupScreen() {
    const { theme, toggleTheme, setIsLoggedIn, setUserEmail, setUser } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const styles = getStyles(Colors);
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert('त्रुटि', 'कृपया सभी जरूरी जानकारी भरें');
            return;
        }
        if (password.length < 6) {
            Alert.alert('त्रुटि', 'Password कम से कम 6 अक्षर का होना चाहिए');
            return;
        }
        setLoading(true);
        try {
            const myReferralCode = 'NM' + Math.floor(1000 + Math.random() * 9000);
            const premiumExpiry = referralCode.trim()
                ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                : null;

            const { data, error } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password: password,
                options: {
                    data: {
                        name: name.trim(),
                        referral_code: myReferralCode,
                        referred_by: referralCode.trim() || null,
                        plan: referralCode.trim() ? 'silver' : 'free',
                        premium_expiry: premiumExpiry,
                        points: 0,
                    }
                }
            });

            if (error) {
                if (error.message.includes('already registered')) {
                    Alert.alert('Email पहले से है', 'यह Email पहले से registered है। Login करें।');
                } else {
                    Alert.alert('Error', error.message);
                }
                return;
            }

            if (data.user) {
                // Insert profile in profiles table
                await supabase.from('profiles').upsert({
                    id: data.user.id,
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    plan: referralCode.trim() ? 'silver' : 'free',
                    points: 0,
                    referral_code: myReferralCode,
                    referred_by: referralCode.trim() || null,
                    premium_expiry: premiumExpiry,
                    created_at: new Date().toISOString(),
                });

                if (referralCode.trim()) {
                    Alert.alert('🎉 Referral Applied!', 'आपको 7 दिन Silver Premium FREE मिला!');
                }

                const userData = {
                    id: data.user.id,
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    plan: referralCode.trim() ? 'silver' : 'free',
                    points: 0,
                    referralCode: myReferralCode,
                    referredBy: referralCode.trim() || null,
                    premiumExpiry: premiumExpiry,
                };

                Alert.alert(
                    '📧 Email Verify करें',
                    'आपके Gmail पर एक confirmation link भेजा गया है। कृपया उसे click करके account verify करें, फिर Login करें।',
                    [{ text: 'Login करें', onPress: () => router.replace('/auth/login') }]
                );
            }
        } catch (e) {
            Alert.alert('Error', 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={toggleTheme}>
                            <Text style={{ fontSize: 24 }}>{theme === 'dark' ? 'moon' : 'sun'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="person-add" size={50} color={Colors.white} />
                        </View>
                        <Text style={styles.appName}>Join NyayMitra</Text>
                        <Text style={styles.tagline}>भारत का AI कानूनी सहायक</Text>
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.title}>Account बनाएं</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="पूरा नाम (Full Name)"
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
                                placeholder="Password (minimum 6 characters)"
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
                                placeholder="Referral Code (Optional) - 7 दिन FREE"
                                placeholderTextColor={Colors.textSecondary}
                                value={referralCode}
                                onChangeText={setReferralCode}
                                autoCapitalize="characters"
                            />
                        </View>
                        <Pressable
                            style={({ pressed }) => [styles.signupButton, pressed && { opacity: 0.8 }]}
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.signupButtonText}>Sign Up</Text>
                            }
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
    container: { flex: 1, backgroundColor: Colors.background },
    scrollContent: { flexGrow: 1, padding: 24 },
    header: { alignItems: 'flex-end', marginBottom: 20 },
    logoContainer: { alignItems: 'center', marginBottom: 30 },
    logoCircle: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: Colors.deepBlue,
        justifyContent: 'center', alignItems: 'center', marginBottom: 16, elevation: 10,
    },
    appName: { fontSize: 28, fontWeight: 'bold', color: Colors.deepBlue },
    tagline: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
    form: { backgroundColor: Colors.white, borderRadius: 20, padding: 24, elevation: 5 },
    title: { fontSize: 22, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 24, textAlign: 'center' },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.background, borderRadius: 12,
        marginBottom: 16, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, height: 50, color: Colors.textPrimary, fontSize: 16 },
    signupButton: {
        backgroundColor: Colors.deepBlue, height: 55, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 4,
    },
    signupButtonText: { color: Colors.white, fontSize: 18, fontWeight: 'bold' },
    loginLink: { marginTop: 20, alignItems: 'center' },
    loginText: { color: Colors.textSecondary, fontSize: 14 },
    loginHighlight: { color: Colors.deepBlue, fontWeight: 'bold' },
});
