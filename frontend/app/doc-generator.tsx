import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Share,
    Alert,
    ActivityIndicator,
    Platform,
    KeyboardAvoidingView,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, DarkColors } from '../constants/colors';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import { sanitizeInput } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const TEMPLATE_FIELDS: any = {
    rent_notice: [
        { key: 'tenant_name', label_hi: 'किरायेदार का नाम', label_en: 'Tenant Name', placeholder_hi: 'उदा: राहुल कुमार', placeholder_en: 'e.g. Rahul Kumar' },
        { key: 'landlord_name', label_hi: 'मकान मालिक का नाम', label_en: 'Landlord Name', placeholder_hi: 'उदा: श्री सुरेश जैन', placeholder_en: 'e.g. Rajesh Sharma' },
        { key: 'address', label_hi: 'पता', label_en: 'Address', placeholder_hi: 'उदा: फ्लैट 402, शिव एनक्लेव', placeholder_en: 'e.g. Flat 402, Shiv Enclave' },
        { key: 'rent_amount', label_hi: 'किराया राशि', label_en: 'Rent Amount', placeholder_hi: 'उदा: 15,000', placeholder_en: 'e.g. 15,000' },
        { key: 'reason', label_hi: 'विवाद का कारण', label_en: 'Reason for Dispute', placeholder_hi: 'उदा: सुरक्षा राशि वापसी', placeholder_en: 'e.g. Security deposit refund' },
    ],
    labor_complaint: [
        { key: 'employee_name', label_hi: 'आपका नाम', label_en: 'Your Name', placeholder_hi: 'उदा: अमित सिंह', placeholder_en: 'e.g. Amit Singh' },
        { key: 'company_name', label_hi: 'कंपनी/संस्था का नाम', label_en: 'Company Name', placeholder_hi: 'उदा: एबीसी प्राइवेट लिमिटेड', placeholder_en: 'e.g. ABC Pvt Ltd' },
        { key: 'designation', label_hi: 'पद', label_en: 'Designation', placeholder_hi: 'उदा: सुपरवाइजर', placeholder_en: 'e.g. Supervisor' },
        { key: 'description', label_hi: 'शिकायत का विवरण', label_en: 'Issue Description', placeholder_hi: 'उदा: 2 महीने का वेतन नहीं मिला', placeholder_en: 'e.g. Last 2 months salary unpaid' },
    ],
    police_complaint: [
        { key: 'complainant_name', label_hi: 'शिकायतकर्ता का नाम', label_en: 'Complainant Name', placeholder_hi: 'उदा: संजय दत्त', placeholder_en: 'e.g. Sanjay Dutt' },
        { key: 'event_date', label_hi: 'घटना की तारीख', label_en: 'Date of Event', placeholder_hi: 'उदा: 10/03/2026', placeholder_en: 'e.g. 10/03/2026' },
        { key: 'event_location', label_hi: 'घटना का स्थान', label_en: 'Location', placeholder_hi: 'उदा: विकास नगर मार्केट', placeholder_en: 'e.g. Vikas Nagar Market' },
        { key: 'description', label_hi: 'घटना का विवरण', label_en: 'Description', placeholder_hi: 'उदा: मोबाइल चोरी', placeholder_en: 'e.g. Mobile theft' },
        { key: 'police_station', label_hi: 'पुलिस स्टेशन', label_en: 'Police Station', placeholder_hi: 'उदा: वसंत कुंज', placeholder_en: 'e.g. Vasant Kunj' },
    ],
    consumer_complaint: [
        { key: 'consumer_name', label_hi: 'उपभोक्ता का नाम', label_en: 'Consumer Name', placeholder_hi: 'उदा: नेहा गुप्ता', placeholder_en: 'e.g. Neha Gupta' },
        { key: 'shop_name', label_hi: 'दुकान/ब्रांड का नाम', label_en: 'Shop/Brand Name', placeholder_hi: 'उदा: ई-कॉमर्स स्टोर', placeholder_en: 'e.g. E-commerce store' },
        { key: 'purchase_date', label_hi: 'खरीद की तारीख', label_en: 'Purchase Date', placeholder_hi: 'उदा: 05/03/2026', placeholder_en: 'e.g. 05/03/2026' },
        { key: 'description', label_hi: 'समस्या का विवरण', label_en: 'Problem Description', placeholder_hi: 'उदा: खराब सामान मिला', placeholder_en: 'e.g. Received damaged product' },
        { key: 'amount_requested', label_hi: 'हर्जाना राशि', label_en: 'Claim Amount', placeholder_hi: 'उदा: 5,000', placeholder_en: 'e.g. 5,000' },
    ]
};

