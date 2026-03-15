import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
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

interface BookmarkItem {
    id: string;
    name: string;
    emoji: string;
    description: string;
    savedAt: string;
}

export default function BookmarksScreen() {
    const { theme } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const styles = getStyles(Colors, theme);
    const router = useRouter();
    const { language } = useAppContext();
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

    const getText = (hindi: string, english: string) => language === 'hindi' ? hindi : english;

    const loadBookmarks = useCallback(async () => {
        try {
            const data = await AsyncStorage.getItem('bookmarks');
            if (data) setBookmarks(JSON.parse(data).reverse());
        } catch { }
    }, []);

    useFocusEffect(useCallback(() => { loadBookmarks(); }, [loadBookmarks]));

    const removeBookmark = async (id: string) => {
        const filtered = bookmarks.filter(b => b.id !== id);
        setBookmarks(filtered);
        await AsyncStorage.setItem('bookmarks', JSON.stringify([...filtered].reverse()));
        Alert.alert('', getText('हटाया गया', 'Removed'));
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top']}>
            <View style={[styles.header, { backgroundColor: Colors.white, borderBottomColor: Colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.deepBlue} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: Colors.deepBlue }]}>{getText('सेव किए अधिकार 🔖', 'Saved Rights 🔖')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {bookmarks.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>🔖</Text>
                        <Text style={[styles.emptyTitle, { color: Colors.textPrimary }]}>{getText('कोई अधिकार सेव नहीं', 'No Rights Saved')}</Text>
                        <Text style={[styles.emptyText, { color: Colors.textSecondary }]}>{getText('अधिकार पेज पर 🔖 दबाएं।', 'Press 🔖 on Rights page.')}</Text>
                        <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: Colors.saffron }]} onPress={() => router.push('/(tabs)/rights')}>
                            <Text style={styles.emptyBtnText}>{getText('अधिकार देखें', 'View Rights')}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    bookmarks.map((item) => (
                        <Pressable
                            key={item.id}
                            style={({ pressed }) => [styles.bookmarkCard, { backgroundColor: Colors.white }, pressed && { opacity: 0.9 }]}
                            onPress={() => router.push(`/rights/${item.id}`)}
                        >
                            <Text style={styles.bookmarkEmoji}>{item.emoji || '⚖️'}</Text>
                            <View style={styles.bookmarkInfo}>
                                <Text style={[styles.bookmarkName, { color: Colors.textPrimary }]}>{item.name}</Text>
                                <Text style={[styles.bookmarkDesc, { color: Colors.textSecondary }]} numberOfLines={2}>{item.description}</Text>
                            </View>
                            <View style={styles.bookmarkActions}>
                                <TouchableOpacity onPress={() => removeBookmark(item.id)} style={styles.removeBtn}>
                                    <Ionicons name="close-circle" size={24} color={Colors.red} />
                                </TouchableOpacity>
                            </View>
                        </Pressable>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (Colors: any, theme: string) => StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    backButton: { padding: 8 },
    content: { padding: 16, paddingBottom: 40 },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyEmoji: { fontSize: 64 },
    emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 16 },
    emptyText: { fontSize: 14, marginTop: 4, marginBottom: 20 },
    emptyBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
    emptyBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
    bookmarkCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 14, marginBottom: 10, elevation: 2, ...Platform.select({ web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 } }) },
    bookmarkEmoji: { fontSize: 28, marginRight: 12 },
    bookmarkInfo: { flex: 1 },
    bookmarkName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
    bookmarkDesc: { fontSize: 12, lineHeight: 18 },
    bookmarkActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    removeBtn: { padding: 4 },
});
