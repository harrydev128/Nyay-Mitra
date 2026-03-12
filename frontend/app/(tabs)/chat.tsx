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
  ActivityIndicator,
  Keyboard,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { chatAPI } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language, isPremium } = useAppContext();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: language === 'hindi'
        ? 'नमस्ते! मैं NyayMitra हूं - आपका AI कानूनी सहायक। 🙏\n\nमुझसे कोई भी कानूनी सवाल पूछें जैसे:\n• नौकरी से निकाला गया\n• पुलिस ने गिरफ्तार किया\n• किरायेदार परेशानी\n• उपभोक्ता शिकायत\n\nआप बोलकर या लिखकर सवाल पूछ सकते हैं।'
        : 'Hello! I am NyayMitra - your AI Legal Assistant. 🙏\n\nAsk me any legal question like:\n• Fired from job\n• Arrested by police\n• Tenant troubles\n• Consumer complaints\n\nYou can ask questions by voice or text.',
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);

    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    // Premium limit check
    const userMessageCount = messages.filter(m => m.role === 'user').length;
    if (!isPremium && userMessageCount >= 3) {
      Alert.alert(
        language === 'hindi' ? 'प्रीमियम आवश्यक' : 'Premium Required',
        language === 'hindi'
          ? 'मुफ्त उपयोगकर्ताओं के लिए मैसेज सीमा समाप्त हो गई है। कृपया असीमित पहुँच के लिए प्रीमियम में अपग्रेड करें।'
          : 'Message limit reached for free users. Please upgrade to Premium for unlimited access.',
        [
          { text: language === 'hindi' ? 'अभी अपग्रेड करें' : 'Upgrade Now', onPress: () => router.push('/profile') },
          { text: language === 'hindi' ? 'ठीक है' : 'OK' }
        ]
      );
      return;
    }

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      const response = await chatAPI.sendMessage('local', userMessage.content, language);

      const assistantMessage: Message = {
        id: response.message_id || `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.log('Chat error:', error);
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: language === 'hindi'
          ? 'माफ करें, कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।'
          : 'Sorry, something went wrong. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          language === 'hindi' ? 'अनुमति आवश्यक' : 'Permission Required',
          language === 'hindi'
            ? 'वॉइस इनपुट के लिए माइक्रोफोन की अनुमति दें'
            : 'Please allow microphone access for voice input'
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.log('Recording error:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    // Note: For actual speech-to-text, you would send the audio to a transcription service
    // For MVP, we'll show a placeholder message
    Alert.alert(
      language === 'hindi' ? 'वॉइस इनपुट' : 'Voice Input',
      language === 'hindi'
        ? 'वॉइस-टू-टेक्स्ट जल्द आ रहा है। अभी के लिए टाइप करें।'
        : 'Voice-to-text coming soon. Please type for now.',
      [{ text: 'OK' }]
    );

    setRecording(null);
  };

  const speakMessage = (text: string) => {
    Speech.speak(text, {
      language: language === 'hindi' ? 'hi-IN' : 'en-IN',
      rate: 0.9,
    });
  };

  const clearChat = async () => {
    Alert.alert(
      language === 'hindi' ? 'चैट साफ करें?' : 'Clear Chat?',
      language === 'hindi'
        ? 'क्या आप सभी संदेश हटाना चाहते हैं?'
        : 'Do you want to delete all messages?',
      [
        { text: language === 'hindi' ? 'नहीं' : 'No', style: 'cancel' },
        {
          text: language === 'hindi' ? 'हां' : 'Yes',
          style: 'destructive',
          onPress: () => {
            setMessages([]);
          },
        },
      ]
    );
  };

  const renderMessage = useCallback(({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.assistantMessage]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.white} />
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
            {item.content}
          </Text>
          {!isUser && (
            <TouchableOpacity
              style={styles.speakButton}
              onPress={() => speakMessage(item.content)}
            >
              <Ionicons name="volume-medium-outline" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="chatbubbles" size={24} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>
              {language === 'hindi' ? 'AI वकील' : 'AI Lawyer'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {language === 'hindi' ? '24/7 उपलब्ध' : 'Available 24/7'}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
            <Ionicons name="trash-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color={Colors.saffron} />
            <Text style={styles.loadingText}>
              {language === 'hindi' ? 'सोच रहा हूं...' : 'Thinking...'}
            </Text>
          </View>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[styles.voiceButton, isRecording && styles.voiceButtonActive]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons
              name={isRecording ? 'stop' : 'mic'}
              size={24}
              color={isRecording ? Colors.white : Colors.saffron}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder={language === 'hindi' ? 'अपना सवाल लिखें...' : 'Type your question...'}
            placeholderTextColor={Colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons name="send" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.saffron,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.green,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langButton: {
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  langButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  clearButton: {
    padding: 8,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.saffron,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: Colors.saffron,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: Colors.white,
  },
  assistantText: {
    color: Colors.textPrimary,
  },
  speakButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    padding: 4,
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.saffron,
  },
  voiceButtonActive: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: Colors.textPrimary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.saffron,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textLight,
  },
});
