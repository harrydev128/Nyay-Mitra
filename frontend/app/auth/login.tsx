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

export default function LoginScreen() {
    const { theme, toggleTheme, setIsLoggedIn, setUserEmail, setUser } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const styles = getStyles(Colors);
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        // Dummy Login for now
        const mockUser = {
            name: email.split('@')[0],
            email: email,
            plan: 'free',
            points: 0,
            referralCode: 'USER_' + Math.floor(Math.random() * 1000),
            referredBy: null,
            premiumExpiry: null,
        };

        try {
            await AsyncStorage.setItem('nyaymitra_user', JSON.stringify(mockUser));
            setUser(mockUser as any);
            setUserEmail(email);
            setIsLoggedIn(true);
            router.replace('/(tabs)');
        } catch {
            Alert.alert('Error', 'Failed to save login session');
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
                                secureTextEntry
                            />
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.loginButton,
                                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
                            ]}
                            onPress={handleLogin}
                        >
                            <Text style={styles.loginButtonText}>Login</Text>
                        </Pressable>

                        <TouchableOpacity style={styles.signupLink} onPress={() => router.push('/auth/signup')}>
                            <Text style={styles.signupText}>
                                Don{"'"}t have an account? <Text style={styles.signupHighlight}>Sign Up</Text>
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
        marginBottom: 40,
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.saffron,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 10,
        ...Platform.select({
            web: { boxShadow: `0px 5px 10px ${Colors.saffron}4D` },
            default: {
                shadowColor: Colors.saffron,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            }
        })
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.deepBlue,
    },
    tagline: {
        fontSize: 16,
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
        fontSize: 24,
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
    loginButton: {
        backgroundColor: Colors.saffron,
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        elevation: 4,
        ...Platform.select({
            web: { boxShadow: `0px 4px 8px ${Colors.saffron}4D` },
            default: {
                shadowColor: Colors.saffron,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            }
        })
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
        color: Colors.textSecondary,
        fontSize: 14,
    },
    signupHighlight: {
        color: Colors.saffron,
        fontWeight: 'bold',
    },
});
