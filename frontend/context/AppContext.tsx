import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'hi';
type Plan = 'free' | 'silver' | 'gold' | 'pro';
type Theme = 'light' | 'dark';

interface User {
  name: string;
  email: string;
  plan: Plan;
  points: number;
  referralCode: string;
  referredBy: string | null;
  premiumExpiry: string | null;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  changeLanguage: (lang: any) => void;
  theme: Theme;
  toggleTheme: () => void;
  isPremium: boolean;
  setIsPremium: (isPremium: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  notificationPanel: boolean;
  setNotificationPanel: (visible: boolean) => void;
  toggleNotificationPanel: () => void;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('hi');
  const [theme, setTheme] = useState<Theme>('light');
  const [isPremium, setIsPremium] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [notificationPanel, setNotificationPanel] = useState(false);

  const toggleNotificationPanel = () => setNotificationPanel(!notificationPanel);

  // Load user data on startup
  React.useEffect(() => {
    loadUserData();
    loadTheme();
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem('app_language');
      if (saved === 'hi' || saved === 'en') setLanguage(saved);
    } catch (error) {
      
    }
  };

  const changeLanguage = async (lang: Language) => {
    setLanguage(lang);
    try {
      await AsyncStorage.setItem('app_language', lang);
    } catch (error) {
      
    }
  };

  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('app_theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setTheme(storedTheme);
      }
    } catch (error) {
      
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      await AsyncStorage.setItem('app_theme', newTheme);
    } catch (error) {
      
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('nyaymitra_user');

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
        setUserEmail(parsedUser.email);
        setIsPremium(parsedUser.plan !== 'free');
      }
    } catch (error) {
      
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('nyaymitra_user');
      setUser(null);
      setIsLoggedIn(false);
      setUserEmail('');
      setIsPremium(false);
    } catch (error) {
      
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        changeLanguage,
        theme,
        toggleTheme,
        isPremium,
        setIsPremium,
        isLoggedIn,
        setIsLoggedIn,
        userEmail,
        setUserEmail,
        user,
        setUser,
        notificationPanel,
        setNotificationPanel,
        toggleNotificationPanel,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
