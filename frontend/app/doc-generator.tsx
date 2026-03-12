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
    Modal,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';

const TEMPLATES = {
    hindi: [
        { id: 'challan', title: 'ट्रैफिक चालान प्रारूप', content: 'सेवा में,\nन्यायालय श्रीमान ...\nविषय: चालान संख्या ... के संबंध में आवेदन।\n\nमहोदय,\nसविनय निवेदन है कि उपरोक्त चालान ... के कारण काटा गया था। मैं इसे स्वीकार करते हुए ... का अनुरोध करता हूँ।\n\nभवदीय,\n(नाम व हस्ताक्षर)' },
        { id: 'bail', title: 'जमानत बांड पेपर', content: 'शपथ पत्र\nसमक्ष न्यायालय ...\nमुकदमा संख्या: ...\n\nमैं (नाम) ..., पुत्र श्री ... निवासी ..., यह घोषणा करता हूँ कि मैं अभियुक्त ... की जमानत के लिए तैयार हूँ।\n\nस्थान: ...\nदिनांक: ...\nहस्ताक्षर: ...' },
        { id: 'fir', title: 'FIR कॉपी प्रारूप', content: 'प्रथम सूचना रिपोर्ट (धारा 154 CrPC)\nप्रति, थाना प्रभारी ...\nदिनांक: ...\n\nविषय: घटना ... की रिपोर्ट दर्ज करने हेतु।\n\nमहोदय,\nघटना का विवरण नीचे दिया गया है:\nशाम लगभग ... बजे ...\n\nप्रार्थी,\n(नाम)' },
        { id: 'consumer', title: 'उपभोक्ता शिकायत फॉर्म', content: 'समक्ष: उपभोक्ता फोरम, ...\nशिकायतकर्ता: ...\nविपक्ष: ...\n\nविषय: दोषपूर्ण वस्तु/सेवा के संबंध में शिकायत।\n\nहर्जाना राशि: ₹...\nप्रार्थना: ...\n\nहस्ताक्षर: ...' },
        { id: 'rent_notice', title: 'किराया विवाद नोटिस', content: 'सेवा में,\nश्री/श्रीमती ... (मकान मालिक)\nपता: ...\n\nविषय: किराया भुगतान / सुरक्षा राशि वापसी के संबंध में कानूनी नोटिस\n\nमहोदय / महोदया,\nयह नोटिस आपको सूचित करने हेतु है कि ...\n\nतदनुसार आपसे निवेदन है कि इस नोटिस की प्राप्ति के 15 दिनों के भीतर ...\nअन्यथा मुझे आपके विरुद्ध उचित कानूनी कार्यवाही प्रारंभ करनी पड़ेगी।\n\nभवदीय,\n(किरायेदार का नाम व हस्ताक्षर)\nदिनांक: ...\nस्थान: ...' },
        { id: 'labour_complaint', title: 'श्रम शिकायत', content: 'सेवा में,\nजिला श्रम अधिकारी,\nपता: ...\n\nविषय: श्रम अधिकारों के उल्लंघन के संबंध में शिकायत\n\nमान्यवर,\nमैं (नाम) ..., कार्यस्थल ... पर ... पद पर कार्यरत हूँ। मेरे साथ निम्न प्रकार से अन्याय हुआ है: ...\n\nकृपया मेरे मामले की जांच कर आवश्यक कार्यवाही करने की कृपा करें।\n\nभवदीय,\n(कर्मचारी का नाम व हस्ताक्षर)\nदिनांक: ...\nस्थान: ...' },
        { id: 'police_complaint', title: 'पुलिस शिकायत पत्र', content: 'सेवा में,\nथाना प्रभारी,\nपुलिस स्टेशन ...\n\nविषय: शिकायत दर्ज करने हेतु प्रार्थना पत्र\n\nमहोदय,\nमैं (नाम) ..., निवासी ... यह निवेदन करता/करती हूँ कि ... घटना हुई है, जिसका विवरण निम्न प्रकार है: ...\n\nकृपया मेरी शिकायत पर उचित कानूनी कार्यवाही करने की कृपा करें।\n\nभवदीय,\n(नाम व हस्ताक्षर)\nदिनांक: ...\nस्थान: ...' },
        { id: 'consumer_forum_notice', title: 'उपभोक्ता शिकायत (फोरम नोटिस)', content: 'समक्ष: उपभोक्ता विवाद प्रतितोष आयोग, ...\nशिकायतकर्ता: ...\nविपक्ष पक्ष: ...\n\nविषय: उपभोक्ता संरक्षण अधिनियम के अंतर्गत शिकायत\n\nमान्यवर,\nयह शिकायत आपके अधीन प्रस्तुत की जा रही है कि ...\n\nकृपया विपक्ष पक्ष को नोटिस जारी कर उचित राहत देने की कृपा करें।\n\nशिकायतकर्ता,\n(नाम व हस्ताक्षर)\nदिनांक: ...\nस्थान: ...' },
    ],
    english: [
        { id: 'challan', title: 'Traffic Challan Format', content: 'To,\nThe Hon\'ble Court of ...\nSubject: Application regarding Challan No. ...\n\nRespected Sir,\nIt is submitted that the aforementioned challan was issued for ... I accept the same and request ...\n\nYours faithfully,\n(Name & Signature)' },
        { id: 'bail', title: 'Bail Bond Paper', content: 'AFFIDAVIT\nBefore the Court of ...\nCase No: ...\n\nI (Name) ..., S/o श्री ... R/o ..., do hereby declare that I am stand as surety for the accused ...\n\nPlace: ...\nDate: ...\nSignature: ...' },
        { id: 'fir', title: 'FIR Copy Format', content: 'FIRST INFORMATION REPORT (u/s 154 CrPC)\nTo, SHO ..., Police Station ...\nDate: ...\n\nSubject: Report regarding incident of ...\n\nSir,\nThe details of the incident are as follows:\nAround ... PM on ...\n\nComplainant,\n(Name)' },
        { id: 'consumer', title: 'Consumer Complaint Form', content: 'Before: Consumer Forum, ...\nComplainant: ...\nOpposite Party: ...\n\nSubject: Complaint regarding defective goods/services.\n\nCompensation Amount: ₹...\nPrayer: ...\n\nSignature: ...' },
        { id: 'rent_notice', title: 'Rent Dispute Notice', content: 'To,\nMr./Ms. ... (Landlord)\nAddress: ...\n\nSubject: Legal Notice regarding rent / security deposit dispute\n\nSir/Madam,\nThis notice is being issued to inform you that ...\n\nYou are hereby called upon to pay/settle the above within 15 days of receipt of this notice, failing which I shall be constrained to initiate appropriate legal proceedings.\n\nYours faithfully,\n(Tenant\'s Name & Signature)\nDate: ...\nPlace: ...' },
        { id: 'labour_complaint', title: 'Labour Complaint', content: 'To,\nThe Labour Officer,\nAddress: ...\n\nSubject: Complaint regarding violation of labour rights\n\nRespected Sir/Madam,\nI, (Name) ..., working at ... as ..., am facing the following issues: ...\n\nKindly inquire into my case and take necessary action.\n\nYours faithfully,\n(Employee\'s Name & Signature)\nDate: ...\nPlace: ...' },
        { id: 'police_complaint', title: 'Police Complaint Letter', content: 'To,\nThe Station House Officer,\nPolice Station ...\n\nSubject: Application for lodging complaint\n\nSir,\nI, (Name) ..., resident of ..., wish to state that the following incident has occurred: ...\n\nKindly register my complaint and take necessary legal action.\n\nYours faithfully,\n(Name & Signature)\nDate: ...\nPlace: ...' },
        { id: 'consumer_forum_notice', title: 'Consumer Forum Notice', content: 'Before: Consumer Disputes Redressal Commission, ...\nComplainant: ...\nOpposite Party: ...\n\nSubject: Complaint under Consumer Protection Act\n\nRespected Sir/Madam,\nThis complaint is being filed against the opposite party for ...\n\nKindly issue notice to the opposite party and grant appropriate relief.\n\nComplainant,\n(Name & Signature)\nDate: ...\nPlace: ...' },
    ]
};