const TEMPLATES = {
    hindi: [
        { id: 'rent_notice', title: 'किराया विवाद नोटिस', icon: 'home' },
        { id: 'labor_complaint', title: 'श्रम शिकायत', icon: 'briefcase' },
        { id: 'police_complaint', title: 'पुलिस शिकायत पत्र', icon: 'shield' },
        { id: 'consumer_complaint', title: 'उपभोक्ता शिकायत', icon: 'cart' },
    ],
    english: [
        { id: 'rent_notice', title: 'Rent Dispute Notice', icon: 'home' },
        { id: 'labor_complaint', title: 'Labor Complaint', icon: 'briefcase' },
        { id: 'police_complaint', title: 'Police Complaint Letter', icon: 'shield' },
        { id: 'consumer_complaint', title: 'Consumer Complaint', icon: 'cart' },
    ]
};

const generateHTMLDoc = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Georgia, serif; padding: 60px; max-width: 794px; margin: 0 auto; }
  h1 { text-align: center; font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
  p { line-height: 1.8; font-size: 14px; text-align: justify; white-space: pre-wrap; }
  .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-45deg); font-size: 60px; color: rgba(0,0,0,0.05); z-index: -1; }
  .footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; }
  .logo { text-align: right; font-size: 10px; color: #666; }
</style>
</head>
<body>
<div class="watermark">NyayMitra</div>
<div class="logo">⚖️ NyayMitra - भारत का AI वकील</div>
<h1>${title}</h1>
${content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '<br/>').join('')}
<div class="footer">
  <p>हस्ताक्षर: _________________ &nbsp;&nbsp; दिनांक: _________________</p>
  <p style="font-size:10px;color:#666;">यह दस्तावेज़ NyayMitra AI द्वारा तैयार किया गया है। कानूनी कार्यवाही से पहले किसी वकील से सलाह लें।</p>
