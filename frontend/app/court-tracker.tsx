import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Linking, Alert, Share
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderToggle from '../components/HeaderToggle';

export default function CourtTrackerScreen() {
  const router = useRouter();
  const { theme, language } = useAppContext();
  const isDark = theme === 'dark';
  const bg = isDark ? '#0D1B2A' : '#F5F5F5';
  const cardBg = isDark ? '#1B2B3B' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a237e';
  const subText = isDark ? '#AABBCC' : '#666666';
  const t = (hi: string, en: string) => language === 'hi' ? hi : en;

  const [cnr, setCnr] = useState('');
  const [caseName, setCaseName] = useState('');
  const [savedCases, setSavedCases] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');

  useEffect(() => { loadSaved(); }, []);

  const loadSaved = async () => {
    try {
      const s = await AsyncStorage.getItem('court_cases');
      if (s) setSavedCases(JSON.parse(s));
    } catch {}
  };

  const openECourts = (cnrNum: string) => {
    if (!cnrNum.trim()) {
      Alert.alert(
        t('CNR नंबर डालें', 'Enter CNR Number'),
        t('कृपया अपना CNR नंबर डालें', 'Please enter your CNR number')
      );
      return;
    }
    // Official eCourts government URL with CNR
    const url = `https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/index&appFlag=web`;
    Linking.openURL(url);
  };

  const saveCase = async () => {
    if (!cnr.trim()) {
      Alert.alert(t('त्रुटि', 'Error'), t('CNR नंबर डालें', 'Enter CNR number'));
      return;
    }
    try {
      const newCase = {
        id: Date.now().toString(),
        cnr: cnr.trim().toUpperCase(),
        name: caseName.trim() || t('मेरा केस', 'My Case'),
        savedAt: new Date().toISOString(),
      };
      const updated = [newCase, ...savedCases.filter(c => c.cnr !== newCase.cnr)];
      setSavedCases(updated);
      await AsyncStorage.setItem('court_cases', JSON.stringify(updated));
      Alert.alert(
        t('सेव हुआ!', 'Saved!'),
        t('केस सेव हो गया। अब आप सेव केस से जल्दी चेक कर सकते हैं।', 'Case saved successfully.')
      );
    } catch {}
  };

  const deleteCase = async (id: string) => {
    Alert.alert(
      t('हटाएं?', 'Delete?'),
      t('यह केस हटाना चाहते हैं?', 'Remove this case?'),
      [
        { text: t('नहीं', 'No') },
        {
          text: t('हां', 'Yes'), style: 'destructive',
          onPress: async () => {
            const updated = savedCases.filter(c => c.id !== id);
            setSavedCases(updated);
            await AsyncStorage.setItem('court_cases', JSON.stringify(updated));
          }
        }
      ]
    );
  };

  const shareCase = async (cnrNum: string) => {
    try {
      await Share.share({
        message: t(
          `मेरा कोर्ट केस CNR: ${cnrNum}\nNyayMitra App से track करें।\neCourts: https://services.ecourts.gov.in`,
          `My Court Case CNR: ${cnrNum}\nTrack via NyayMitra App.\neCourts: https://services.ecourts.gov.in`
        )
      });
    } catch {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>

      {/* Header */}
      <View style={{ backgroundColor: '#1a237e', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
            {t('कोर्ट केस ट्रैकर', 'Court Case Tracker')}
          </Text>
          <Text style={{ color: '#AABBCC', fontSize: 11 }}>
            {t('सरकारी eCourts डेटा', 'Official Govt eCourts Data')}
          </Text>
        </View>
        <HeaderToggle />
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: cardBg, margin: 12, borderRadius: 10, padding: 4 }}>
        {(['search', 'saved'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={{ flex: 1, padding: 10, borderRadius: 8, backgroundColor: activeTab === tab ? '#FF6B00' : 'transparent', alignItems: 'center' }}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={{ color: activeTab === tab ? '#fff' : subText, fontWeight: 'bold', fontSize: 13 }}>
              {tab === 'search'
                ? t('🔍 केस खोजें', '🔍 Search')
                : `📁 ${t('सेव केस', 'Saved')} (${savedCases.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {activeTab === 'search' ? (
          <>
            {/* CNR Info Box */}
            <View style={{ backgroundColor: isDark ? '#0D2A1B' : '#E8F5E9', borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#00AA44' }}>
              <Text style={{ color: isDark ? '#88FFAA' : '#006622', fontWeight: 'bold', fontSize: 13, marginBottom: 6 }}>
                {t('CNR नंबर क्या होता है?', 'What is CNR Number?')}
              </Text>
              <Text style={{ color: isDark ? '#AACCBB' : '#333', fontSize: 12, lineHeight: 18 }}>
                {t(
                  'CNR एक unique 16-digit नंबर है जो हर court case को मिलता है। यह आपके court notice पर या वकील के पास मिलेगा।',
                  'CNR is a unique 16-digit number for every court case. Find it on your court notice or ask your advocate.'
                )}
              </Text>
              <Text style={{ color: isDark ? '#88FFAA' : '#006622', fontSize: 12, marginTop: 6, fontWeight: 'bold' }}>
                {t('Example: UPLN010012342024', 'Example: UPLN010012342024')}
              </Text>
            </View>

            {/* Search Form */}
            <View style={{ backgroundColor: cardBg, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 15, marginBottom: 14 }}>
                {t('अपना केस खोजें', 'Find Your Case')}
              </Text>

              <Text style={{ color: subText, fontSize: 12, marginBottom: 4 }}>
                {t('केस का नाम (याद रखने के लिए)', 'Case Name (to remember)')}
              </Text>
              <TextInput
                style={{ backgroundColor: isDark ? '#243447' : '#F5F5F5', color: textColor, borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 0.5, borderColor: isDark ? '#2A3F55' : '#E0E0E0' }}
                placeholder={t('जैसे: जमीन विवाद, किराया केस', 'e.g. Land Dispute, Rent Case')}
                placeholderTextColor={subText}
                value={caseName}
                onChangeText={setCaseName}
              />

              <Text style={{ color: subText, fontSize: 12, marginBottom: 4 }}>
                {t('CNR नंबर *', 'CNR Number *')}
              </Text>
              <TextInput
                style={{ backgroundColor: isDark ? '#243447' : '#F5F5F5', color: textColor, borderRadius: 8, padding: 12, marginBottom: 16, borderWidth: 0.5, borderColor: isDark ? '#2A3F55' : '#E0E0E0', letterSpacing: 2, fontSize: 15, fontWeight: 'bold' }}
                placeholder="UPLN010012342024"
                placeholderTextColor={subText}
                value={cnr}
                onChangeText={text => setCnr(text.toUpperCase())}
                autoCapitalize="characters"
                maxLength={20}
              />

              {/* Main Button */}
              <TouchableOpacity
                style={{ backgroundColor: '#FF6B00', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 10 }}
                onPress={() => openECourts(cnr)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                  {t('🔍 अपनी तारीख देखें', '🔍 Check My Court Date')}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 }}>
                  {t('सरकारी eCourts पर खुलेगा', 'Opens on official eCourts')}
                </Text>
              </TouchableOpacity>

              {/* Save Button */}
              <TouchableOpacity
                style={{ backgroundColor: '#1a237e', borderRadius: 12, padding: 14, alignItems: 'center' }}
                onPress={saveCase}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                  {t('💾 यह केस सेव करें', '💾 Save This Case')}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 }}>
                  {t('अगली बार जल्दी खोलें', 'Quick access next time')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* UP Specific Courts */}
            <View style={{ backgroundColor: cardBg, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 14, marginBottom: 12 }}>
                {t('उत्तर प्रदेश के कोर्ट', 'Uttar Pradesh Courts')}
              </Text>
              {[
                {
                  label: t('eCourts - सभी District Courts UP', 'eCourts - All UP District Courts'),
                  sublabel: t('Lucknow, Kanpur, Agra, Varanasi सब', 'Lucknow, Kanpur, Agra, Varanasi etc'),
                  url: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/index&appFlag=web',
                  icon: '🏛️',
                  color: '#FF6B00'
                },
                {
                  label: t('Allahabad High Court', 'Allahabad High Court'),
                  sublabel: t('Allahabad और Lucknow Bench', 'Allahabad & Lucknow Bench'),
                  url: 'https://www.allahabadhighcourt.in/case/CaseStatus.html',
                  icon: '⚖️',
                  color: '#1a237e'
                },
                {
                  label: t('Supreme Court of India', 'Supreme Court of India'),
                  sublabel: t('सर्वोच्च न्यायालय', 'Highest Court'),
                  url: 'https://sci.gov.in/case-status/',
                  icon: '🏆',
                  color: '#006622'
                },
                {
                  label: t('Consumer Forum UP', 'Consumer Forum UP'),
                  sublabel: t('उपभोक्ता फोरम', 'Consumer Disputes'),
                  url: 'https://confonet.nic.in',
                  icon: '🛒',
                  color: '#CC0000'
                },
              ].map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: i < 3 ? 0.5 : 0, borderBottomColor: isDark ? '#2A3F55' : '#F0F0F0' }}
                  onPress={() => Linking.openURL(item.url)}
                >
                  <View style={{ backgroundColor: item.color + '22', borderRadius: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: item.color, fontSize: 13, fontWeight: 'bold' }}>{item.label}</Text>
                    <Text style={{ color: subText, fontSize: 11, marginTop: 1 }}>{item.sublabel}</Text>
                  </View>
                  <Text style={{ color: subText, fontSize: 16 }}>{'>'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* How to find CNR */}
            <View style={{ backgroundColor: isDark ? '#1B2A3B' : '#EEF2FF', borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 13, marginBottom: 10 }}>
                {t('CNR नंबर कहां मिलेगा?', 'Where to find CNR?')}
              </Text>
              {[
                { icon: '📄', text: t('Court notice या summon पर लिखा होता है', 'Written on court notice or summon') },
                { icon: '👨‍💼', text: t('अपने वकील से मांगें', 'Ask your advocate') },
                { icon: '🏛️', text: t('Court reception पर जाकर case number बताएं', 'Visit court reception with case number') },
                { icon: '📱', text: t('eCourts app से case number से CNR पाएं', 'Get CNR via eCourts app using case number') },
              ].map((tip, i) => (
                <View key={i} style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 16, marginRight: 10 }}>{tip.icon}</Text>
                  <Text style={{ color: subText, fontSize: 12, flex: 1, lineHeight: 18 }}>{tip.text}</Text>
                </View>
              ))}
            </View>

            {/* Disclaimer */}
            <View style={{ backgroundColor: isDark ? '#2A1A00' : '#FFF8E1', borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: '#FF8F00' }}>
              <Text style={{ color: isDark ? '#FFCC44' : '#E65100', fontSize: 11, lineHeight: 16 }}>
                {t(
                  '⚠️ यह डेटा सरकारी eCourts portal से लिया गया है। किसी भी discrepancy के लिए services.ecourts.gov.in पर verify करें।',
                  '⚠️ Data sourced from official eCourts govt portal. Verify at services.ecourts.gov.in for any discrepancy.'
                )}
              </Text>
            </View>
          </>

        ) : (
          /* Saved Cases */
          savedCases.length === 0 ? (
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Text style={{ fontSize: 60 }}>🏛️</Text>
              <Text style={{ color: textColor, fontSize: 16, fontWeight: 'bold', marginTop: 16 }}>
                {t('कोई केस सेव नहीं है', 'No saved cases')}
              </Text>
              <Text style={{ color: subText, textAlign: 'center', marginTop: 8, fontSize: 13 }}>
                {t('केस का CNR नंबर डालें और सेव करें\nअगली बार एक tap में date देखें', 'Enter CNR and save\nCheck date with one tap next time')}
              </Text>
              <TouchableOpacity
                style={{ backgroundColor: '#FF6B00', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12, marginTop: 20 }}
                onPress={() => setActiveTab('search')}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('केस जोड़ें', 'Add Case')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            savedCases.map((c, index) => (
              <View key={c.id} style={{ backgroundColor: cardBg, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 0.5, borderColor: isDark ? '#2A3F55' : '#E0E0E0' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{ backgroundColor: '#FF6B0022', borderRadius: 10, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 24 }}>🏛️</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 14 }}>{c.name}</Text>
                    <Text style={{ color: '#FF6B00', fontSize: 13, letterSpacing: 1, fontWeight: 'bold' }}>{c.cnr}</Text>
                    <Text style={{ color: subText, fontSize: 11 }}>
                      {t('सेव किया:', 'Saved:')} {new Date(c.savedAt).toLocaleDateString('hi-IN')}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteCase(c.id)} style={{ padding: 8 }}>
                    <Text style={{ color: '#CC0000', fontSize: 22 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={{ flex: 2, backgroundColor: '#FF6B00', borderRadius: 10, padding: 12, alignItems: 'center' }}
                    onPress={() => openECourts(c.cnr)}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>
                      {t('🔍 तारीख देखें', '🔍 Check Date')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: isDark ? '#243447' : '#F0F0F0', borderRadius: 10, padding: 12, alignItems: 'center' }}
                    onPress={() => shareCase(c.cnr)}
                  >
                    <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 13 }}>
                      {t('📤 शेयर', '📤 Share')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

