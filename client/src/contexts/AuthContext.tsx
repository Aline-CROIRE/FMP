'use client';
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'program_manager' | 'finance_manager' | 'viewer';
    profilePictureUrl?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const loadUserFromToken = (tokenToLoad: string) => {
        try {
            const decoded = jwtDecode(tokenToLoad) as { user: User, exp: number };
            if (decoded && decoded.exp * 1000 > Date.now()) {
                setUser(decoded.user);
                setToken(tokenToLoad);
                return true;
            }
        } catch (error) {
            console.error("Invalid token during load:", error);
        }
        localStorage.removeItem('token');
        return false;
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) loadUserFromToken(storedToken);
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        const { token: newToken } = response.data;
        localStorage.setItem('token', newToken);
        loadUserFromToken(newToken);
        router.push('/dashboard');
    };
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        router.push('/login');
    };
    const refreshUser = async () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // A true refresh would hit a GET /auth/me endpoint
            // But re-decoding works for this app's purposes.
            loadUserFromToken(storedToken);
        }
    };
    const value = { isAuthenticated: !!token, user, token, isLoading, login, logout, refreshUser };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};