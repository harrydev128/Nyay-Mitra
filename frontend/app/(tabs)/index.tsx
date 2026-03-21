import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Linking,
  StatusBar, Platform, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../context/AppContext';
import HeaderToggle from '../../components/HeaderToggle';
import SideDrawer from '../../components/SideDrawer';
import AdBanner from '../../components/AdBanner';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme, language, user } = useAppContext();
  const router = useRouter();
  const isDark = theme === 'dark';
  const [drawerVisible, setDrawerVisible] = useState(false);

  const t = (hi: string, en: string) => language === 'hi' ? hi : en;

  // Colors - HTML design jaisa
  const bg = isDark ? '#141B3C' : '#F0F2FF';
  const cardBg = isDark ? '#1C2340' : '#FFFFFF';
  const card2 = isDark ? '#222A4A' : '#F5F7FF';
  const textColor = isDark ? '#F0F2FF' : '#141B3C';
  const subText = isDark ? '#8A95C0' : '#666666';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#E8EAFF';
  const orange = '#E8610A';
  const orange2 = '#FF7A25';

  const mainServices = [
    { icon: '⚖️', name: t('AI वकील', 'AI Lawyer'), desc: t('कानूनी सवाल पूछें 24/7', 'Ask legal questions 24/7'), route: '/(tabs)/chat' },
    { icon: '📋', name: t('अधिकार जानें', 'Know Rights'), desc: t('40+ कानूनी अधिकार', '40+ Legal Rights'), route: '/(tabs)/rights' },
    { icon: '📝', name: t('दस्तावेज़ बनाएं', 'Make Document'), desc: t('FIR, Notice, Agreement', 'FIR, Notice, Agreement'), route: '/(tabs)/documents' },
    { icon: '🏛️', name: t('कोर्ट तारीख', 'Court Date'), desc: t('केस ट्रैक करें', 'Track your case'), route: '/court-tracker', isNew: true },
  ];

  const tools = [
    { icon: '🏠', name: t('किराया समझौता', 'Rent Agreement'), route: '/rent-agreement' },
    { icon: '💰', name: t('वेतन कैलकुलेटर', 'Salary Calc'), route: '/salary-calculator' },
    { icon: '🏛️', name: t('सरकारी योजनाएं', 'Govt Schemes'), route: '/govt-schemes' },
    { icon: '🚦', name: t('e-Challan', 'e-Challan'), route: '/challan-checker' },
    { icon: '📢', name: t('RTI आवेदन', 'RTI Application'), route: '/rti-writer' },
    { icon: '🏡', name: t('Property Guide', 'Property Guide'), route: '/property-guide' },
  ];

  const schemes = [
    { icon: '🌾', color: 'rgba(34,197,94,0.15)', name: 'PM Kisan Samman Nidhi', target: t('छोटे किसान', 'Small Farmers'), benefit: t('₹6000/साल सीधे खाते में', '₹6000/year direct transfer') },
    { icon: '🏥', color: 'rgba(239,68,68,0.15)', name: 'Ayushman Bharat', target: t('गरीब परिवार', 'Poor Families'), benefit: t('₹5 लाख मुफ्त इलाज/साल', '₹5 lakh free treatment/year') },
    { icon: '🔥', color: 'rgba(251,146,60,0.15)', name: 'PM Ujjwala Yojana', target: t('BPL महिलाएं', 'BPL Women'), benefit: t('मुफ्त LPG कनेक्शन', 'Free LPG Connection') },
    { icon: '👧', color: 'rgba(139,92,246,0.15)', name: 'Sukanya Samriddhi', target: t('10 साल से कम बेटी', 'Girl below 10 yrs'), benefit: t('8.2% ब्याज दर', '8.2% interest rate') },
  ];

  const helplines = [
    { num: '112', label: t('पुलिस', 'Police') },
    { num: '181', label: t('महिला हेल्पलाइन', 'Women Helpline') },
    { num: '108', label: t('एम्बुलेंस', 'Ambulance') },
    { num: '1930', label: t('साइबर क्राइम', 'Cyber Crime') },
    { num: '15100', label: t('कानूनी सहायता', 'Legal Aid') },
    { num: '1098', label: t('बाल सहायता', 'Child Help') },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* TOP BAR */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 18, paddingVertical: 12,
        backgroundColor: bg, borderBottomWidth: 1, borderBottomColor: borderColor,
      }}>
        <TouchableOpacity onPress={() => setDrawerVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Text style={{ fontSize: 20 }}>⚖️</Text>
          <Text style={{ fontWeight: '800', fontSize: 22, color: textColor }}>
            Nyay<Text style={{ color: orange }}>Mitra</Text>
          </Text>
        </TouchableOpacity>
        <HeaderToggle />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* HERO BANNER */}
        <View style={{
          margin: 14, borderRadius: 18, padding: 22, overflow: 'hidden',
          backgroundColor: orange,
        }}>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'flex-start',
            paddingHorizontal: 10, paddingVertical: 3, borderRadius: 50, marginBottom: 10,
          }}>
            <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>🇮🇳 {t('भारत का AI Legal Assistant', "India's AI Legal Assistant")}</Text>
          </View>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', lineHeight: 28, marginBottom: 6 }}>
            {t('आपका AI वकील\n₹49 में — Hindi में', 'Your AI Lawyer\nStarting ₹49')}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 16, lineHeight: 20 }}>
            {t('अपने अधिकार जानें, दस्तावेज़ बनाएं — सरल भाषा में।', 'Know your rights, make documents — in simple language.')}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/chat')}
            style={{ backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, alignSelf: 'flex-start' }}
          >
            <Text style={{ color: orange, fontWeight: '700', fontSize: 14 }}>📲 {t('AI वकील से पूछें', 'Ask AI Lawyer')}</Text>
          </TouchableOpacity>
          <Text style={{ position: 'absolute', right: 14, bottom: -8, fontSize: 72, opacity: 0.18 }}>⚖️</Text>
        </View>

        {/* STATS ROW */}
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 14, marginBottom: 6 }}>
          {[
            { val: '40+', lbl: t('Legal Rights', 'Legal Rights') },
            { val: '10+', lbl: t('Tools', 'Tools') },
            { val: '₹49', lbl: t('से Premium', 'Premium') },
            { val: '24/7', lbl: t('AI Help', 'AI Help') },
          ].map((s, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: cardBg, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: borderColor }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: orange }}>{s.val}</Text>
              <Text style={{ fontSize: 10, color: subText, marginTop: 2, textAlign: 'center' }}>{s.lbl}</Text>
            </View>
          ))}
        </View>

        {/* MAIN SERVICES */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: textColor }}>{t('मुख्य सेवाएं', 'Main Services')}</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 14 }}>
          {mainServices.map((s, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => router.push(s.route as any)}
              style={{
                width: (width - 38) / 2,
                backgroundColor: cardBg, borderRadius: 16, padding: 18,
                borderWidth: 1, borderColor: isDark ? 'rgba(232,97,10,0.3)' : borderColor,
                position: 'relative', overflow: 'hidden',
              }}
            >
              {s.isNew && (
                <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: orange, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 50 }}>
                  <Text style={{ color: 'white', fontSize: 9, fontWeight: '800' }}>NEW</Text>
                </View>
              )}
              <Text style={{ fontSize: 30, marginBottom: 10 }}>{s.icon}</Text>
              <Text style={{ fontSize: 15, fontWeight: '700', color: textColor, marginBottom: 3 }}>{s.name}</Text>
              <Text style={{ fontSize: 11.5, color: subText, lineHeight: 16 }}>{s.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* USEFUL TOOLS */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: textColor }}>{t('उपयोगी टूल्स', 'Useful Tools')}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, gap: 10 }}>
          {tools.map((tool, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => router.push(tool.route as any)}
              style={{ backgroundColor: cardBg, borderRadius: 14, padding: 14, alignItems: 'center', width: 90, borderWidth: 1, borderColor: borderColor }}
            >
              <Text style={{ fontSize: 26, marginBottom: 7 }}>{tool.icon}</Text>
              <Text style={{ fontSize: 11, color: subText, fontWeight: '600', textAlign: 'center', lineHeight: 15 }}>{tool.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* GOVT SCHEMES */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: textColor }}>{t('सरकारी योजनाएं', 'Govt Schemes')}</Text>
          <TouchableOpacity onPress={() => router.push('/govt-schemes')}><Text style={{ fontSize: 12, color: orange, fontWeight: '600' }}>{t('सभी देखें →', 'See all →')}</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, gap: 10 }}>
          {schemes.map((s, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => router.push('/govt-schemes')}
              style={{ width: 200, backgroundColor: cardBg, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: borderColor }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: s.color, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 20 }}>{s.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: textColor }}>{s.name}</Text>
                  <Text style={{ fontSize: 11, color: subText }}>{s.target}</Text>
                </View>
              </View>
              <View style={{ backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: 8, padding: 8 }}>
                <Text style={{ fontSize: 12, color: '#22C55E', fontWeight: '600' }}>{s.benefit}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* PREMIUM BANNER */}
        <View style={{
          margin: 14, borderRadius: 16, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: isDark ? '#1E2850' : '#EEF0FF', borderWidth: 1, borderColor: isDark ? 'rgba(232,97,10,0.3)' : 'rgba(232,97,10,0.2)',
        }}>
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: orange, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 50, marginBottom: 6 }}>
              <Text style={{ color: 'white', fontSize: 10, fontWeight: '800' }}>⭐ PREMIUM</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: textColor, marginBottom: 4 }}>{t('Silver Plan लें', 'Get Silver Plan')}</Text>
            <Text style={{ fontSize: 12, color: subText, lineHeight: 17 }}>{t('Unlimited documents,\n40+ rights, AI scanner', 'Unlimited documents,\n40+ rights, AI scanner')}</Text>
          </View>
          <View style={{ alignItems: 'center', marginLeft: 16 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: orange }}>₹49</Text>
            <Text style={{ fontSize: 11, color: subText }}>{t('/महीना', '/month')}</Text>
            <TouchableOpacity
              onPress={() => router.push('/premium')}
              style={{ backgroundColor: orange, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, marginTop: 8 }}
            >
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>{t('अभी लें', 'Get Now')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* HELPLINES */}
        <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: textColor }}>🚨 {t('आपातकालीन हेल्पलाइन', 'Emergency Helplines')}</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 8 }}>
          {helplines.map((h, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => Linking.openURL(`tel:${h.num}`)}
              style={{
                width: (width - 48) / 3, backgroundColor: cardBg, borderRadius: 12,
                padding: 12, alignItems: 'center', borderWidth: 1, borderColor: borderColor,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#EF4444' }}>{h.num}</Text>
              <Text style={{ fontSize: 10, color: subText, marginTop: 3, textAlign: 'center' }}>{h.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DISCLAIMER */}
        <View style={{
          margin: 14, borderRadius: 12, padding: 14, flexDirection: 'row', gap: 10,
          backgroundColor: isDark ? 'rgba(232,97,10,0.08)' : '#FFF8F0',
          borderWidth: 1, borderColor: isDark ? 'rgba(232,97,10,0.2)' : 'rgba(232,97,10,0.15)',
        }}>
          <Text style={{ fontSize: 18 }}>⚠️</Text>
          <Text style={{ flex: 1, fontSize: 12, color: subText, lineHeight: 18 }}>
            {t(
              'AI की जानकारी शैक्षिक उद्देश्य के लिए है। गंभीर मामलों में एक योग्य वकील से परामर्श अवश्य लें।',
              'AI information is for educational purposes only. For serious matters, always consult a qualified lawyer.'
            )}
          </Text>
        </View>



        {/* FOOTER */}
        <View style={{ paddingVertical: 14, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: borderColor }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <TouchableOpacity onPress={() => router.push('/settings?section=privacy')} style={{ alignItems: 'center', minWidth: 80 }}>
              <Text style={{ fontSize: 20 }}>🔒</Text>
              <Text style={{ color: subText, fontSize: 10, marginTop: 2, textAlign: 'center' }}>{t('प्राइवेसी पॉलिसी', 'Privacy Policy')}</Text>
            </TouchableOpacity>
            <Text style={{ color: subText, fontSize: 11, textAlign: 'center' }}>{'© 2026\nNyayMitra'}</Text>
            <TouchableOpacity onPress={() => router.push('/settings?section=terms')} style={{ alignItems: 'center', minWidth: 80 }}>
              <Text style={{ fontSize: 20 }}>📄</Text>
              <Text style={{ color: subText, fontSize: 10, marginTop: 2, textAlign: 'center' }}>{t('नियम व शर्तें', 'Terms & Conditions')}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.me/918573821917')}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#25D366', borderRadius: 10, paddingVertical: 10, gap: 8 }}
          >
            <Text style={{ fontSize: 18 }}>💬</Text>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>{t('WhatsApp सपोर्ट', 'WhatsApp Support')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      <AdBanner />
      <SideDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </SafeAreaView>
  );
}
