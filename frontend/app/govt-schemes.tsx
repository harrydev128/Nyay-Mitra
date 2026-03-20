import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import HeaderToggle from '../components/HeaderToggle';

const SCHEMES = [
  { id: 1, icon: '🌾', name: 'PM Kisan Samman Nidhi', category: 'किसान', who: 'छोटे और सीमांत किसान', benefit: '6000 रुपये/साल - 3 किश्तें', eligibility: ['आपके पास खेती योग्य जमीन हो', 'स्वयं किसान हों', 'सरकारी कर्मचारी पात्र नहीं', 'Income Tax भरने वाले पात्र नहीं'], steps: ['pmkisan.gov.in पर जाएं', 'New Farmer Registration पर क्लिक करें', 'Aadhaar और मोबाइल डालें', 'जमीन के कागज अपलोड करें', 'Bank details भरें और Submit करें'], apply: 'pmkisan.gov.in', url: 'https://pmkisan.gov.in', helpline: '155261' },
  { id: 2, icon: '🔥', name: 'PM Ujjwala Yojana', category: 'महिला', who: 'BPL परिवार की महिलाएं', benefit: 'मुफ्त LPG कनेक्शन + 1600 रुपये सहायता', eligibility: ['महिला घर की मुखिया हो', 'BPL राशन कार्ड हो', 'उम्र 18 साल या ज्यादा', 'पहले से LPG न हो'], steps: ['नजदीकी LPG वितरक पर जाएं', 'KYC Form भरें', 'Aadhaar और राशन कार्ड दें', 'BPL certificate जमा करें', '7-15 दिन में कनेक्शन मिलेगा'], apply: 'pmuy.gov.in', url: 'https://pmuy.gov.in', helpline: '1906' },
  { id: 3, icon: '🏥', name: 'Ayushman Bharat PM-JAY', category: 'स्वास्थ्य', who: 'गरीब परिवार', benefit: '5 लाख रुपये/साल मुफ्त इलाज', eligibility: ['SECC 2011 डेटा में नाम हो', '70+ साल के बुजुर्ग पात्र हैं', 'Aadhaar से verify होगा', 'सरकारी नौकरी वाले पात्र नहीं'], steps: ['pmjay.gov.in पर पात्रता check करें', 'नजदीकी CSC पर जाएं', 'Aadhaar और राशन कार्ड दें', 'Ayushman Card बनवाएं', 'empanelled hospital में card दिखाएं'], apply: 'pmjay.gov.in', url: 'https://pmjay.gov.in', helpline: '14555' },
  { id: 4, icon: '🏠', name: 'PM Awas Yojana Gramin', category: 'आवास', who: 'ग्रामीण बेघर परिवार', benefit: '1.20 लाख रुपये सीधे बैंक में', eligibility: ['ग्रामीण क्षेत्र में रहते हों', 'SECC 2011 में नाम हो', 'पक्का मकान न हो'], steps: ['ग्राम पंचायत में ग्राम सचिव से मिलें', 'SECC सूची में नाम check करें', 'आवेदन फॉर्म भरें', 'BDO की मंजूरी का इंतजार करें', 'pmayg.nic.in पर status देखें'], apply: 'pmayg.nic.in', url: 'https://pmayg.nic.in', helpline: '1800-11-6446' },
  { id: 5, icon: '💼', name: 'PM Mudra Yojana', category: 'व्यापार', who: 'छोटे व्यापारी और दुकानदार', benefit: 'बिना गारंटी 10 लाख तक loan', eligibility: ['Non-farm small business हो', 'उम्र 18-65 साल', 'अच्छा Credit History हो', 'पहले से loan default न हो'], steps: ['नजदीकी बैंक पर जाएं', 'Mudra Loan Form भरें', 'Business plan दें', 'Aadhaar और PAN दें', '7-30 दिन में loan मिलेगा'], apply: 'mudra.org.in', url: 'https://www.mudra.org.in', helpline: '1800-180-1111' },
  { id: 6, icon: '🏦', name: 'PM Jan Dhan Yojana', category: 'बैंकिंग', who: 'बिना बैंक खाते के नागरिक', benefit: 'Zero balance account + 10000 overdraft', eligibility: ['10 साल या ज्यादा उम्र', 'कोई भी ID proof काफी', 'पहले से account न हो'], steps: ['नजदीकी बैंक जाएं', 'Account opening form भरें', 'Aadhaar या Voter ID दें', 'Photo दें', 'उसी दिन account खुलेगा'], apply: 'pmjdy.gov.in', url: 'https://pmjdy.gov.in', helpline: '1800-11-0001' },
  { id: 7, icon: '👧', name: 'Sukanya Samriddhi Yojana', category: 'बच्चे', who: '10 साल से कम बेटी के माता-पिता', benefit: '8.2 प्रतिशत ब्याज - Tax free', eligibility: ['बेटी की उम्र 10 साल से कम', 'अधिकतम 2 बेटियों के लिए', 'भारतीय नागरिक हों'], steps: ['Post Office या Bank जाएं', 'SSY form भरें', 'बेटी का जन्म प्रमाण पत्र दें', '250 रुपये से account खोलें', 'हर साल minimum 250 जमा करें'], apply: 'Post Office या Bank', url: 'https://www.indiapost.gov.in', helpline: '1800-266-6868' },
  { id: 8, icon: '🌿', name: 'PM Fasal Bima Yojana', category: 'किसान', who: 'सभी किसान', benefit: 'फसल खराब होने पर मुआवजा', eligibility: ['खेती योग्य जमीन के मालिक', 'किरायेदार किसान भी पात्र', 'समय पर apply करें'], steps: ['pmfby.gov.in पर apply करें', 'या नजदीकी बैंक जाएं', 'फसल और क्षेत्र की जानकारी दें', 'Premium भरें', 'फसल खराब होने पर helpline पर call करें'], apply: 'pmfby.gov.in', url: 'https://pmfby.gov.in', helpline: '1800-200-7710' },
  { id: 9, icon: '🛡️', name: 'PM Suraksha Bima Yojana', category: 'बीमा', who: '18-70 साल के बैंक खाता धारक', benefit: '2 लाख दुर्घटना बीमा - मात्र 20 रुपये/साल', eligibility: ['उम्र 18-70 साल', 'बचत खाता हो', 'Aadhaar linked mobile हो'], steps: ['बैंक app में Insurance section खोलें', 'PMSBY में enroll करें', '20 रुपये auto-debit होगा', 'दुर्घटना पर 30 दिन में claim करें'], apply: 'jansuraksha.gov.in', url: 'https://jansuraksha.gov.in', helpline: '1800-110-001' },
  { id: 10, icon: '👴', name: 'Atal Pension Yojana', category: 'पेंशन', who: 'असंगठित क्षेत्र के 18-40 साल के कामगार', benefit: '1000 से 5000 रुपये/माह pension 60 साल के बाद', eligibility: ['उम्र 18-40 साल', 'बचत खाता हो', 'Income Tax न भरते हों', 'EPF/ESIC member न हों'], steps: ['बैंक में APY enrollment form भरें', 'Monthly contribution चुनें', 'Auto-debit mandate दें', '60 साल तक contribute करें', '60 साल पर pension शुरू होगी'], apply: 'npscra.nsdl.co.in', url: 'https://npscra.nsdl.co.in', helpline: '1800-110-069' },
  { id: 11, icon: '👩', name: 'PM Matru Vandana Yojana', category: 'महिला', who: 'गर्भवती और स्तनपान कराने वाली महिलाएं', benefit: '5000 रुपये - 3 किश्तों में', eligibility: ['19 साल या ज्यादा उम्र', 'पहले जीवित बच्चे पर लागू', 'सरकारी कर्मचारी पात्र नहीं'], steps: ['नजदीकी Anganwadi जाएं', 'PMMVY form भरें', 'Aadhaar और MCP Card दें', 'Bank details दें', 'तीन किश्तें मिलेंगी'], apply: 'wcd.nic.in', url: 'https://wcd.nic.in', helpline: '7998799804' },
  { id: 12, icon: '🔨', name: 'PM Vishwakarma Yojana', category: 'कारीगर', who: 'पारंपरिक हस्तशिल्प कारीगर', benefit: '15000 toolkit + 5 प्रतिशत ब्याज पर 3 लाख loan', eligibility: ['18 श्रेणियों में काम करते हों', 'उम्र 18 साल या ज्यादा', 'सरकारी नौकरी न हो'], steps: ['pmvishwakarma.gov.in पर जाएं', 'CSC से registration करें', 'Aadhaar और trade document दें', 'Training पूरी करें', 'Certificate के बाद loan मिलेगा'], apply: 'pmvishwakarma.gov.in', url: 'https://pmvishwakarma.gov.in', helpline: '1800-267-7777' },
  { id: 13, icon: '⚡', name: 'PM Surya Ghar Yojana', category: 'बिजली', who: 'खुद का मकान रखने वाले', benefit: '300 unit/माह free बिजली + 78000 तक subsidy', eligibility: ['खुद का मकान हो', 'बिजली का active connection हो', 'छत पर खाली जगह हो'], steps: ['pmsuryaghar.gov.in पर register करें', 'Electricity bill और Aadhaar दें', 'Approved vendor चुनें', 'Installation के बाद net meter लगेगा', 'Subsidy बैंक में आएगी'], apply: 'pmsuryaghar.gov.in', url: 'https://pmsuryaghar.gov.in', helpline: '1800-180-3333' },
  { id: 14, icon: '💧', name: 'Jal Jeevan Mission', category: 'पानी', who: 'ग्रामीण परिवार जिनके घर नल नहीं', benefit: 'घर तक नल का पीने का पानी मुफ्त', eligibility: ['ग्रामीण क्षेत्र में रहते हों', 'घर में tap water न हो'], steps: ['ग्राम पंचायत को आवेदन दें', 'Village Water Committee से मिलें', 'jaljeevan.gov.in पर request दर्ज करें', 'काम न हो तो Collector को लिखें'], apply: 'jaljeevan.gov.in', url: 'https://jaljeevan.gov.in', helpline: '1800-180-1551' },
  { id: 15, icon: '🌾', name: 'MGNREGA - नरेगा', category: 'रोजगार', who: 'ग्रामीण क्षेत्र के सभी वयस्क', benefit: '100 दिन guaranteed रोजगार - 220 से 350 रुपये/दिन', eligibility: ['ग्रामीण क्षेत्र में रहते हों', '18 साल या ज्यादा उम्र', 'Job Card हो'], steps: ['ग्राम पंचायत से Job Card बनवाएं', 'Aadhaar और Ration Card दें', 'ग्राम रोजगार सेवक से काम मांगें', '15 दिन में काम मिलेगा', 'nrega.nic.in पर status देखें'], apply: 'nrega.nic.in', url: 'https://nrega.nic.in', helpline: '1800-345-2244' },
];

