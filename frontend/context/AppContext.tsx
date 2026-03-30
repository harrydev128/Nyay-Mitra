import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Platform } from 'react-native';

// Cross-platform storage
const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') return localStorage.setItem(key, value);
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') return localStorage.removeItem(key);
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage.removeItem(key);
  },
};

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
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [hasFullAccess, setHasFullAccess] = useState(false);

  const toggleNotificationPanel = () => setNotificationPanel(!notificationPanel);

  const refreshTrialStatus = async (userId: string) => {
    try {
      const { checkTrialStatus } = require('../utils/trial');
      const status = await checkTrialStatus(userId);
      setTrialDaysLeft(status.daysLeft);
      setHasFullAccess(status.hasAccess);
      if (status.isPremium) setIsPremium(true);
    } catch {}
  };

  React.useEffect(() => {
    Promise.all([loadUserData(), loadTheme(), loadLanguage()]).finally(() => setIsLoading(false));

    // Supabase auth state listener
    const { supabase } = require('../services/supabase');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoggedIn(false);
        setUserEmail('');
        setIsPremium(false);
        await storage.removeItem('nyaymitra_user');
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  const loadLanguage = async () => {
    try {
      const saved = await storage.getItem('app_language');
      if (saved === 'hi' || saved === 'en') setLanguage(saved);
    } catch {}
  };

  const changeLanguage = async (lang: Language) => {
    setLanguage(lang);
    try { await storage.setItem('app_language', lang); } catch {}
  };

  const loadTheme = async () => {
    try {
      const storedTheme = await storage.getItem('app_theme');
      if (storedTheme === 'dark' || storedTheme === 'light') setTheme(storedTheme);
    } catch {}
  };

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      await storage.setItem('app_theme', newTheme);
    } catch {}
  };

  const loadUserData = async () => {
    try {
      const userData = await storage.getItem('nyaymitra_user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
        setUserEmail(parsedUser.email);
        setIsPremium(parsedUser.plan !== 'free');
        if (parsedUser.id) refreshTrialStatus(parsedUser.id);
      }
    } catch {}
  };

  const logout = async () => {
    try {
      const { supabase } = require('../services/supabase');
      await supabase.auth.signOut();
    } catch {}
    await storage.removeItem('nyaymitra_user');
    setUser(null);
    setIsLoggedIn(false);
    setUserEmail('');
    setIsPremium(false);
  };

  return (
    <AppContext.Provider
      value={{
        language, setLanguage: changeLanguage, changeLanguage,
        theme, toggleTheme, isPremium, setIsPremium,
        isLoggedIn, setIsLoggedIn, userEmail, setUserEmail,
        user, setUser, notificationPanel, setNotificationPanel,
        toggleNotificationPanel, logout, isLoading,
        trialDaysLeft, hasFullAccess, refreshTrialStatus,
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
