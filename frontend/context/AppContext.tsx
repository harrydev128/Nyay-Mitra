import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'hindi' | 'english';

interface AppContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    isPremium: boolean;
    setIsPremium: (isPremium: boolean) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    userEmail: string;
    setUserEmail: (email: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('hindi');
    const [isPremium, setIsPremium] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    return (
        <AppContext.Provider
            value={{
                language,
                setLanguage,
                isPremium,
                setIsPremium,
                isLoggedIn,
                setIsLoggedIn,
                userEmail,
                setUserEmail,
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
