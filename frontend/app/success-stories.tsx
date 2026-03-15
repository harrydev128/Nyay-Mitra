import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    FlatList,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';

interface StoryItem {
    name: string;
    city: string;
    category: string;
    story: string;
    rating: number;
    isUser?: boolean;
}

const PRESET_STORIES: StoryItem[] = [
    { name: 'रामेश कुमार', city: 'लखनऊ', category: 'किरायेदार', story: 'मकान मालिक ने बिना नोटिस दिए मुझे निकालने की धमकी दी। NyayMitra की मदद से मैंने अपने अधिकार जाने और ₹50,000 सुरक्षा राशि वापस मिली।', rating: 5 },
    { name: 'प्रिया शर्मा', city: 'दिल्ली', category: 'पुलिस', story: 'ऑटो एक्सीडेंट में पुलिस FIR दर्ज नहीं कर रही थी। NyayMitra ने बताया कि FIR दर्ज करना पुलिस की ड्यूटी है। 2 दिन में FIR दर्ज हुई।', rating: 5 },
    { name: 'अजय सिंह', city: 'मुंबई', category: 'उपभोक्ता', story: 'ऑनलाइन खरीदा फोन खराब निकला। NyayMitra से उपभोक्ता शिकायत फॉर्म बनाया और कंपनी ने पूरा पैसा वापस किया।', rating: 5 },
    { name: 'सुनीता देवी', city: 'जयपुर', category: 'श्रम', story: 'फैक्ट्री में 3 महीने से वेतन नहीं मिला। NyayMitra ने श्रम कानून समझाया और श्रम अदालत में शिकायत दर्ज करवाई। पूरा वेतन मिला।', rating: 5 },
    { name: 'मोहन लाल', city: 'भोपाल', category: 'किरायेदार', story: 'मकान मालिक ने बिजली काट दी थी। NyayMitra ने बताया कि यह गैरकानूनी है। लीगल नोटिस भेजा और बिजली 24 घंटे में वापस आई।', rating: 5 },
    { name: 'अंजलि गुप्ता', city: 'कोलकाता', category: 'उपभोक्ता', story: 'ब्यूटी प्रोडक्ट से स्किन एलर्जी हुई। NyayMitra ने उपभोक्ता अदालत में केस दाखिल करने में मदद की। ₹25,000 मुआवज़ा मिला।', rating: 5 },
    { name: 'राजेश यादव', city: 'पटना', category: 'पुलिस', story: 'बिना कारण पुलिस ने रात को उठा लिया। NyayMitra ने बताया कि रात में गिरफ्तारी के नियम क्या हैं। तुरंत रिहाई मिली।', rating: 4 },
    { name: 'कमला बाई', city: 'इंदौर', category: 'श्रम', story: 'घरेलू काम में न्यूनतम वेतन नहीं मिल रहा था। NyayMitra से पता चला मिनिमम वेज कितनी होनी चाहिए। अब सही वेतन मिल रहा है।', rating: 5 },
    { name: 'विकास चौहान', city: 'चेन्नई', category: 'उपभोक्ता', story: 'बिल्डर ने तय समय पर फ्लैट नहीं दिया। RERA शिकायत करने में NyayMitra ने पूरी मदद की। ₹2 लाख मुआवज़ा और possession मिला।', rating: 5 },
    { name: 'नीलम सिंह', city: 'लखनऊ', category: 'किरायेदार', story: 'डिपॉज़िट 6 महीने से नहीं वापस मिला। NyayMitra के जरिए लीगल नोटिस भेजा। 10 दिन में पूरा पैसा वापस मिला।', rating: 5 },
];

const CATEGORY_COLORS: Record<string, string> = {
    'किरायेदार': '#FF9800',
    'उपभोक्ता': '#4CAF50',
    'श्रम': '#2196F3',
    'पुलिस': '#F44336',
};

const StoryCard = React.memo(({ story, language, Colors, styles }: any) => {
    const getText = (hindi: string, english: string) => language === 'hindi' ? hindi : english;

    return (
        <View style={[styles.storyCard, { backgroundColor: Colors.white }, story.isUser && styles.userStoryCard]}>
            {story.isUser && (
                <View style={[styles.userBadge, { backgroundColor: Colors.saffron }]}>
                    <Text style={styles.userBadgeText}>{getText('आपकी कहानी', 'Your Story')}</Text>
                </View>
            )}
            <View style={styles.storyHeader}>
                <View style={[styles.avatarCircle, { backgroundColor: Colors.deepBlue }]}>
                    <Text style={styles.avatarText}>{story.name.charAt(0)}</Text>
                </View>
                <View style={styles.storyMeta}>
                    <Text style={[styles.storyName, { color: Colors.textPrimary }]}>{story.name}</Text>
                    <Text style={[styles.storyCity, { color: Colors.textSecondary }]}>{story.city}</Text>
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[story.category] || Colors.textLight }]}>
                    <Text style={styles.categoryText}>{story.category}</Text>
                </View>
            </View>
            <Text style={[styles.storyText, { color: Colors.textPrimary }]}>{story.story}</Text>
            <View style={styles.storyFooter}>
                <Text style={styles.stars}>{'⭐'.repeat(Math.min(story.rating, 5))}</Text>
                <Text style={[styles.quoteText, { color: Colors.textSecondary }]}>
                    {getText('"NyayMitra ने मेरी मदद की"', '"NyayMitra helped me"')}
                </Text>
            </View>
        </View>
    );
});
StoryCard.displayName = 'StoryCard';

