import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, 
  StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import HeaderToggle from '../components/HeaderToggle';

const EMERGENCY_DATA = [
  {
    id: 'police',
    emoji: '👮',
    title_hi: 'पुलिस ने पकड़ लिया',
    title_en: 'Arrested by Police',
    steps_hi: [
      'शांत रहें — घबराएं नहीं',
      'अपना नाम और पता बताएं, बाकी चुप रहें',
      'कहें: "मुझे वकील चाहिए" — यह आपका अधिकार है',
      '24 घंटे में मजिस्ट्रेट के सामने पेश होने का हक है',
      'परिवार को सूचित करने का अधिकार है',
    ],
    steps_en: [
      'Stay calm — do not panic',
      'Give your name and address only, stay silent otherwise',
      'Say: "I want a lawyer" — this is your right',
      'You have right to appear before magistrate in 24 hours',
      'You have right to inform your family',
    ],
    helpline: '112',
    helpline_label: 'Police Emergency',
    law: 'BNSS 47, 58 | Constitution Article 22',
  },
  {
    id: 'house',
    emoji: '🏠',
    title_hi: 'घर से निकाल दिया',
    title_en: 'Evicted from Home',
    steps_hi: [
      'किराएदार को 15 दिन का लिखित नोटिस जरूरी है',
      'बिना नोटिस निकालना गैरकानूनी है',
      'नजदीकी पुलिस स्टेशन में शिकायत करें',
      'Rent Controller को लिखित आवेदन दें',
      'सामान वापस न दें तो FIR दर्ज करें',
    ],
    steps_en: [
      'Tenant must receive 15 days written notice',
      'Eviction without notice is illegal',
      'File complaint at nearest police station',
      'Submit written application to Rent Controller',
      'File FIR if belongings are not returned',
    ],
    helpline: '15100',
    helpline_label: 'Legal Aid',
    law: 'Transfer of Property Act 1882 | Rent Control Act',
  },
  {
    id: 'fraud',
    emoji: '💸',
    title_hi: 'पैसे की धोखाधड़ी हुई',
    title_en: 'Financial Fraud',
    steps_hi: [
      'तुरंत 1930 पर call करें — Cyber Crime Helpline',
      'अपने Bank को call करके account freeze करवाएं',
      'cybercrime.gov.in पर online complaint दर्ज करें',
      'नजदीकी पुलिस स्टेशन में FIR दर्ज करें',
      'Transaction का screenshot और record सुरक्षित रखें',
    ],
    steps_en: [
      'Immediately call 1930 — Cyber Crime Helpline',
      'Call your bank and request account freeze',
      'File online complaint at cybercrime.gov.in',
      'File FIR at nearest police station',
      'Save screenshots and transaction records',
    ],
    helpline: '1930',
    helpline_label: 'Cyber Crime',
    law: 'IT Act 2000 Section 66C, 66D | BNS 318',
  },
  {
    id: 'assault',
    emoji: '👊',
    title_hi: 'मार-पीट हुई',
    title_en: 'Physical Assault',
    steps_hi: [
      'तुरंत 112 पर call करें',
      'सरकारी अस्पताल से Medico-Legal Certificate (MLC) बनवाएं',
      'पुलिस में FIR दर्ज करवाएं — मना नहीं कर सकते',
      'गवाहों के नाम और नंबर लें',
      'चोटों की फोटो खींचें — सबूत रखें',
    ],
    steps_en: [
      'Immediately call 112',
      'Get Medico-Legal Certificate (MLC) from govt hospital',
      'File FIR at police station — they cannot refuse',
      'Collect names and numbers of witnesses',
      'Photograph injuries as evidence',
    ],
    helpline: '112',
    helpline_label: 'Emergency',
    law: 'BNS 115, 118 | CrPC / BNSS 154',
  },
  {
    id: 'job',
    emoji: '💼',
    title_hi: 'नौकरी से निकाल दिया',
    title_en: 'Wrongful Termination',
    steps_hi: [
      'Termination letter मांगें — देने से मना नहीं कर सकते',
      'अंतिम वेतन और PF के लिए HR को लिखित दें',
      'Labour Commissioner के office में शिकायत दर्ज करें',
      'shramsuvidha.gov.in पर online complaint करें',
      'Gratuity (5+ साल पर) claim करें',
    ],
    steps_en: [
      'Demand termination letter — they cannot refuse',
      'Give written request to HR for final salary and PF',
      'File complaint at Labour Commissioner office',
      'File online complaint at shramsuvidha.gov.in',
      'Claim gratuity if worked 5+ years',
    ],
    helpline: '1800-11-2228',
    helpline_label: 'Labour Helpline',
    law: 'Industrial Disputes Act 1947 | Payment of Wages Act',
  },
  {
    id: 'women',
    emoji: '👩',
    title_hi: 'महिला उत्पीड़न',
    title_en: 'Women Harassment',
    steps_hi: [
      'तुरंत 181 पर call करें — Women Helpline',
      'NCW (राष्ट्रीय महिला आयोग): 7827170170',
      'नजदीकी पुलिस स्टेशन में FIR दर्ज करें',
      'Mahila Thana में जाना बेहतर होगा',
      'Medical report जरूर बनवाएं',
    ],
    steps_en: [
      'Immediately call 181 — Women Helpline',
      'NCW (National Women Commission): 7827170170',
      'File FIR at nearest police station',
      'Going to Mahila Thana is recommended',
      'Get medical report done',
    ],
    helpline: '181',
    helpline_label: 'Women Helpline',
    law: 'BNS 74, 75, 85 | PWDVA 2005',
  },
];

