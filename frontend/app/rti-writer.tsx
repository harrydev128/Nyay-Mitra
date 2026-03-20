import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Share, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import HeaderToggle from '../components/HeaderToggle';

const RTI_TEMPLATES = [
  { id: 1, label_hi: 'जमीन/संपत्ति रिकॉर्ड', label_en: 'Land / Property Records', dept: 'Revenue Department / Tehsil Office', info: 'Survey number [X] की khatauni, khasra, mutation records की certified copy' },
  { id: 2, label_hi: 'सरकारी नौकरी भर्ती', label_en: 'Government Job Recruitment', dept: 'Concerned Department / UPPSC / SSC', info: 'Post [X] की merit list, answer key, marks, selection criteria' },
  { id: 3, label_hi: 'सड़क/नाली निर्माण', label_en: 'Road / Drain Construction', dept: 'PWD / Nagar Palika / Gram Panchayat', info: '[Location] पर निर्माण कार्य का tender, expenditure, contractor details' },
  { id: 4, label_hi: 'पेंशन/भत्ता', label_en: 'Pension / Allowance', dept: 'District Social Welfare Officer', info: '[Scheme name] के अंतर्गत आवेदन status और rejection reason' },
  { id: 5, label_hi: 'FIR Status', label_en: 'FIR Status', dept: 'Police Station / SP Office', info: 'FIR No. [X] की current investigation status, action taken report' },
  { id: 6, label_hi: 'स्कूल/शिक्षा', label_en: 'School / Education', dept: 'District Education Officer / School Principal', info: 'RTE quota admissions, mid-day meal records, teacher attendance' },
  { id: 7, label_hi: 'अपना खुद लिखें', label_en: 'Write Your Own', dept: '', info: '' },
];

