import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    FlatList,
    Platform,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';
import HeaderToggle from '../components/HeaderToggle';

interface CaseItem {
    id: string;
    problem: string;
    solution: any;
    rawResponse: string;
    status: string;
    createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
    'नया': '#FFC107',
    'जारी है': '#2196F3',
    'हल हुआ': '#4CAF50',
};

const CaseCard = React.memo(({ item, language, Colors, theme, expandedId, setExpandedId, onUpdateStatus, onDelete }: any) => {
    const getText = (hindi: string, english: string) => language === 'hi' ? hindi : english;
    const isExpanded = expandedId === item.id;

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
            ' ' + d.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={[styles.caseCard, { backgroundColor: Colors.white, borderColor: isExpanded ? Colors.saffron : 'transparent', borderWidth: isExpanded ? 1 : 0 }]}>
            <Pressable
                style={styles.caseSummary}
                onPress={() => setExpandedId(isExpanded ? null : item.id)}
            >
                <View style={styles.caseTop}>
                    <Text style={[styles.caseDate, { color: Colors.textSecondary }]}>{formatDate(item.createdAt)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] || Colors.textLight }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
                <Text style={[styles.caseProblem, { color: Colors.textPrimary }]} numberOfLines={isExpanded ? undefined : 2}>{item.problem}</Text>
                <View style={styles.caseExpand}>
                    <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textSecondary} />
                </View>
            </Pressable>
            {isExpanded && (
                <View style={[styles.expandedContent, { backgroundColor: theme === 'dark' ? '#1E293B' : Colors.background, borderTopColor: Colors.border }]}>
                    {item.rawResponse ? (
                        <Text style={[styles.solutionText, { color: Colors.textPrimary }]}>
                            {item.rawResponse.substring(0, 1000)}
                            {item.rawResponse.length > 1000 ? '...' : ''}
                        </Text>
                    ) : null}
                    <View style={styles.statusButtons}>
                        <TouchableOpacity style={[styles.statusBtn, { backgroundColor: '#2196F3' }]} onPress={() => onUpdateStatus(item.id, 'जारी है')}>
                            <Text style={styles.statusBtnText}>{getText('In Progress', 'In Progress')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.statusBtn, { backgroundColor: '#4CAF50' }]} onPress={() => onUpdateStatus(item.id, 'हल हुआ')}>
                            <Text style={styles.statusBtnText}>{getText('हल हुआ', 'Resolved')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.statusBtn, { backgroundColor: Colors.red, flex: 0.3 }]} onPress={() => onDelete(item.id)}>
                            <Ionicons name="trash" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
});

export default function MyCasesScreen() {
    const { theme } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const router = useRouter();
    const { language } = useAppContext();
    const [cases, setCases] = useState<CaseItem[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const getText = (hi: string, en: string) => language === 'hi' ? hi : en;

    const loadCases = useCallback(async () => {
        try {
            const data = await AsyncStorage.getItem('my_cases');
            if (data) setCases(JSON.parse(data).reverse());
        } catch { }
    }, []);

    useFocusEffect(useCallback(() => { loadCases(); }, [loadCases]));

    const updateStatus = useCallback(async (id: string, newStatus: string) => {
        const updated = cases.map(c => c.id === id ? { ...c, status: newStatus } : c);
        setCases(updated);
        await AsyncStorage.setItem('my_cases', JSON.stringify([...updated].reverse()));
    }, [cases]);

    const deleteCase = useCallback((id: string) => {
        Alert.alert(getText('केस हटाएं?', 'Delete?'), getText('हटाना चाहते हैं?', 'Delete this?'), [
            { text: getText('नहीं', 'No'), style: 'cancel' },
            {
                text: getText('हां', 'Yes'), style: 'destructive', onPress: async () => {
                    const filtered = cases.filter(c => c.id !== id);
                    setCases(filtered);
                    await AsyncStorage.setItem('my_cases', JSON.stringify([...filtered].reverse()));
                }
            }
        ]);
    }, [cases, language]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top']}>
            <View style={[styles.header, { backgroundColor: Colors.white, borderBottomColor: Colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><Ionicons name="arrow-back" size={24} color={Colors.deepBlue} /></TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={[styles.headerTitle, { color: Colors.deepBlue }]}>{getText('मेरे केस 📋', 'My Cases 📋')}</Text>
                </View>
                <HeaderToggle />
            </View>
            <FlatList
                data={cases} keyExtractor={m => m.id} contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => <CaseCard item={item} language={language} Colors={Colors} theme={theme} expandedId={expandedId} setExpandedId={setExpandedId} onUpdateStatus={updateStatus} onDelete={deleteCase} />}
                ListEmptyComponent={<View style={styles.empty}><Ionicons name="folder-open-outline" size={64} color={Colors.textLight} /><Text style={[styles.emptyTitle, { color: Colors.textPrimary }]}>{getText('कोई केस नहीं', 'No Cases')}</Text></View>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    backBtn: { padding: 4 },
    caseCard: { borderRadius: 16, marginBottom: 12, elevation: 2, ...Platform.select({ web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 } }), overflow: 'hidden' },
    caseSummary: { padding: 16 },
    caseTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    caseDate: { fontSize: 12 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
    statusText: { fontSize: 11, fontWeight: '700', color: '#fff' },
    caseProblem: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
    caseExpand: { alignItems: 'center', marginTop: 8 },
    expandedContent: { borderTopWidth: 1, padding: 16 },
    solutionText: { fontSize: 13, lineHeight: 20, marginBottom: 16 },
    statusButtons: { flexDirection: 'row', gap: 8 },
    statusBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    statusBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
    empty: { alignItems: 'center', marginTop: 100 },
    emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 16 },
});
