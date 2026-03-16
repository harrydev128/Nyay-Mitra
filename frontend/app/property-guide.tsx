import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import HeaderToggle from '../components/HeaderToggle';

const PROPERTY_ISSUES = [
  {
    id: 1, icon: '🏚️',
    title: 'अवैध कब्जा / Illegal Possession',
    desc: 'किसी ने आपकी जमीन पर जबरदस्ती कब्जा कर लिया',
    steps: [
      'तुरंत नजदीकी police station में FIR दर्ज करें — BNS Section 329',
      'Tahsildar/SDM को लिखित शिकायत दें',
      'Civil Court में Suit for Possession file करें',
      'अगर 12 साल से कम — Adverse Possession का खतरा नहीं',
      'सभी जमीन के कागज सुरक्षित रखें',
    ],
    docs: ['खतौनी/खसरा', 'Registry/Sale Deed', 'Tax Receipts', 'Photos/Videos of encroachment'],
    helpline: '112',
    law: 'BNS 329, 331 | Specific Relief Act 1963',
    url: 'https://upbhulekh.gov.in',
    urlLabel: 'UP Bhulekh — जमीन रिकॉर्ड देखें',
  },
  {
    id: 2, icon: '👨‍👩‍👧',
    title: 'पारिवारिक संपत्ति विवाद',
    desc: 'पिता/दादा की संपत्ति में हिस्से को लेकर झगड़ा',
    steps: [
      'पहले परिवार में बातचीत से सुलझाने की कोशिश करें',
      'Mediation Centre जाएं — District Court में होता है, मुफ्त',
      'Partition Suit file करें Civil Court में',
      'बेटियों का पैतृक संपत्ति में बराबर हक है — Hindu Succession Act',
      'Will/Vasiyatnama है तो probate के लिए court में दाखिल करें',
    ],
    docs: ['मृत्यु प्रमाण पत्र', 'Family Tree Affidavit', 'Property Documents', 'Will if any'],
    helpline: '15100',
    law: 'Hindu Succession Act 1956 | Partition Act 1893',
    url: 'https://services.ecourts.gov.in',
    urlLabel: 'District Court — Partition Suit',
  },
  {
    id: 3, icon: '🏗️',
    title: 'Builder ने धोखा दिया / Builder Fraud',
    desc: 'पैसे लिए, flat/plot नहीं दिया या देरी कर रहा है',
    steps: [
      'RERA portal पर तुरंत complaint दर्ज करें — 60 दिन में सुनवाई',
      'Builder को legal notice भेजें — registered post से',
      'Consumer Forum में complaint — ₹50 लाख तक के cases',
      'RERA registration check करें — unregistered builder को जुर्माना',
      'Police में FIR — BNS Section 318 (cheating)',
    ],
    docs: ['Agreement to Sale', 'Payment Receipts', 'Brochure/Advertisement', 'Correspondence'],
    helpline: '1800-180-3770',
    law: 'RERA Act 2016 | Consumer Protection Act 2019',
    url: 'https://up-rera.in',
    urlLabel: 'UP RERA — Complaint Portal',
  },
  {
    id: 4, icon: '📋',
    title: 'जमीन की Registry / Mutation',
    desc: 'नई जमीन खरीदी, Mutation (दाखिल खारिज) नहीं हो रहा',
    steps: [
      'Tehsil office में Mutation application दें',
      'Required documents: Sale Deed, ID Proof, Stamp Duty receipt',
      'Online: UP Bhulekh portal पर track करें',
      'SDM को complaint दें अगर 30 दिन में न हो',
      'CM Helpline 1076 पर complaint करें',
    ],
    docs: ['Sale Deed (Registered)', 'ID Proof', 'Old Khatauni', 'NOC from seller'],
    helpline: '1076',
    law: 'Registration Act 1908 | UP Revenue Code 2006',
    url: 'https://upbhulekh.gov.in',
    urlLabel: 'UP Bhulekh Portal',
  },
  {
    id: 5, icon: '🌾',
    title: 'सरकारी जमीन अधिग्रहण',
    desc: 'सरकार ने जमीन ली, मुआवजा कम दिया या नहीं दिया',
    steps: [
      'Collector के यहां objection petition दाखिल करें — 30 दिन में',
      'Reference Court में Reference case file करें — ज्यादा मुआवजे के लिए',
      'Legal Aid से मुफ्त वकील लें — DLSA office',
      'High Court में writ petition दाखिल करें',
      'Social Impact Assessment Report की copy मांगें RTI से',
    ],
    docs: ['Award Notice', 'Land Records', 'Market Value proof', 'RTI application'],
    helpline: '1800-11-0031',
    law: 'RFCTLARR Act 2013 | Constitution Article 300A',
    url: 'https://rtionline.gov.in',
    urlLabel: 'RTI File करें',
  },
  {
    id: 6, icon: '🏠',
    title: 'किरायेदार बेदखली',
    desc: 'मकान मालिक बिना नोटिस घर खाली करवा रहा है',
    steps: [
      'बिना 15 दिन notice के बेदखली गैरकानूनी है',
      'Rent Controller के यहां complaint दें',
      'Police में शिकायत दें — BNS 329',
      'Rent Agreement है तो Civil Court में injunction लें',
      'Legal Aid से मुफ्त वकील — DLSA',
    ],
    docs: ['Rent Agreement', 'Rent Receipts', 'ID Proof', 'Notice received'],
    helpline: '15100',
    law: 'UP Urban Buildings (Regulation of Letting) Act 1972',
    url: 'https://services.ecourts.gov.in',
    urlLabel: 'Civil Court — Injunction',
  },
];