export default function DocGeneratorScreen() {
    const router = useRouter();
    const { language, setLanguage, isPremium } = useAppContext();
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [customInput, setCustomInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const getText = (hindi: string, english: string) => {
        return language === 'hindi' ? hindi : english;
    };

    const handleSelectTemplate = (item: any) => {
        if (false) {
            Alert.alert(
                getText('प्रीमियम फीचर', 'Premium Feature'),
                getText(
                    'डॉक्यूमेंट जनरेटर का उपयोग करने के लिए कृपया प्रीमियम में अपग्रेड करें।',
                    'Please upgrade to Premium to use the Document Generator.'
                ),
                [{ text: getText('अभी अपग्रेड करें', 'Upgrade Now'), onPress: () => router.push('/profile') }, { text: getText('ठीक है', 'OK') }]
            );
            return;
        }
        setSelectedTemplate(item);
    };

    const currentTemplates = language === 'hindi' ? TEMPLATES.hindi : TEMPLATES.english;

    const handleShare = async () => {
        if (!selectedTemplate) return;
        try {
            await Share.share({
                message: selectedTemplate.content,
                title: selectedTemplate.title,
            });
        } catch (error) {
            console.log('Share error:', error);
        }
    };

    const handleGenerateCustom = async () => {
        if (false) {
            Alert.alert(
                getText('प्रीमियम फीचर', 'Premium Feature'),
                getText(
                    'डॉक्यूमेंट जनरेटर का उपयोग करने के लिए कृपया प्रीमियम में अपग्रेड करें।',
                    'Please upgrade to Premium to use the Document Generator.'
                ),
                [
                    {
                        text: getText('अभी अपग्रेड करें', 'Upgrade Now'),
                        onPress: () => router.push('/profile'),
                    },
                    { text: getText('ठीक है', 'OK') },
                ]
            );
            return;
        }

        if (!customInput.trim()) {
            Alert.alert(
                getText('विवरण आवश्यक', 'Description Required'),
                getText(
                    'कृपया पहले अपनी स्थिति विस्तार से लिखें।',
                    'Please describe your situation in detail first.'
                )
            );
            return;
        }
        try {
            setIsGenerating(true);
            setGeneratedDoc(null);

            const res = await fetch('http://localhost:8001/api/documents/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    template_type: 'custom',
                    details: { description: customInput.trim() }
                })
            });
            const data = await res.json();
            const docText = data?.document as string;
            setGeneratedDoc(docText);
            setIsModalVisible(true);
        } catch (error: any) {
            console.log('Custom document generation error:', error?.response || error);
            Alert.alert(
                getText('त्रुटि', 'Error'),
                getText(
                    'दस्तावेज़ नहीं बन पाया। कृपया बाद में पुनः प्रयास करें।',
                    'Unable to generate document. Please try again later.'
                )
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShareGenerated = async () => {
        if (!generatedDoc) return;
        try {
            await Share.share({
                message: generatedDoc,
                title: getText('AI दस्तावेज़', 'AI Document'),
            });
        } catch (error) {
            console.log('Share generated document error:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.deepBlue} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{getText('डॉक्यूमेंट जनरेटर', 'Doc Generator')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {!selectedTemplate ? (
                    <>
                        <Text style={styles.subTitle}>
                            {getText('एक कानूनी टेम्पलेट चुनें', 'Select a legal template')}
                        </Text>
                        <View style={styles.grid}>
                            {currentTemplates.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.card}
                                    onPress={() => handleSelectTemplate(item)}
                                >
                                    <View style={styles.iconBg}>
                                        <Ionicons name="document-text" size={30} color={Colors.white} />
                                    </View>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.customSection}>
                            <Text style={styles.customHeading}>
                                {getText('अपना दस्तावेज़ बनाएं', 'Create Your Own Document')}
                            </Text>
                            <TextInput
                                style={styles.customInput}
                                multiline
                                placeholder={
                                    language === 'hindi'
                                        ? 'अपनी स्थिति विस्तार से लिखें... जैसे: मेरे मकान मालिक ने 3 महीने से पैसे नहीं लौटाए'
                                        : 'Describe your situation in detail... e.g. My landlord has not returned my deposit for 3 months'
                                }
                                placeholderTextColor={Colors.textLight}
                                value={customInput}
                                onChangeText={setCustomInput}
                                textAlignVertical="top"
                            />
                            <TouchableOpacity
                                style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
                                onPress={handleGenerateCustom}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <ActivityIndicator color={Colors.white} />
                                ) : (
                                    <>
                                        <Ionicons name="sparkles-outline" size={20} color={Colors.white} />
                                        <Text style={styles.generateButtonText}>
                                            {getText('दस्तावेज़ बनाएं (AI)', 'Generate Document (AI)')}
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.editorContainer}>
                        <View style={styles.editorHeader}>
                            <Text style={styles.editorTitle}>{selectedTemplate.title}</Text>
                            <TouchableOpacity onPress={() => setSelectedTemplate(null)}>
                                <Ionicons name="close-circle" size={24} color={Colors.red} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.editor}
                            multiline
                            value={selectedTemplate.content}
                            onChangeText={(text) => setSelectedTemplate({ ...selectedTemplate, content: text })}
                        />
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                                <Ionicons name="share-social" size={20} color={Colors.white} />
                                <Text style={styles.actionText}>{getText('शेयर करें', 'Share')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.printButton} onPress={() => Alert.alert(getText('जल्द आ रहा है', 'Coming Soon'), getText('प्रिंट फीचर जल्द उपलब्ध होगा।', 'Printing feature will be available soon.'))}>
                                <Ionicons name="print" size={20} color={Colors.white} />
                                <Text style={styles.actionText}>{getText('प्रिंट', 'Print')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
                transparent
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {getText('बनाया गया दस्तावेज़', 'Generated Document')}
                            </Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={24} color={Colors.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.modalText}>{generatedDoc}</Text>
                        </ScrollView>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.shareButton} onPress={handleShareGenerated}>
                                <Ionicons name="share-social" size={20} color={Colors.white} />
                                <Text style={styles.actionText}>{getText('शेयर करें', 'Share')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        padding: 20,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    card: {
        width: '47%',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconBg: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.saffron,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    editorContainer: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        elevation: 4,
    },
    editorHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    editorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.deepBlue,
    },
    editor: {
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 15,
        fontSize: 14,
        minHeight: 300,
        color: Colors.textPrimary,
        textAlignVertical: 'top',
    },
    actions: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 10,
    },
    shareButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.deepBlue,
        borderRadius: 12,
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    printButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.green,
        borderRadius: 12,
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    actionText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    customSection: {
        marginTop: 30,
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    customHeading: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.deepBlue,
        marginBottom: 12,
    },
    customInput: {
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 12,
        minHeight: 140,
        fontSize: 14,
        color: Colors.textPrimary,
        marginBottom: 12,
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.saffron,
        borderRadius: 24,
        paddingVertical: 12,
    },
    generateButtonDisabled: {
        opacity: 0.7,
    },
    generateButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        width: '100%',
        maxHeight: '80%',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.deepBlue,
    },
    modalBody: {
        marginBottom: 12,
    },
    modalText: {
        fontSize: 14,
        lineHeight: 22,
        color: Colors.textPrimary,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});