export default function RTIWriterScreen() {
  const router = useRouter();
  const { theme, language } = useAppContext();
  const isDark = theme === 'dark';
  const bg = isDark ? '#0D1B2A' : '#F5F5F5';
  const cardBg = isDark ? '#1B2B3B' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a237e';
  const subText = isDark ? '#AABBCC' : '#666666';
  const t = (hi: string, en: string) => language === 'hi' ? hi : en;

  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [form, setForm] = useState({
    applicantName: '',
    applicantAddress: '',
    applicantCity: '',
    applicantMobile: '',
    applicantEmail: '',
    department: '',
    infoRequired: '',
    period: '',
    state: 'Uttar Pradesh',
  });
  const [generatedRTI, setGeneratedRTI] = useState('');

  const generateRTI = () => {
    if (!form.applicantName || !form.department || !form.infoRequired) {
      Alert.alert(
        language === 'hi' ? 'त्रुटि' : 'Error',
        language === 'hi' ? 'कृपया सभी जरूरी जानकारी भरें' : 'Please fill all required fields'
      );
      return;
    }

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    if (language === 'hi') {
      const rti = `--- AI GENERATED DOCUMENT | NyayMitra ---
--- यह दस्तावेज़ AI द्वारा तैयार किया गया है ---

सेवा में,
जन सूचना अधिकारी (PIO),
${form.department},
${form.state || 'उत्तर प्रदेश'}

दिनांक: ${dateStr}
स्थान: ${form.applicantCity || form.applicantAddress?.split(',')[0] || ''}

विषय: सूचना के अधिकार अधिनियम, 2005 की धारा 6(1) के अंतर्गत सूचना प्राप्त करने हेतु आवेदन।

महोदय/महोदया,

मैं ${form.applicantName}, पुत्र/पुत्री/पत्नी श्री/श्रीमती ____________, निवासी ${form.applicantAddress || '[पता]'}, एक भारतीय नागरिक हूं।

मैं सूचना के अधिकार अधिनियम, 2005 की धारा 6(1) के अंतर्गत निम्नलिखित सूचना की मांग करता/करती हूं:

मांगी गई सूचना:
${form.infoRequired}

${form.period ? `सूचना की समय अवधि: ${form.period}` : ''}

मैं उपरोक्त सूचना की स्व-प्रमाणित प्रति प्राप्त करना चाहता/चाहती हूं।

मैं सूचित करता/करती हूं कि मांगी गई सूचना अधिनियम की धारा 8 के अंतर्गत प्रतिबंधित नहीं है।

मैं इस आवेदन के साथ निर्धारित आवेदन शुल्क ₹10/- (दस रुपये) IPO/DD/नकद के रूप में संलग्न कर रहा/रही हूं।

यदि आप इस सूचना के लिए सक्षम अधिकारी नहीं हैं, तो कृपया अधिनियम की धारा 6(3) के अंतर्गत इस आवेदन को 5 कार्य दिवसों के भीतर उचित सक्षम अधिकारी को अग्रेषित करें।

कृपया सूचना अधिनियम की धारा 7(1) के अंतर्गत 30 दिवस की निर्धारित अवधि में सूचना प्रदान करें।

भवदीय,

हस्ताक्षर: _______________

नाम: ${form.applicantName}
पता: ${form.applicantAddress || '[पता]'}
मोबाइल: ${form.applicantMobile || '[मोबाइल नंबर]'}
ईमेल: ${form.applicantEmail || '[ईमेल]'}
दिनांक: ${dateStr}

संलग्नक:
1. ₹10/- का IPO/DD (आवेदन शुल्क)
2. पहचान प्रमाण की प्रति (यदि आवश्यक हो)

─────────────────────────────────
⚠️ NyayMitra द्वारा तैयार | RTI Act 2005
30 दिन में जवाब न मिले तो प्रथम अपील करें — Section 19(1)
─────────────────────────────────`;
      setGeneratedRTI(rti);
    } else {
      const rti = `--- AI GENERATED DOCUMENT | NyayMitra ---
--- This document is AI generated ---

To,
The Public Information Officer (PIO),
${form.department},
${form.state || 'Uttar Pradesh'}

Date: ${dateStr}
Place: ${form.applicantCity || form.applicantAddress?.split(',')[0] || ''}

Subject: Application for Information under Section 6(1) of the Right to Information Act, 2005.

Sir/Madam,

I, ${form.applicantName}, Son/Daughter/Wife of Shri/Smt. ____________, resident of ${form.applicantAddress || '[Address]'}, am an Indian citizen.

I hereby request the following information under Section 6(1) of the Right to Information Act, 2005:

Information Sought:
${form.infoRequired}

${form.period ? `Period: ${form.period}` : ''}

I wish to obtain a self-attested copy of the above information.

I state that the information sought does not fall within the restrictions contained in Section 8 of the RTI Act, 2005.

I am enclosing the prescribed application fee of Rs. 10/- (Rupees Ten only) via IPO/DD/Cash.

If you are not the competent authority for this information, please transfer this application to the appropriate authority within 5 working days under Section 6(3) of the Act.

Kindly furnish the information within 30 days as stipulated under Section 7(1) of the RTI Act, 2005.

Yours faithfully,

Signature: _______________

Name: ${form.applicantName}
Address: ${form.applicantAddress || '[Address]'}
Mobile: ${form.applicantMobile || '[Mobile Number]'}
Email: ${form.applicantEmail || '[Email]'}
Date: ${dateStr}

Enclosures:
1. IPO/DD of Rs. 10/- (Application Fee)
2. Copy of Identity Proof (if required)

─────────────────────────────────
⚠️ Generated by NyayMitra | RTI Act 2005
If no reply in 30 days, file First Appeal — Section 19(1)
─────────────────────────────────`;
      setGeneratedRTI(rti);
    }

    setStep(3);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ backgroundColor: '#1a237e', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()} style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{t('📝 RTI आवेदन लिखें', '📝 Write RTI')}</Text>
          <Text style={{ color: '#AABBCC', fontSize: 11 }}>Step {step} of 3 — RTI Application Writer</Text>
        </View>
        <HeaderToggle />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {step === 1 && (
          <>
            <View style={{ backgroundColor: isDark ? '#1B2A1B' : '#E8F5E9', borderRadius: 12, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#00AA44' }}>
              <Text style={{ color: isDark ? '#88FFAA' : '#006622', fontWeight: 'bold' }}>RTI क्या है?</Text>
              <Text style={{ color: isDark ? '#AACCBB' : '#444', fontSize: 12, marginTop: 4, lineHeight: 18 }}>
                सूचना का अधिकार (RTI) Act 2005 — किसी भी सरकारी विभाग से जानकारी मांगने का आपका कानूनी अधिकार। मात्र ₹10 में। 30 दिन में जवाब देना सरकार का कर्तव्य है।
              </Text>
            </View>

            <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 15, marginBottom: 12 }}>
              {t('आप किस बारे में RTI दाखिल करना चाहते हैं?', 'What do you want to file RTI about?')}
            </Text>

            {RTI_TEMPLATES.map(t => (
              <TouchableOpacity
                key={t.id}
                style={{ backgroundColor: selectedTemplate?.id === t.id ? '#FF6B00' : cardBg, borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: selectedTemplate?.id === t.id ? '#FF6B00' : (isDark ? '#2A3F55' : '#E0E0E0') }}
                onPress={() => setSelectedTemplate(t)}
              >
                <Text style={{ color: selectedTemplate?.id === t.id ? '#fff' : textColor, fontWeight: 'bold', fontSize: 13 }}>
                  {language === 'hi' ? t.label_hi : t.label_en}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={{ backgroundColor: selectedTemplate ? '#FF6B00' : '#ccc', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 }}
              onPress={() => {
                if (!selectedTemplate) { Alert.alert('', t('कृपया एक विकल्प चुनें', 'Please select an option')); return; }
                setForm({ ...form, department: selectedTemplate.dept, infoRequired: selectedTemplate.info });
                setStep(2);
              }}
              disabled={!selectedTemplate}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>{t('आगे बढ़ें →', 'Next →')}</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 15, marginBottom: 16 }}>
              {t('अपनी जानकारी भरें', 'Fill Your Details')}
            </Text>

            {[
              { key: 'applicantName', label_hi: 'आपका पूरा नाम *', label_en: 'Full Name *', ph: 'Ram Kumar Singh' },
              { key: 'applicantAddress', label_hi: 'पता *', label_en: 'Address *', ph: 'Village, Post, District, State' },
              { key: 'applicantCity', label_hi: 'शहर *', label_en: 'City *', ph: 'Lucknow' },
              { key: 'applicantMobile', label_hi: 'मोबाइल नंबर', label_en: 'Mobile Number', ph: '9XXXXXXXXX' },
              { key: 'applicantEmail', label_hi: 'ईमेल (वैकल्पिक)', label_en: 'Email (optional)', ph: 'example@gmail.com' },
              { key: 'department', label_hi: 'विभाग/कार्यालय *', label_en: 'Department/Office *', ph: 'Revenue Department, Lucknow' },
              { key: 'infoRequired', label_hi: 'मांगी जाने वाली सूचना *', label_en: 'Information Required *', ph: t('विस्तार से लिखें...', 'Write in detail...') },
              { key: 'period', label_hi: 'समय अवधि (वैकल्पिक)', label_en: 'Period (optional)', ph: t('जैसे: 2020 से 2024 तक', 'e.g. 2020 to 2024') },
            ].map(f => (
              <View key={f.key} style={{ marginBottom: 12 }}>
                <Text style={{ color: subText, fontSize: 12, marginBottom: 4 }}>{language === 'hi' ? f.label_hi : f.label_en}</Text>
                <TextInput
                  style={{ backgroundColor: cardBg, color: textColor, borderRadius: 8, padding: 12, borderWidth: 0.5, borderColor: isDark ? '#2A3F55' : '#E0E0E0', minHeight: f.key === 'infoRequired' ? 80 : 44 }}
                  value={form[f.key as keyof typeof form]}
                  onChangeText={val => setForm({ ...form, [f.key]: val })}
                  placeholder={f.ph}
                  placeholderTextColor={subText}
                  multiline={f.key === 'infoRequired' || f.key === 'applicantAddress'}
                  textAlignVertical={f.key === 'infoRequired' ? 'top' : 'center'}
                />
              </View>
            ))}

            <TouchableOpacity
              style={{ backgroundColor: '#FF6B00', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 }}
              onPress={generateRTI}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>{t('📝 RTI बनाएं', '📝 Generate RTI')}</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E0E0E0' }}>
              <Text style={{ fontSize: 13, lineHeight: 22, color: '#111', fontFamily: 'monospace' }}>
                {generatedRTI}
              </Text>
            </View>

            <View style={{ gap: 8 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#FF6B00', borderRadius: 12, padding: 14, alignItems: 'center' }}
                onPress={() => Share.share({ message: generatedRTI })}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>{t('📤 Share / Print करें', '📤 Share / Print')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#1a237e', borderRadius: 12, padding: 14, alignItems: 'center' }}
                onPress={() => Linking.openURL('https://rtionline.gov.in')}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>{t('🌐 Online RTI Submit करें', '🌐 Submit RTI Online')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: isDark ? '#243447' : '#F0F0F0', borderRadius: 12, padding: 14, alignItems: 'center' }}
                onPress={() => { setStep(1); setGeneratedRTI(''); setSelectedTemplate(null); }}
              >
                <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 14 }}>{t('नई RTI लिखें', 'Write New RTI')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

