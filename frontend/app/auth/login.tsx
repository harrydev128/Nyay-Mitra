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

export default function LoginScreen() {
    const { theme, toggleTheme, setIsLoggedIn, setUserEmail, setUser } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const styles = getStyles(Colors);
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('त्रुटि', 'कृपया Email और Password भरें');
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password: password,
            });
            if (error) {
                if (error.message.includes('Invalid login')) {
                    Alert.alert('गलत जानकारी', 'Email या Password गलत है');
                } else if (error.message.includes('Email not confirmed')) {
                    Alert.alert('Email Verify करें', 'कृपया अपना Email verify करें');
                } else {
                    Alert.alert('Error', error.message);
                }
                return;
            }
            if (data.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                const userData = {
                    id: data.user.id,
                    name: profile?.name || email.split('@')[0],
                    email: data.user.email || email,
                    plan: profile?.plan || 'free',
                    points: profile?.points || 0,
                    referralCode: profile?.referral_code || 'NM' + Math.floor(1000 + Math.random() * 9000),
                    referredBy: profile?.referred_by || null,
                    premiumExpiry: profile?.premium_expiry || null,
                };
                setUser(userData as any);
                setUserEmail(userData.email);
                setIsLoggedIn(true);
                router.replace('/(tabs)');
            }
        } catch (e) {
            Alert.alert('Error', 'Login failed. Please try again.');
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
                            <Text style={{ fontSize: 24 }}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="scale-outline" size={60} color={Colors.white} />
                        </View>
                        <Text style={styles.appName}>NyayMitra</Text>
                        <Text style={styles.tagline}>भारत का AI वकील</Text>
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.title}>Login</Text>
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
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <Pressable
                            style={({ pressed }) => [styles.loginButton, pressed && { opacity: 0.8 }]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.loginButtonText}>Login</Text>
                            }
                        </Pressable>
                        <TouchableOpacity style={styles.signupLink} onPress={() => router.push('/auth/signup')}>
                            <Text style={styles.signupText}>
                                Don't have an account? <Text style={styles.signupHighlight}>Sign Up</Text>
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
    logoContainer: { alignItems: 'center', marginBottom: 40 },
    logoCircle: {
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: Colors.saffron,
        justifyContent: 'center', alignItems: 'center', marginBottom: 16, elevation: 10,
    },
    appName: { fontSize: 32, fontWeight: 'bold', color: Colors.deepBlue },
    tagline: { fontSize: 16, color: Colors.textSecondary, marginTop: 4 },
    form: { backgroundColor: Colors.white, borderRadius: 20, padding: 24, elevation: 5 },
    title: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 24, textAlign: 'center' },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.background, borderRadius: 12,
        marginBottom: 16, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, height: 50, color: Colors.textPrimary, fontSize: 16 },
    loginButton: {
        backgroundColor: Colors.saffron, height: 55, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 4,
    },
    loginButtonText: { color: Colors.white, fontSize: 18, fontWeight: 'bold' },
    signupLink: { marginTop: 20, alignItems: 'center' },
    signupText: { color: Colors.textSecondary, fontSize: 14 },
    signupHighlight: { color: Colors.saffron, fontWeight: 'bold' },
});
