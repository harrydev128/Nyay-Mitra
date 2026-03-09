import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'hindi' | 'english';

export const useLanguage = () => {
  const [language, setLanguageState] = useState<Language>('hindi');
  
  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('nyaymitra_language', lang);
  }, []);
  
  const loadLanguage = useCallback(async () => {
    const saved = await AsyncStorage.getItem('nyaymitra_language');
    if (saved === 'hindi' || saved === 'english') {
      setLanguageState(saved);
    }
  }, []);
  
  const getText = useCallback((hindi: string, english: string) => {
    return language === 'hindi' ? hindi : english;
  }, [language]);
  
  return { language, setLanguage, loadLanguage, getText };
};

export default useLanguage;
