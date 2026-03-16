import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import HeaderToggle from '../components/HeaderToggle';

const STATE_PORTALS = [
  { state: 'Uttar Pradesh', url: 'https://echallan.parivahan.gov.in/index/accused-challan', icon: '🏛️' },
  { state: 'Delhi', url: 'https://echallan.parivahan.gov.in/index/accused-challan', icon: '🏙️' },
  { state: 'Maharashtra', url: 'https://echallan.parivahan.gov.in/index/accused-challan', icon: '🌊' },
  { state: 'सभी राज्य (National)', url: 'https://echallan.parivahan.gov.in/index/accused-challan', icon: '🇮🇳' },
];

const COMMON_FINES = [
  { violation: 'बिना helmet के', fine: '₹1,000', law: 'MV Act Section 129' },
  { violation: 'बिना seat belt के', fine: '₹1,000', law: 'MV Act Section 138' },
  { violation: 'Red light jump', fine: '₹5,000', law: 'MV Act Section 119' },
  { violation: 'Mobile चलाते हुए', fine: '₹5,000', law: 'MV Act Section 184' },
  { violation: 'Over speeding', fine: '₹2,000-4,000', law: 'MV Act Section 112' },
  { violation: 'Drunk driving', fine: '₹10,000', law: 'MV Act Section 185' },
  { violation: 'बिना insurance के', fine: '₹2,000', law: 'MV Act Section 146' },
  { violation: 'बिना RC/DL के', fine: '₹5,000', law: 'MV Act Section 3,39' },
];

export default function ChallanCheckerScreen() {
  const router = useRouter();
  const { theme, language } = useAppContext();
  const isDark = theme === 'dark';
  const bg = isDark ? '#0D1B2A' : '#F5F5F5';
  const cardBg = isDark ? '#1B2B3B' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1a237e';
  const subText = isDark ? '#AABBCC' : '#666666';
  const [vehicleNo, setVehicleNo] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [webUrl, setWebUrl] = useState('');
  const [webTitle, setWebTitle] = useState('');

  const WebViewModal = () => (
    <Modal
      visible={showWebView}
      animationType="slide"
      onRequestClose={() => setShowWebView(false)}
    >
      <View style={{ flex: 1, backgroundColor: '#1a237e' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center',
          paddingTop: 50, paddingBottom: 12, paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={() => setShowWebView(false)}
            style={{ marginRight: 12 }}>
            <Text style={{ color: '#fff', fontSize: 22 }}>{'X'}</Text>
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 }}>
            {webTitle}
          </Text>
        </View>
        <WebView
          source={{ uri: webUrl }}
          style={{ flex: 1 }}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={{ flex: 1, justifyContent: 'center',
              alignItems: 'center', backgroundColor: '#fff' }}>
              <ActivityIndicator size="large" color="#FF6B00" />
              <Text style={{ marginTop: 12, color: '#666' }}>
                Loading...
              </Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ backgroundColor: '#1a237e', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>🚦 e-Challan चेकर</Text>
          <Text style={{ color: '#AABBCC', fontSize: 11 }}>Traffic Fine Check & Contest</Text>
        </View>
        <HeaderToggle />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ backgroundColor: cardBg, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 15, marginBottom: 12 }}>
            अपना e-Challan चेक करें
          </Text>
          <Text style={{ color: subText, fontSize: 12, marginBottom: 4 }}>वाहन नंबर डालें</Text>
          <TextInput
            style={{ backgroundColor: isDark ? '#243447' : '#F5F5F5', color: textColor, borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 0.5, borderColor: isDark ? '#2A3F55' : '#E0E0E0', letterSpacing: 2, fontSize: 16, fontWeight: 'bold' }}
            placeholder="UP32AB1234"
            placeholderTextColor={subText}
            value={vehicleNo}
            onChangeText={t => setVehicleNo(t.toUpperCase())}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={{ backgroundColor: '#FF6B00', borderRadius: 12, padding: 16, alignItems: 'center' }}
            onPress={() => {
              if (!vehicleNo.trim()) {
                Alert.alert('', 'वाहन नंबर डालें');
                return;
              }
              setWebUrl('https://echallan.parivahan.gov.in/index/accused-challan');
              setWebTitle('e-Challan Check — ' + vehicleNo);
              setShowWebView(true);
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>🔍 Challan देखें</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>Government Portal पर खुलेगा</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: '#1a237e', borderRadius: 12,
              padding: 14, alignItems: 'center', marginTop: 8 }}
            onPress={() => {
              if (!vehicleNo.trim()) {
                Alert.alert('', 'वाहन नंबर डालें');
                return;
              }
              setWebUrl('https://www.mymotor.in/rc-details?regnNumber=' + vehicleNo);
              setWebTitle('RC Details — ' + vehicleNo);
              setShowWebView(true);
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
              🚗 RC Details भी देखें
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 }}>
              Owner, Insurance, Fitness — App के अंदर
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: cardBg, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 14, marginBottom: 12 }}>
            State Portal से चेक करें
          </Text>
          {STATE_PORTALS.map((p, i) => (
            <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: i < STATE_PORTALS.length - 1 ? 0.5 : 0, borderBottomColor: isDark ? '#2A3F55' : '#F0F0F0' }} onPress={() => {
              setWebUrl(p.url);
              setWebTitle(p.state + ' — Challan Check');
              setShowWebView(true);
            }}>
              <Text style={{ fontSize: 20, marginRight: 12 }}>{p.icon}</Text>
              <Text style={{ color: '#FF6B00', fontSize: 13, flex: 1 }}>{p.state}</Text>
              <Text style={{ color: subText }}>{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ backgroundColor: isDark ? '#2A1A00' : '#FFF8E1', borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#FF8F00' }}>
          <Text style={{ color: isDark ? '#FFCC44' : '#E65100', fontWeight: 'bold', fontSize: 13, marginBottom: 8 }}>
            ⚖️ Challan गलत है? Contest करें!
          </Text>
          {[
            'Challan मिलने के 60 दिन के अंदर contest करें',
            'Magistrate Court में application दें',
            'गवाह और सबूत तैयार रखें (photo/video)',
            'Legal Aid से मुफ्त वकील मिलेगा',
          ].map((tip, i) => (
            <Text key={i} style={{ color: isDark ? '#FFDD88' : '#795548', fontSize: 12, marginBottom: 4 }}>• {tip}</Text>
          ))}
        </View>

        <View style={{ backgroundColor: cardBg, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 14, marginBottom: 12 }}>
            सामान्य ट्रैफिक जुर्माने
          </Text>
          {COMMON_FINES.map((f, i) => (
            <View key={i} style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: i < COMMON_FINES.length - 1 ? 0.5 : 0, borderBottomColor: isDark ? '#2A3F55' : '#F0F0F0' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: textColor, fontSize: 13, fontWeight: 'bold' }}>{f.violation}</Text>
                <Text style={{ color: subText, fontSize: 11 }}>{f.law}</Text>
              </View>
              <Text style={{ color: '#CC0000', fontWeight: 'bold', fontSize: 14 }}>{f.fine}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      <WebViewModal />
    </View>
  );
}