export default function SuccessStoriesScreen() {
    const { theme } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const styles = getStyles(Colors, theme);
    const router = useRouter();
    const { language } = useAppContext();
    const [userStories, setUserStories] = useState<StoryItem[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formName, setFormName] = useState('');
    const [formCity, setFormCity] = useState('');
    const [formStory, setFormStory] = useState('');

    const getText = useCallback((hindi: string, english: string) => language === 'hindi' ? hindi : english, [language]);

    useEffect(() => {
        loadUserStories();
    }, []);

    const loadUserStories = async () => {
        try {
            const data = await AsyncStorage.getItem('user_stories');
            if (data) setUserStories(JSON.parse(data));
        } catch { }
    };

    const submitStory = useCallback(async () => {
        if (!formName.trim() || !formCity.trim() || !formStory.trim()) {
            Alert.alert('', getText('सभी फ़ील्ड भरें', 'Fill all fields'));
            return;
        }

        const newStory: StoryItem = {
            name: formName.trim(),
            city: formCity.trim(),
            category: 'उपभोक्ता',
            story: formStory.trim(),
            rating: 5,
            isUser: true,
        };

        const updated = [newStory, ...userStories];
        setUserStories(updated);
        await AsyncStorage.setItem('user_stories', JSON.stringify(updated));

        setFormName('');
        setFormCity('');
        setFormStory('');
        setShowForm(false);
        Alert.alert('✅', getText('आपकी कहानी शेयर हो गई!', 'Your story has been shared!'));
    }, [formName, formCity, formStory, userStories, getText]);

    const allStories = useMemo(() => [...userStories, ...PRESET_STORIES], [userStories]);

    const renderStory = useCallback(({ item }: { item: StoryItem }) => (
        <StoryCard story={item} language={language} Colors={Colors} styles={styles} />
    ), [language, Colors, styles]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={[styles.header, { backgroundColor: Colors.white, borderBottomColor: Colors.border }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.deepBlue} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: Colors.deepBlue }]}>{getText('सफलता की कहानियां ⭐', 'Success Stories ⭐')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={allStories}
                renderItem={renderStory}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                contentContainerStyle={styles.content}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={3}
                removeClippedSubviews={Platform.OS === 'android'}
                ListFooterComponent={
                    showForm ? (
                        <View style={[styles.formCard, { backgroundColor: Colors.white }]}>
                            <Text style={[styles.formTitle, { color: Colors.deepBlue }]}>{getText('अपनी कहानी शेयर करें', 'Share Your Story')}</Text>
                            <TextInput style={[styles.formInput, { backgroundColor: Colors.background, color: Colors.textPrimary }]} placeholder={getText('आपका नाम', 'Your Name')} placeholderTextColor={Colors.textLight} value={formName} onChangeText={setFormName} />
                            <TextInput style={[styles.formInput, { backgroundColor: Colors.background, color: Colors.textPrimary }]} placeholder={getText('शहर', 'City')} placeholderTextColor={Colors.textLight} value={formCity} onChangeText={setFormCity} />
                            <TextInput style={[styles.formInput, styles.formStoryInput, { backgroundColor: Colors.background, color: Colors.textPrimary }]} placeholder={getText('अपनी कहानी लिखें...', 'Write your story...')} placeholderTextColor={Colors.textLight} value={formStory} onChangeText={setFormStory} multiline textAlignVertical="top" />
                            <View style={styles.formBtns}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
                                    <Text style={[styles.cancelBtnText, { color: Colors.textSecondary }]}>{getText('रद्द', 'Cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.submitFormBtn, { backgroundColor: Colors.saffron }]} onPress={submitStory}>
                                    <Text style={styles.submitFormBtnText}>{getText('शेयर करें', 'Share')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity style={[styles.shareStoryBtn, { backgroundColor: Colors.saffron }]} onPress={() => setShowForm(true)}>
                            <Ionicons name="add-circle" size={22} color={Colors.white} />
                            <Text style={styles.shareStoryBtnText}>{getText('अपनी कहानी शेयर करें', 'Share Your Story')}</Text>
                        </TouchableOpacity>
                    )
                }
            />
        </SafeAreaView>
    );
}

const getStyles = (Colors: any, theme: string) => StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    content: { padding: 16, paddingBottom: 40 },
    storyCard: { borderRadius: 16, padding: 16, marginBottom: 14, elevation: 2, ...Platform.select({ web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 } }) },
    userStoryCard: { borderWidth: 2, borderColor: Colors.saffron },
    userBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, marginBottom: 8 },
    userBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.white },
    storyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    avatarCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    avatarText: { fontSize: 18, fontWeight: '700', color: '#fff' },
    storyMeta: { flex: 1 },
    storyName: { fontSize: 15, fontWeight: '700' },
    storyCity: { fontSize: 12 },
    categoryBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
    categoryText: { fontSize: 11, fontWeight: '600', color: '#fff' },
    storyText: { fontSize: 14, lineHeight: 22, marginBottom: 10 },
    storyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    stars: { fontSize: 14 },
    quoteText: { fontSize: 12, fontStyle: 'italic' },
    shareStoryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 20, gap: 8, marginTop: 8 },
    shareStoryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
    formCard: { borderRadius: 16, padding: 16, marginTop: 8, elevation: 3 },
    formTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
    formInput: { borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 10 },
    formStoryInput: { minHeight: 100 },
    formBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
    cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#ccc', alignItems: 'center' },
    cancelBtnText: { fontSize: 14, fontWeight: '600' },
    submitFormBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
    submitFormBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
