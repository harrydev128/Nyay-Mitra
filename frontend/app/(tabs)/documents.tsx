import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
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
import { LightColors, DarkColors } from '../../constants/colors';
import { useAppContext } from '../../context/AppContext';

const { width } = Dimensions.get('window');

interface GeneratedDoc {
    id: string;
    type: string;
    content: string;
    createdAt: string;
}

const DocCard = React.memo(({ doc, language, Colors, onView, onDelete }: any) => {
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <View style={[styles.docCard, { backgroundColor: Colors.cardBackground, borderColor: Colors.border }]}>
            <View style={[styles.docIconBgSmall, { backgroundColor: Colors.background }]}>
                <Ionicons name="document-text" size={24} color={Colors.saffron} />
            </View>
            <View style={styles.docInfo}>
                <Text style={[styles.docType, { color: Colors.textPrimary }]} numberOfLines={1}>{doc.type}</Text>
                <Text style={[styles.docDate, { color: Colors.textSecondary }]}>{formatDate(doc.createdAt)}</Text>
            </View>
            <View style={styles.docActions}>
                <TouchableOpacity style={[styles.viewBtn, { backgroundColor: Colors.background }]} onPress={() => onView(doc)}>
                    <Ionicons name="eye-outline" size={22} color={Colors.deepBlue} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: Colors.background }]} onPress={() => onDelete(doc.id)}>
                    <Ionicons name="trash-outline" size={22} color={Colors.red} />
                </TouchableOpacity>
            </View>
        </View>
    );
});
DocCard.displayName = 'DocCard';

export default function DocumentsScreen() {
    const { theme, toggleTheme, language, setLanguage } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const router = useRouter();
    const [recentDocs, setRecentDocs] = useState<GeneratedDoc[]>([]);

    const getText = (hindi: string, english: string) => language === 'hi' ? hindi : english;

    const loadRecentDocs = useCallback(async () => {
        try {
            const data = await AsyncStorage.getItem('generated_docs');
            if (data) {
                const docs: GeneratedDoc[] = JSON.parse(data);
                setRecentDocs([...docs].reverse());
            }
        } catch { }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadRecentDocs();
        }, [loadRecentDocs])
    );

    const handleDelete = useCallback((id: string) => {
        Alert.alert(
            getText('दस्तावेज़ हटाएं', 'Delete Document'),
            getText('क्या आप इसे हटाना चाहते हैं?', 'Do you want to delete this?'),
            [
                { text: getText('नहीं', 'No'), style: 'cancel' },
                {
                    text: getText('हाँ, हटाएं', 'Yes, Delete'),
                    style: 'destructive',
                    onPress: async () => {
                        const data = await AsyncStorage.getItem('generated_docs');
                        if (data) {
                            const docs: GeneratedDoc[] = JSON.parse(data);
                            const filtered = docs.filter(d => d.id !== id);
                            await AsyncStorage.setItem('generated_docs', JSON.stringify(filtered));
                            loadRecentDocs();
                        }
                    }
                }
            ]
        );
    }, [language, loadRecentDocs]);

    const handleView = useCallback((doc: GeneratedDoc) => {
        Alert.alert(doc.type, doc.content);
    }, []);

    const renderDoc = useCallback(({ item }: { item: GeneratedDoc }) => (
        <DocCard doc={item} language={language} Colors={Colors} onView={handleView} onDelete={handleDelete} />
    ), [language, Colors, handleView, handleDelete]);

    const ListHeader = useMemo(() => (
        <View>
            <View style={styles.cardsRow}>
                <Pressable
                    style={({ pressed }) => [styles.mainCard, { backgroundColor: Colors.cardBackground }, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
                    onPress={() => router.push('/doc-generator')}
                >
                    <View style={[styles.cardIconBg, { backgroundColor: Colors.saffron }]}>
                        <Ionicons name="document-text" size={36} color={Colors.white} />
                    </View>
                    <Text style={styles.cardEmoji}>📝</Text>
                    <Text style={[styles.cardTitle, { color: Colors.textPrimary }]}>{getText('दस्तावेज़ बनाएं', 'Create Document')}</Text>
                    <Text style={[styles.cardDesc, { color: Colors.textSecondary }]}>{getText('FIR, नोटिस', 'FIR, Notice')}</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [styles.mainCard, { backgroundColor: Colors.cardBackground }, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
                    onPress={() => router.push('/doc-scanner')}
                >
                    <View style={[styles.cardIconBg, { backgroundColor: Colors.deepBlue }]}>
                        <Ionicons name="scan" size={36} color={Colors.white} />
                    </View>
                    <Text style={styles.cardEmoji}>🔍</Text>
                    <Text style={[styles.cardTitle, { color: Colors.textPrimary }]}>{getText('दस्तावेज़ स्कैन करें', 'Scan Document')}</Text>
                    <Text style={[styles.cardDesc, { color: Colors.textSecondary }]}>{getText('फोटो से टेक्स्ट', 'Text from photo')}</Text>
                </Pressable>
            </View>

            <View style={styles.recentSectionHeader}>
                <Text style={[styles.sectionTitle, { color: Colors.textPrimary }]}>{getText('इतिहास', 'History')}</Text>
            </View>
        </View>
    ), [Colors, language, router]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top']}>
            <View style={[styles.header, { backgroundColor: Colors.cardBackground, borderBottomColor: Colors.border }]}>
                <View style={styles.headerTop}>
                    <Text style={[styles.headerTitle, { color: Colors.deepBlue }]}>{getText('दस्तावेज़', 'Documents')}</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={{ marginRight: 16 }} onPress={toggleTheme}>
                            <Text style={{ fontSize: 22 }}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.langToggle, { backgroundColor: Colors.deepBlue }]} onPress={() => setLanguage(language === 'hi' ? 'english' : 'hi')}>
                            <Text style={styles.langText}>{language === 'hi' ? 'EN' : 'हि'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <FlatList
                data={recentDocs}
                renderItem={renderDoc}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={[styles.emptyState, { backgroundColor: Colors.cardBackground }]}>
                        <Ionicons name="document-outline" size={60} color={Colors.textSecondary} />
                        <Text style={[styles.emptyText, { color: Colors.textSecondary }]}>{getText('अभी कोई दस्तावेज़ नहीं।', 'No documents saved yet.')}</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerIcons: { flexDirection: 'row', alignItems: 'center' },
    langToggle: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
    langText: { color: '#fff', fontWeight: '700', fontSize: 12 },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    cardsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 20, gap: 12 },
    mainCard: { flex: 1, borderRadius: 20, padding: 16, alignItems: 'center', elevation: 4, ...Platform.select({ web: { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 } }), minHeight: 180 },
    cardIconBg: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    cardEmoji: { fontSize: 20, marginBottom: 4 },
    cardTitle: { fontSize: 14, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
    cardDesc: { fontSize: 11, textAlign: 'center' },
    recentSectionHeader: { marginHorizontal: 16, marginTop: 24, marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    emptyState: { alignItems: 'center', paddingVertical: 60, borderRadius: 20, margin: 16 },
    emptyText: { fontSize: 14, textAlign: 'center', marginTop: 16 },
    docCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12, padding: 12, borderRadius: 16, borderWidth: 1 },
    docIconBgSmall: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    docInfo: { flex: 1 },
    docType: { fontSize: 15, fontWeight: '600' },
    docDate: { fontSize: 12, marginTop: 4 },
    docActions: { flexDirection: 'row', gap: 8 },
    viewBtn: { padding: 8, borderRadius: 10 },
    deleteBtn: { padding: 8, borderRadius: 10 },
});