export default function EmergencyScreen() {
  const router = useRouter();
  const { theme, language } = useAppContext();
  const isDark = theme === 'dark';
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getText = (hi: string, en: string) => 
    language === 'hi' ? hi : en;

  const bgColor = isDark ? '#0D1B2A' : '#F5F5F5';
  const cardBg = isDark ? '#1B2B3B' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a237e';
  const subTextColor = isDark ? '#AABBCC' : '#555555';
  const stepBg = isDark ? '#243447' : '#F8F9FA';

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#CC0000',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <TouchableOpacity onPress={() => router.back()} 
          style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff', fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ 
            color: '#FFFFFF', 
            fontSize: 20, 
            fontWeight: 'bold' 
          }}>
            {getText('🆘 आपातकालीन मदद', '🆘 Emergency Help')}
          </Text>
        </View>
        <HeaderToggle />
      </View>

      <ScrollView style={{ flex: 1 }} 
        contentContainerStyle={{ padding: 16 }}>
        
        <Text style={{ 
          color: subTextColor, 
          fontSize: 14, 
          marginBottom: 16,
          textAlign: 'center'
        }}>
          {getText(
            'अपनी स्थिति चुनें — तुरंत कदम जानें',
            'Select your situation — get immediate steps'
          )}
        </Text>

        {EMERGENCY_DATA.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{
              backgroundColor: cardBg,
              borderRadius: 12,
              marginBottom: 12,
              overflow: 'hidden',
              borderWidth: expandedId === item.id ? 2 : 1,
              borderColor: expandedId === item.id ? '#CC0000' : 
                (isDark ? '#2A3F55' : '#E0E0E0'),
            }}
            onPress={() => setExpandedId(
              expandedId === item.id ? null : item.id
            )}
            activeOpacity={0.8}
          >
            {/* Card Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
            }}>
              <Text style={{ fontSize: 32, marginRight: 12 }}>
                {item.emoji}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: textColor,
                }}>
                  {getText(item.title_hi, item.title_en)}
                </Text>
              </View>
              <Text style={{ 
                color: '#CC0000', 
                fontSize: 20,
                fontWeight: 'bold'
              }}>
                {expandedId === item.id ? '▲' : '▼'}
              </Text>
            </View>

            {/* Expanded Steps */}
            {expandedId === item.id && (
              <View style={{ 
                paddingHorizontal: 16, 
                paddingBottom: 16 
              }}>
                
                {/* Steps */}
                {(language === 'hi' ? item.steps_hi : item.steps_en)
                  .map((step, index) => (
                  <View key={index} style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    backgroundColor: stepBg,
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 8,
                  }}>
                    <View style={{
                      backgroundColor: '#CC0000',
                      borderRadius: 12,
                      width: 24,
                      height: 24,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                      marginTop: 1,
                      flexShrink: 0,
                    }}>
                      <Text style={{ 
                        color: '#fff', 
                        fontSize: 12, 
                        fontWeight: 'bold' 
                      }}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text style={{ 
                      color: subTextColor, 
                      fontSize: 14,
                      lineHeight: 20,
                      flex: 1,
                    }}>
                      {step}
                    </Text>
                  </View>
                ))}

                {/* Law reference */}
                <Text style={{
                  color: isDark ? '#6699AA' : '#888888',
                  fontSize: 11,
                  marginTop: 4,
                  marginBottom: 12,
                  fontStyle: 'italic',
                }}>
                  📜 {item.law}
                </Text>

                {/* Helpline Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#CC0000',
                    borderRadius: 10,
                    padding: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}
                  onPress={() => 
                    Linking.openURL('tel:' + item.helpline)
                  }
                >
                  <Text style={{ 
                    fontSize: 18, 
                    marginRight: 8 
                  }}>📞</Text>
                  <Text style={{ 
                    color: '#FFFFFF', 
                    fontSize: 16, 
                    fontWeight: 'bold' 
                  }}>
                    {item.helpline} — {item.helpline_label}
                  </Text>
                </TouchableOpacity>

                {/* AI Vakeel Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FF6B00',
                    borderRadius: 10,
                    padding: 14,
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    router.push('/(tabs)/chat');
                  }}
                >
                  <Text style={{ 
                    color: '#FFFFFF', 
                    fontSize: 14, 
                    fontWeight: 'bold' 
                  }}>
                    {getText(
                      '⚖️ AI वकील से विस्तार में पूछें',
                      '⚖️ Ask AI Lawyer for details'
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
