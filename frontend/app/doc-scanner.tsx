import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import api from '../services/api';

export default function DocScannerScreen() {
    const router = useRouter();
    const { language, setLanguage, isPremium } = useAppContext();
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    const getText = (hindi: string, english: string) => {
        return language === 'hindi' ? hindi : english;
    };

    const ensurePremium = () => {
        if (!isPremium) {
            Alert.alert(
                getText('प्रीमियम फीचर', 'Premium Feature'),
                getText(
                    'डॉक्यूमेंट स्कैनर का उपयोग करने के लिए कृपया प्रीमियम में अपग्रेड करें।',
                    'Please upgrade to Premium to use the Document Scanner.'
                ),
                [{ text: getText('अभी अपग्रेड करें', 'Upgrade Now'), onPress: () => router.push('/profile') }, { text: getText('ठीक है', 'OK') }]
            );
            return false;
        }
        return true;
    };

    const analyzeImage = async (base64Data: string, filename: string) => {
        try {
            setIsScanning(true);
            setScanResult(null);

            const response = await api.post('scan-document', {
                image_base64: base64Data,
                filename,
            });

            const analysis = response.data?.analysis as string;
            setScanResult(analysis);
        } catch (error: any) {
            console.log('Scan document error:', error?.response || error);
            Alert.alert(
                getText('त्रुटि', 'Error'),
                getText(
                    'दस्तावेज़ का विश्लेषण नहीं हो सका। कृपया बाद में पुनः प्रयास करें।',
                    'Unable to analyze document. Please try again later.'
                )
            );
        } finally {
            setIsScanning(false);
        }
    };

    const handleCameraScan = async () => {
        if (!ensurePremium()) return;

        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                getText('अनुमति आवश्यक', 'Permission Required'),
                getText(
                    'कैमरा से स्कैन करने के लिए कैमरा अनुमति दें।',
                    'Please allow camera access to scan documents.'
                )
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
            base64: true,
        });

        if (result.canceled || !result.assets?.[0]) {
            return;
        }

        const asset = result.assets[0];
        if (!asset.base64) {
            Alert.alert(
                getText('त्रुटि', 'Error'),
                getText('छवि डेटा नहीं मिल पाया।', 'Could not read image data.')
            );
            return;
        }

        setSelectedImageUri(asset.uri);
        setSelectedFileName('camera-document.jpg');
        await analyzeImage(asset.base64, 'camera-document.jpg');
    };

    const handleFileUpload = async () => {
        if (!ensurePremium()) return;

        const imageResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            base64: true,
        });

        if (!imageResult.canceled && imageResult.assets?.[0]) {
            const asset = imageResult.assets[0];
            if (!asset.base64) {
                Alert.alert(
                    getText('त्रुटि', 'Error'),
                    getText('छवि डेटा नहीं मिल पाया।', 'Could not read image data.')
                );
                return;
            }
            setSelectedImageUri(asset.uri);
            setSelectedFileName(asset.fileName || 'gallery-document.jpg');
            await analyzeImage(asset.base64, asset.fileName || 'gallery-document.jpg');
            return;
        }

        const docResult = await DocumentPicker.getDocumentAsync({
            type: ['application/pdf', 'image/*'],
            copyToCacheDirectory: true,
        });

        if (docResult.canceled || !docResult.assets?.[0]) {
            return;
        }

        const doc = docResult.assets[0];

        try {
            const base64Data = await FileSystem.readAsStringAsync(doc.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            setSelectedImageUri(doc.mimeType?.startsWith('image/') ? doc.uri : null);
            setSelectedFileName(doc.name || 'document.pdf');
            await analyzeImage(base64Data, doc.name || 'document.pdf');
        } catch (e) {
            console.log('File base64 read error:', e);
            Alert.alert(
                getText('त्रुटि', 'Error'),
                getText('फ़ाइल पढ़ने में समस्या आई।', 'There was a problem reading the file.')
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.deepBlue} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{getText('डॉक्यूमेंट स्कैनर', 'Doc Scanner')}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.topButton} onPress={handleCameraScan}>
                        <Text style={styles.topButtonText}>📷 {getText('कैमरा से स्कैन करें', 'Scan with Camera')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topButtonSecondary} onPress={handleFileUpload}>
                        <Text style={styles.topButtonText}>📁 {getText('फ़ाइल अपलोड करें', 'Upload File')}</Text>
                    </TouchableOpacity>
                </View>

                {selectedImageUri && (
                    <View style={styles.previewContainer}>
                        <Text style={styles.previewLabel}>
                            {getText('चयनित दस्तावेज़', 'Selected Document')}
                        </Text>
                        <Image source={{ uri: selectedImageUri }} style={styles.previewImage} resizeMode="contain" />
                        {selectedFileName && (
                            <Text style={styles.previewFileName}>{selectedFileName}</Text>
                        )}
                    </View>
                )}

                {isScanning && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.saffron} />
                        <Text style={styles.loadingText}>
                            {getText('AI विश्लेषण कर रहा है...', 'AI is analyzing...')}
                        </Text>
                    </View>
                )}

                {scanResult && !isScanning && (
                    <ScrollView style={styles.resultContainer}>
                        <View style={styles.resultCard}>
                            <Text style={styles.sectionHeading}>
                                {getText('यह दस्तावेज़ क्या है:', 'What is this document:')}
                            </Text>
                            <Text style={styles.resultText}>{scanResult}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={() => {
                                setScanResult(null);
                                setSelectedImageUri(null);
                                setSelectedFileName(null);
                            }}
                        >
                            <Text style={styles.resetButtonText}>
                                {getText('दूसरा दस्तावेज़ स्कैन करें', 'Scan Another Document')}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}

                {!scanResult && !isScanning && !selectedImageUri && (
                    <View style={styles.scannerPlaceholder}>
                        <View style={styles.cameraFrame}>
                            <Ionicons name="scan-outline" size={100} color={Colors.saffron + '40'} />
                            <View style={styles.cornerTopLeft} />
                            <View style={styles.cornerTopRight} />
                            <View style={styles.cornerBottomLeft} />
                            <View style={styles.cornerBottomRight} />
                        </View>
                        <Text style={styles.instruction}>
                            {getText(
                                'ऊपर दिए गए विकल्प से दस्तावेज़ चुनें या स्कैन करें',
                                'Choose or scan a document using the options above'
                            )}
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.deepBlue,
    },
    langToggle: {
        backgroundColor: Colors.deepBlue,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    langText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 12,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 8,
    },
    topButton: {
        flex: 1,
        backgroundColor: Colors.saffron,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    topButtonSecondary: {
        flex: 1,
        backgroundColor: Colors.deepBlue,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    topButtonText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
    scannerPlaceholder: {
        alignItems: 'center',
        marginTop: 30,
    },
    cameraFrame: {
        width: 280,
        height: 380,
        backgroundColor: Colors.white,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        position: 'relative',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cornerTopLeft: { position: 'absolute', top: 10, left: 10, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: Colors.saffron, borderTopLeftRadius: 10 },
    cornerTopRight: { position: 'absolute', top: 10, right: 10, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: Colors.saffron, borderTopRightRadius: 10 },
    cornerBottomLeft: { position: 'absolute', bottom: 10, left: 10, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: Colors.saffron, borderBottomLeftRadius: 10 },
    cornerBottomRight: { position: 'absolute', bottom: 10, right: 10, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: Colors.saffron, borderBottomRightRadius: 10 },
    instruction: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginTop: 20,
        textAlign: 'center',
    },
    previewContainer: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    previewLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        backgroundColor: Colors.background,
    },
    previewFileName: {
        marginTop: 8,
        fontSize: 12,
        color: Colors.textSecondary,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 24,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    resultContainer: {
        flex: 1,
        marginTop: 16,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    resultTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.green,
    },
    resultCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        elevation: 2,
        marginBottom: 16,
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    resultText: {
        fontSize: 16,
        lineHeight: 24,
        color: Colors.textPrimary,
    },
    resetButton: {
        backgroundColor: Colors.deepBlue,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 30,
    },
    resetButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
