import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { LightColors, DarkColors } from '../../constants/colors';
import { chatAPI, sanitizeInput } from '../../services/api';
import { useAppContext } from '../../context/AppContext';
import { t } from '../../constants/translations';
import LegalDisclaimer from '../../components/LegalDisclaimer';
import LanguageToggle from '../../components/LanguageToggle';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const MessageBubble = React.memo(({ item, isUser, Colors, theme, onSpeak }: any) => {
  const isSystemError = item.id.startsWith('error_');
  return (
    <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.assistantMessage]}>
      {!isUser && <View style={[styles.avatarContainer, { backgroundColor: Colors.saffron }]}><Ionicons name="shield-checkmark" size={20} color="#fff" /></View>}
      <View style={styles.messageWrapper}>
        <View style={[styles.messageBubble, isUser ? { backgroundColor: Colors.saffron, borderBottomRightRadius: 4 } : { backgroundColor: theme === 'dark' ? '#1E293B' : Colors.white, borderBottomLeftRadius: 4, elevation: 2, ...Platform.select({ web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }, default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 } }) }]}>
          <Text style={[styles.messageText, { color: isUser ? '#fff' : Colors.textPrimary }]}>{item.content}</Text>
          {!isUser && !isSystemError && item.id !== 'welcome' && (
            <TouchableOpacity style={styles.speakButton} onPress={() => onSpeak(item.content)}><Ionicons name="volume-medium-outline" size={16} color={Colors.textSecondary} /></TouchableOpacity>
          )}
        </View>
        {!isUser && !isSystemError && item.id !== 'welcome' && <LegalDisclaimer position="after" />}
      </View>
    </View>
  );
});
MessageBubble.displayName = 'MessageBubble';

export default function ChatScreen() {
  const { theme, language, changeLanguage } = useAppContext();
  const Colors = theme === 'dark' ? DarkColors : LightColors;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const welcome = {
      id: 'welcome', role: 'assistant', timestamp: new Date().toISOString(),
      content: t('welcome_message', language)
    };
    setMessages([welcome as Message]);
  }, [language, t]);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    if (timeSinceLastRequest < 2000) return;
    setIsLoading(true);
    setLastRequestTime(Date.now());
    Keyboard.dismiss();
    try {
      const res = await chatAPI.sendMessage('local', inputText, language);
      const assistantMsg: Message = { id: res.message_id || `a_${Date.now()}`, role: 'assistant', content: res.response, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, assistantMsg]);
      const stats = await AsyncStorage.getItem('stats_ai_count');
      await AsyncStorage.setItem('stats_ai_count', (parseInt(stats || '0') + 1).toString());
    } catch (e) {
      if (__DEV__) console.error('Chat error:', e);
      setMessages(prev => [...prev, {
        id: `e_${Date.now()}`,
        role: 'assistant',
        content: t('check_internet', language),
        timestamp: new Date().toISOString()
      }]);
    } finally { setIsLoading(false); }
  }, [inputText, isLoading, language, lastRequestTime]);

  const speakMessage = useCallback((text: string) => Speech.speak(text, { language: language === 'hi' ? 'hi-IN' : 'en-IN', rate: 0.9 }), [language]);

  const clearChat = () => Alert.alert(
    t('clear_question', language), 
    t('delete_question', language), [
    { text: t('no', language), style: 'cancel' },
    { text: t('yes', language), style: 'destructive', onPress: () => setMessages([]) }
  ]);



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top']}>
      <KeyboardAvoidingView 
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
      >
        <View style={[styles.header, { backgroundColor: Colors.white, borderBottomColor: Colors.border }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIcon, { backgroundColor: Colors.saffron }]}><Ionicons name="chatbubbles" size={24} color="#fff" /></View>
            <View><Text style={[styles.headerTitle, { color: Colors.textPrimary }]}>{t('chat', language)}</Text><Text style={[styles.headerSubtitle, { color: Colors.green }]}>{t('online', language)}</Text></View>
            <LanguageToggle />
          </View>
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}><Ionicons name="trash-outline" size={20} color={Colors.textSecondary} /></TouchableOpacity>
        </View>
        <FlatList
          ref={flatListRef} data={messages} keyExtractor={m => m.id} contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => <MessageBubble item={item} isUser={item.role === 'user'} Colors={Colors} theme={theme} onSpeak={speakMessage} />}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          style={{flex: 1}}
          inverted={false}
          removeClippedSubviews={Platform.OS === 'android'}
        />
        {isLoading && <View style={styles.loadingContainer}><View style={[styles.loadingBubble, { backgroundColor: theme === 'dark' ? '#1E293B' : '#fff' }]}><Text style={{ color: Colors.textSecondary }}>{t('thinking', language)}</Text></View></View>}
        <View style={[styles.inputContainer, { backgroundColor: theme === 'dark' ? '#0D1B2A' : '#fff', borderTopColor: Colors.border }]}>
          <TextInput style={[styles.input, { backgroundColor: theme === 'dark' ? '#1E293B' : Colors.background, color: Colors.textPrimary }]} placeholder={t('type_message', language)} placeholderTextColor={Colors.textLight} value={inputText} onChangeText={setInputText} multiline />
          <Pressable style={({ pressed }) => [styles.sendButton, { backgroundColor: Colors.saffron }, (!inputText.trim() || isLoading) && styles.disabledBtn, pressed && { opacity: 0.7 }]} onPress={() => sendMessage()} disabled={!inputText.trim() || isLoading}>
            <Ionicons name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerSubtitle: { fontSize: 12 },
  clearButton: { padding: 8 },
  messagesList: { padding: 16 },
  messageContainer: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  userMessage: { justifyContent: 'flex-end' },
  assistantMessage: { justifyContent: 'flex-start' },
  avatarContainer: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  messageBubble: { maxWidth: '85%', padding: 12, borderRadius: 16 },
  messageWrapper: { maxWidth: '80%', alignItems: 'flex-start' },
  disclaimerText: { fontSize: 10, marginTop: 4, marginLeft: 4, fontStyle: 'italic' },
  messageText: { fontSize: 15, lineHeight: 22 },
  speakButton: { alignSelf: 'flex-end', marginTop: 8, padding: 4 },
  loadingContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  loadingBubble: { padding: 12, borderRadius: 16, alignSelf: 'flex-start', elevation: 1 },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, borderTopWidth: 1, gap: 8 },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  disabledBtn: { backgroundColor: '#ccc' },
});