export default function GovtSchemesScreen() {
  const router = useRouter();
  const { theme, language } = useAppContext();
  const isDark = theme === 'dark';
  const bg = isDark ? '#0D1B2A' : '#F5F5F5';
  const cardBg = isDark ? '#1B2B3B' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a237e';
  const subText = isDark ? '#AABBCC' : '#666666';
  const t = (hi: string, en: string) => language === 'hi' ? hi : en;
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('सभी');
  const [expanded, setExpanded] = useState<number | null>(null);

  const categories = ['सभी', 'किसान', 'महिला', 'स्वास्थ्य', 'आवास', 'व्यापार', 'बैंकिंग', 'बीमा', 'पेंशन', 'कारीगर', 'बिजली', 'पानी', 'रोजगार', 'बच्चे'];

  const filtered = SCHEMES.filter(s => {
    const matchCat = activeCategory === 'सभी' || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.who.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ backgroundColor: '#1a237e', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff', fontSize: 24 }}>{'<'}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{t('Sarkari Yojanaen', 'Govt Schemes')}</Text>
        </View>
        <HeaderToggle />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 8 }} contentContainerStyle={{ alignItems: 'center', paddingVertical: 8 }}>
        {categories.map(cat => (
          <TouchableOpacity key={cat} onPress={() => setActiveCategory(cat)} style={{ backgroundColor: activeCategory === cat ? '#FF6B00' : (isDark ? '#2A3F55' : '#F0F0F0'), paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: activeCategory === cat ? '#FF6B00' : (isDark ? '#2A3F55' : '#E0E0E0') }}>
            <Text style={{ color: activeCategory === cat ? '#fff' : subText, fontSize: 12, fontWeight: activeCategory === cat ? 'bold' : 'normal', textDecorationLine: 'none' }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        <TextInput style={{ backgroundColor: cardBg, color: textColor, borderRadius: 10, padding: 12, borderWidth: 0.5, borderColor: isDark ? '#2A3F55' : '#E0E0E0' }} placeholder={t('Yojana khojein...', 'Search schemes...')} placeholderTextColor={subText} value={search} onChangeText={setSearch} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {filtered.map(s => (
          <TouchableOpacity key={s.id} style={{ backgroundColor: cardBg, borderRadius: 12, marginBottom: 10, overflow: 'hidden', borderWidth: expanded === s.id ? 2 : 0.5, borderColor: expanded === s.id ? '#FF6B00' : (isDark ? '#2A3F55' : '#E0E0E0') }} onPress={() => setExpanded(expanded === s.id ? null : s.id)} activeOpacity={0.8}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
              <Text style={{ fontSize: 28, marginRight: 12 }}>{s.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: textColor, fontSize: 14, fontWeight: 'bold' }}>{s.name}</Text>
                <Text style={{ color: subText, fontSize: 12, marginTop: 2 }}>{s.who}</Text>
              </View>
              <Text style={{ color: '#FF6B00', fontSize: 16 }}>{expanded === s.id ? 'A' : 'V'}</Text>
            </View>

            {expanded === s.id && (
              <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
                <View style={{ backgroundColor: isDark ? '#0D2A1B' : '#E8F5E9', borderRadius: 8, padding: 10, marginBottom: 10 }}>
                  <Text style={{ color: '#00AA44', fontSize: 12, fontWeight: 'bold' }}>Labh: {s.benefit}</Text>
                </View>

                <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 13, marginBottom: 6 }}>Patrata janchen:</Text>
                {s.eligibility.map((e, i) => (
                  <Text key={i} style={{ color: subText, fontSize: 12, marginBottom: 4 }}>- {e}</Text>
                ))}

                <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 13, marginTop: 10, marginBottom: 6 }}>Avedan kaise karen:</Text>
                {s.steps.map((step, i) => (
                  <View key={i} style={{ flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' }}>
                    <View style={{ backgroundColor: '#FF6B00', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 8, flexShrink: 0 }}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{i + 1}</Text>
                    </View>
                    <Text style={{ color: subText, fontSize: 12, flex: 1, lineHeight: 18 }}>{step}</Text>
                  </View>
                ))}

                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  <TouchableOpacity style={{ flex: 1, backgroundColor: '#FF6B00', borderRadius: 8, padding: 10, alignItems: 'center' }} onPress={() => Linking.openURL(s.url)}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Avedan Karen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, backgroundColor: '#1a237e', borderRadius: 8, padding: 10, alignItems: 'center' }} onPress={() => Linking.openURL('tel:' + s.helpline)}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{s.helpline}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
