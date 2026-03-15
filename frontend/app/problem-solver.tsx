import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    Linking,
    Platform,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';
import { Config } from '../constants/Config';

interface SolutionData {
    rights: string[];
    actions: string[];
    helpline: string;
    document_type: string;
}

export default function ProblemSolverScreen() {
    const { theme, toggleTheme } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const styles = getStyles(Colors);
    const isDark = theme === 'dark';

    // Dark mode color variables
    const textPrimary = isDark ? '#FFFFFF' : '#1a237e';
    const textSecondary = isDark ? '#CCCCCC' : '#555555';
    const textBody = isDark ? '#EEEEEE' : '#333333';
    const cardBg = isDark ? '#243447' : '#FFFFFF';
    const pageBg = isDark ? '#0D1B2A' : '#F5F5F5';
    const dividerColor = isDark ? '#2A3F55' : '#E0E0E0';
    const inputBg = isDark ? '#1B2B3B' : '#FFFFFF';

    const router = useRouter();
    const { language } = useAppContext();
    const [problemText, setProblemText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [solution, setSolution] = useState<SolutionData | null>(null);

    const getText = useCallback((hi: string, en: string) => language === 'hindi' ? hi : en, [language]);

    const handleSubmit = async () => {
        if (!problemText.trim()) {
            Alert.alert(getText('विवरण', 'Required'), getText('समस्या लिखें।', 'Describe problem.'));
            return;
        }
        setIsLoading(true);
        setSolution(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        try {
            const prompt = `Case Study: ${problemText.trim()}. Provide JSON with keys: rights (string[]), actions (string[]), helpline (string), document_type (string)`;
            const res = await fetch(`${Config.API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: prompt }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) throw new Error('API request failed');

            const data = await res.json();
            const txt = data.response || '';
            let parsed: SolutionData | null = null;

            try {
                const match = txt.match(/\{[\s\S]*\}/);
                if (match) {
                    parsed = JSON.parse(match[0]);
                }
            } catch (err) {
                console.warn('JSON Parse Error:', err);
            }

            if (!parsed || !parsed.rights) {
                parsed = {
                    rights: [getText('संबंधित अधिकार', 'Legal Rights')],
                    actions: [getText('AI वकील से और पूछें', 'Ask AI Lawyer more')],
                    helpline: '112',
                    document_type: getText('शिकायत', 'Complaint')
                };
            }

            setSolution(parsed);

            const c = {
                id: `c_${Date.now()}`,
                problem: problemText.trim(),
                solution: parsed,
                rawResponse: txt,
                status: getText('नया', 'New'),
                createdAt: new Date().toISOString()
            };

            const existingCases = await AsyncStorage.getItem('my_cases');
            const cases = existingCases ? JSON.parse(existingCases) : [];
            cases.push(c);
            await AsyncStorage.setItem('my_cases', JSON.stringify(cases));
        } catch (error: any) {
            console.error('Submission Error:', error);
            if (error.name === 'AbortError') {
                Alert.alert(getText('त्रुटि', 'Error'), getText('समय समाप्त हो गया। कृपया फिर से प्रयास करें।', 'Request timed out. Please try again.'));
            } else {
                Alert.alert(getText('त्रुटि', 'Error'), getText('कुछ गलत हुआ। कृपया फिर से प्रयास करें।', 'Something went wrong. Please try again.'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: pageBg }]} edges={['top']}>
            <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: dividerColor }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><Ionicons name="arrow-back" size={24} color={textPrimary} /></TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textPrimary }]}>{getText('हल खोजें ⚖️', 'Solve ⚖️')}</Text>
                <TouchableOpacity style={{ marginRight: 16 }} onPress={toggleTheme}><Text style={{ fontSize: 22 }}>{theme === 'dark' ? '🌙' : '☀️'}</Text></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {!solution && (
                    <>
                        <Text style={[styles.label, { color: textPrimary }]}>{getText('समस्या लिखें:', 'Describe Problem:')}</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor: dividerColor, borderWidth: 1 }]}
                            multiline
                            placeholder={getText('यहाँ अपनी समस्या विस्तार से लिखें...', 'Type your problem in detail here...')}
                            placeholderTextColor={textSecondary}
                            value={problemText}
                            onChangeText={setProblemText}
                        />
                        <Pressable
                            style={({ pressed }) => [styles.btn, { backgroundColor: Colors.saffron }, (isLoading || !problemText.trim()) && styles.disabled, pressed && { opacity: 0.8 }]}
                            onPress={handleSubmit}
                            disabled={isLoading || !problemText.trim()}
                        >
                            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{getText('समाधान खोजें', 'Find Solution')}</Text>}
                        </Pressable>
                    </>
                )}
                {solution && !isLoading && (
                    <>
                        <View style={[styles.card, { borderLeftColor: Colors.deepBlue, backgroundColor: cardBg }]}>
                            <Text style={[styles.cardT, { color: textPrimary }]}>⚖️ {getText('अधिकार', 'Rights')}</Text>
                            {solution.rights.map((r, i) => (
                                <Text key={i} style={[styles.t, { color: textBody }]}>• {r}</Text>
                            ))}
                        </View>
                        <View style={[styles.card, { borderLeftColor: Colors.saffron, backgroundColor: cardBg }]}>
                            <Text style={[styles.cardT, { color: textPrimary }]}>⚡ {getText('उपाय', 'Actions')}</Text>
                            {solution.actions.map((a, i) => (
                                <Text key={i} style={[styles.t, { color: textBody }]}>{i + 1}. {a}</Text>
                            ))}
                        </View>
                        <TouchableOpacity style={[styles.call, { backgroundColor: Colors.green }]} onPress={() => Linking.openURL(`tel:${solution.helpline}`)}>
                            <Ionicons name="call" size={20} color="#fff" />
                            <Text style={styles.callT}>{solution.helpline}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.new, { borderColor: Colors.saffron }]} onPress={() => { setSolution(null); setProblemText(''); }}>
                            <Text style={{ color: Colors.saffron, fontWeight: 'bold' }}>{getText('नया सवाल', 'Ask New')}</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (Colors: any) => StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    backBtn: { padding: 4 },
    content: { padding: 20 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
    input: { borderRadius: 16, padding: 16, fontSize: 15, minHeight: 180, elevation: 2, ...Platform.select({ web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 } }), marginBottom: 16 },
    btn: { paddingVertical: 14, borderRadius: 24, alignItems: 'center', elevation: 3 },
    btnText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
    disabled: { opacity: 0.5 },
    card: { borderRadius: 16, padding: 16, marginBottom: 16, borderLeftWidth: 4, elevation: 2, ...Platform.select({ web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 } }) },
    cardT: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    t: { fontSize: 14, lineHeight: 22, marginBottom: 4 },
    call: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 10, marginBottom: 16 },
    callT: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    new: { padding: 14, borderRadius: 12, borderWidth: 2, alignItems: 'center' },
});