</div>
</body>
</html>`;

export default function DocGeneratorScreen() {
    const { theme, language, setLanguage } = useAppContext();
    const Colors = theme === 'dark' ? DarkColors : LightColors;
    const styles = getStyles(Colors, theme);
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
    const [step, setStep] = useState(1);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [formFields, setFormFields] = useState<any>({});
    const [userSituation, setUserSituation] = useState('');
    const [generatedDoc, setGeneratedDoc] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    const getText = (hindi: string, english: string) => language === 'hindi' ? hindi : english;

    const handleSelectTemplate = (id: string) => {
        setSelectedId(id);
        setFormFields({});
        setUserSituation('');
        setStep(2);
    };

    const handleGenerate = async () => {
        const fields = TEMPLATE_FIELDS[selectedId!];
        for (const field of fields) {
            if (!formFields[field.key]) {
                Alert.alert(getText('अपूर्ण फॉर्म', 'Incomplete Form'), getText(`${field.label_hi} आवश्यक है`, `${field.label_en} is required`));
                return;
            }
        }

        try {
            setIsGenerating(true);
            const sanitizedFields = Object.keys(formFields).reduce((acc: any, key) => {
                acc[key] = sanitizeInput(formFields[key]);
                return acc;
            }, {});
            const sanitizedSituation = sanitizeInput(userSituation);

            const response = await fetch('http://192.168.1.4:8001/api/documents/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    template_type: selectedId,
                    fields: sanitizedFields,
                    user_situation: sanitizedSituation,
                    language: language
                })
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            setGeneratedDoc(data.document);
            setStep(3);

            const historyItem = {
                id: `doc_${Date.now()}`,
                type: selectedId,
                title: TEMPLATES[language === 'hindi' ? 'hindi' : 'english'].find(t => t.id === selectedId)?.title || 'Legal Document',
                content: data.document,
                createdAt: new Date().toISOString(),
            };
            const existing = await AsyncStorage.getItem('generated_docs');
            const history = existing ? JSON.parse(existing) : [];
            history.unshift(historyItem);
            await AsyncStorage.setItem('generated_docs', JSON.stringify(history));

            const statsStr = await AsyncStorage.getItem('stats_docs_count');
            const count = parseInt(statsStr || '0') + 1;
            await AsyncStorage.setItem('stats_docs_count', count.toString());

        } catch {
            Alert.alert(getText('त्रुटि', 'Error'), getText('दस्तावेज़ बनाने में विफल। कृपया पुन: प्रयास करें।', 'Failed to generate document. Please try again.'));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAIGenerate = async () => {
        if (!userSituation.trim()) return;

        try {
            setIsGenerating(true);
            const sanitizedSituation = sanitizeInput(userSituation);

            const response = await fetch('http://192.168.1.4:8001/api/documents/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    template_type: "custom",
                    user_situation: sanitizedSituation,
                    language: language
                })
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            setGeneratedDoc(data.document);
            setSelectedId('custom');
            setStep(3);

            const historyItem = {
                id: `doc_${Date.now()}`,
                type: 'custom',
                title: 'AI Generated Document',
                content: data.document,
                createdAt: new Date().toISOString(),
            };
            const existing = await AsyncStorage.getItem('generated_docs');
            const history = existing ? JSON.parse(existing) : [];
            history.unshift(historyItem);
            await AsyncStorage.setItem('generated_docs', JSON.stringify(history));

            const statsStr = await AsyncStorage.getItem('stats_docs_count');
            const count = parseInt(statsStr || '0') + 1;
            await AsyncStorage.setItem('stats_docs_count', count.toString());

        } catch {
            Alert.alert(getText('त्रुटि', 'Error'), getText('दस्तावेज़ बनाने में विफल। कृपया पुन: प्रयास करें।', 'Failed to generate document. Please try again.'));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({ message: generatedDoc });
        } catch { }
    };

    const downloadPDF = async () => {
        try {
            const title = TEMPLATES[language === 'hindi' ? 'hindi' : 'english'].find(t => t.id === selectedId)?.title || 'Document';
            const { uri } = await Print.printToFileAsync({ html: generateHTMLDoc(title, generatedDoc) });
            await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
        } catch { Alert.alert('Error', 'Failed to save PDF'); }
    };

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>{getText('एक कानूनी टेम्पलेट चुनें', 'Select a Legal Template')}</Text>
            <View style={styles.grid}>
                {TEMPLATES[language === 'hindi' ? 'hindi' : 'english'].map((item) => (
                    <Pressable
                        key={item.id}
                        style={({ pressed }) => [styles.card, { backgroundColor: cardBg }, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
                        onPress={() => handleSelectTemplate(item.id)}
                    >
                        <View style={[styles.iconBg, { backgroundColor: Colors.saffron }]}>
                            <Ionicons name={item.icon as any} size={30} color="#fff" />
                        </View>
                        <Text style={[styles.cardTitle, { color: textPrimary }]}>{item.title}</Text>
                    </Pressable>
                ))}
            </View>

            {/* AI Chat Box Section */}
            <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: dividerColor }]} />
                <Text style={[styles.dividerText, { color: textSecondary }]}>या</Text>
                <View style={[styles.dividerLine, { backgroundColor: dividerColor }]} />
            </View>

            <View style={[styles.card, styles.aiCard, { backgroundColor: cardBg }]}>
                <Text style={[styles.aiCardTitle, { color: textPrimary }]}>✍️ खुद बताएं, AI बनाएगा</Text>
                <Text style={[styles.aiCardSubtitle, { color: textSecondary }]}>अपनी स्थिति लिखें, AI तुरंत दस्तावेज़ बनाएगा</Text>
                
                <TextInput
                    style={[styles.aiInput, { backgroundColor: inputBg, color: textPrimary, borderColor: dividerColor }]}
                    placeholder="उदाहरण: मेरे मकान मालिक ने 3 महीने से किराया वापस नहीं किया, मुझे कानूनी नोटिस चाहिए..."
                    placeholderTextColor={textSecondary}
                    multiline
                    numberOfLines={4}
                    value={userSituation}
                    onChangeText={setUserSituation}
                />

                <Pressable 
                    style={({ pressed }) => [styles.aiButton, { backgroundColor: Colors.saffron }, isGenerating && styles.disabledButton, pressed && { opacity: 0.8 }]} 
                    onPress={handleAIGenerate} 
                    disabled={isGenerating || !userSituation.trim()}
                >
                    {isGenerating ? (
                        <>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={styles.aiButtonText}>दस्तावेज़ तैयार हो रहा है...</Text>
                        </>
                    ) : (
                        <>
                            <Ionicons name="flash" size={18} color="#fff" />
                            <Text style={styles.aiButtonText}>⚡ AI से दस्तावेज़ बनाएं</Text>
                        </>
                    )}
                </Pressable>
            </View>
        </View>
    );

    const renderStep2 = () => {
        const fields = TEMPLATE_FIELDS[selectedId!];
        const template = TEMPLATES[language === 'hindi' ? 'hindi' : 'english'].find(t => t.id === selectedId);
        return (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.stepContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[styles.sectionTitle, { color: textPrimary }]}>{template?.title}</Text>
                    <Text style={[styles.sectionSubtitle, { color: textSecondary }]}>{getText('कृपया नीचे दी गई जानकारी भरें:', 'Please fill in the details below:')}</Text>

                    {fields.map((f: any) => (
                        <View key={f.key} style={styles.formGroup}>
                            <Text style={[styles.label, { color: textPrimary }]}>{getText(f.label_hi, f.label_en)}</Text>
                            <TextInput style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor: dividerColor }]} placeholder={getText(f.placeholder_hi, f.placeholder_en)} placeholderTextColor={textSecondary} value={formFields[f.key] || ''} onChangeText={(val) => setFormFields({ ...formFields, [f.key]: val })} />
                        </View>
                    ))}

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: textPrimary }]}>{getText('अपनी स्थिति बताएं (वैकल्पिक)', 'Your situation (Optional)')}</Text>
                        <TextInput
                            style={[styles.input, styles.textArea, { backgroundColor: inputBg, color: textPrimary, borderColor: dividerColor }]}
                            placeholder={getText('अपनी समस्या या स्थिति विस्तार से लिखें... AI इसे दस्तावेज़ में शामिल करेगा', 'Describe your problem or situation in detail... AI will include it in the document')}
                            placeholderTextColor={textSecondary}
                            multiline
                            numberOfLines={4}
                            value={userSituation}
                            onChangeText={setUserSituation}
                        />
                    </View>

                    <Pressable style={({ pressed }) => [styles.mainButton, { backgroundColor: Colors.saffron }, isGenerating && styles.disabledButton, pressed && { opacity: 0.8 }]} onPress={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? <ActivityIndicator color="#fff" /> : (
                            <>
                                <Ionicons name="sparkles" size={20} color="#fff" />
                                <Text style={styles.mainButtonText}>{getText('दस्तावेज़ बनाएं (AI)', 'Generate Document (AI)')}</Text>
                            </>
                        )}
                    </Pressable>

                    <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                        <Text style={[styles.backButtonText, { color: textSecondary }]}>{getText('पीछे जाएं', 'Go Back')}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    };

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <ScrollView>
                <View style={{
                    backgroundColor: '#FFFFFF',
                    margin: 16,
                    padding: 40,
                    minHeight: 600,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 4},
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    position: 'relative',
                }}>
                    
                    {/* Watermark - diagonal across page */}
                    <Text style={{
                        position: 'absolute',
                        top: '40%',
                        left: '5%',
                        fontSize: 28,
                        color: 'rgba(255, 107, 0, 0.06)',
                        transform: [{rotate: '-45deg'}],
                        width: '120%',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        zIndex: 0,
                    }}>
                        NyayMitra NyayMitra NyayMitra
                    </Text>

                    {/* Header */}
                    <View style={{alignItems: 'center', marginBottom: 20, zIndex: 1}}>
                        <Text style={{fontSize: 11, color: '#888', textAlign: 'right', 
                            width: '100%'}}>⚖️ NyayMitra - AI Legal Assistant</Text>
                        <View style={{height: 1, backgroundColor: '#333', 
                            width: '100%', marginTop: 8}}/>
                    </View>

                    {/* Document Title - Bold, Centered */}
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#000000',
                        marginBottom: 20,
                        fontFamily: 'serif',
                        zIndex: 1,
                    }}>
                        {TEMPLATES[language === 'hindi' ? 'hindi' : 'english'].find(t => t.id === selectedId)?.title || 'AI Generated Document'}
                    </Text>

                    {/* Document Body - Justified text */}
                    <Text style={{
                        fontSize: 14,
                        lineHeight: 24,
                        color: '#111111',
                        textAlign: 'justify',
                        fontFamily: 'serif',
                        zIndex: 1,
                    }}>
                        {generatedDoc}
                    </Text>

                    {/* Footer */}
                    <View style={{marginTop: 40, zIndex: 1}}>
                        <View style={{height: 1, backgroundColor: '#CCCCCC', 
                            marginBottom: 12}}/>
                        <Text style={{fontSize: 11, color: '#666', textAlign: 'center'}}>
                            यह दस्तावेज़ NyayMitra AI द्वारा तैयार किया गया है।
                        </Text>
                        <Text style={{fontSize: 10, color: '#999', textAlign: 'center',
                            marginTop: 4}}>
                            कानूनी कार्यवाही से पहले किसी वकील से सलाह लें।
                        </Text>
                        <View style={{marginTop: 24}}>
                            <Text style={{fontSize: 12, color: '#333'}}>
                                हस्ताक्षर: _______________________
                            </Text>
                            <Text style={{fontSize: 12, color: '#333', marginTop: 8}}>
                                दिनांक: _______________________
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#1a237e' }]} onPress={handleShare}>
                    <Ionicons name="share-social" size={20} color="#fff" /><Text style={styles.actionBtnText}>{getText('शेयर', 'Share')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#138808' }]} onPress={downloadPDF}>
                    <Ionicons name="download" size={20} color="#fff" /><Text style={styles.actionBtnText}>{getText('डाउनलोड', 'PDF')}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.resetButton} onPress={() => setStep(1)}>
                <Text style={[styles.resetButtonText, { color: Colors.saffron }]}>{getText('नया दस्तावेज़ बनाएं', 'Create New Document')}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: pageBg }]} edges={['top']}>
            <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: dividerColor }]}>
                <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
                    <Ionicons name="arrow-back" size={24} color={textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textPrimary }]}>{getText('डॉक्यूमेंट जनरेटर', 'Doc Generator')}</Text>
                <TouchableOpacity onPress={() => setLanguage(language === 'hindi' ? 'english' : 'hindi')} style={[styles.langBtn, { backgroundColor: Colors.deepBlue }]}><Text style={styles.langBtnText}>{language === 'hindi' ? 'EN' : 'हि'}</Text></TouchableOpacity>
            </View>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </SafeAreaView>
    );
}

const getStyles = (Colors: any, theme: string) => StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, marginLeft: 12 },
    langBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    langBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
    stepContainer: { flex: 1, padding: 20 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    sectionSubtitle: { fontSize: 14, marginBottom: 24 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    card: { width: '47%', borderRadius: 20, padding: 20, alignItems: 'center', elevation: 4, ...Platform.select({ web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 } }) },
    iconBg: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    cardTitle: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
    // AI Chat Box Styles
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
    dividerLine: { flex: 1, height: 1 },
    dividerText: { paddingHorizontal: 16, fontSize: 14, fontWeight: '600' },
    aiCard: { width: '100%', alignItems: 'flex-start', padding: 20 },
    aiCardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    aiCardSubtitle: { fontSize: 14, marginBottom: 16 },
    aiInput: { width: '100%', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, minHeight: 120, textAlignVertical: 'top', marginBottom: 16 },
    aiButton: { borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', elevation: 4 },
    aiButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    formGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15 },
    textArea: { minHeight: 100, textAlignVertical: 'top' },
    mainButton: { borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, elevation: 4 },
    mainButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    disabledButton: { opacity: 0.7 },
    backButton: { alignItems: 'center', paddingVertical: 16 },
    backButtonText: { fontSize: 14 },
    paperContainer: { flex: 1, borderRadius: 8, padding: 24, elevation: 8, ...Platform.select({ web: { boxShadow: '0px 4px 12px rgba(0,0,0,0.2)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 } }), borderWidth: 1 },
    paperHeader: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10, marginBottom: 20 },
    paperLogo: { fontSize: 14, fontWeight: 'bold', color: '#666' },
    paperBody: { fontSize: 16, lineHeight: 26, color: '#000', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
    actionButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12 },
    actionBtnText: { color: '#FFF', fontWeight: 'bold' },
    resetButton: { alignItems: 'center', marginTop: 10, paddingBottom: 20 },
    resetButtonText: { fontWeight: 'bold', fontSize: 16 }
});
