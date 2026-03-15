import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
    Share,
    Linking,
    Platform,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors } from '../constants/colors';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';

export default function DocScannerScreen() {
    const { theme, toggleTheme } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const styles = getStyles(Colors, theme);
    const isDark = theme === 'dark';

    // Dark mode color variables
    const textPrimary = isDark ? '#FFFFFF' : '#1a237e';
    const textSecondary = isDark ? '#CCCCCC' : '#555555';
    const cardBg = isDark ? '#243447' : '#FFFFFF';
    const pageBg = isDark ? '#0D1B2A' : '#F5F5F5';
    const dividerColor = isDark ? '#2A3F55' : '#E0E0E0';

    const router = useRouter();
    const { language } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [previewUri, setPreviewUri] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<{ name: string; type: string } | null>(null);

    const getText = (hindi: string, english: string) => language === 'hindi' ? hindi : english;

    const handleCamera = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    getText('अनुमति आवश्यक', 'Permission Required'),
                    getText('दस्तावेजों को स्कैन करने के लिए कैमरा एक्सेस की आवश्यकता है', 'Camera access needed to scan documents'),
                    [{ text: 'Cancel' }, { text: 'Settings', onPress: () => Linking.openSettings() }]
                );
                return;
            }
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                base64: true,
                allowsEditing: true,
            });
            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                setSelectedFile({ name: 'camera_scan.jpg', type: 'image/jpeg' });
                setPreviewUri(asset.uri);
                await analyzeDocument(asset.base64 || '', 'image/jpeg');
            }
        } catch (error: any) {
            Alert.alert('Error', 'Camera failed: ' + error.message);
        }
    };

    const handleUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf'],
                copyToCacheDirectory: true,
            });
            if (!result.canceled && result.assets[0]) {
                const file = result.assets[0];
                setSelectedFile({ name: file.name, type: file.mimeType || 'application/octet-stream' });
                setPreviewUri(file.uri);
                const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' });
                await analyzeDocument(base64, file.mimeType || 'image/jpeg');
            }
        } catch (error: any) {
            Alert.alert('Error', 'Upload failed: ' + error.message);
        }
    };

    const analyzeDocument = async (base64: string, mimeType: string) => {
        setLoading(true);
        setAnalysis(null);
        try {
            const response = await fetch('http://localhost:8001/api/analyze-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file_data: base64, file_type: mimeType, language: language }),
            });
            if (!response.ok) throw new Error('Server error: ' + response.status);
            const data = await response.json();
            setAnalysis(data.analysis);

            try {
                const existingDocs = await AsyncStorage.getItem('generated_docs');
                const docs = existingDocs ? JSON.parse(existingDocs) : [];
                docs.push({
                    id: `scan_${Date.now()}`,
                    type: getText('स्कैन विश्लेषण', 'Scan Analysis'),
                    title: getText('दस्तावेज़ विश्लेषण', 'Document Analysis'),
                    content: data.analysis || '',
                    createdAt: new Date().toISOString(),
                });
                await AsyncStorage.setItem('generated_docs', JSON.stringify(docs));
            } catch { }
        } catch (error: any) {
            Alert.alert(getText('विश्लेषण विफल', 'Analysis Failed'), getText('कृपया दोबारा कोशिश करें: ', 'Please try again: ') + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = useCallback(() => {
        if (!analysis) return;
        Clipboard.setStringAsync(analysis);
        Alert.alert(getText('कॉपी हो गया!', 'Copied!'));
    }, [analysis, language]);

    const handleShare = async () => {
        if (!analysis) return;
        try {
            await Share.share({ message: analysis });
        } catch { }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: pageBg }]} edges={['top']}>
            <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: dividerColor }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textPrimary }]}>{getText('दस्तावेज़ विश्लेषण', 'Document Analysis')}</Text>
                <TouchableOpacity style={{ marginRight: 16 }} onPress={toggleTheme}>
                    <Text style={{ fontSize: 22 }}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {!loading && !analysis && (
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={({ pressed }) => [styles.cameraButton, { backgroundColor: Colors.saffron }, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
                            onPress={handleCamera}
                        >
                            <Ionicons name="camera-outline" size={32} color={Colors.white} />
                            <Text style={styles.cameraButtonText}>{getText('📷 कैमरा से स्कैन करें', '📷 Scan with Camera')}</Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [styles.fileButton, { backgroundColor: Colors.deepBlue }, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
                            onPress={handleUpload}
                        >
                            <Ionicons name="document-outline" size={32} color={Colors.white} />
                            <Text style={styles.fileButtonText}>{getText('📁 फाइल अपलोड करें', '📁 Upload File')}</Text>
                            <Text style={styles.fileSubtext}>{getText('PDF या छवि स्वीकार्य', 'PDF or Image accepted')}</Text>
                        </Pressable>
                    </View>
                )}

                {previewUri && (
                    <View style={[styles.previewContainer, { backgroundColor: cardBg }]}>
                        <Text style={[styles.previewLabel, { color: textPrimary }]}>{getText('दस्तावेज़ पूर्वावलोकन', 'Document Preview')}</Text>
                        {selectedFile?.type.startsWith('image/') ? (
                            <Image source={{ uri: previewUri }} style={styles.previewImage} resizeMode="contain" />
                        ) : (
                            <View style={[styles.previewImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: pageBg }]}>
                                <Ionicons name="document-text" size={50} color={textSecondary} />
                                <Text style={{ color: textSecondary }}>{selectedFile?.name}</Text>
                            </View>
                        )}
                    </View>
                )}

                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.saffron} />
                        <Text style={[styles.loadingText, { color: textPrimary }]}>{getText('🔍 दस्तावेज़ विश्लेषण हो रहा है...', '🔍 Analyzing document...')}</Text>
                    </View>
                )}

                {analysis && !loading && (
                    <View style={styles.resultsContainer}>
                        <View style={[styles.resultCard, { backgroundColor: cardBg }]}>
                            <Text style={[styles.cardTitle, { color: textPrimary }]}>{getText('विश्लेषण परिणाम', 'Analysis Result')}</Text>
                            <Text style={[styles.cardContent, { color: textPrimary }]}>{analysis}</Text>
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.saffron }]} onPress={handleCopy}>
                                <Ionicons name="copy-outline" size={20} color={Colors.white} />
                                <Text style={styles.actionButtonText}>{getText('कॉपी करें', 'Copy')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.saffron }]} onPress={handleShare}>
                                <Ionicons name="share-outline" size={20} color={Colors.white} />
                                <Text style={styles.actionButtonText}>{getText('शेयर करें', 'Share')}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.deepBlue, width: '100%', marginTop: 10 }]} onPress={() => router.push('/rights')}>
                            <Text style={styles.actionButtonText}>{getText('संबंधित अधिकार देखें', 'See Related Rights')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.scanAnotherButton, { backgroundColor: Colors.deepBlue }]} onPress={() => { setAnalysis(null); setPreviewUri(null); setSelectedFile(null); }}>
                            <Text style={styles.scanAnotherText}>{getText('दूसरा दस्तावेज़ स्कैन करें', 'Scan Another')}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (Colors: any, theme: string) => StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    content: { flex: 1, padding: 20 },
    buttonContainer: { gap: 16, marginBottom: 20 },
    cameraButton: { borderRadius: 16, padding: 24, alignItems: 'center', elevation: 4, ...Platform.select({ web: { boxShadow: '0px 4px 12px rgba(0,0,0,0.15)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 } }) },
    cameraButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 12 },
    fileButton: { borderRadius: 16, padding: 24, alignItems: 'center', elevation: 4, ...Platform.select({ web: { boxShadow: '0px 4px 12px rgba(0,0,0,0.15)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 } }) },
    fileButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 12 },
    fileSubtext: { color: '#fff', fontSize: 14, opacity: 0.9, marginTop: 4 },
    previewContainer: { borderRadius: 16, padding: 16, marginBottom: 20, elevation: 2, ...Platform.select({ web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 } }) },
    previewLabel: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
    previewImage: { width: '100%', height: 200, borderRadius: 12 },
    loadingContainer: { alignItems: 'center', marginTop: 40 },
    loadingText: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },
    resultsContainer: { marginTop: 10 },
    actionButtons: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingVertical: 12, gap: 8 },
    actionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    resultCard: { borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2, ...Platform.select({ web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 } }) },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    cardContent: { fontSize: 15, lineHeight: 22 },
    scanAnotherButton: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 30 },
    scanAnotherText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
