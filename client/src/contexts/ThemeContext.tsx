


'use client';
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '@/styles/theme';

type ThemeMode = 'light' | 'dark';
interface ThemeContextType { mode: ThemeMode; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<ThemeMode>('dark');
    useEffect(() => {
        try {
            const localTheme = localStorage.getItem('theme_mode') as ThemeMode;
            if (localTheme) setMode(localTheme);
        } catch (error) {}
    }, []);
    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        try { localStorage.setItem('theme_mode', newMode); } catch (error) {}
    };
    const currentTheme = mode === 'light' ? lightTheme : darkTheme;
    const value = { mode, toggleTheme };
    return (
        <ThemeContext.Provider value={value}>
            <StyledThemeProvider theme={currentTheme}>{children}</StyledThemeProvider>
        </ThemeContext.Provider>
    );
};
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) throw new Error('useTheme must be used within a CustomThemeProvider');
    return context;
};