export default function PropertyGuideScreen() {
  const router = useRouter();
  const { theme, language } = useAppContext();
  const isDark = theme === 'dark';
  const bg = isDark ? '#0D1B2A' : '#F5F5F5';
  const cardBg = isDark ? '#1B2B3B' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a237e';
  const subText = isDark ? '#AABBCC' : '#666666';
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ backgroundColor: '#1a237e', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>🏘️ संपत्ति विवाद गाइड</Text>
          <Text style={{ color: '#AABBCC', fontSize: 11 }}>Property Dispute Guide</Text>
        </View>
        <HeaderToggle />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ backgroundColor: isDark ? '#0D2A1B' : '#E8F5E9', borderRadius: 12, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#00AA44' }}>
          <Text style={{ color: isDark ? '#88FFAA' : '#006622', fontWeight: 'bold', fontSize: 13 }}>
            ⚠️ महत्वपूर्ण जानकारी
          </Text>
          <Text style={{ color: isDark ? '#AACCBB' : '#444', fontSize: 12, marginTop: 4, lineHeight: 18 }}>
            भारत में 66% civil cases संपत्ति से जुड़े हैं। अपनी समस्या चुनें और तुरंत क्या करना है जानें।
          </Text>
        </View>

        {PROPERTY_ISSUES.map(item => (
          <TouchableOpacity
            key={item.id}
            style={{ backgroundColor: cardBg, borderRadius: 12, marginBottom: 10, overflow: 'hidden', borderWidth: expanded === item.id ? 2 : 0.5, borderColor: expanded === item.id ? '#FF6B00' : (isDark ? '#2A3F55' : '#E0E0E0') }}
            onPress={() => setExpanded(expanded === item.id ? null : item.id)}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
              <Text style={{ fontSize: 28, marginRight: 12 }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: textColor, fontSize: 14, fontWeight: 'bold' }}>{item.title}</Text>
                <Text style={{ color: subText, fontSize: 12, marginTop: 2 }}>{item.desc}</Text>
              </View>
              <Text style={{ color: '#FF6B00', fontSize: 16 }}>{expanded === item.id ? '▲' : '▼'}</Text>
            </View>

            {expanded === item.id && (
              <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
                <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 13, marginBottom: 8 }}>
                  📋 तुरंत क्या करें:
                </Text>
                {item.steps.map((step, i) => (
                  <View key={i} style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' }}>
                    <View style={{ backgroundColor: '#FF6B00', borderRadius: 12, width: 22, height: 22, alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0 }}>
                      <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{i + 1}</Text>
                    </View>
                    <Text style={{ color: subText, fontSize: 12, flex: 1, lineHeight: 18 }}>{step}</Text>
                  </View>
                ))}

                <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 13, marginTop: 8, marginBottom: 6 }}>
                  📂 जरूरी दस्तावेज:
                </Text>
                {item.docs.map((doc, i) => (
                  <Text key={i} style={{ color: subText, fontSize: 12, marginBottom: 3 }}>• {doc}</Text>
                ))}

                <View style={{ backgroundColor: isDark ? '#243447' : '#F8F9FA', borderRadius: 8, padding: 10, marginTop: 10, marginBottom: 10 }}>
                  <Text style={{ color: isDark ? '#AABBCC' : '#666', fontSize: 11, fontStyle: 'italic' }}>
                    📜 कानून: {item.law}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#CC0000', borderRadius: 8, padding: 10, alignItems: 'center' }}
                    onPress={() => Linking.openURL('tel:' + item.helpline)}
                  >
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>📞 {item.helpline}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#1a237e', borderRadius: 8, padding: 10, alignItems: 'center' }}
                    onPress={() => Linking.openURL(item.url)}
                  >
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{item.urlLabel}</Text>
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

